import { z } from 'zod';

// Basic, non-exhaustive validators for listing metadata per category
// use an object with catchall to allow extending
const BaseMetadataSchema = z.object({}).catchall(z.any());

const VehicleMetadataSchema = BaseMetadataSchema.extend({
  vehicleType: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  mileage: z.union([z.string(), z.number()]).optional(),
});

const RealEstateMetadataSchema = BaseMetadataSchema.extend({
  propertyType: z.string().optional(),
  areaGross: z.union([z.string(), z.number()]).optional(),
  rooms: z.union([z.string(), z.number()]).optional(),
});

export function validateMetadata(categoryId: number, metadata: unknown) {
  try {
    if (categoryId === 1) {
      VehicleMetadataSchema.parse(metadata);
      return { ok: true };
    }
    if (categoryId === 2) {
      RealEstateMetadataSchema.parse(metadata);
      return { ok: true };
    }

    // Fallback: ensure it's an object
    BaseMetadataSchema.parse(metadata);
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, errors: err.errors };
    }
    return { ok: false, errors: [{ message: 'Unknown validation error' }] };
  }
}

export default validateMetadata;
