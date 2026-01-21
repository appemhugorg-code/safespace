import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Star, Clock, Users, Send, Filter } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';

interface Therapist {
    id: number;
    name: string;
    email: string;
    status: string;
    specialization?: string;
    availability: Array<{
        day_of_week: number;
        start_time: string;
        end_time: string;
        day_name: string;
    }>;
    active_connections: number;
    rating?: number;
    years_experience?: number;
}

interface RecommendedTherapist {
    id: number;
    name: string;
    specialization?: string;
    availability_slots: number;
    recommendation_score: number;
}

interface SearchStats {
    total_therapists: number;
    therapists_with_availability: number;
    therapists_without_availability: number;
    average_connections_per_therapist: number;
}

interface Props {
    therapists: Therapist[];
    recommended_therapists: RecommendedTherapist[];
    filters: Record<string, any>;
    search_stats: SearchStats;
}

export default function GuardianTherapistSearch({ therapists, recommended_therapists, filters, search_stats }: Props) {
    const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
    const [showRequestDialog, setShowRequestDialog] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        therapist_id: '',
        message: '',
    });

    const searchForm = useForm({
        name: filters.name || '',
        specialization: filters.specialization || '',
        available_day: filters.available_day || '',
        available_time: filters.available_time || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchForm.get('/guardian/connections/search', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRequestConnection = (therapist: Therapist) => {
        setSelectedTherapist(therapist);
        setData('therapist_id', therapist.id.toString());
        setShowRequestDialog(true);
    };

    const submitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post('/guardian/connections/requests', {
            onSuccess: () => {
                toast.success('Connection request sent successfully!');
                setShowRequestDialog(false);
                reset();
                setSelectedTherapist(null);
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Failed to send connection request. Please try again.');
                }
            },
        });
    };

    const getDayName = (dayOfWeek: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek] || 'Unknown';
    };

    const formatAvailability = (availability: Therapist['availability']) => {
        if (availability.length === 0) return 'No availability set';

        return availability.slice(0, 3).map(slot =>
            `${slot.day_name} ${slot.start_time}-${slot.end_time}`
        ).join(', ') + (availability.length > 3 ? '...' : '');
    };

    return (
        <AppLayout>
            <Head title="Find Therapists" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Find Therapists</h1>
                        <p className="text-muted-foreground">
                            Search for available therapists and send connection requests
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                </div>

                {/* Search Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{search_stats.total_therapists}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">With Availability</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{search_stats.therapists_with_availability}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Connections</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{search_stats.average_connections_per_therapist}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{therapists.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Filters */}
                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Filters</CardTitle>
                            <CardDescription>Refine your search to find the right therapist</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Search by name..."
                                            value={searchForm.data.name}
                                            onChange={(e) => searchForm.setData('name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Input
                                            id="specialization"
                                            placeholder="e.g., Child Psychology"
                                            value={searchForm.data.specialization}
                                            onChange={(e) => searchForm.setData('specialization', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="available_day">Available Day</Label>
                                        <Select value={searchForm.data.available_day} onValueChange={(value) => searchForm.setData('available_day', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any day" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Any day</SelectItem>
                                                <SelectItem value="0">Sunday</SelectItem>
                                                <SelectItem value="1">Monday</SelectItem>
                                                <SelectItem value="2">Tuesday</SelectItem>
                                                <SelectItem value="3">Wednesday</SelectItem>
                                                <SelectItem value="4">Thursday</SelectItem>
                                                <SelectItem value="5">Friday</SelectItem>
                                                <SelectItem value="6">Saturday</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="available_time">Available Time</Label>
                                        <Input
                                            id="available_time"
                                            type="time"
                                            value={searchForm.data.available_time}
                                            onChange={(e) => searchForm.setData('available_time', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={searchForm.processing}>
                                        <Search className="w-4 h-4 mr-2" />
                                        Search
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            searchForm.reset();
                                            searchForm.get('/guardian/connections/search');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Recommended Therapists */}
                {recommended_therapists.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Recommended for You
                            </CardTitle>
                            <CardDescription>
                                Based on availability and current workload
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recommended_therapists.map((therapist) => (
                                    <Card key={therapist.id} className="border-yellow-200">
                                        <CardContent className="pt-4">
                                            <h4 className="font-semibold">{therapist.name}</h4>
                                            <p className="text-sm text-muted-foreground">{therapist.specialization || 'General Therapy'}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <Badge variant="outline">{therapist.availability_slots} slots</Badge>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        const fullTherapist = therapists.find(t => t.id === therapist.id);
                                                        if (fullTherapist) handleRequestConnection(fullTherapist);
                                                    }}
                                                >
                                                    Connect
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search Results */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Available Therapists ({therapists.length})</h2>

                    {therapists.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Therapists Found</h3>
                                <p className="text-muted-foreground text-center">
                                    Try adjusting your search filters or check back later for new therapists.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {therapists.map((therapist) => (
                                <Card key={therapist.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{therapist.name}</CardTitle>
                                                <CardDescription>{therapist.email}</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="outline">
                                                    {therapist.active_connections} connections
                                                </Badge>
                                                {therapist.rating && (
                                                    <Badge variant="outline" className="text-yellow-600">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        {therapist.rating}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Specialization:</span>
                                                <p className="text-muted-foreground">{therapist.specialization || 'General Therapy'}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Availability:</span>
                                                <p className="text-muted-foreground">{formatAvailability(therapist.availability)}</p>
                                            </div>
                                            {therapist.years_experience && (
                                                <div>
                                                    <span className="font-medium">Experience:</span>
                                                    <p className="text-muted-foreground">{therapist.years_experience} years</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">Status:</span>
                                                <Badge variant={therapist.status === 'active' ? 'default' : 'secondary'}>
                                                    {therapist.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <Button onClick={() => handleRequestConnection(therapist)}>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Request
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Connection Request Dialog */}
                <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Connection Request</DialogTitle>
                            <DialogDescription>
                                Send a connection request to {selectedTherapist?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitRequest}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="message">Message (Optional)</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell the therapist why you'd like to connect..."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowRequestDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Sending...' : 'Send Request'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}