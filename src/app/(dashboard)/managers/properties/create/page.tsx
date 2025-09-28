
import CreatePropertyForm from '@/components/dashboard/CreatePropertyForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CreateProperty() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/managers/properties">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Properties
                        </Button>
                    </Link>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
                    <p className="text-gray-600 mt-2">
                        Add a new property to your portfolio. Fill in all the required information to get started.
                    </p>
                </div>
            </div>

            <CreatePropertyForm />
        </div>
    );
}