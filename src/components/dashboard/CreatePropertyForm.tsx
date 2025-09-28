'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserProvider';
import { generateCloudinarySignature } from '@/server/actions/property';
import Image from 'next/image';

const PropertyTypes = [
  'Rooms',
  'Tinyhouse',
  'Apartment',
  'Villa',
  'Townhouse',
  'Cottage'
] as const;

const Amenities = [
  'WasherDryer',
  'AirConditioning',
  'Dishwasher',
  'HighSpeedInternet',
  'HardwoodFloors',
  'WalkInClosets',
  'Microwave',
  'Refrigerator',
  'Pool',
  'Gym',
  'Parking',
  'PetsAllowed',
  'WiFi'
] as const;

const Highlights = [
  'HighSpeedInternetAccess',
  'WasherDryer',
  'AirConditioning',
  'Heating',
  'SmokeFree',
  'CableReady',
  'SatelliteTV',
  'DoubleVanities',
  'TubShower',
  'Intercom',
  'SprinklerSystem',
  'RecentlyRenovated',
  'CloseToTransit',
  'GreatView',
  'QuietNeighborhood'
] as const;

interface PropertyFormData {
  name: string;
  description: string;
  pricePerMonth: string;
  securityDeposit: string;
  applicationFee: string;
  beds: string;
  baths: string;
  squareFeet: string;
  propertyType: string;
  isPetsAllowed: boolean;
  isParkingIncluded: boolean;
  amenities: string[];
  highlights: string[];
  photoUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export default function CreatePropertyForm() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    pricePerMonth: '',
    securityDeposit: '',
    applicationFee: '',
    beds: '',
    baths: '',
    squareFeet: '',
    propertyType: '',
    isPetsAllowed: false,
    isParkingIncluded: false,
    amenities: [],
    highlights: [],
    photoUrl: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'amenities' | 'highlights', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('jpeg') && !file.type.includes('jpg') && !file.type.includes('png')) {
      toast.error('Please upload only JPEG or PNG images');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const { signature, timestamp, folder, cloudName, apiKey } = await generateCloudinarySignature('property-images');

      if (!cloudName || !apiKey || !signature || !timestamp) {
        throw new Error('Cloudinary configuration missing');
      }

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('api_key', apiKey);
      uploadForm.append('timestamp', String(timestamp));
      uploadForm.append('signature', signature);
      uploadForm.append('folder', folder);

      const res = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: uploadForm,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Cloudinary upload failed: ${errText}`);
      }

      const data = await res.json();
      const imageUrl: string | undefined = data.secure_url;

      if (!imageUrl) {
        throw new Error('No secure_url returned from Cloudinary');
      }

      setUploadedImage(imageUrl);
      setFormData(prev => ({
        ...prev,
        photoUrl: imageUrl
      }));

      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleImageRemove = () => {
    setUploadedImage('');
    setFormData(prev => ({
      ...prev,
      photoUrl: ''
    }));
    toast.success('Image removed successfully!');
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'name', 'description', 'pricePerMonth', 'securityDeposit',
      'applicationFee', 'beds', 'baths', 'squareFeet', 'propertyType',
      'address', 'city', 'state', 'country', 'postalCode'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof PropertyFormData]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }

    const numericFields = ['pricePerMonth', 'securityDeposit', 'applicationFee', 'beds', 'baths', 'squareFeet'];
    for (const field of numericFields) {
      const value = formData[field as keyof PropertyFormData] as string;
      if (isNaN(Number(value)) || Number(value) < 0) {
        toast.error(`Please enter a valid ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pricePerMonth: parseFloat(formData.pricePerMonth),
          securityDeposit: parseFloat(formData.securityDeposit),
          applicationFee: parseFloat(formData.applicationFee),
          beds: parseInt(formData.beds),
          baths: parseFloat(formData.baths),
          squareFeet: parseInt(formData.squareFeet),
          managerId: user?.id
        }),
      });

      if (response.ok) {
        toast.success('Property created successfully!');
        router.push('/managers/properties');
      } else {
        throw new Error('Failed to create property');
      }
    } catch (error) {
      toast.error('Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Luxury Downtown Apartment"
                required
              />
            </div>
            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PropertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your property..."
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pricePerMonth">Monthly Rent ($) *</Label>
              <Input
                id="pricePerMonth"
                type="number"
                step="0.01"
                value={formData.pricePerMonth}
                onChange={(e) => handleInputChange('pricePerMonth', e.target.value)}
                placeholder="2500"
                required
              />
            </div>
            <div>
              <Label htmlFor="securityDeposit">Security Deposit ($) *</Label>
              <Input
                id="securityDeposit"
                type="number"
                step="0.01"
                value={formData.securityDeposit}
                onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                placeholder="2500"
                required
              />
            </div>
            <div>
              <Label htmlFor="applicationFee">Application Fee ($) *</Label>
              <Input
                id="applicationFee"
                type="number"
                step="0.01"
                value={formData.applicationFee}
                onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                placeholder="50"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="beds">Bedrooms *</Label>
              <Input
                id="beds"
                type="number"
                min="0"
                value={formData.beds}
                onChange={(e) => handleInputChange('beds', e.target.value)}
                placeholder="2"
                required
              />
            </div>
            <div>
              <Label htmlFor="baths">Bathrooms *</Label>
              <Input
                id="baths"
                type="number"
                step="0.5"
                min="0"
                value={formData.baths}
                onChange={(e) => handleInputChange('baths', e.target.value)}
                placeholder="2"
                required
              />
            </div>
            <div>
              <Label htmlFor="squareFeet">Square Feet *</Label>
              <Input
                id="squareFeet"
                type="number"
                min="0"
                value={formData.squareFeet}
                onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                placeholder="1200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPetsAllowed"
                checked={formData.isPetsAllowed}
                onCheckedChange={(checked) => handleInputChange('isPetsAllowed', checked as boolean)}
              />
              <Label htmlFor="isPetsAllowed">Pets Allowed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isParkingIncluded"
                checked={formData.isParkingIncluded}
                onCheckedChange={(checked) => handleInputChange('isParkingIncluded', checked as boolean)}
              />
              <Label htmlFor="isParkingIncluded">Parking Included</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="New York"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="NY"
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="USA"
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="10001"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={() => handleArrayToggle('amenities', amenity)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                  {amenity.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Highlights.map((highlight) => (
              <div key={highlight} className="flex items-center space-x-2">
                <Checkbox
                  id={`highlight-${highlight}`}
                  checked={formData.highlights.includes(highlight)}
                  onCheckedChange={() => handleArrayToggle('highlights', highlight)}
                />
                <Label htmlFor={`highlight-${highlight}`} className="text-sm">
                  {highlight.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image-upload" className="block mb-2">Upload Property Image (JPEG/PNG only)</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              disabled={uploadingImage || !!uploadedImage}
              className="w-full"
            />
            {uploadingImage && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Uploading image...
              </p>
            )}
            {uploadedImage && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Image uploaded successfully
              </p>
            )}
          </div>

          {uploadedImage && (
            <div className="space-y-4">
              <h4 className="font-medium">Property Image</h4>
              <div className="relative group border rounded-lg overflow-hidden max-w-md">
                <Image
                  src={uploadedImage}
                  alt="Property image"
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/no-photo.jpg';
                  }}
                />
                <div className="absolute inset-0 hover:bg-black/20 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleImageRemove}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
}
