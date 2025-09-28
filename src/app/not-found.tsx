import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
            <p className="text-gray-600">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Properties
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}