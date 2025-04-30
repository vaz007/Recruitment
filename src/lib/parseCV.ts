// lib/parsePDFClient.ts
'use client';

import { pdfjs } from 'react-pdf';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const parsePDFClient = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: TextItem | TextMarkedContent) => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n';
  }
  console.log(fullText.trim())

  return fullText.trim();
};
