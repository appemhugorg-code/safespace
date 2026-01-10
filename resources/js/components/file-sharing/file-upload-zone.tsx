import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useFileSharing } from '@/hooks/use-file-sharing';
import { FileUpload, FileValidationResult, UploadProgress } from '@/services/file-sharing-service';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadZoneProps {
  authToken: string;
  conversationId?: string;
  sessionId?: string;
  allowedUsers?: string[];
  allowedRoles?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  hipaaCompliant?: boolean;
  encrypt?: boolean;
  onFilesUploaded?: (files: FileUpload[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

interface FileItem {
  file: File;
  id: string;
  validation?: FileValidationResult;
  upload?: FileUpload;
  progress?: UploadProgress;
  status: 'pending' | 'validating' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export function FileUploadZone({
  authToken,
  conversationId,
  sessionId,
  allowedUsers,
  allowedRoles,
  maxFiles = 10,
  maxFileSize = 25 * 1024 * 1024, // 25MB
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', '.doc', '.docx', '.txt'],
  hipaaCompliant = false,
  encrypt = true,
  onFilesUploaded,
  onUploadError,
  className = '',
}: FileUploadZoneProps) {
  const {
    uploadFile,
    cancelUpload,
    validateFile,
    formatFileSize,
    getFileIcon,
    isFileTypeAllowed,
  } = useFileSharing({
    authToken,
    conversationId,
    sessionId,
    allowedUsers,
    allowedRoles,
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    
    // Check file count limit
    if (files.length + fileArray.length > maxFiles) {
      onUploadError?.(new Error(`Maximum ${maxFiles} files allowed`));
      return;
    }

    const newFiles: FileItem[] = fileArray.map(file => ({
      file,
      id: crypto.randomUUID(),
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Validate and upload files
    for (const fileItem of newFiles) {
      await processFile(fileItem);
    }
  }, [files.length, maxFiles, onUploadError]);

  const processFile = useCallback(async (fileItem: FileItem) => {
    try {
      // Update status to validating
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'validating' } : f
      ));

      // Validate file
      const validation = await validateFile(fileItem.file);
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, validation } : f
      ));

      // Check if validation passed
      if (!validation.isValid) {
        const criticalIssues = validation.issues.filter(i => i.severity === 'critical' || i.severity === 'high');
        if (criticalIssues.length > 0) {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'error', 
              error: criticalIssues[0].message 
            } : f
          ));
          return;
        }
      }

      // Start upload
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading' } : f
      ));
      
      setIsUploading(true);

      const uploadResult = await uploadFile(fileItem.file, {
        encrypt,
        hipaaCompliant,
        onProgress: (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, progress } : f
          ));
        },
      });

      // Upload completed
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { 
          ...f, 
          status: 'completed', 
          upload: uploadResult 
        } : f
      ));

      // Notify parent component
      onFilesUploaded?.([ uploadResult]);

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ));
      
      onUploadError?.(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      // Check if all uploads are complete
      setFiles(current => {
        const stillUploading = current.some(f => f.status === 'uploading' || f.status === 'validating');
        if (!stillUploading) {
          setIsUploading(false);
        }
        return current;
      });
    }
  }, [validateFile, uploadFile, encrypt, hipaaCompliant, onFilesUploaded, onUploadError]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if leaving the drop zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  // File input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
    
    // Clear input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    const fileItem = files.find(f => f.id === fileId);
    
    if (fileItem?.status === 'uploading' && fileItem.upload) {
      cancelUpload(fileItem.upload.id);
    }
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, [files, cancelUpload]);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.status === 'uploading' && file.upload) {
        cancelUpload(file.upload.id);
      }
    });
    
    setFiles([]);
    setIsUploading(false);
  }, [files, cancelUpload]);

  // Get file type icon
  const getFileTypeIcon = useCallback((file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (file.type.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (file.type.includes('zip') || file.type.includes('archive')) return <Archive className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  }, []);

  // Get status icon
  const getStatusIcon = useCallback((fileItem: FileItem) => {
    switch (fileItem.status) {
      case 'validating':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className={`h-6 w-6 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Drag and drop files here, or click to select files
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span>Max {maxFiles} files</span>
            <span>•</span>
            <span>Up to {formatFileSize(maxFileSize)} each</span>
            <span>•</span>
            <span>{acceptedTypes.slice(0, 3).join(', ')}{acceptedTypes.length > 3 ? '...' : ''}</span>
          </div>

          {/* Security indicators */}
          <div className="flex justify-center space-x-4 text-xs">
            {encrypt && (
              <div className="flex items-center space-x-1 text-green-600">
                <Shield className="h-3 w-3" />
                <span>Encrypted</span>
              </div>
            )}
            {hipaaCompliant && (
              <div className="flex items-center space-x-1 text-blue-600">
                <Shield className="h-3 w-3" />
                <span>HIPAA Compliant</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Files ({files.length})
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((fileItem) => (
                <motion.div
                  key={fileItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                >
                  {/* File icon */}
                  <div className="flex-shrink-0 text-gray-500">
                    {getFileTypeIcon(fileItem.file)}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </p>
                      {getStatusIcon(fileItem)}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                      
                      {/* Status badge */}
                      <Badge 
                        variant={
                          fileItem.status === 'completed' ? 'default' :
                          fileItem.status === 'error' ? 'destructive' :
                          fileItem.status === 'uploading' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {fileItem.status}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    {fileItem.progress && fileItem.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress 
                          value={fileItem.progress.percentage} 
                          className="h-1"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{fileItem.progress.percentage}%</span>
                          <span>{fileItem.progress.stage}</span>
                        </div>
                      </div>
                    )}

                    {/* Validation issues */}
                    {fileItem.validation && fileItem.validation.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {fileItem.validation.issues.map((issue, index) => (
                          <div 
                            key={index}
                            className={`flex items-center space-x-1 text-xs ${
                              issue.severity === 'critical' || issue.severity === 'high' 
                                ? 'text-red-600' 
                                : issue.severity === 'medium'
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`}
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>{issue.message}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Error message */}
                    {fileItem.error && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>{fileItem.error}</span>
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileItem.id)}
                    disabled={fileItem.status === 'uploading'}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Upload summary */}
            {files.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-sm text-blue-800">
                  <span>
                    {files.filter(f => f.status === 'completed').length} of {files.length} files uploaded
                  </span>
                  {isUploading && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-blue-600">
                  Total: {formatFileSize(files.reduce((sum, f) => sum + f.file.size, 0))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}