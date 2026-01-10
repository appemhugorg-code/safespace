import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Share2,
  SortAsc,
  SortDesc,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { FileUpload } from '@/services/file-sharing-service';
import { FilePreview } from './file-preview';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface FileGalleryProps {
  files: FileUpload[];
  authToken: string;
  viewMode?: 'grid' | 'list';
  showSearch?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  allowMultiSelect?: boolean;
  onFileSelect?: (file: FileUpload) => void;
  onFilesSelect?: (files: FileUpload[]) => void;
  onDownload?: (file: FileUpload) => void;
  onDelete?: (fileId: string) => void;
  onShare?: (file: FileUpload) => void;
  onPreview?: (file: FileUpload) => void;
  className?: string;
}

type SortField = 'name' | 'size' | 'uploadedAt' | 'type';
type SortOrder = 'asc' | 'desc';
type FileTypeFilter = 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'archives';

export function FileGallery({
  files,
  authToken,
  viewMode: initialViewMode = 'grid',
  showSearch = true,
  showFilters = true,
  showActions = true,
  allowMultiSelect = false,
  onFileSelect,
  onFilesSelect,
  onDownload,
  onDelete,
  onShare,
  onPreview,
  className = '',
}: FileGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<FileUpload | null>(null);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.originalName.toLowerCase().includes(query) ||
        file.type.toLowerCase().includes(query) ||
        file.uploadedBy.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(file => {
        switch (typeFilter) {
          case 'images':
            return file.type.startsWith('image/');
          case 'videos':
            return file.type.startsWith('video/');
          case 'audio':
            return file.type.startsWith('audio/');
          case 'documents':
            return file.type.includes('pdf') || 
                   file.type.includes('document') || 
                   file.type.includes('text') ||
                   file.type.includes('spreadsheet') ||
                   file.type.includes('presentation');
          case 'archives':
            return file.type.includes('zip') || 
                   file.type.includes('archive') ||
                   file.type.includes('compressed');
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.originalName.toLowerCase();
          bValue = b.originalName.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'uploadedAt':
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, searchQuery, typeFilter, sortField, sortOrder]);

  // Handle file selection
  const handleFileSelect = (file: FileUpload) => {
    if (allowMultiSelect) {
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id);
      } else {
        newSelected.add(file.id);
      }
      setSelectedFiles(newSelected);
      
      const selectedFileObjects = files.filter(f => newSelected.has(f.id));
      onFilesSelect?.(selectedFileObjects);
    } else {
      onFileSelect?.(file);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedFiles.size === filteredAndSortedFiles.length) {
      setSelectedFiles(new Set());
      onFilesSelect?.([]);
    } else {
      const allIds = new Set(filteredAndSortedFiles.map(f => f.id));
      setSelectedFiles(allIds);
      onFilesSelect?.(filteredAndSortedFiles);
    }
  };

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Get file type icon
  const getFileTypeIcon = (file: FileUpload) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (file.type.includes('zip') || file.type.includes('archive')) return <Archive className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type counts
  const getFileTypeCounts = () => {
    const counts = {
      all: files.length,
      images: files.filter(f => f.type.startsWith('image/')).length,
      videos: files.filter(f => f.type.startsWith('video/')).length,
      audio: files.filter(f => f.type.startsWith('audio/')).length,
      documents: files.filter(f => 
        f.type.includes('pdf') || f.type.includes('document') || 
        f.type.includes('text') || f.type.includes('spreadsheet') || 
        f.type.includes('presentation')
      ).length,
      archives: files.filter(f => 
        f.type.includes('zip') || f.type.includes('archive') || 
        f.type.includes('compressed')
      ).length,
    };
    return counts;
  };

  const typeCounts = getFileTypeCounts();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Files ({filteredAndSortedFiles.length})
          </h2>
          {selectedFiles.size > 0 && (
            <p className="text-sm text-gray-600">
              {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Bulk actions */}
          {allowMultiSelect && selectedFiles.size > 0 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selectedFileObjects = files.filter(f => selectedFiles.has(f.id));
                  selectedFileObjects.forEach(file => onDownload?.(file));
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectedFiles.forEach(fileId => onDelete?.(fileId));
                  setSelectedFiles(new Set());
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Type Filter */}
          {showFilters && (
            <div className="flex space-x-2 overflow-x-auto">
              {Object.entries(typeCounts).map(([type, count]) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type as FileTypeFilter)}
                  className="whitespace-nowrap"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-gray-600">Sort by:</span>
        <div className="flex items-center space-x-2">
          {(['name', 'size', 'uploadedAt', 'type'] as SortField[]).map(field => (
            <Button
              key={field}
              variant="ghost"
              size="sm"
              onClick={() => handleSort(field)}
              className={`${sortField === field ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {field === 'uploadedAt' ? 'Date' : field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (
                sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
              )}
            </Button>
          ))}
        </div>

        {allowMultiSelect && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="ml-auto"
          >
            {selectedFiles.size === filteredAndSortedFiles.length ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>

      {/* File Grid/List */}
      <AnimatePresence>
        {filteredAndSortedFiles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-2'
            }
          >
            {filteredAndSortedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  ${viewMode === 'grid' ? 'aspect-square' : 'h-auto'}
                  ${allowMultiSelect && selectedFiles.has(file.id) ? 'ring-2 ring-blue-500' : ''}
                  cursor-pointer transition-all duration-200 hover:shadow-md
                `}
                onClick={() => handleFileSelect(file)}
              >
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
                      {file.thumbnailUrl ? (
                        <img
                          src={file.thumbnailUrl}
                          alt={file.originalName}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400">
                          {getFileTypeIcon(file)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {file.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    {showActions && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewFile(file);
                              onPreview?.(file);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownload?.(file);
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* List View */
                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
                    {/* Checkbox */}
                    {allowMultiSelect && (
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.id)}
                        onChange={() => handleFileSelect(file)}
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}

                    {/* Icon */}
                    <div className="flex-shrink-0 text-gray-500">
                      {getFileTypeIcon(file)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.type}</span>
                        <span>Uploaded {formatDistanceToNow(file.uploadedAt, { addSuffix: true })}</span>
                        <span>by {file.uploadedBy}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <Badge variant="secondary" className="text-xs">
                      {file.status}
                    </Badge>

                    {/* Actions */}
                    {showActions && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewFile(file);
                            onPreview?.(file);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload?.(file);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {onShare && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(file);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(file.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload some files to get started'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <FilePreview
                file={previewFile}
                authToken={authToken}
                onDownload={onDownload}
                onDelete={onDelete}
                onShare={onShare}
              />
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setPreviewFile(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}