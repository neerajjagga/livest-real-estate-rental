'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    MapPin,
    Calendar,
    FileText,
    Eye,
    Phone,
    Mail,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Check,
    X,
    MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Application {
    id: string;
    applicationDate: string;
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
    status: 'Pending' | 'Approved' | 'Denied';
    tenantId: string;
    propertyId: string;
    leaseId: string | null;
    property: {
        id: string;
        name: string;
        pricePerMonth: number;
        securityDeposit: number;
        applicationFee: number;
        photoUrls: string[];
        beds: number;
        baths: number;
        squareFeet: number;
        propertyType: string;
        address: string;
    };
    manager: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
    };
    lease: {
        id: string;
        startDate: string;
        endDate: string;
        rent: number;
        deposit: number;
        nextPaymentDate: string;
    } | null;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Approved':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Denied':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Pending':
            return <Clock className="w-4 h-4" />;
        case 'Approved':
            return <CheckCircle className="w-4 h-4" />;
        case 'Denied':
            return <XCircle className="w-4 h-4" />;
        default:
            return <AlertCircle className="w-4 h-4" />;
    }
};

export default function ManagerApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/applications');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch applications');
            }

            if (data.success) {
                setApplications(data.applications);
            } else {
                throw new Error(data.message || 'Failed to fetch applications');
            }
        } catch (err: any) {
            console.error('Error fetching applications:', err);
            setError(err.message);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApplicationAction = async (applicationId: string, status: 'Approved' | 'Denied') => {
        try {
            setProcessingId(applicationId);

            const response = await fetch(`/api/applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to ${status.toLowerCase()} application`);
            }

            if (data.success) {
                toast.success(`Application ${status.toLowerCase()} successfully`);
                setApplications(prev =>
                    prev.map(app =>
                        app.id === applicationId
                            ? { ...app, status: status }
                            : app
                    )
                );
            } else {
                throw new Error(data.message || `Failed to ${status.toLowerCase()} application`);
            }
        } catch (err: any) {
            console.error(`Error ${status.toLowerCase()} application:`, err);
            toast.error(err.message || `Failed to ${status.toLowerCase()} application`);
        } finally {
            setProcessingId(null);
            setActionType(null);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'Pending').length,
        approved: applications.filter(app => app.status === 'Approved').length,
        denied: applications.filter(app => app.status === 'Denied').length,
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-8 w-12" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="text-center py-12">
                    <CardContent>
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Applications</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={fetchApplications} variant="outline">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Property Applications</h1>
                    <p className="text-gray-600">Review and manage rental applications for your properties</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <XCircle className="h-8 w-8 text-red-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Denied</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.denied}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {applications.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-4">
                            You haven't received any rental applications for your properties yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((application) => (
                        <Card key={application.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src={application.property.photoUrls?.[0] || '/no-photo.jpg'}
                                    alt={application.property.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                                        {getStatusIcon(application.status)}
                                        {application.status}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg line-clamp-1">{application.property.name}</CardTitle>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {application.property.address}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">{application.name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                        <span>{application.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                        <span>{application.phoneNumber}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Applied:</span>
                                        <span className="font-medium">{formatDate(application.applicationDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rent:</span>
                                        <span className="font-medium">{formatCurrency(application.property.pricePerMonth)}/mo</span>
                                    </div>
                                </div>

                                {application.message && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MessageSquare className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Message:</span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => setSelectedApplication(application)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Application Details</DialogTitle>
                                                <DialogDescription>
                                                    Application from {selectedApplication?.name} for {selectedApplication?.property.name}
                                                </DialogDescription>
                                            </DialogHeader>

                                            {selectedApplication && (
                                                <div className="space-y-6">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="relative h-48 md:h-32">
                                                            <Image
                                                                src={selectedApplication.property.photoUrls?.[0] || '/no-photo.jpg'}
                                                                alt={selectedApplication.property.name}
                                                                fill
                                                                className="object-cover rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="font-semibold text-lg">{selectedApplication.property.name}</h3>
                                                            <p className="text-sm text-gray-600 flex items-center">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {selectedApplication.property.address}
                                                            </p>
                                                            <div className="flex gap-4 text-sm">
                                                                <span>{selectedApplication.property.beds} beds</span>
                                                                <span>{selectedApplication.property.baths} baths</span>
                                                                <span>{selectedApplication.property.squareFeet} sq ft</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">Status:</span>
                                                        <Badge className={`${getStatusColor(selectedApplication.status)} flex items-center gap-1`}>
                                                            {getStatusIcon(selectedApplication.status)}
                                                            {selectedApplication.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold">Applicant Information</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-4 h-4 text-gray-500" />
                                                                    <span>{selectedApplication.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                                    <span>{selectedApplication.email}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="w-4 h-4 text-gray-500" />
                                                                    <span>{selectedApplication.phoneNumber}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                                    <span>Applied: {formatDate(selectedApplication.applicationDate)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold">Financial Details</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Monthly Rent:</span>
                                                                    <span className="font-medium">{formatCurrency(selectedApplication.property.pricePerMonth)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Security Deposit:</span>
                                                                    <span className="font-medium">{formatCurrency(selectedApplication.property.securityDeposit)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Application Fee:</span>
                                                                    <span className="font-medium">{formatCurrency(selectedApplication.property.applicationFee)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {selectedApplication.message && (
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold">Applicant Message</h4>
                                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                                {selectedApplication.message}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {selectedApplication.lease && (
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold">Lease Information</h4>
                                                            <div className="bg-green-50 p-3 rounded-lg space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Start Date:</span>
                                                                    <span className="font-medium">{formatDate(selectedApplication.lease.startDate)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>End Date:</span>
                                                                    <span className="font-medium">{formatDate(selectedApplication.lease.endDate)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Next Payment Due:</span>
                                                                    <span className="font-medium">{formatDate(selectedApplication.lease.nextPaymentDate)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {selectedApplication.status === 'Pending' && (
                                                        <div className="flex gap-3 pt-4 border-t">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="destructive"
                                                                        className="flex-1"
                                                                        onClick={() => setActionType('deny')}
                                                                        disabled={processingId === selectedApplication.id}
                                                                    >
                                                                        <X className="w-4 h-4 mr-1" />
                                                                        Deny Application
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Deny Application</DialogTitle>
                                                                        <DialogDescription>
                                                                            Are you sure you want to deny the application from {selectedApplication.name} for {selectedApplication.property.name}?
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="outline" onClick={() => setActionType(null)}>Cancel</Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => handleApplicationAction(selectedApplication.id, 'Denied')}
                                                                            disabled={processingId === selectedApplication.id}
                                                                        >
                                                                            {processingId === selectedApplication.id ? 'Processing...' : 'Deny Application'}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        className="flex-1"
                                                                        onClick={() => setActionType('approve')}
                                                                        disabled={processingId === selectedApplication.id}
                                                                    >
                                                                        <Check className="w-4 h-4 mr-1" />
                                                                        Approve Application
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Approve Application</DialogTitle>
                                                                        <DialogDescription>
                                                                            Are you sure you want to approve the application from {selectedApplication.name} for {selectedApplication.property.name}? This will create a lease agreement.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="outline" onClick={() => setActionType(null)}>Cancel</Button>
                                                                        <Button
                                                                            onClick={() => handleApplicationAction(selectedApplication.id, 'Approved')}
                                                                            disabled={processingId === selectedApplication.id}
                                                                        >
                                                                            {processingId === selectedApplication.id ? 'Processing...' : 'Approve Application'}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    {application.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1"
                                                        disabled={processingId === application.id}
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Deny
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Deny Application</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to deny the application from {application.name}?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleApplicationAction(application.id, 'Denied')}
                                                            disabled={processingId === application.id}
                                                        >
                                                            {processingId === application.id ? 'Processing...' : 'Deny Application'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        disabled={processingId === application.id}
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Approve Application</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to approve the application from {application.name}? This will create a lease agreement.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button
                                                            onClick={() => handleApplicationAction(application.id, 'Approved')}
                                                            disabled={processingId === application.id}
                                                        >
                                                            {processingId === application.id ? 'Processing...' : 'Approve Application'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}