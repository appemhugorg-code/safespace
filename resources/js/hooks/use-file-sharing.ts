import { useState, useCallback, useRef, useEffect } from 'react';
import { FileSharingService, FileUpload, FileValidationResult, UploadProgress, FilePreview } from '@/services/file-sharing-service';

export interface UseFileSharingOptions {
  baseUrl?: string;
  authToken: string;
  conversationId?: string;
  sessionId?: string;
  allowedUsers?: string[];
  allowedRoles?: string[];
  autoValidate?: boolean;
  maxConcurrentUploads?: number;
}

export interface UseFileSharingReturn {
  // Upload state
  uploads: Map<string, FileUpload>;
  uploadProgress: Map<string, UploadProgress>;
  isUploading: boolean;
  
  // Validation
  validationResults: Map<string, FileValidationResult>;
  
  // Actions
  uploadFiles: (files: FileList | File[], options?: {
    encrypt?: boolean;
    hipaaCompliant?: boolean;
    expiresAt?: Date;
  }) => Promise<FileUpload[]>;
  uploadFile: (file: File, options?: {
    encrypt?: boolean;
    hipaaCompliant?: boolean;
    expiresAt?: Date;
    onProgress?: (progress: UploadProgress) => void;
  }) => Promise<FileUpload>;
  cancelUpload: (fileId: string) => void;
  cancelAllUploads: () => void;
  
  // File management
  getFileInfo: (fileId: string) => Promise<FileUpload>;
  deleteFile: (fileId: string) => Promise<void>;
  downloadFile: (fileId: string, filename?: string) => Promise<Blob>;
  getFilePreview: (fileId: string) => Promise<FilePreview>;
  
  // Validation
  validateFile: (file: File) => Promise<FileValidationResult>;
  validateFiles: (files: FileList | File[]) => Promise<FileValidationResult[]>;
  
  // Utility
  formatFileSize: (bytes: number) => string;
  getFileIcon: (mimeType: string) => string;
  isFileTypeAllowed: (file: File) => boolean;
  
  // Events
  onUploadComplete: (callback: (file: FileUpload) => void) => () => void;
  onUploadError: (callback: (error: Error, fileId?: string) => void) => () => void;
  onValidationComplete: (callback: (result: FileValidationResult, file: File) => void) => () => void;
}

