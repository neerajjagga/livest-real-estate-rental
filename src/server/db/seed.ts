/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:pass@localhost:5432/livest-real-estate-app"
    }
  }
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

async function insertLocationData(locations: any[]) {
  const createdLocations: any[] = [];
  for (const location of locations) {
    const { country, city, state, address, postalCode, coordinates } = location;
    try {
      // Generate a UUID for the location
      const locationId = crypto.randomUUID();
      
      await prisma.$executeRaw`
        INSERT INTO "location" ("id", "country", "city", "state", "address", "postalCode", "coordinates", "createdAt", "updatedAt") 
        VALUES (${locationId}, ${country}, ${city}, ${state}, ${address}, ${postalCode}, ST_GeomFromText(${coordinates}, 4326), NOW(), NOW());
      `;
      
      // Fetch the created location to return it
      const createdLocation = await prisma.location.findUnique({
        where: { id: locationId }
      });
      
      if (createdLocation) {
        createdLocations.push(createdLocation);
      }
      console.log(`Inserted location for ${city}`);
    } catch (error) {
      console.error(`Error inserting location for ${city}:`, error);
    }
  }
  return createdLocations;
}

async function resetSequence(modelName: string) {
  // Since we're using UUID primary keys, we don't need to reset sequences
  // UUID generation is handled automatically by Prisma
  console.log(`Skipping sequence reset for ${modelName} (using UUID primary keys)`);
}

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    return toPascalCase(path.basename(fileName, path.extname(fileName)));
  });

  for (const modelName of modelNames.reverse()) {
    const modelNameCamel = toCamelCase(modelName);
    const model = (prisma as any)[modelNameCamel];
    if (!model) {
      console.error(`Model ${modelName} not found in Prisma client`);
      continue;
    }
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "location.json", // No dependencies
    "user.json", // No dependencies (unified managers and tenants)
    "property.json", // Depends on location and user (manager)
    "lease.json", // Depends on property and user (tenant)
    "application.json", // Depends on property and user (tenant)
    "payment.json", // Depends on lease
  ];

  // Delete all existing data
  await deleteAllData(orderedFileNames);

  // Store created records to reference their UUIDs
  const createdRecords: { [key: string]: any[] } = {};

  // Seed data
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    
    console.log(`Processing file: ${fileName}`);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = toPascalCase(
      path.basename(fileName, path.extname(fileName))
    );
    const modelNameCamel = toCamelCase(modelName);

    if (modelName === "Location") {
      const locations = await insertLocationData(jsonData);
      createdRecords['Location'] = locations;
    } else {
      const model = (prisma as any)[modelNameCamel];
      if (!model) {
        console.error(`Model ${modelNameCamel} not found in Prisma client`);
        continue;
      }
      
      try {
        console.log(`Seeding ${jsonData.length} items for ${modelName}`);
        const createdItems = [];
        for (let i = 0; i < jsonData.length; i++) {
          const item = { ...jsonData[i] };
          
          // For User model, keep the ID if it's already a UUID string, otherwise remove it
          if (modelName === 'User') {
            if (typeof item.id !== 'string' || !item.id.includes('-')) {
              delete item.id;
            }
          } else {
            // Remove the id field since UUIDs are auto-generated
            delete item.id;
          }
          
          // Map foreign key references to actual UUIDs
          if (item.locationId && createdRecords['Location']) {
            const locationIndex = item.locationId - 1; // Convert 1-based to 0-based index
            if (createdRecords['Location'][locationIndex]) {
              item.locationId = createdRecords['Location'][locationIndex].id;
            }
          }
          
          if (item.managerId && createdRecords['User']) {
            // If managerId is already a UUID string, find the user with that ID
            if (typeof item.managerId === 'string' && item.managerId.includes('-')) {
              const manager = createdRecords['User'].find(u => u.id === item.managerId);
              if (manager) {
                item.managerId = manager.id;
              }
            } else {
              // Find manager by role
              const manager = createdRecords['User'].find(u => u.role === 'Manager');
              if (manager) {
                item.managerId = manager.id;
              }
            }
          }
          
          if (item.propertyId && createdRecords['Property']) {
            const propertyIndex = item.propertyId - 1;
            if (createdRecords['Property'][propertyIndex]) {
              item.propertyId = createdRecords['Property'][propertyIndex].id;
            }
          }
          
          if (item.tenantId && createdRecords['User']) {
            // If tenantId is already a UUID string, find the user with that ID
            if (typeof item.tenantId === 'string' && item.tenantId.includes('-')) {
              const tenant = createdRecords['User'].find(u => u.id === item.tenantId);
              if (tenant) {
                item.tenantId = tenant.id;
              }
            } else {
              // Find tenant by role
              const tenant = createdRecords['User'].find(u => u.role === 'Tenant');
              if (tenant) {
                item.tenantId = tenant.id;
              }
            }
          }
          
          if (item.leaseId && createdRecords['Lease']) {
            const leaseIndex = item.leaseId - 1;
            if (createdRecords['Lease'][leaseIndex]) {
              item.leaseId = createdRecords['Lease'][leaseIndex].id;
            }
          }
          
          const createdItem = await model.create({
            data: item,
          });
          createdItems.push(createdItem);
        }
        createdRecords[modelName] = createdItems;
        console.log(`Seeded ${modelName} with data from ${fileName}`);
      } catch (error) {
        console.error(`Error seeding data for ${modelName}:`, error);
        // Continue with next model instead of stopping
        continue;
      }
    }

    // Reset the sequence after seeding each model (no-op for UUIDs)
    try {
      await resetSequence(modelName);
    } catch (error) {
      console.error(`Error resetting sequence for ${modelName}:`, error);
    }

    await sleep(1000);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
