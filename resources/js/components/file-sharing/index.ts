export { FileSharingService, FILE_TYPE_CONFIG } from '@/services/file-sharing-service';
export { useFileSharing } from '@/hooks/use-file-sharing';
export { FileUploadZone } from './file-upload-zone';
export { FilePreview } from './file-preview';
export { FileGallery } from './file-gallery';

export type {
  FileUpload,
  FileMetadata,
  FileSecurity,
  FileAccess,
  FileValidationResult,
  FileValidationIssue,
  UploadProgress,
  FilePreview as FilePreviewData,
} from '@/services/file-sharing-service';

export type {
  UseFileSharingOptions,
  UseFileSharingReturn,
} from '@/hooks/use-file-sharing';