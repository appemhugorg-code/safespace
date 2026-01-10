import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Clock, MapPin, User, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PanicAlertNotification from '@/components/panic-alert-notification';
import { usePanicAlerts } from '@/hooks/use-panic-alerts';
import AppLayout from '@/layouts/app-layout';

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
    panicAlerts: PanicAlert[];
    unviewedCount: number;
}

export default function PanicAlertsIndex({ panicAlerts: initialAlerts, unviewedCount: initialUnviewedCount }: Props) {
    const { alerts: realtimeAlerts, unviewedCount: realtimeUnviewedCount, markAsViewed } = usePanicAlerts();
    const [displayAlerts, setDisplayAlerts] = useState(initialAlerts);
    const [activeTab, setActiveTab] = useState('all');

    // Update display alerts when real-time alerts change
    useEffect(() => {
        if (realtimeAlerts.length > 0) {
            // Merge real-time alerts with initial alerts, avoiding duplicates
            const mergedAlerts = [...realtimeAlerts];
            initialAlerts.forEach(alert => {
                if (!realtimeAlerts.some(rtAlert => rtAlert.id === alert.id)) {
                    mergedAlerts.push(alert);
                }
            });
            setDisplayAlerts(mergedAlerts);
        }
    }, [realtimeAlerts, initialAlerts]);

    const filterAlerts = (alerts: PanicAlert[], filter: string) => {
        switch (filter) {
            case 'active':
                return alerts.filter(alert => alert.status === 'active');
            case 'acknowledged':
                return alerts.filter(alert => alert.status === 'acknowledged');
            case 'resolved':
                return alerts.filter(alert => alert.status === 'resolved');
            default:
                return alerts;
        }
    };

    const getStatusCounts = (alerts: PanicAlert[]) => {
        return {
            all: alerts.length,
            active: alerts.filter(alert => alert.status === 'active').length,
            acknowledged: alerts.filter(alert => alert.status === 'acknowledged').length,
            resolved: alerts.filter(alert => alert.status === 'resolved').length,
        };
    };

    const statusCounts = getStatusCounts(displayAlerts);
    const filteredAlerts = filterAlerts(displayAlerts, activeTab);

    return (
        <AppLayout>
            <Head title="Emergency Alerts" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Shield className="h-8 w-8 text-red-600" />
                            Emergency Alerts
                        </h1>
                        <p className="text-muted-foreground">
                            Monitor and respond to panic button activations
                        </p>
                    </div>
                    {(realtimeUnviewedCount || initialUnviewedCount) > 0 && (
                        <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                            {realtimeUnviewedCount || initialUnviewedCount} unviewed
                        </Badge>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.all}</div>
                            <p className="text-xs text-muted-foreground">
                                all time alerts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{statusCounts.active}</div>
                            <p className="text-xs text-muted-foreground">
                                need immediate attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{statusCounts.acknowledged}</div>
                            <p className="text-xs text-muted-foreground">
                                being handled
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
                            <p className="text-xs text-muted-foreground">
                                successfully handled
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alert Management</CardTitle>
                        <CardDescription>
                            View and manage emergency alerts by status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="all">
                                    All ({statusCounts.all})
                                </TabsTrigger>
                                <TabsTrigger value="active" className="text-red-600">
                                    Active ({statusCounts.active})
                                </TabsTrigger>
                                <TabsTrigger value="acknowledged" className="text-yellow-600">
                                    Acknowledged ({statusCounts.acknowledged})
                                </TabsTrigger>
                                <TabsTrigger value="resolved" className="text-green-600">
                                    Resolved ({statusCounts.resolved})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value={activeTab} className="mt-6">
                                {filteredAlerts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No {activeTab === 'all' ? '' : activeTab} alerts
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {activeTab === 'active'
                                                ? 'No active emergency alerts at this time.'
                                                : activeTab === 'acknowledged'
                                                    ? 'No acknowledged alerts waiting for resolution.'
                                                    : activeTab === 'resolved'
                                                        ? 'No resolved alerts in recent history.'
                                                        : 'No emergency alerts have been triggered yet.'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAlerts.map((alert) => (
                                            <PanicAlertNotification
                                                key={alert.id}
                                                alert={alert}
                                                compact={false}
                                                showActions={alert.status !== 'resolved'}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Emergency Information */}
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-orange-900 mb-1">Emergency Response Guidelines</h4>
                                <ul className="text-sm text-orange-800 space-y-1">
                                    <li>• <strong>Active alerts</strong> require immediate attention and response</li>
                                    <li>• <strong>Acknowledge</strong> alerts to let others know you're responding</li>
                                    <li>• <strong>Resolve</strong> alerts once the situation is safely handled</li>
                                    <li>• Always add notes when resolving to document the response</li>
                                    <li>• Contact emergency services (911) for life-threatening situations</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
