import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  EyeOff, 
  Maximize2, 
  X, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Shield,
  Clock,
  User,
  Calendar,
  HardDrive,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { FileUpload, FilePreview as FilePreviewData } from '@/services/file-sharing-service';
import { useFileSharing } from '@/hooks/use-file-sharing';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface FilePreviewProps {
  file: FileUpload;
  authToken: string;
  showDetails?: boolean;
  showActions?: boolean;
  onDownload?: (file: FileUpload) => void;
  onDelete?: (fileId: string) => void;
  onShare?: (file: FileUpload) => void;
  className?: string;
}

export function FilePreview({
  file,
  authToken,
  showDetails = true,
  showActions = true,
  onDownload,
  onDelete,
  onShare,
  className = '',
}: FilePreviewProps) {
  const [preview, setPreview] = useState<FilePreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getFilePreview, downloadFile, formatFileSize } = useFileSharing({
    authToken,
  });

  // Load preview
  useEffect(() => {
    const loadPreview = async () => {
      if (!file.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const previewData = await getFilePreview(file.id);
        setPreview(previewData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [file.id, getFilePreview]);

  // Handle download
  const handleDownload = useCallback(async () => {
    try {
      await downloadFile(file.id, file.originalName);
      onDownload?.(file);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [file, downloadFile, onDownload]);

  // Get file type icon
  const getFileIcon = useCallback(() => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (file.type.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (file.type.includes('zip') || file.type.includes('archive')) return <Archive className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  }, [file.type]);

  // Get status color
  const getStatusColor = () => {
    switch (file.status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'quarantined': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  // Render preview content
  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      );
    }

    if (!preview || !preview.canPreview) {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <div className="text-center">
            {getFileIcon()}
            <p className="text-sm text-gray-600 mt-2">Preview not available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="mt-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download to view
            </Button>
          </div>
        </div>
      );
    }

    // Render based on preview type
    switch (preview.type) {
      case 'image':
        return (
          <div className="relative group">
            <img
              src={preview.url || preview.thumbnailUrl}
              alt={file.originalName}
              className="w-full h-auto max-h-96 object-contain rounded-lg cursor-pointer"
              onClick={() => setShowFullscreen(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Full size
              </Button>
            </div>
          </div>
        );

      case 'video':
        return (
          <video
            src={preview.url}
            controls
            className="w-full h-auto max-h-96 rounded-lg"
            poster={preview.thumbnailUrl}
          >
            Your browser does not support video playback.
          </video>
        );

      case 'audio':
        return (
          <div className="p-6 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Music className="h-8 w-8 text-gray-600" />
              <div>
                <h4 className="font-medium">{file.originalName}</h4>
                <p className="text-sm text-gray-600">Audio file</p>
              </div>
            </div>
            <audio src={preview.url} controls className="w-full">
              Your browser does not support audio playback.
            </audio>
          </div>
        );

      case 'document':
        return (
          <div className="p-6 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8 text-gray-600" />
              <div>
                <h4 className="font-medium">{file.originalName}</h4>
                <p className="text-sm text-gray-600">
                  {preview.pages ? `${preview.pages} pages` : 'Document'}
                </p>
              </div>
            </div>
            {preview.url && (
              <Button
                variant="outline"
                onClick={() => window.open(preview.url, '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </Button>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {preview.previewData}
            </pre>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
            <div className="text-center">
              {getFileIcon()}
              <p className="text-sm text-gray-600 mt-2">Unsupported preview type</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-gray-500">
                {getFileIcon()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant={file.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {file.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {file.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShare(file)}
                    title="Share"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(file.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-4">
          {renderPreviewContent()}
        </div>

        {/* Details */}
        {showDetails && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Uploaded by:</span>
                  <span className="font-medium">{file.uploadedBy}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Uploaded:</span>
                  <span>{formatDistanceToNow(file.uploadedAt, { addSuffix: true })}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Size:</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Security indicators */}
                {file.security.encrypted && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Encrypted</span>
                  </div>
                )}
                
                {file.security.hipaaCompliant && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Shield className="h-4 w-4" />
                    <span>HIPAA Compliant</span>
                  </div>
                )}
                
                {file.security.virusScanned && (
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-4 w-4 ${
                      file.security.virusScanResult === 'clean' ? 'text-green-600' :
                      file.security.virusScanResult === 'infected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`} />
                    <span className="capitalize">
                      {file.security.virusScanResult || 'Scanned'}
                    </span>
                  </div>
                )}

                {/* Access info */}
                {file.access.expiresAt && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      Expires {formatDistanceToNow(file.access.expiresAt, { addSuffix: true })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            {file.metadata && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-700 mb-2">File Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {file.metadata.width && file.metadata.height && (
                    <div>Dimensions: {file.metadata.width} × {file.metadata.height}</div>
                  )}
                  {file.metadata.duration && (
                    <div>Duration: {Math.round(file.metadata.duration)}s</div>
                  )}
                  {file.metadata.pages && (
                    <div>Pages: {file.metadata.pages}</div>
                  )}
                  {file.metadata.bitrate && (
                    <div>Bitrate: {Math.round(file.metadata.bitrate / 1000)}kbps</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && preview?.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setShowFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={preview.url || preview.thumbnailUrl}
                alt={file.originalName}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}