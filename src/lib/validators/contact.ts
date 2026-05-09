// src/lib/validators/contact.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less')
    .regex(
      /^[\p{L}\p{M}\s.'-]+$/u,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must be 254 characters or less'),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be 200 characters or less'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be 5000 characters or less'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
