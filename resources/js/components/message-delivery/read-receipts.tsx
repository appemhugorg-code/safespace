import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Users, 
  Clock, 
  Check,
  ChevronDown,
  ChevronUp,
  Settings,
  Shield,
  User
} from 'lucide-react';
import { DeliveryReceipt, ReadReceiptSettings } from '@/services/message-delivery-service';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ReadReceiptsProps {
  messageId: string;
  receipts: DeliveryReceipt[];
  settings: ReadReceiptSettings;
  isGroupMessage?: boolean;
  currentUserId: string;
  showDetails?: boolean;
  className?: string;
}

export function ReadReceipts({
  messageId,
  receipts,
  settings,
  isGroupMessage = false,
  currentUserId,
  showDetails = false,
  className = '',
}: ReadReceiptsProps) {
  const [expanded, setExpanded] = useState(false);

  // Filter receipts based on settings
  const visibleReceipts = receipts.filter(receipt => {
    if (!settings.enabled) return false;
    if (settings.anonymousMode && isGroupMessage) return false;
    return true;
  });

  // Separate read and delivered receipts
  const readReceipts = visibleReceipts.filter(receipt => receipt.readAt);
  const deliveredReceipts = visibleReceipts.filter(receipt => !receipt.readAt);

  // Get summary counts
  const totalRecipients = receipts.length;
  const readCount = readReceipts.length;
  const deliveredCount = deliveredReceipts.length;

  if (!settings.enabled || (!settings.showToSender && !settings.showToRecipient)) {
    return null;
  }

  if (visibleReceipts.length === 0) {
    return (
      <div className={`flex items-center space-x-1 text-xs text-gray-400 ${className}`}>
        <EyeOff className="h-3 w-3" />
        <span>Read receipts disabled</span>
      </div>
    );
  }

  // Simple view for single recipient
  if (!isGroupMessage && visibleReceipts.length === 1) {
    const receipt = visibleReceipts[0];
    return (
      <div className={`flex items-center space-x-1 text-xs ${className}`}>
        {receipt.readAt ? (
          <>
            <Eye className="h-3 w-3 text-blue-500" />
            <span className="text-blue-600">
              Read {formatDistanceToNow(receipt.readAt, { addSuffix: true })}
            </span>
          </>
        ) : (
          <>
            <Check className="h-3 w-3 text-green-500" />
            <span className="text-green-600">
              Delivered {formatDistanceToNow(receipt.deliveredAt, { addSuffix: true })}
            </span>
          </>
        )}
      </div>
    );
  }

  // Group message view
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Read count */}
          {readCount > 0 && (
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3 text-blue-500" />
              <Badge variant="secondary" className="text-xs">
                {readCount} read
              </Badge>
            </div>
          )}

          {/* Delivered count */}
          {deliveredCount > 0 && (
            <div className="flex items-center space-x-1">
              <Check className="h-3 w-3 text-green-500" />
              <Badge variant="outline" className="text-xs">
                {deliveredCount} delivered
              </Badge>
            </div>
          )}

          {/* Anonymous mode indicator */}
          {settings.anonymousMode && isGroupMessage && (
            <div className="flex items-center space-x-1">
              <EyeOff className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">Anonymous</span>
            </div>
          )}
        </div>

        {/* Expand/collapse button */}
        {showDetails && visibleReceipts.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 px-2"
          >
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* Detailed view */}
      <AnimatePresence>
        {expanded && showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {/* Read receipts */}
            {readReceipts.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-1">Read by:</h5>
                <div className="space-y-1">
                  {readReceipts.map((receipt) => (
                    <ReceiptItem
                      key={receipt.id}
                      receipt={receipt}
                      type="read"
                      showAnonymous={settings.anonymousMode && isGroupMessage}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Delivered receipts */}
            {deliveredCount > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-1">Delivered to:</h5>
                <div className="space-y-1">
                  {deliveredReceipts.map((receipt) => (
                    <ReceiptItem
                      key={receipt.id}
                      receipt={receipt}
                      type="delivered"
                      showAnonymous={settings.anonymousMode && isGroupMessage}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ReceiptItemProps {
  receipt: DeliveryReceipt;
  type: 'read' | 'delivered';
  showAnonymous?: boolean;
}

function ReceiptItem({ receipt, type, showAnonymous = false }: ReceiptItemProps) {
  const timestamp = type === 'read' ? receipt.readAt : receipt.deliveredAt;
  const icon = type === 'read' ? Eye : Check;
  const IconComponent = icon;
  const color = type === 'read' ? 'text-blue-500' : 'text-green-500';

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center space-x-2">
        <IconComponent className={`h-3 w-3 ${color}`} />
        <span className="text-gray-700">
          {showAnonymous ? 'Anonymous User' : `User ${receipt.recipientId.slice(-4)}`}
        </span>
        {receipt.deviceInfo && (
          <Badge variant="outline" className="text-xs">
            {receipt.deviceInfo.type}
          </Badge>
        )}
      </div>
      
      {timestamp && (
        <span className="text-gray-500">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      )}
    </div>
  );
}

interface ReadReceiptSettingsProps {
  settings: ReadReceiptSettings;
  onSettingsChange: (settings: Partial<ReadReceiptSettings>) => void;
  isGroupConversation?: boolean;
  userRole?: string;
  className?: string;
}

export function ReadReceiptSettingsPanel({
  settings,
  onSettingsChange,
  isGroupConversation = false,
  userRole = 'client',
  className = '',
}: ReadReceiptSettingsProps) {
  const handleToggle = useCallback((key: keyof ReadReceiptSettings, value: boolean) => {
    onSettingsChange({ [key]: value });
  }, [onSettingsChange]);

  const isTherapist = userRole === 'therapist';
  const canModifySettings = isTherapist || userRole === 'moderator';

  return (
    <div className={`space-y-4 p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center space-x-2">
        <Settings className="h-4 w-4 text-gray-600" />
        <h4 className="font-medium text-gray-900">Read Receipt Settings</h4>
      </div>

      <div className="space-y-3">
        {/* Enable read receipts */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Enable Read Receipts</label>
            <p className="text-xs text-gray-500">Show when messages are read</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => handleToggle('enabled', e.target.checked)}
            disabled={!canModifySettings}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {settings.enabled && (
          <>
            {/* Show to sender */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Show to Sender</label>
                <p className="text-xs text-gray-500">Let senders see read receipts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showToSender}
                onChange={(e) => handleToggle('showToSender', e.target.checked)}
                disabled={!canModifySettings}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Show to recipient */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Show to Recipient</label>
                <p className="text-xs text-gray-500">Let recipients see their own read status</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showToRecipient}
                onChange={(e) => handleToggle('showToRecipient', e.target.checked)}
                disabled={!canModifySettings}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Group read receipts */}
            {isGroupConversation && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Group Read Receipts</label>
                  <p className="text-xs text-gray-500">Show read receipts in group conversations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.groupReadReceipts}
                  onChange={(e) => handleToggle('groupReadReceipts', e.target.checked)}
                  disabled={!canModifySettings}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Anonymous mode */}
            {isGroupConversation && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Anonymous Mode</label>
                  <p className="text-xs text-gray-500">Hide individual identities in group receipts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.anonymousMode}
                  onChange={(e) => handleToggle('anonymousMode', e.target.checked)}
                  disabled={!canModifySettings}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Therapist override */}
            {isTherapist && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <label className="text-sm font-medium text-green-900">Therapist Override</label>
                    <p className="text-xs text-green-700">Always see read receipts for therapeutic purposes</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.therapistOverride}
                  onChange={(e) => handleToggle('therapistOverride', e.target.checked)}
                  className="rounded border-green-300 text-green-600 focus:ring-green-500"
                />
              </div>
            )}
          </>
        )}
      </div>

      {!canModifySettings && (
        <div className="text-xs text-gray-500 italic">
          Only therapists and moderators can modify these settings
        </div>
      )}
    </div>
  );
}

interface ReadReceiptSummaryProps {
  totalRecipients: number;
  readCount: number;
  deliveredCount: number;
  settings: ReadReceiptSettings;
  className?: string;
}

export function ReadReceiptSummary({
  totalRecipients,
  readCount,
  deliveredCount,
  settings,
  className = '',
}: ReadReceiptSummaryProps) {
  if (!settings.enabled) {
    return null;
  }

  const undeliveredCount = totalRecipients - deliveredCount - readCount;
  const readPercentage = totalRecipients > 0 ? Math.round((readCount / totalRecipients) * 100) : 0;

  return (
    <div className={`flex items-center space-x-4 text-xs ${className}`}>
      {/* Read status */}
      <div className="flex items-center space-x-1">
        <Eye className="h-3 w-3 text-blue-500" />
        <span className="text-blue-600">{readCount}</span>
        <span className="text-gray-500">read</span>
      </div>

      {/* Delivered status */}
      <div className="flex items-center space-x-1">
        <Check className="h-3 w-3 text-green-500" />
        <span className="text-green-600">{deliveredCount}</span>
        <span className="text-gray-500">delivered</span>
      </div>

      {/* Undelivered status */}
      {undeliveredCount > 0 && (
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600">{undeliveredCount}</span>
          <span className="text-gray-500">pending</span>
        </div>
      )}

      {/* Read percentage */}
      {totalRecipients > 1 && (
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">•</span>
          <span className="font-medium text-gray-700">{readPercentage}%</span>
          <span className="text-gray-500">read</span>
        </div>
      )}
    </div>
  );
}