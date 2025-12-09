
import { ConversionMap, MimeType } from './types';

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// Mime Types Constants for easier usage
const TXT = 'text/plain';
const CSV = 'text/csv';
const MD = 'text/markdown';
const HTML = 'text/html';
const XML = 'text/xml';
const JSON_TYPE = 'application/json';
const PDF = 'application/pdf';
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const JPG = 'image/jpeg';
const PNG = 'image/png';
const WEBP = 'image/webp';

export const CONVERSION_MAP: ConversionMap = {
  [PDF]: [DOCX, TXT, JPG, PNG, HTML, CSV, XLSX],
  [DOCX]: [PDF, TXT, PPTX, HTML, CSV, XLSX],
  [PPTX]: [PDF, DOCX, TXT],
  [TXT]: [PDF, DOCX, CSV, HTML, PPTX],
  [CSV]: [XLSX, PDF, JSON_TYPE, XML],
  [XLSX]: [CSV, PDF, HTML],
  [JPG]: [PDF, DOCX, TXT, HTML],
  [PNG]: [PDF, DOCX, TXT, HTML],
  [JSON_TYPE]: [CSV, XLSX],
  [XML]: [JSON_TYPE, CSV, XLSX],
  [HTML]: [PDF, DOCX],
  [MD]: [HTML, TXT, PDF, DOCX],
  [WEBP]: [JPG, PNG]
};

export const MIME_TYPE_NAMES: { [key in MimeType]: string } = {
  [TXT]: 'Text (TXT)',
  [CSV]: 'CSV',
  [MD]: 'Markdown',
  [HTML]: 'HTML',
  [XML]: 'XML',
  [JSON_TYPE]: 'JSON',
  [PDF]: 'PDF Document',
  [DOCX]: 'Word Doc (DOCX)',
  [XLSX]: 'Excel Sheet (XLSX)',
  [PPTX]: 'PowerPoint (PPT)',
  [JPG]: 'JPEG Image',
  [PNG]: 'PNG Image',
  [WEBP]: 'WebP Image',
};

export const FILE_EXTENSIONS: { [key in MimeType]: string } = {
  [TXT]: '.txt',
  [CSV]: '.csv',
  [MD]: '.md',
  [HTML]: '.html',
  [XML]: '.xml',
  [JSON_TYPE]: '.json',
  [PDF]: '.pdf',
  [DOCX]: '.docx',
  [XLSX]: '.xlsx',
  [PPTX]: '.pptx',
  [JPG]: '.jpg',
  [PNG]: '.png',
  [WEBP]: '.webp',
};
