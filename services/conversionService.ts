
import { MimeType } from '../types';
import { GoogleGenAI } from "@google/genai";

// --- Helper Functions for I/O ---

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove Data URL prefix (e.g. "data:image/png;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// --- Module Loading Helper ---
async function loadModule(moduleName: string) {
    try {
        return await import(moduleName);
    } catch (error) {
        console.error(`Failed to load module: ${moduleName}`, error);
        throw new Error(`Could not load required library: ${moduleName}. Please check your internet connection.`);
    }
}

// --- Input Extraction ---

const extractContentFromDocx = async (file: File): Promise<string> => {
    const mod = await loadModule("mammoth");
    const mammoth = mod.default || mod;
    const extractRawText = mammoth.extractRawText || mod.extractRawText;
    
    if (!extractRawText) throw new Error("Failed to initialize DOCX parser.");

    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await extractRawText({ arrayBuffer });
    return result.value;
};

const extractContentFromXlsx = async (file: File): Promise<string> => {
    const mod = await loadModule("xlsx");
    const read = mod.read || (mod.default && mod.default.read);
    const utils = mod.utils || (mod.default && mod.default.utils);

    if (!read || !utils) throw new Error("Failed to initialize Excel parser.");

    const arrayBuffer = await readFileAsArrayBuffer(file);
    const workbook = read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return utils.sheet_to_csv(worksheet);
};

// --- Output Generation (Creating valid binary files) ---

const createPdfBlob = async (textContent: string): Promise<Blob> => {
    const mod = await loadModule("jspdf");
    const jsPDFConstructor = mod.jsPDF || (typeof mod.default === 'function' ? mod.default : mod.default?.jsPDF);
    
    if (!jsPDFConstructor) throw new Error("Failed to initialize PDF generator.");

    const doc = new jsPDFConstructor();
    const cleanText = textContent.replace(/[^\x20-\x7E\n\r\t]/g, ''); 
    const splitText = doc.splitTextToSize(cleanText, 180);
    
    let y = 10;
    const pageHeight = doc.internal.pageSize.height;
    
    for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - 10) {
            doc.addPage();
            y = 10;
        }
        doc.text(splitText[i], 10, y);
        y += 7;
    }
    return doc.output('blob');
};

const createDocxBlob = async (textContent: string): Promise<Blob> => {
    const mod = await loadModule("docx");
    const Document = mod.Document || (mod.default && mod.default.Document);
    const Packer = mod.Packer || (mod.default && mod.default.Packer);
    const Paragraph = mod.Paragraph || (mod.default && mod.default.Paragraph);
    const TextRun = mod.TextRun || (mod.default && mod.default.TextRun);
    
    if (!Document || !Packer) throw new Error("Failed to initialize Word document generator.");

    const lines = textContent.split('\n');
    const paragraphs = lines.map(line => new Paragraph({
        children: [new TextRun(line)]
    }));

    const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
    });

    return await Packer.toBlob(doc);
};

