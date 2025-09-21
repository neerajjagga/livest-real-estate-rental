import * as z from "zod";
import { PropertyType } from "@prisma/client";

const propertyTypeValues = Object.values(PropertyType) as [PropertyType, ...PropertyType[]];

export const propertySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  pricePerMonth: z.coerce.number().positive(),
  securityDeposit: z.coerce.number().nonnegative(),
  applicationFee: z.coerce.number().nonnegative(),
  photoUrls: z.array(z.string().url()),
  amenities: z.union([z.string(), z.array(z.string())]),
  highlights: z.union([z.string(), z.array(z.string())]),
  isPetsAllowed: z.union([z.string(), z.boolean()]).optional(),
  isParkingIncluded: z.union([z.string(), z.boolean()]).optional(),
  beds: z.coerce.number().int().positive(),
  baths: z.coerce.number().positive(),
  squareFeet: z.coerce.number().int().positive(),
  propertyType: z.enum(propertyTypeValues),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  managerId: z.union([z.string(), z.number()]),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
