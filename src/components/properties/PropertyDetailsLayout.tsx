
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    Star,
    Bed,
    Bath,
    Square,
    MapPin,
    Wifi,
    Car,
    Waves,
    Phone,
    Calendar,
    Shield,
    FileText,
    Share,
    MessageCircle,
    User,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUser } from '../UserProvider';
import { useRouter } from 'next/navigation';

interface PropertyDetails {
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
    location: {
        id: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates?: {
            longitude: number;
            latitude: number;
        };
    };
    manager: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    applications?: Array<{
        id: string;
        status: string;
        applicationDate: string;
    }>;
    leases?: Array<{
        id: string;
        startDate: string;
        endDate: string;
        rent: number;
    }>;
    _count?: {
        applications: number;
        leases: number;
    };
}

interface PropertyDetailsLayoutProps {
    property: PropertyDetails;
    currentUserId?: string;
}

export default function PropertyDetailsLayout({
    property,
    currentUserId
}: PropertyDetailsLayoutProps) {
    const { user } = useUser();
    const router = useRouter();

    const [showContactDialog, setShowContactDialog] = useState(false);
    const [showApplicationDialog, setShowApplicationDialog] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [applicationForm, setApplicationForm] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        message: ''
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAmenityIcon = (amenity: string) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
            return <Wifi className="h-4 w-4" />;
        }
        if (amenityLower.includes('parking') || amenityLower.includes('car')) {
            return <Car className="h-4 w-4" />;
        }
        if (amenityLower.includes('pool') || amenityLower.includes('swim')) {
            return <Waves className="h-4 w-4" />;
        }
        return <CheckCircle className="h-4 w-4" />;
    };


    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent successfully!');
        setShowContactDialog(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
    };

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingApplication(true);

        try {
            const applicationData = {
                applicationDate: new Date().toISOString(),
                propertyId: property.id,
                name: applicationForm.name,
                email: applicationForm.email,
                phoneNumber: applicationForm.phoneNumber,
                message: applicationForm.message || undefined
            };

            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const errorMessages = result.errors.map((err: any) => err.message).join(', ');
                    toast.error(`Validation error: ${errorMessages}`);
                } else {
                    toast.error(result.error || 'Failed to submit application');
                }
                return;
            }

            if (result.success) {
                toast.success('Application submitted successfully!');
                setShowApplicationDialog(false);
                setApplicationForm({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    message: ''
                });
            } else {
                toast.error(result.error || 'Failed to submit application');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setIsSubmittingApplication(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-[60vh] md:h-[70vh] bg-gray-900">
                <div className="relative h-full">
                    <Image
                        src={property.photoUrls?.[0] || '/no-photo.jpg'}
                        alt={property.name}
                        fill
                        className="object-cover"
                        priority
                    />

                    <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 text-white">
                            {property.propertyType}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {property.name}
                                        </h1>
                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                            <MapPin className="h-4 w-4" />
                                            <span>
                                                {property.location.address}, {property.location.city}, {property.location.state} {property.location.postalCode}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{property.averageRating}</span>
                                            <span className="text-gray-500">({property.numberOfReviews} reviews)</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {formatCurrency(property.pricePerMonth)}
                                        </div>
                                        <div className="text-gray-500">per month</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Bed className="h-4 w-4 text-gray-600" />
                                            <span className="font-semibold">{property.beds}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Bedrooms</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Bath className="h-4 w-4 text-gray-600" />
                                            <span className="font-semibold">{property.baths}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Bathrooms</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Square className="h-4 w-4 text-gray-600" />
                                            <span className="font-semibold">{property.squareFeet}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">sq ft</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>About this property</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {property.description}
                                </p>
                            </CardContent>
                        </Card>

                        {property.amenities?.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Amenities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {property.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                {getAmenityIcon(amenity)}
                                                <span className="text-gray-700">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {property.highlights?.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Property Highlights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {property.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-gray-700">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <div className="font-medium">Security Deposit</div>
                                            <div className="text-gray-600">{formatCurrency(property.securityDeposit)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <div className="font-medium">Application Fee</div>
                                            <div className="text-gray-600">{formatCurrency(property.applicationFee)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Car className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <div className="font-medium">Parking</div>
                                            <div className="text-gray-600">
                                                {property.isParkingIncluded ? 'Included' : 'Not included'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <div className="font-medium">Pets</div>
                                            <div className="text-gray-600">
                                                {property.isPetsAllowed ? 'Allowed' : 'Not allowed'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Posted on {formatDate(property.postedDate)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Property Manager</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        {property.manager.image ? (
                                            <Image
                                                src={property.manager.image}
                                                alt={property.manager.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-gray-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{property.manager.name}</div>
                                        <div className="text-sm text-gray-600">Property Manager</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" variant="outline">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Contact {property.manager.name}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={contactForm.name}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={contactForm.email}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input
                                                        id="phone"
                                                        value={contactForm.phone}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="message">Message</Label>
                                                    <Textarea
                                                        id="message"
                                                        value={contactForm.message}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                                        placeholder="I'm interested in this property..."
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full">
                                                    Send Message
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <Button className="w-full" variant="outline">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Apply Now</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                        {formatCurrency(property.pricePerMonth)}
                                    </div>
                                    <div className="text-sm text-gray-600">per month</div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Security Deposit:</span>
                                        <span className="font-medium">{formatCurrency(property.securityDeposit)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Application Fee:</span>
                                        <span className="font-medium">{formatCurrency(property.applicationFee)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Move-in Cost:</span>
                                        <span>{formatCurrency(property.pricePerMonth + property.securityDeposit + property.applicationFee)}</span>
                                    </div>
                                </div>

                                <Dialog open={showApplicationDialog} onOpenChange={(open) => {
                                    if (open && !user) {
                                        router.push('/signin');
                                        return;
                                    }
                                    setShowApplicationDialog(open);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" size="lg">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Apply Now
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Apply for {property.name}</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleApplicationSubmit} className="space-y-4">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    Application fee: {formatCurrency(property.applicationFee)}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    This fee will be charged upon submission
                                                </p>
                                            </div>

                                            <div>
                                                <Label htmlFor="app-name">Full Name *</Label>
                                                <Input
                                                    id="app-name"
                                                    value={applicationForm.name}
                                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="app-email">Email Address *</Label>
                                                <Input
                                                    id="app-email"
                                                    type="email"
                                                    value={applicationForm.email}
                                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="app-phone">Phone Number *</Label>
                                                <Input
                                                    id="app-phone"
                                                    type="tel"
                                                    value={applicationForm.phoneNumber}
                                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                                    placeholder="1234567890"
                                                    pattern="[0-9]{10}"
                                                    title="Please enter a 10-digit phone number"
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">10 digits only, no spaces or dashes</p>
                                            </div>

                                            <div>
                                                <Label htmlFor="app-message">Additional Message (Optional)</Label>
                                                <Textarea
                                                    id="app-message"
                                                    value={applicationForm.message}
                                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, message: e.target.value }))}
                                                    placeholder="Tell us why you're interested in this property..."
                                                    maxLength={500}
                                                    rows={3}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {applicationForm.message.length}/500 characters
                                                </p>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    type="submit"
                                                    className="flex-1"
                                                    disabled={isSubmittingApplication}
                                                >
                                                    {isSubmittingApplication ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        'Submit Application'
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowApplicationDialog(false)}
                                                    disabled={isSubmittingApplication}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Property Stats */}
                        {property._count && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Property Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Applications</span>
                                            <Badge variant="secondary">{property._count.applications}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Active Leases</span>
                                            <Badge variant="secondary">{property._count.leases}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}