const createXlsxBlob = async (data: any[][]): Promise<Blob> => {
    const mod = await loadModule("xlsx");
    const utils = mod.utils || (mod.default && mod.default.utils);
    const write = mod.write || (mod.default && mod.default.write);

    if (!utils || !write) throw new Error("Failed to initialize Excel generator.");

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    const wbout = write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

const createPptxBlob = async (slidesData: { title: string, text: string }[]): Promise<Blob> => {
    const mod = await loadModule("pptxgenjs");
    const PptxGenJS = mod.default || mod;
    
    if (!PptxGenJS) throw new Error("Failed to initialize PowerPoint generator.");

    const pres = new PptxGenJS();

    slidesData.forEach(slideInfo => {
        const slide = pres.addSlide();
        
        // Add Title
        slide.addText(slideInfo.title || "Untitled Slide", { 
            x: 0.5, y: 0.5, w: '90%', h: 1, 
            fontSize: 24, bold: true, color: '363636' 
        });
        
        // Add Body Text
        slide.addText(slideInfo.text || "", { 
            x: 0.5, y: 1.5, w: '90%', h: 4, 
            fontSize: 14, color: '666666', valign: 'top' 
        });
    });

    // If no slides were generated, add a placeholder
    if (pres.slides.length === 0) {
        const slide = pres.addSlide();
        slide.addText("Conversion Result", { x: 1, y: 1, fontSize: 18 });
    }

    const out = await pres.write({ outputType: 'blob' });
    return out as Blob;
};

// --- Deterministic Data Conversion (No AI) ---

const convertDataFiles = async (file: File, targetMimeType: MimeType): Promise<Blob> => {
    const mod = await loadModule("xlsx");
    const read = mod.read || (mod.default && mod.default.read);
    const utils = mod.utils || (mod.default && mod.default.utils);
    const write = mod.write || (mod.default && mod.default.write);

    if (!read || !utils || !write) throw new Error("Failed to initialize data conversion engine.");

    // 1. JSON Input -> Sheet/CSV
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await readFileAsText(file);
        let jsonData;
        try {
            jsonData = JSON.parse(text);
        } catch(e) {
            throw new Error("Invalid JSON file.");
        }

        // Ensure data is an array to produce valid rows
        const data = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        const workbook = utils.book_new();
        // json_to_sheet automatically handles object keys as headers
        const worksheet = utils.json_to_sheet(data);
        utils.book_append_sheet(workbook, worksheet, "Sheet1");

        if (targetMimeType === 'text/csv') {
            const csvData = utils.sheet_to_csv(worksheet);
            return new Blob([csvData], { type: 'text/csv' });
        } else if (targetMimeType.includes('spreadsheetml.sheet')) {
             const wbout = write(workbook, { bookType: 'xlsx', type: 'array' });
             return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        }
        throw new Error("Unsupported JSON conversion target.");
    }

    // 2. CSV/XLSX Input -> Read into generic Workbook
    const buffer = await readFileAsArrayBuffer(file);
    
    // `cellDates: true` ensures ISO strings or Excel date codes become JS Dates
    const workbook = read(buffer, { type: 'array', cellDates: true });
    
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];

    // 3. Output Generation based on target
    
    // Target: JSON
    if (targetMimeType === 'application/json') {
        // raw: true keeps numbers as numbers, false converts to strings
        // defval: null ensures empty cells appear as null, preserving object structure
        const jsonData = utils.sheet_to_json(firstSheet, { 
            raw: true, 
            defval: null 
        });
        return new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    }
    
    // Target: CSV
    if (targetMimeType === 'text/csv') {
        const csvData = utils.sheet_to_csv(firstSheet);
        return new Blob([csvData], { type: 'text/csv' });
    }

    // Target: XLSX
    if (targetMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Effectively a conversion/cleanup pass
        const wbout = write(workbook, { bookType: 'xlsx', type: 'array' });
        return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    throw new Error("Unsupported data conversion path.");
};


// --- AI Conversion Logic ---

const convertImageWithCanvas = (file: File, targetMimeType: MimeType): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (targetMimeType === 'image/jpeg' && ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Canvas error')), targetMimeType, 0.95);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = URL.createObjectURL(file);
  });
};

