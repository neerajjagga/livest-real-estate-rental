import * as z from "zod";
import { ApplicationStatus, PropertyType } from "@prisma/client";

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

export const createApplicationSchema = z.object({
  applicationDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  propertyId: z.string().min(1, "Property ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  message: z.string().max(500).optional()
});

export const updateApplicationSchema = z.object({
  status: z.nativeEnum(ApplicationStatus)
});

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
