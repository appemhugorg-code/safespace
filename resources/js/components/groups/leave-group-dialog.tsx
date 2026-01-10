import { useState } from 'react';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Group {
    id: number;
    name: string;
}

interface LeaveGroupDialogProps {
    group: Group;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLeave: (reason: string, customReason?: string) => Promise<void>;
}

export default function LeaveGroupDialog({
    group,
    open,
    onOpenChange,
    onLeave
}: LeaveGroupDialogProps) {
    const [leaveReason, setLeaveReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [leaving, setLeaving] = useState(false);

    const leaveReasons = [
        { value: 'no_longer_relevant', label: 'No longer relevant' },
        { value: 'too_busy', label: 'Too busy' },
        { value: 'found_better_support', label: 'Found better support' },
        { value: 'privacy_concerns', label: 'Privacy concerns' },
        { value: 'other', label: 'Other' },
    ];

    const handleLeave = async () => {
        if (!leaveReason) return;

        setLeaving(true);
        try {
            await onLeave(leaveReason, leaveReason === 'other' ? customReason : undefined);
            // Reset form
            setLeaveReason('');
            setCustomReason('');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to leave group:', error);
        } finally {
            setLeaving(false);
        }
    };

    const handleCancel = () => {
        setLeaveReason('');
        setCustomReason('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LogOut className="w-5 h-5" />
                        Leave Group
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave "{group.name}"? You'll lose access to all group messages and won't receive new messages.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="reason">Reason for leaving *</Label>
                        <Select value={leaveReason} onValueChange={setLeaveReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {leaveReasons.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {leaveReason === 'other' && (
                        <div>
                            <Label htmlFor="custom_reason">Please specify</Label>
                            <Textarea
                                id="custom_reason"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Tell us why you're leaving..."
                                rows={3}
                            />
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Your feedback helps us improve group experiences.
                            This information will be reviewed by group administrators.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={leaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLeave}
                            disabled={leaving || !leaveReason || (leaveReason === 'other' && !customReason.trim())}
                        >
                            {leaving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <LogOut className="w-4 h-4 mr-2" />
                            )}
                            Leave Group
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
