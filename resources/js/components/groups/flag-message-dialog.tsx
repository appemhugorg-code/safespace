import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { Flag } from 'lucide-react';

interface FlagMessageDialogProps {
    messageId: number;
    isOpen: boolean;
    onClose: () => void;
    onFlagged?: () => void;
}

const flagTypes = [
    { value: 'inappropriate', label: 'Inappropriate Content', description: 'Contains offensive or inappropriate language' },
    { value: 'spam', label: 'Spam', description: 'Unwanted or repetitive content' },
    { value: 'harassment', label: 'Harassment', description: 'Bullying, threats, or harassment' },
    { value: 'violence', label: 'Violence/Threats', description: 'Contains violent content or threats' },
    { value: 'self_harm', label: 'Self-Harm', description: 'Content related to self-harm or suicide' },
    { value: 'other', label: 'Other', description: 'Other reason not listed above' },
];

export default function FlagMessageDialog({ messageId, isOpen, onClose, onFlagged }: FlagMessageDialogProps) {
    const [flagType, setFlagType] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!flagType) {
            setError('Please select a reason for flagging this message.');
            return;
        }

        if (flagType === 'other' && !reason.trim()) {
            setError('Please provide a reason when selecting "Other".');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await api.post(`/messages/${messageId}/flag`, {
                flag_type: flagType,
                reason: reason.trim() || null,
            });

            onFlagged?.();
            onClose();

            // Reset form
            setFlagType('');
            setReason('');
        } catch (error: any) {
            console.error('Failed to flag message:', error);
            setError(error.response?.data?.message || 'Failed to flag message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setFlagType('');
            setReason('');
            setError(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Flag className="h-5 w-5 text-red-500" />
                        <span>Flag Message</span>
                    </DialogTitle>
                    <DialogDescription>
                        Help us maintain a safe environment by reporting inappropriate content.
                        Your report will be reviewed by our moderation team.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <Label className="text-sm font-medium">Reason for flagging</Label>
                        <RadioGroup value={flagType} onValueChange={setFlagType} className="mt-2">
                            {flagTypes.map((type) => (
                                <div key={type.value} className="flex items-start space-x-2">
                                    <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor={type.value} className="text-sm font-medium cursor-pointer">
                                            {type.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {(flagType === 'other' || flagType) && (
                        <div>
                            <Label htmlFor="reason" className="text-sm font-medium">
                                {flagType === 'other' ? 'Please specify the reason' : 'Additional details (optional)'}
                            </Label>
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={flagType === 'other'
                                    ? 'Please describe why you are flagging this message...'
                                    : 'Provide any additional context that might help our review...'
                                }
                                className="mt-1"
                                rows={3}
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {reason.length}/500 characters
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!flagType || isSubmitting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isSubmitting ? 'Flagging...' : 'Flag Message'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
