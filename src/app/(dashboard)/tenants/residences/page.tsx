'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Building2,
    MapPin,
    Calendar,
    DollarSign,
    FileText,
    Eye,
    Phone,
    Mail,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Home,
    CreditCard,
    CalendarDays,
    Receipt
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Payment {
    id: string;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    status: 'Pending' | 'Paid' | 'PartiallyPaid' | 'Overdue';
    type: string;
}

interface Lease {
    id: string;
    startDate: string;
    endDate: string;
    rent: number;
    deposit: number;
    createdAt: string;
    property: {
        id: string;
        name: string;
        photoUrls: string[];
        beds: number;
        baths: number;
        squareFeet: number;
        propertyType: string;
        location: {
            address: string;
            city: string;
            state: string;
            zipCode: string;
        };
        manager: {
            name: string;
            email: string;
        };
    };
    payments: Payment[];
    application: {
        id: string;
        applicationDate: string;
        status: string;
    } | null;
}

export default function TenantResidences() {
    const [leases, setLeases] = useState<Lease[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLease, setSelectedLease] = useState<Lease | null>(null);

    useEffect(() => {
        fetchLeases();
    }, []);

    const fetchLeases = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get current user session to get tenantId
            const response = await fetch('/api/leases');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch leases');
            }

            if (data.success) {
                setLeases(data.leases);
            } else {
                throw new Error(data.message || 'Failed to fetch leases');
            }
        } catch (err: any) {
            setError(err.message);
            toast.error('Failed to load residences');
        } finally {
            setLoading(false);
        }
    };

    const isCurrentLease = (lease: Lease) => {
        const now = new Date();
        const startDate = new Date(lease.startDate);
        const endDate = new Date(lease.endDate);
        return now >= startDate && now <= endDate;
    };

    const getLeaseStatus = (lease: Lease) => {
        const now = new Date();
        const startDate = new Date(lease.startDate);
        const endDate = new Date(lease.endDate);
        
        if (now < startDate) return 'Upcoming';
        if (now > endDate) return 'Expired';
        return 'Active';
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'default';
            case 'Upcoming': return 'secondary';
            case 'Expired': return 'outline';
            default: return 'outline';
        }
    };

    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'Pending': return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'Overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
            case 'PartiallyPaid': return <CreditCard className="h-4 w-4 text-orange-600" />;
            default: return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const currentLeases = leases.filter(lease => isCurrentLease(lease));
    const pastLeases = leases.filter(lease => !isCurrentLease(lease));

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
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
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Error Loading Residences</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={fetchLeases} variant="outline">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (leases.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">My Residences</h1>
                    <p className="text-gray-600">View your current and past rental properties</p>
                </div>
                
                <Card className="text-center py-12">
                    <CardContent>
                        <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Residences Found</h3>
                        <p className="text-gray-600 mb-4">
                            You don't have any current or past leases. Start by browsing available properties.
                        </p>
                        <Button asChild>
                            <a href="/search">Browse Properties</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">My Residences</h1>
                <p className="text-gray-600">View your current and past rental properties</p>
            </div>

            {currentLeases.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-semibold">Current Residences</h2>
                        <Badge variant="secondary">{currentLeases.length}</Badge>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentLeases.map((lease) => (
                            <Card key={lease.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={lease.property.photoUrls?.[0] || '/no-photo.jpg'}
                                        alt={lease.property.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={getStatusBadgeVariant(getLeaseStatus(lease))}>
                                            {getLeaseStatus(lease)}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">{lease.property.name}</CardTitle>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {lease.property.location.address}, {lease.property.location.city}
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Monthly Rent</span>
                                        <span className="font-semibold">{formatCurrency(lease.rent)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Lease Period</span>
                                        <span>{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Property Details</span>
                                        <span>{lease.property.beds} bed • {lease.property.baths} bath • {lease.property.squareFeet} sq ft</span>
                                    </div>
                                    
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" onClick={() => setSelectedLease(lease)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                            {selectedLease && (
                                                <>
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <Building2 className="h-5 w-5" />
                                                            {selectedLease.property.name}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Lease details and payment history
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="space-y-4">
                                                            <h3 className="font-semibold flex items-center gap-2">
                                                                <Home className="h-4 w-4" />
                                                                Property Information
                                                            </h3>
                                                            
                                                            <div className="relative h-48 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={selectedLease.property.photoUrls?.[0] || '/no-photo.jpg'}
                                                                    alt={selectedLease.property.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                                    <span>
                                                                        {selectedLease.property.location.address}, {selectedLease.property.location.city}, {selectedLease.property.location.state} {selectedLease.property.location.zipCode}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.propertyType}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Home className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.beds} bed • {selectedLease.property.baths} bath • {selectedLease.property.squareFeet} sq ft</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium">Property Manager</h4>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <User className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.manager.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.manager.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-4">
                                                            <h3 className="font-semibold flex items-center gap-2">
                                                                <FileText className="h-4 w-4" />
                                                                Lease Information
                                                            </h3>
                                                            
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Status</span>
                                                                    <Badge variant={getStatusBadgeVariant(getLeaseStatus(selectedLease))}>
                                                                        {getLeaseStatus(selectedLease)}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Monthly Rent</span>
                                                                    <span className="font-semibold">{formatCurrency(selectedLease.rent)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Security Deposit</span>
                                                                    <span>{formatCurrency(selectedLease.deposit)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Start Date</span>
                                                                    <span>{formatDate(selectedLease.startDate)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">End Date</span>
                                                                    <span>{formatDate(selectedLease.endDate)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Lease Signed</span>
                                                                    <span>{formatDate(selectedLease.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-3">
                                                                <h4 className="font-medium flex items-center gap-2">
                                                                    <Receipt className="h-4 w-4" />
                                                                    Recent Payments
                                                                </h4>
                                                                
                                                                {selectedLease.payments.length > 0 ? (
                                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                                        {selectedLease.payments.slice(0, 5).map((payment) => (
                                                                            <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                                                <div className="flex items-center gap-2">
                                                                                    {getPaymentStatusIcon(payment.status)}
                                                                                    <div>
                                                                                        <div className="text-sm font-medium">{formatCurrency(payment.amount)}</div>
                                                                                        <div className="text-xs text-gray-600">Due: {formatDate(payment.dueDate)}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <Badge variant={payment.status === 'Paid' ? 'default' : payment.status === 'Overdue' ? 'destructive' : 'secondary'}>
                                                                                    {payment.status}
                                                                                </Badge>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-600">No payment history available</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {pastLeases.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-gray-600" />
                        <h2 className="text-xl font-semibold">Past Residences</h2>
                        <Badge variant="outline">{pastLeases.length}</Badge>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pastLeases.map((lease) => (
                            <Card key={lease.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-90">
                                <div className="relative h-48">
                                    <Image
                                        src={lease.property.photoUrls?.[0] || '/no-photo.jpg'}
                                        alt={lease.property.name}
                                        fill
                                        className="object-cover grayscale-[0.3]"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={getStatusBadgeVariant(getLeaseStatus(lease))}>
                                            {getLeaseStatus(lease)}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">{lease.property.name}</CardTitle>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {lease.property.location.address}, {lease.property.location.city}
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Monthly Rent</span>
                                        <span className="font-semibold">{formatCurrency(lease.rent)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Lease Period</span>
                                        <span>{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Property Details</span>
                                        <span>{lease.property.beds} bed • {lease.property.baths} bath</span>
                                    </div>
                                    
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full" onClick={() => setSelectedLease(lease)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                            {selectedLease && (
                                                <>
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <Building2 className="h-5 w-5" />
                                                            {selectedLease.property.name}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Lease details and payment history
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="space-y-4">
                                                            <h3 className="font-semibold flex items-center gap-2">
                                                                <Home className="h-4 w-4" />
                                                                Property Information
                                                            </h3>
                                                            
                                                            <div className="relative h-48 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={selectedLease.property.photoUrls?.[0] || '/no-photo.jpg'}
                                                                    alt={selectedLease.property.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                                    <span>
                                                                        {selectedLease.property.location.address}, {selectedLease.property.location.city}, {selectedLease.property.location.state} {selectedLease.property.location.zipCode}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.propertyType}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Home className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.beds} bed • {selectedLease.property.baths} bath • {selectedLease.property.squareFeet} sq ft</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium">Property Manager</h4>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <User className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.manager.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                                    <span>{selectedLease.property.manager.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-4">
                                                            <h3 className="font-semibold flex items-center gap-2">
                                                                <FileText className="h-4 w-4" />
                                                                Lease Information
                                                            </h3>
                                                            
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Status</span>
                                                                    <Badge variant={getStatusBadgeVariant(getLeaseStatus(selectedLease))}>
                                                                        {getLeaseStatus(selectedLease)}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Monthly Rent</span>
                                                                    <span className="font-semibold">{formatCurrency(selectedLease.rent)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Security Deposit</span>
                                                                    <span>{formatCurrency(selectedLease.deposit)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Start Date</span>
                                                                    <span>{formatDate(selectedLease.startDate)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">End Date</span>
                                                                    <span>{formatDate(selectedLease.endDate)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Lease Signed</span>
                                                                    <span>{formatDate(selectedLease.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-3">
                                                                <h4 className="font-medium flex items-center gap-2">
                                                                    <Receipt className="h-4 w-4" />
                                                                    Recent Payments
                                                                </h4>
                                                                
                                                                {selectedLease.payments.length > 0 ? (
                                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                                        {selectedLease.payments.slice(0, 5).map((payment) => (
                                                                            <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                                                <div className="flex items-center gap-2">
                                                                                    {getPaymentStatusIcon(payment.status)}
                                                                                    <div>
                                                                                        <div className="text-sm font-medium">{formatCurrency(payment.amount)}</div>
                                                                                        <div className="text-xs text-gray-600">Due: {formatDate(payment.dueDate)}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <Badge variant={payment.status === 'Paid' ? 'default' : payment.status === 'Overdue' ? 'destructive' : 'secondary'}>
                                                                                    {payment.status}
                                                                                </Badge>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-600">No payment history available</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}