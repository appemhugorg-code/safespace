export interface FileUpload {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  mimeType: string;
  extension: string;
  uploadedBy: string;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'quarantined';
  progress: number;
  url?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  metadata: FileMetadata;
  security: FileSecurity;
  access: FileAccess;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number; // for audio/video
  pages?: number; // for documents
  bitrate?: number; // for audio/video
  frameRate?: number; // for video
  colorSpace?: string; // for images
  compression?: string;
  exifData?: Record<string, any>; // for images
  checksum: string;
  fileSignature: string; // Magic number validation
}

export interface FileSecurity {
  encrypted: boolean;
  encryptionAlgorithm?: string;
  keyId?: string;
  virusScanned: boolean;
  virusScanResult?: 'clean' | 'infected' | 'suspicious' | 'pending';
  virusScanDate?: Date;
  contentValidated: boolean;
  contentValidationResult?: 'valid' | 'invalid' | 'suspicious';
  hipaaCompliant: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface FileAccess {
  conversationId?: string;
  sessionId?: string;
  allowedUsers: string[];
  allowedRoles: ('therapist' | 'client' | 'guardian' | 'admin')[];
  expiresAt?: Date;
  downloadLimit?: number;
  downloadCount: number;
  shareableLink?: string;
  shareableLinkExpires?: Date;
  permissions: ('view' | 'download' | 'share' | 'delete')[];
}

export interface FileValidationResult {
  isValid: boolean;
  fileType: string;
  actualMimeType: string;
  detectedExtension: string;
  issues: FileValidationIssue[];
  recommendations: string[];
}

export interface FileValidationIssue {
  type: 'security' | 'format' | 'size' | 'content' | 'metadata';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  code: string;
}

export interface UploadProgress {
  fileId: string;
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
  stage: 'uploading' | 'processing' | 'validating' | 'scanning' | 'encrypting' | 'storing';
}

export interface FilePreview {
  type: 'image' | 'video' | 'audio' | 'document' | 'text' | 'unsupported';
  url?: string;
  thumbnailUrl?: string;
  previewData?: string; // Base64 for small files or text content
  pages?: number;
  canPreview: boolean;
  requiresDownload: boolean;
}

// Allowed file types with size limits (in bytes)
export const FILE_TYPE_CONFIG = {
  images: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedInTherapy: true,
  },
  videos: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
    extensions: ['.mp4', '.webm', '.mov', '.avi'],
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedInTherapy: true,
  },
  audio: {
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
    extensions: ['.mp3', '.wav', '.ogg', '.m4a', '.webm'],
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedInTherapy: true,
  },
  documents: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
    ],
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedInTherapy: true,
  },
  archives: {
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    extensions: ['.zip', '.rar', '.7z'],
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedInTherapy: false, // Not allowed in therapy sessions for security
  },
};

