-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('Tenant', 'Manager');

-- CreateEnum
CREATE TYPE "public"."Highlight" AS ENUM ('HighSpeedInternetAccess', 'WasherDryer', 'AirConditioning', 'Heating', 'SmokeFree', 'CableReady', 'SatelliteTV', 'DoubleVanities', 'TubShower', 'Intercom', 'SprinklerSystem', 'RecentlyRenovated', 'CloseToTransit', 'GreatView', 'QuietNeighborhood');

-- CreateEnum
CREATE TYPE "public"."Amenity" AS ENUM ('WasherDryer', 'AirConditioning', 'Dishwasher', 'HighSpeedInternet', 'HardwoodFloors', 'WalkInClosets', 'Microwave', 'Refrigerator', 'Pool', 'Gym', 'Parking', 'PetsAllowed', 'WiFi');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('Rooms', 'Tinyhouse', 'Apartment', 'Villa', 'Townhouse', 'Cottage');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('Pending', 'Denied', 'Approved');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('Pending', 'Paid', 'PartiallyPaid', 'Overdue');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'Tenant';

-- CreateTable
CREATE TABLE "public"."property" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "securityDeposit" DOUBLE PRECISION NOT NULL,
    "applicationFee" DOUBLE PRECISION NOT NULL,
    "photoUrls" TEXT[],
    "amenities" "public"."Amenity"[],
    "highlights" "public"."Highlight"[],
    "isPetsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "isParkingIncluded" BOOLEAN NOT NULL DEFAULT false,
    "beds" INTEGER NOT NULL,
    "baths" DOUBLE PRECISION NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL,
    "postedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "averageRating" DOUBLE PRECISION DEFAULT 0,
    "numberOfReviews" INTEGER DEFAULT 0,
    "locationId" INTEGER NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "coordinates" geography(Point, 4326) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lease" (
    "id" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."application" (
    "id" INTEGER NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "message" TEXT,
    "leaseId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" INTEGER NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL,
    "leaseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TenantFavorites" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TenantFavorites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_leaseId_key" ON "public"."application"("leaseId");

-- CreateIndex
CREATE INDEX "_TenantFavorites_B_index" ON "public"."_TenantFavorites"("B");

-- AddForeignKey
ALTER TABLE "public"."property" ADD CONSTRAINT "property_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property" ADD CONSTRAINT "property_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lease" ADD CONSTRAINT "lease_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lease" ADD CONSTRAINT "lease_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application" ADD CONSTRAINT "application_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application" ADD CONSTRAINT "application_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application" ADD CONSTRAINT "application_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "public"."lease"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "public"."lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TenantFavorites" ADD CONSTRAINT "_TenantFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TenantFavorites" ADD CONSTRAINT "_TenantFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
