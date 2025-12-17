# Universal File Converter (UFC)

A modern, AI-powered file conversion tool that runs entirely in your browser. Convert between multiple file formats with zero server uploads and complete data privacy.

![Universal File Converter](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

- **🔒 100% Client-Side Processing** - All conversions happen in your browser. Your files never leave your device.
- **🤖 AI-Powered Conversions** - Leverages Google Gemini 1.5 Flash for intelligent document understanding and conversion.
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices.
- **⚡ Fast & Efficient** - Optimized performance with modern web technologies.
- **🎨 Modern UI** - Beautiful, tech-inspired interface with smooth animations.
- **📦 No Installation Required** - Run directly in your browser.

## 🔄 Supported Conversions

### Document Formats
- **PDF** → DOCX, TXT, JPG, PNG, HTML, CSV, XLSX
- **DOCX** → PDF, TXT, PPT, HTML, CSV, XLSX
- **PPT** → PDF, DOCX, TXT
- **TXT** → PDF, DOCX, CSV, HTML, PPT
- **HTML** → PDF, DOCX
- **Markdown** → HTML, TXT, PDF, DOCX

### Data Formats
- **CSV** → XLSX, PDF, JSON, XML
- **XLSX** → CSV, PDF, HTML
- **JSON** → CSV, XLSX
- **XML** → JSON, CSV, XLSX

### Image Formats
- **JPG/PNG** → PDF, DOCX, TXT, HTML
- **WEBP** → JPG, PNG

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling

### AI & Processing
- **Google Gemini 1.5 Flash** - AI-powered document understanding
- **jsPDF** - PDF generation
- **Mammoth.js** - DOCX parsing
- **SheetJS (xlsx)** - Excel file handling
- **Docx** - Word document generation
- **PptxGenJS** - PowerPoint generation

## 📋 Prerequisites

- Node.js 16+ (for local development)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API Key (for AI conversions)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MD-Abdul-Raheem/Universal_File_Converter.git
cd Universal_File_Converter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_google_gemini_api_key_here
```

To get a Google Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into your `.env` file

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📱 Usage

1. **Upload a File**
   - Drag and drop a file into the upload zone
   - Or click "Browse Files" to select from your device
   - Maximum file size: 100MB

2. **Select Output Format**
   - Choose your desired output format from the dropdown
   - Only compatible formats will be shown

3. **Convert**
   - Click "EXECUTE CONVERSION"
   - Wait for the AI to process your file
   - Progress bar shows conversion status

4. **Download**
   - Click "RETRIEVE FILE" to download your converted file
   - Process another file or close the converter

## 🔐 Privacy & Security

- **Zero-Retention Policy** - Files are processed in memory and immediately discarded
- **No Server Uploads** - All processing happens client-side in your browser
- **Data Sovereignty** - Your files never leave your device (except for AI API calls)
- **Secure Processing** - Uses modern web security standards

## 🎨 Features Breakdown

### Intelligent Conversion Engine
- **Deterministic Algorithms** - For structured data (CSV, JSON, XLSX)
- **AI-Powered Extraction** - For complex documents (PDF, DOCX)
- **Canvas-Based Processing** - For image conversions
- **Binary Reconstruction** - Ensures high-quality output files

### User Experience
- **Drag & Drop** - Intuitive file upload
- **Real-time Progress** - Visual feedback during conversion
- **Toast Notifications** - Clear success/error messages
- **Responsive Design** - Works on all screen sizes
- **Dark Theme** - Easy on the eyes with tech-inspired aesthetics

## 📂 Project Structure

```
Universal_File_Converter/
├── components/
│   ├── AboutView.tsx          # About page component
│   ├── ConverterView.tsx      # Main converter interface
│   ├── Footer.tsx             # Footer component
│   ├── Header.tsx             # Navigation header
│   ├── InstructionsView.tsx   # Conversion matrix display
│   └── Toast.tsx              # Notification component
├── services/
│   └── conversionService.ts   # Core conversion logic
├── App.tsx                    # Main app component
├── constants.ts               # Conversion mappings & constants
├── types.ts                   # TypeScript type definitions
├── index.tsx                  # App entry point
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── README.md                  # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent document processing
- Open-source libraries that make this project possible
- The React and TypeScript communities

## 📧 Contact

MD Abdul Raheem - [@MD-Abdul-Raheem](https://github.com/MD-Abdul-Raheem)

Project Link: [https://github.com/MD-Abdul-Raheem/Universal_File_Converter](https://github.com/MD-Abdul-Raheem/Universal_File_Converter)

## 🐛 Known Issues

- Large PDF files (>50MB) may take longer to process
- Some complex Excel formulas may not convert perfectly
- Image quality in PDF conversions depends on source resolution

## 🔮 Future Enhancements

- [ ] Batch file conversion
- [ ] Custom conversion settings
- [ ] Conversion history
- [ ] More file format support
- [ ] Offline mode with service workers
- [ ] File compression options

---

**Made with ❤️ using React, TypeScript, and AI**