export function useFileSharing(options: UseFileSharingOptions): UseFileSharingReturn {
  const {
    baseUrl = '/api',
    authToken,
    conversationId,
    sessionId,
    allowedUsers,
    allowedRoles,
    autoValidate = true,
    maxConcurrentUploads = 3,
  } = options;

  // State
  const [uploads, setUploads] = useState<Map<string, FileUpload>>(new Map());
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const [validationResults, setValidationResults] = useState<Map<string, FileValidationResult>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const fileSharingServiceRef = useRef<FileSharingService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);
  const uploadQueueRef = useRef<Array<{ file: File; options: any; resolve: Function; reject: Function }>>([]);
  const activeUploadsRef = useRef<Set<string>>(new Set());

  // Initialize service
  useEffect(() => {
    const service = new FileSharingService({
      baseUrl,
      authToken,
    });

    fileSharingServiceRef.current = service;

    return () => {
      // Cleanup
      eventUnsubscribersRef.current.forEach(unsubscribe => unsubscribe());
      eventUnsubscribersRef.current = [];
      
      if (fileSharingServiceRef.current) {
        fileSharingServiceRef.current.destroy();
        fileSharingServiceRef.current = null;
      }
    };
  }, [baseUrl, authToken]);

  // Process upload queue
  const processUploadQueue = useCallback(async () => {
    if (!fileSharingServiceRef.current || activeUploadsRef.current.size >= maxConcurrentUploads) {
      return;
    }

    const queueItem = uploadQueueRef.current.shift();
    if (!queueItem) {
      setIsUploading(false);
      return;
    }

    const { file, options, resolve, reject } = queueItem;
    const fileId = crypto.randomUUID();
    
    try {
      activeUploadsRef.current.add(fileId);
      setIsUploading(true);

      const uploadOptions = {
        conversationId,
        sessionId,
        allowedUsers,
        allowedRoles,
        ...options,
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(prev => new Map(prev.set(progress.fileId, progress)));
          options.onProgress?.(progress);
        },
      };

      const result = await fileSharingServiceRef.current.uploadFile(file, uploadOptions);
      
      setUploads(prev => new Map(prev.set(result.id, result)));
      resolve(result);

    } catch (error) {
      reject(error);
    } finally {
      activeUploadsRef.current.delete(fileId);
      setUploadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(fileId);
        return newMap;
      });
      
      // Process next item in queue
      setTimeout(processUploadQueue, 100);
    }
  }, [conversationId, sessionId, allowedUsers, allowedRoles, maxConcurrentUploads]);

  // Upload single file
  const uploadFile = useCallback(async (file: File, options: {
    encrypt?: boolean;
    hipaaCompliant?: boolean;
    expiresAt?: Date;
    onProgress?: (progress: UploadProgress) => void;
  } = {}): Promise<FileUpload> => {
    if (!fileSharingServiceRef.current) {
      throw new Error('File sharing service not initialized');
    }

    // Validate file if auto-validation is enabled
    if (autoValidate) {
      const validation = await validateFile(file);
      if (!validation.isValid) {
        const criticalIssues = validation.issues.filter(i => i.severity === 'critical');
        if (criticalIssues.length > 0) {
          throw new Error(`File validation failed: ${criticalIssues[0].message}`);
        }
      }
    }

    return new Promise((resolve, reject) => {
      uploadQueueRef.current.push({ file, options, resolve, reject });
      processUploadQueue();
    });
  }, [autoValidate, validateFile, processUploadQueue]);

  // Upload multiple files
  const uploadFiles = useCallback(async (files: FileList | File[], options: {
    encrypt?: boolean;
    hipaaCompliant?: boolean;
    expiresAt?: Date;
  } = {}): Promise<FileUpload[]> => {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(file => uploadFile(file, options));
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Failed to upload files:', error);
      throw error;
    }
  }, [uploadFile]);

  // Cancel upload
  const cancelUpload = useCallback((fileId: string) => {
    if (fileSharingServiceRef.current) {
      fileSharingServiceRef.current.cancelUpload(fileId);
    }
    
    activeUploadsRef.current.delete(fileId);
    setUploadProgress(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  // Cancel all uploads
  const cancelAllUploads = useCallback(() => {
    uploadQueueRef.current = [];
    
    for (const fileId of activeUploadsRef.current) {
      cancelUpload(fileId);
    }
    
    setIsUploading(false);
  }, [cancelUpload]);

  // File management
  const getFileInfo = useCallback(async (fileId: string): Promise<FileUpload> => {
    if (!fileSharingServiceRef.current) {
      throw new Error('File sharing service not initialized');
    }
    
    return await fileSharingServiceRef.current.getFileInfo(fileId);
  }, []);

  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    if (!fileSharingServiceRef.current) {
      throw new Error('File sharing service not initialized');
    }
    
    await fileSharingServiceRef.current.deleteFile(fileId);
    
    setUploads(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  const downloadFile = useCallback(async (fileId: string, filename?: string): Promise<Blob> => {
    if (!fileSharingServiceRef.current) {
      throw new Error('File sharing service not initialized');
    }
    
    return await fileSharingServiceRef.current.downloadFile(fileId, filename);
  }, []);

  const getFilePreview = useCallback(async (fileId: string): Promise<FilePreview> => {
    if (!fileSharingServiceRef.current) {
      throw new Error('File sharing service not initialized');
    }
    
    return await fileSharingServiceRef.current.getFilePreview(fileId);
  }, []);

  // Validation
  const validateFile = useCallback(async (file: File): Promise<FileValidationResult> => {
    if (!fileSharingServiceRef.current) {
      throw new Error('File sharing service not initialized');
    }
    
    const result = await fileSharingServiceRef.current.validateFile(file);
    
    setValidationResults(prev => new Map(prev.set(file.name, result)));
    
    return result;
  }, []);

  const validateFiles = useCallback(async (files: FileList | File[]): Promise<FileValidationResult[]> => {
    const fileArray = Array.from(files);
    const validationPromises = fileArray.map(file => validateFile(file));
    
    return await Promise.all(validationPromises);
  }, [validateFile]);

  // Utility functions
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileIcon = useCallback((mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    if (mimeType.includes('text')) return '📃';
    return '📁';
  }, []);

  const isFileTypeAllowed = useCallback((file: File): boolean => {
    if (!fileSharingServiceRef.current) return false;
    
    // This would use the service's validation logic
    // For now, we'll do a basic check
    const allowedTypes = [
      'image/', 'video/', 'audio/', 'application/pdf', 
      'application/msword', 'application/vnd.openxmlformats-officedocument',
      'text/', 'application/zip'
    ];
    
    return allowedTypes.some(type => file.type.startsWith(type));
  }, []);

  // Event handlers
  const onUploadComplete = useCallback((callback: (file: FileUpload) => void) => {
    if (!fileSharingServiceRef.current) {
      return () => {};
    }
    
    return fileSharingServiceRef.current.on('upload-complete', callback);
  }, []);

  const onUploadError = useCallback((callback: (error: Error, fileId?: string) => void) => {
    if (!fileSharingServiceRef.current) {
      return () => {};
    }
    
    return fileSharingServiceRef.current.on('upload-error', callback);
  }, []);

  const onValidationComplete = useCallback((callback: (result: FileValidationResult, file: File) => void) => {
    if (!fileSharingServiceRef.current) {
      return () => {};
    }
    
    return fileSharingServiceRef.current.on('validation-complete', callback);
  }, []);

  return {
    // Upload state
    uploads,
    uploadProgress,
    isUploading,
    
    // Validation
    validationResults,
    
    // Actions
    uploadFiles,
    uploadFile,
    cancelUpload,
    cancelAllUploads,
    
    // File management
    getFileInfo,
    deleteFile,
    downloadFile,
    getFilePreview,
    
    // Validation
    validateFile,
    validateFiles,
    
    // Utility
    formatFileSize,
    getFileIcon,
    isFileTypeAllowed,
    
    // Events
    onUploadComplete,
    onUploadError,
    onValidationComplete,
  };
}