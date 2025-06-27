// File processing utilities for extracting text from various file types

// Extract text from plain text files
const extractTextFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

// Extract text from PDF files (basic implementation)
const extractTextFromPdf = async (file) => {
  try {
    // For now, we'll use a simple approach that works with basic PDFs
    // In a production app, you'd want to use a library like pdf-parse or PDF.js
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Basic PDF text extraction (this is very limited)
    // Look for text between stream and endstream
    const textMatches = text.match(/stream\s*(.*?)\s*endstream/gs);
    if (textMatches) {
      let extractedText = '';
      textMatches.forEach(match => {
        // Remove PDF commands and extract readable text
        const content = match.replace(/stream\s*|\s*endstream/g, '');
        // Basic cleanup - remove PDF operators and keep readable text
        const readable = content.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ');
        extractedText += readable + ' ';
      });
      return extractedText.trim() || 'Could not extract readable text from PDF. Please try copying and pasting the text manually.';
    }
    
    return 'Could not extract text from PDF. Please try copying and pasting the text manually.';
  } catch (error) {
    throw new Error('Failed to process PDF file. Please try copying and pasting the text manually.');
  }
};

// Extract text from DOCX files (basic implementation)
const extractTextFromDocx = async (file) => {
  try {
    // Basic DOCX processing - in production, use a library like mammoth.js
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Look for XML content in DOCX
    const xmlMatches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/gs);
    if (xmlMatches) {
      let extractedText = '';
      xmlMatches.forEach(match => {
        const content = match.replace(/<w:t[^>]*>|<\/w:t>/g, '');
        extractedText += content + ' ';
      });
      return extractedText.trim() || 'Could not extract readable text from DOCX. Please try copying and pasting the text manually.';
    }
    
    return 'Could not extract text from DOCX. Please try copying and pasting the text manually.';
  } catch (error) {
    throw new Error('Failed to process DOCX file. Please try copying and pasting the text manually.');
  }
};

// Main file processing function
export const processFile = async (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB limit
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Please use files smaller than 10MB.');
  }

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    // Handle different file types
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTxt(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPdf(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file);
    } else {
      throw new Error('Unsupported file type. Please use TXT, PDF, or DOCX files.');
    }
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
};

// Validate file type
export const validateFileType = (file) => {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const allowedExtensions = ['.txt', '.pdf', '.docx'];
  
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  const isValidType = allowedTypes.includes(fileType);
  const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  return isValidType || isValidExtension;
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file type icon
export const getFileTypeIcon = (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) return '📄';
  if (fileName.endsWith('.docx')) return '📝';
  if (fileName.endsWith('.txt')) return '📃';
  
  return '📄';
};
