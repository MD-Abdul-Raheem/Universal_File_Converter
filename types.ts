
export const Page = {
  CONVERTER: 'Converter',
  INSTRUCTIONS: 'Instructions',
  ABOUT: 'About',
} as const;

export type Page = typeof Page[keyof typeof Page];

export type MimeType = 
  | 'text/plain' 
  | 'text/csv' 
  | 'text/markdown' 
  | 'text/html' 
  | 'text/xml'
  | 'application/json' 
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // docx
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // xlsx
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // pptx
  | 'image/jpeg' 
  | 'image/png' 
  | 'image/webp';

export type ConversionMap = {
  [key in MimeType]?: MimeType[];
};
