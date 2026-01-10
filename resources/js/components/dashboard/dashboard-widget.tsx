import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Settings, 
  Maximize2, 
  Minimize2,
  X 
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface DashboardWidgetData {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  visible: boolean;
  enabled: boolean;
  content?: React.ReactNode;
  settings?: Record<string, any>;
}

interface DashboardWidgetProps {
  widget: DashboardWidgetData;
  index: number;
  isEditing: boolean;
  onMove: (dragIndex: number, dropIndex: number) => void;
  onToggleVisibility: (widgetId: string) => void;
  onChangeSize: (widgetId: string, size: 'small' | 'medium' | 'large') => void;
  onRemove?: (widgetId: string) => void;
  onSettings?: (widgetId: string) => void;
}

const ItemType = 'DASHBOARD_WIDGET';

export function DashboardWidget({
  widget,
  index,
  isEditing,
  onMove,
  onToggleVisibility,
  onChangeSize,
  onRemove,
  onSettings,
}: DashboardWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { index, id: widget.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditing,
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number; id: string }) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const dropIndex = index;
      
      if (dragIndex === dropIndex) return;
      
      onMove(dragIndex, dropIndex);
      item.index = dropIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  preview(drop(ref));

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'medium':
        return 'col-span-1 row-span-2';
      case 'large':
        return 'col-span-2 row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small':
        return 'S';
      case 'medium':
        return 'M';
      case 'large':
        return 'L';
      default:
        return 'M';
    }
  };

  if (!widget.visible && !isEditing) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className={`
        ${getSizeClasses(widget.size)}
        ${isDragging ? 'opacity-50' : ''}
        ${isOver ? 'ring-2 ring-blue-400' : ''}
        ${!widget.visible ? 'opacity-60' : ''}
        transition-all duration-200
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full ${!widget.enabled ? 'bg-gray-50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isEditing && (
                <div
                  ref={drag}
                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              )}
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {getSizeLabel(widget.size)}
              </Badge>
            </div>
            
            {isEditing && (
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleVisibility(widget.id)}
                  className="h-6 w-6 p-0"
                >
                  {widget.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
                    const currentIndex = sizes.indexOf(widget.size);
                    const nextSize = sizes[(currentIndex + 1) % sizes.length];
                    onChangeSize(widget.id, nextSize);
                  }}
                  className="h-6 w-6 p-0"
                >
                  {widget.size === 'large' ? (
                    <Minimize2 className="h-3 w-3" />
                  ) : (
                    <Maximize2 className="h-3 w-3" />
                  )}
                </Button>
                
                {onSettings && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSettings(widget.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                )}
                
                {onRemove && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(widget.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {widget.enabled ? (
            widget.content || (
              <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
                {widget.type} widget content
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
              Widget disabled
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}