export class FileSharingService {
  private baseUrl: string;
  private authToken: string;
  private uploadQueue: Map<string, XMLHttpRequest> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: { baseUrl: string; authToken: string }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
  }

  // File Upload
  public async uploadFile(
    file: File,
    options: {
      conversationId?: string;
      sessionId?: string;
      allowedUsers?: string[];
      allowedRoles?: string[];
      expiresAt?: Date;
      encrypt?: boolean;
      hipaaCompliant?: boolean;
      onProgress?: (progress: UploadProgress) => void;
    } = {}
  ): Promise<FileUpload> {
    // Validate file before upload
    const validation = await this.validateFile(file);
    if (!validation.isValid) {
      const criticalIssues = validation.issues.filter(i => i.severity === 'critical');
      if (criticalIssues.length > 0) {
        throw new Error(`File validation failed: ${criticalIssues[0].message}`);
      }
    }

    const fileId = crypto.randomUUID();
    const formData = new FormData();
    
    // Add file and metadata
    formData.append('file', file);
    formData.append('fileId', fileId);
    formData.append('originalName', file.name);
    formData.append('size', file.size.toString());
    formData.append('mimeType', file.type);
    
    // Add options
    if (options.conversationId) formData.append('conversationId', options.conversationId);
    if (options.sessionId) formData.append('sessionId', options.sessionId);
    if (options.allowedUsers) formData.append('allowedUsers', JSON.stringify(options.allowedUsers));
    if (options.allowedRoles) formData.append('allowedRoles', JSON.stringify(options.allowedRoles));
    if (options.expiresAt) formData.append('expiresAt', options.expiresAt.toISOString());
    if (options.encrypt !== undefined) formData.append('encrypt', options.encrypt.toString());
    if (options.hipaaCompliant !== undefined) formData.append('hipaaCompliant', options.hipaaCompliant.toString());

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.uploadQueue.set(fileId, xhr);

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress: UploadProgress = {
            fileId,
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
            speed: this.calculateUploadSpeed(fileId, event.loaded),
            timeRemaining: this.calculateTimeRemaining(fileId, event.loaded, event.total),
            stage: 'uploading',
          };
          options.onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        this.uploadQueue.delete(fileId);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data.file);
            } else {
              reject(new Error(response.message || 'Upload failed'));
            }
          } catch (error) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        this.uploadQueue.delete(fileId);
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('abort', () => {
        this.uploadQueue.delete(fileId);
        reject(new Error('Upload was cancelled'));
      });

      xhr.open('POST', `${this.baseUrl}/api/files/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
      xhr.send(formData);
    });
  }

  // File Validation
  public async validateFile(file: File): Promise<FileValidationResult> {
    const issues: FileValidationIssue[] = [];
    const recommendations: string[] = [];

    // Get file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    // Detect actual file type from magic numbers
    const actualMimeType = await this.detectMimeType(file);
    const detectedExtension = this.getExtensionFromMimeType(actualMimeType);

    // Check file size
    const maxSize = this.getMaxFileSize(file.type);
    if (file.size > maxSize) {
      issues.push({
        type: 'size',
        severity: 'high',
        message: `File size (${this.formatFileSize(file.size)}) exceeds maximum allowed size (${this.formatFileSize(maxSize)})`,
        code: 'FILE_TOO_LARGE',
      });
    }

    // Check file type
    if (!this.isAllowedFileType(file.type, extension)) {
      issues.push({
        type: 'format',
        severity: 'high',
        message: `File type ${file.type} is not allowed`,
        code: 'INVALID_FILE_TYPE',
      });
    }

    // Check for mime type spoofing
    if (actualMimeType !== file.type) {
      issues.push({
        type: 'security',
        severity: 'medium',
        message: `File extension doesn't match content type. Expected: ${file.type}, Detected: ${actualMimeType}`,
        code: 'MIME_TYPE_MISMATCH',
      });
    }

    // Check filename for suspicious patterns
    if (this.hasSuspiciousFilename(file.name)) {
      issues.push({
        type: 'security',
        severity: 'medium',
        message: 'Filename contains suspicious characters or patterns',
        code: 'SUSPICIOUS_FILENAME',
      });
    }

    // Check for executable files
    if (this.isExecutableFile(extension, actualMimeType)) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Executable files are not allowed',
        code: 'EXECUTABLE_FILE',
      });
    }

    // Generate recommendations
    if (file.size > 1024 * 1024) { // > 1MB
      recommendations.push('Consider compressing large files to reduce upload time');
    }

    if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) { // > 5MB
      recommendations.push('Large images can be optimized for web to reduce file size');
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0,
      fileType: this.getFileCategory(actualMimeType),
      actualMimeType,
      detectedExtension,
      issues,
      recommendations,
    };
  }

  // File Preview
  public async getFilePreview(fileId: string): Promise<FilePreview> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files/${fileId}/preview`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get preview: ${response.status}`);
      }

      const data = await response.json();
      return data.preview;
    } catch (error) {
      console.error('Failed to get file preview:', error);
      return {
        type: 'unsupported',
        canPreview: false,
        requiresDownload: true,
      };
    }
  }

  // File Download
  public async downloadFile(fileId: string, filename?: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Trigger download in browser
      if (filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      return blob;
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  // File Management
  public async getFileInfo(fileId: string): Promise<FileUpload> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.status}`);
      }

      const data = await response.json();
      return data.file;
    } catch (error) {
      console.error('Failed to get file info:', error);
      throw error;
    }
  }

  public async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  public async updateFileAccess(fileId: string, access: Partial<FileAccess>): Promise<FileUpload> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files/${fileId}/access`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(access),
      });

      if (!response.ok) {
        throw new Error(`Failed to update file access: ${response.status}`);
      }

      const data = await response.json();
      return data.file;
    } catch (error) {
      console.error('Failed to update file access:', error);
      throw error;
    }
  }

  // Cancel Upload
  public cancelUpload(fileId: string): void {
    const xhr = this.uploadQueue.get(fileId);
    if (xhr) {
      xhr.abort();
      this.uploadQueue.delete(fileId);
    }
  }

  // Utility Methods
  private async detectMimeType(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        const header = Array.from(arr.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Magic number detection
        const mimeTypes: Record<string, string> = {
          '89504e47': 'image/png',
          'ffd8ffe0': 'image/jpeg',
          'ffd8ffe1': 'image/jpeg',
          'ffd8ffe2': 'image/jpeg',
          '47494638': 'image/gif',
          '25504446': 'application/pdf',
          '504b0304': 'application/zip',
          '504b0506': 'application/zip',
          '504b0708': 'application/zip',
          'd0cf11e0': 'application/msword',
          '00000018': 'video/mp4',
          '00000020': 'video/mp4',
          '66747970': 'video/mp4',
        };

        resolve(mimeTypes[header] || file.type);
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'application/pdf': '.pdf',
      'application/zip': '.zip',
      'text/plain': '.txt',
    };
    return extensions[mimeType] || '';
  }

  private isAllowedFileType(mimeType: string, extension: string): boolean {
    for (const category of Object.values(FILE_TYPE_CONFIG)) {
      if (category.mimeTypes.includes(mimeType) || category.extensions.includes(extension)) {
        return true;
      }
    }
    return false;
  }

  private getMaxFileSize(mimeType: string): number {
    for (const category of Object.values(FILE_TYPE_CONFIG)) {
      if (category.mimeTypes.includes(mimeType)) {
        return category.maxSize;
      }
    }
    return 5 * 1024 * 1024; // Default 5MB
  }

  private getFileCategory(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
  }

  private hasSuspiciousFilename(filename: string): boolean {
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|app|deb|pkg|dmg)$/i,
      /[<>:"|?*]/,
      /^\./,
      /\s+$/,
      /.{255,}/, // Very long filenames
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(filename));
  }

  private isExecutableFile(extension: string, mimeType: string): boolean {
    const executableExtensions = [
      '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
      '.app', '.deb', '.pkg', '.dmg', '.msi', '.run', '.bin'
    ];
    
    const executableMimeTypes = [
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msdos-program',
      'application/x-java-archive',
      'application/java-archive',
    ];

    return executableExtensions.includes(extension) || executableMimeTypes.includes(mimeType);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private calculateUploadSpeed(fileId: string, loaded: number): number {
    // This would track upload speed over time
    // For now, return a placeholder
    return 0;
  }

  private calculateTimeRemaining(fileId: string, loaded: number, total: number): number {
    // This would calculate based on current speed
    // For now, return a placeholder
    return 0;
  }

  // Event System
  public on(event: string, callback: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
    
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public destroy(): void {
    // Cancel all uploads
    for (const [fileId, xhr] of this.uploadQueue) {
      xhr.abort();
    }
    this.uploadQueue.clear();
    this.eventListeners.clear();
  }
}