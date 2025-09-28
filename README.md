# 🏠 Real Estate Rental Platform

A comprehensive full-stack real estate rental application built with Next.js 15, featuring role-based dashboards for property managers and tenants, advanced search capabilities, and complete rental management workflows.

## ✨ Features

### 🔐 Authentication & Authorization
- **Better Auth** integration with Google OAuth
- Role-based access control (Tenant/Manager)
- Secure session management with centralized state
- Protected routes and API endpoints

### 🏘️ Property Management
- **Property Listings** with detailed information, photos, and amenities
- **Advanced Search** with filters (location, price, property type, amenities)
- **Interactive Maps** with property markers using Leaflet
- **Favorites System** for tenants to save properties
- **Property Creation** for managers with image upload via Cloudinary

### 📋 Application System
- **Application Submission** by tenants with contact information
- **Application Review** by managers (approve/deny)
- **Application Tracking** with status updates and notifications
- **Duplicate Prevention** to avoid multiple applications per property

### 🏠 Lease Management
- **Lease Creation** upon application approval
- **Lease Tracking** for both tenants and managers
- **Payment History** with status tracking
- **Residence Management** for current and past leases

### 📊 Dashboard Features
- **Manager Dashboard**: Property portfolio, applications, lease management
- **Tenant Dashboard**: Applications, current residences, search properties
- **Statistics Overview** with key metrics and insights
- **Responsive Design** optimized for mobile and desktop

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19 RC** with TypeScript
- **Tailwind CSS v4** for styling
- **Radix UI** components for accessibility
- **React Hook Form** with Zod validation
- **Leaflet** for interactive maps
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for RESTful endpoints
- **Prisma ORM** with PostgreSQL database
- **Better Auth** for authentication
- **Cloudinary** for image management
- **PostGIS** for geospatial data

### Database
- **PostgreSQL** with PostGIS extension
- **UUID** primary keys for security
- **Optimized indexes** for performance
- **Transaction safety** for data consistency

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database with PostGIS extension
- Cloudinary account for image uploads
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-rental-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   # Application
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/rental_app
   
   # Authentication
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database with sample data
   pnpm run seed:db
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── managers/             # Manager-specific pages
│   │   ├── tenants/              # Tenant-specific pages
│   │   └── properties/           # Property details
│   ├── (marketing)/              # Public landing page
│   ├── (nondashboard)/           # Public search page
│   └── api/                      # API routes
├── components/                   # Reusable UI components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── landing/                  # Landing page components
│   ├── properties/               # Property-related components
│   └── search/                   # Search functionality
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication configuration
│   └── utils.ts                  # Helper functions
├── server/                       # Server-side code
│   ├── db/                       # Database configuration
│   └── validators/               # Zod schemas
└── types/                        # TypeScript type definitions
```

## 🎯 Key Features Walkthrough

### For Property Managers
1. **Dashboard Overview**: View portfolio statistics and recent applications
2. **Property Management**: Create, edit, and manage property listings
3. **Application Review**: Review and approve/deny tenant applications
4. **Lease Management**: Track active leases and payment history

### For Tenants
1. **Property Search**: Browse and filter available properties
2. **Application Submission**: Apply for properties with contact details
3. **Application Tracking**: Monitor application status and updates
4. **Residence Management**: View current and past lease information

## 🔧 API Endpoints

### Properties
- `GET /api/properties` - List all properties with filters
- `GET /api/properties/[id]` - Get property details
- `GET /api/properties/me` - Get manager's properties
- `POST /api/properties` - Create new property

### Applications
- `GET /api/applications` - List applications (filtered by role)
- `POST /api/applications` - Submit new application
- `PATCH /api/applications/[id]` - Update application status
- `DELETE /api/applications/[id]` - Cancel application

### Leases
- `GET /api/leases` - List leases (filtered by role)

### Search
- `GET /api/search` - Advanced property search with filters

### Environment Setup
Ensure all environment variables are configured in your deployment platform, including:
- Database connection string
- Authentication secrets
- Cloudinary credentials
- Google OAuth credentials (if used)