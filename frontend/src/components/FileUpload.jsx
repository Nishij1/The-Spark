import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { processFile, validateFileType, formatFileSize, getFileTypeIcon } from '../utils/fileProcessor';

export default function FileUpload({ onFileProcessed, onError, disabled = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file) => {
    try {
      // Validate file type
      if (!validateFileType(file)) {
        throw new Error('Invalid file type. Please upload TXT, PDF, or DOCX files only.');
      }

      setUploadedFile(file);
      setIsProcessing(true);
      setProcessingStatus('processing');

      // Process the file
      const extractedText = await processFile(file);
      
      setProcessingStatus('success');
      setIsProcessing(false);
      
      // Call the callback with extracted text
      onFileProcessed(extractedText, file);

    } catch (error) {
      console.error('File processing error:', error);
      setProcessingStatus('error');
      setIsProcessing(false);
      onError(error.message);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setProcessingStatus(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileProcessed('', null);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver && !disabled
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadedFile ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Processing file...
            </p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getFileTypeIcon(uploadedFile)}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              {processingStatus === 'success' && (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              )}
              {processingStatus === 'error' && (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Remove file</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium text-primary-600 dark:text-primary-400">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              TXT, PDF, or DOCX files (max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Processing Status */}
      {processingStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700 dark:text-green-300">
              File processed successfully! Text has been extracted and added to the transcript field.
            </p>
          </div>
        </motion.div>
      )}

      {processingStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300">
              Failed to process file. Please try copying and pasting the text manually.
            </p>
          </div>
        </motion.div>
      )}

      {/* Supported Formats Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p className="font-medium mb-1">Supported formats:</p>
        <ul className="space-y-1">
          <li>• <strong>TXT:</strong> Plain text files</li>
          <li>• <strong>PDF:</strong> Portable Document Format (text extraction may vary)</li>
          <li>• <strong>DOCX:</strong> Microsoft Word documents</li>
        </ul>
      </div>
    </div>
  );
}