const convertWithGemini = async (file: File, targetMimeType: MimeType): Promise<Blob> => {
  const apiKey = import.meta.env.VITE_API_KEY || localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error("API Key required. Please add VITE_API_KEY to Vercel environment variables.");
  
  const ai = new GoogleGenAI({ apiKey });
  
  // Determine if we need structured output for PPTX or XLSX
  const isPptxTarget = targetMimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  const isXlsxTarget = targetMimeType.includes('spreadsheetml.sheet');
  
  let contents: any = [];
  let extractedText = "";
  
  const isNativeGeminiFormat = file.type.startsWith('image/') || file.type === 'application/pdf';

  if (isNativeGeminiFormat) {
      const base64 = await readFileAsBase64(file);
      contents.push({ inlineData: { mimeType: file.type, data: base64 } });
      contents.push({ text: "Extract the full content." });
  } else {
      try {
          if (file.name.endsWith('.docx')) {
              extractedText = await extractContentFromDocx(file);
          } else if (file.name.endsWith('.xlsx')) {
              extractedText = await extractContentFromXlsx(file);
          } else {
              extractedText = await readFileAsText(file);
          }
      } catch (e) {
          throw new Error("Could not extract text from file.");
      }
      contents.push({ text: `Content:\n${extractedText.substring(0, 30000)}` });
  }

  // System Instructions
  let systemInstruction = "You are a file converter.";
  
  if (isPptxTarget) {
      systemInstruction += ` Summarize the content into a presentation. 
      Strictly output a JSON array of objects, where each object represents a slide and has exactly two keys: "title" (string) and "text" (string). 
      Example: [{"title": "Intro", "text": "Hello"}]. Do not include Markdown formatting or code blocks. Pure JSON only.`;
  } else if (isXlsxTarget) {
      systemInstruction += ` Extract the data into a structure suitable for a spreadsheet.
      Strictly output a JSON Two-Dimensional Array (Array of Arrays), where the first inner array is the header.
      Example: [["Name", "Age"], ["Alice", "30"]]. Do not include Markdown formatting or code blocks. Pure JSON only.`;
  } else if (targetMimeType === 'application/pdf') {
      systemInstruction += " Output as plain text, maintaining layout.";
  } else if (targetMimeType.includes('wordprocessingml')) {
      systemInstruction += " Output as plain text, preserving paragraphs.";
  } else {
      systemInstruction += " Output the content directly.";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: { systemInstruction }
  });

  let resultText = response.text || "";
  // Strip code blocks
  resultText = resultText.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '').trim();

  if (isPptxTarget) {
      try {
          const slidesData = JSON.parse(resultText);
          if (Array.isArray(slidesData)) {
              return await createPptxBlob(slidesData);
          }
          throw new Error("Invalid JSON from AI");
      } catch (e) {
          console.error("PPTX JSON parse error", e);
          return await createPptxBlob([{ title: "Conversion Error", text: "Could not structure content for slides. Raw text: \n" + resultText.substring(0, 500) }]);
      }
  } else if (isXlsxTarget) {
      try {
          const rows = JSON.parse(resultText);
          if (Array.isArray(rows) && Array.isArray(rows[0])) {
              return await createXlsxBlob(rows);
          }
          throw new Error("Invalid JSON 2D Array from AI");
      } catch (e) {
          console.error("XLSX JSON parse error", e);
          // Fallback to simple split if JSON fails, though risky for data integrity
          const rows = resultText.split('\n').map(r => r.split(','));
          return await createXlsxBlob(rows);
      }
  } else if (targetMimeType === 'application/pdf') {
      return await createPdfBlob(resultText);
  } else if (targetMimeType.includes('wordprocessingml')) {
      return await createDocxBlob(resultText);
  } else {
      return new Blob([resultText], { type: targetMimeType });
  }
};

export const convertFile = async (file: File, targetMimeType: MimeType): Promise<Blob> => {
  const srcType = file.type;

  // 1. Image -> Image (Local Canvas)
  if (srcType.startsWith('image/') && targetMimeType.startsWith('image/')) {
    return convertImageWithCanvas(file, targetMimeType);
  }

  // 2. Data -> Data (Deterministic SheetJS)
  // Groups: CSV, JSON, Excel
  const isDataFormat = (t: string) => 
      t === 'text/csv' || 
      t === 'application/json' || 
      t.includes('spreadsheetml.sheet');
  
  if (isDataFormat(srcType) && isDataFormat(targetMimeType)) {
      return convertDataFiles(file, targetMimeType);
  }

  // 3. All other complex conversions (PDF, Docx, PPT, Cross-format) -> AI
  return convertWithGemini(file, targetMimeType);
};
