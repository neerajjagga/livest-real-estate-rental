
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Building2,
    MapPin,
    Bed,
    Bath,
    Square,
    Star,
    Users,
    FileText,
    Calendar,
    Plus
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Property {
    id: string;
    name: string;
    description: string;
    pricePerMonth: number;
    securityDeposit: number;
    applicationFee: number;
    photoUrls: string[];
    amenities: string[];
    highlights: string[];
    isPetsAllowed: boolean;
    isParkingIncluded: boolean;
    beds: number;
    baths: number;
    squareFeet: number;
    propertyType: string;
    postedDate: string;
    averageRating: number;
    numberOfReviews: number;
    locationId: string;
    managerId: string;
    createdAt: string;
    updatedAt: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    manager: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
    applications: Array<{
        id: string;
        status: string;
        applicationDate: string;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    leases: Array<{
        id: string;
        startDate: string;
        endDate: string;
        rent: number;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    _count: {
        applications: number;
        leases: number;
    };
}

interface ApiResponse {
    success: boolean;
    properties: Property[];
    message: string;
}

export default function ManagerProperties() {
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/properties/me');
            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch properties');
            }

            if (data.success) {
                setProperties(data.properties);
            } else {
                throw new Error(data.message || 'Failed to fetch properties');
            }
        } catch (err: any) {
            setError(err.message);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
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
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <div className="text-red-500 mb-4">
                            <Building2 className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Error Loading Properties</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={fetchProperties}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
                    <p className="text-gray-600">
                        Manage your {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'}
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/managers/properties/create')}
                    className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Property
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Properties</p>
                                <p className="text-2xl font-bold">{properties.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Applications</p>
                                <p className="text-2xl font-bold">
                                    {properties.reduce((sum, p) => sum + p._count.applications, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Active Leases</p>
                                <p className="text-2xl font-bold">
                                    {properties.reduce((sum, p) => sum + p._count.leases, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {properties.length === 0 ? (
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                        <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                        <p className="text-gray-600 mb-4">
                            Start by adding your first property to begin managing rentals.
                        </p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Property
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <Link href={`/properties/${property.id}`} key={property.id}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={property.photoUrls?.[0] || '/no-photo.jpg'}
                                        alt={property.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                                            {property.propertyType}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-blue-600 text-white">
                                            {formatCurrency(property.pricePerMonth)}/mo
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                                            {property.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                                            <MapPin className="h-3 w-3" />
                                            <span className="text-sm line-clamp-1">
                                                {property.location.address}, {property.location.city}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 mb-3">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-sm">{property.averageRating}</span>
                                            <span className="text-gray-500 text-sm">
                                                ({property.numberOfReviews} reviews)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Bed className="h-4 w-4" />
                                                <span>{property.beds}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="h-4 w-4" />
                                                <span>{property.baths}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Square className="h-4 w-4" />
                                                <span>{property.squareFeet} sq ft</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="text-center p-2 bg-gray-50 rounded">
                                            <div className="text-lg font-semibold text-blue-600">
                                                {property._count.applications}
                                            </div>
                                            <div className="text-xs text-gray-600">Applications</div>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded">
                                            <div className="text-lg font-semibold text-green-600">
                                                {property._count.leases}
                                            </div>
                                            <div className="text-xs text-gray-600">Leases</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                                        <Calendar className="h-3 w-3" />
                                        <span>Posted {formatDate(property.postedDate)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}