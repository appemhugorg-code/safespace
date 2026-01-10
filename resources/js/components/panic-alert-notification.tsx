import { AlertTriangle, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PanicAlert {
    id: number;
    child: {
        id: number;
        name: string;
    };
    triggered_at: string;
    status: 'active' | 'acknowledged' | 'resolved';
    resolved_at?: string;
    resolved_by?: {
        id: number;
        name: string;
    };
    location_data?: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
    notes?: string;
    notifications?: Array<{
        id: number;
        viewed_at?: string;
        acknowledged_at?: string;
        notification_type: string;
    }>;
}

interface Props {
    alert: PanicAlert;
    compact?: boolean;
    showActions?: boolean;
}

export default function PanicAlertNotification({ alert, compact = false, showActions = true }: Props) {
    const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
    const [resolveNotes, setResolveNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'active': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTimeElapsed = (triggeredAt: string) => {
        const now = new Date();
        const triggered = new Date(triggeredAt);
        const diffInMinutes = Math.floor((now.getTime() - triggered.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const handleAcknowledge = () => {
        setIsProcessing(true);
        router.patch(`/panic-alerts/${alert.id}/acknowledge`, {}, {
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleResolve = () => {
        setIsProcessing(true);
        router.patch(`/panic-alerts/${alert.id}/resolve`, {
            notes: resolveNotes
        }, {
            onSuccess: () => {
                setResolveDialogOpen(false);
                setResolveNotes('');
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const openLocationInMaps = () => {
        if (alert.location_data) {
            const { latitude, longitude } = alert.location_data;
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(url, '_blank');
        }
    };

    if (compact) {
        return (
            <div className={`flex items-center justify-between p-3 border rounded-lg ${alert.status === 'active' ? 'border-red-200 bg-red-50' :
                    alert.status === 'acknowledged' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                }`}>
                <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${alert.status === 'active' ? 'text-red-600' :
                            alert.status === 'acknowledged' ? 'text-yellow-600' :
                                'text-green-600'
                        }`} />
                    <div>
                        <p className="font-medium">{alert.child.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {getTimeElapsed(alert.triggered_at)}
                        </p>
                    </div>
                </div>
                <Badge className={getStatusColor(alert.status)}>
                    {alert.status}
                </Badge>
            </div>
        );
    }

    return (
        <>
            <Card className={`${alert.status === 'active' ? 'border-red-200' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className={`h-6 w-6 ${alert.status === 'active' ? 'text-red-600' :
                                    alert.status === 'acknowledged' ? 'text-yellow-600' :
                                        'text-green-600'
                                }`} />
                            <div>
                                <CardTitle className="text-lg">Emergency Alert</CardTitle>
                                <CardDescription>
                                    {alert.child.name} activated panic button
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(alert.triggered_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{alert.child.name}</span>
                        </div>
                        {alert.location_data && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <button
                                    onClick={openLocationInMaps}
                                    className="text-blue-600 hover:underline"
                                >
                                    View Location
                                </button>
                            </div>
                        )}
                        {alert.resolved_by && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Resolved by {alert.resolved_by.name}</span>
                            </div>
                        )}
                    </div>

                    {alert.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Resolution Notes:</p>
                            <p className="text-sm text-gray-700">{alert.notes}</p>
                        </div>
                    )}

                    {showActions && alert.status !== 'resolved' && (
                        <div className="flex gap-2 pt-2">
                            {alert.status === 'active' && (
                                <Button
                                    onClick={handleAcknowledge}
                                    disabled={isProcessing}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Acknowledge
                                </Button>
                            )}
                            <Button
                                onClick={() => setResolveDialogOpen(true)}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Mark Resolved
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resolve Dialog */}
            <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resolve Panic Alert</DialogTitle>
                        <DialogDescription>
                            Mark this alert as resolved and add any notes about the resolution.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="resolve-notes">Resolution Notes (optional)</Label>
                            <Textarea
                                id="resolve-notes"
                                value={resolveNotes}
                                onChange={(e) => setResolveNotes(e.target.value)}
                                placeholder="Describe what action was taken to resolve this alert..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setResolveDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResolve}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Resolve Alert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
