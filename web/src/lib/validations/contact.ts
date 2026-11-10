import { z } from 'zod';
import type { FormDictionary } from '../../i18n/ui';

// Values must match the select options of the PocketBase `leads` collection.
export const SERVICE_VALUES = ['website', 'web-app', 'mobile-app', 'design', 'ai', 'other'] as const;
export const TIMELINE_VALUES = ['asap', '1-3m', '3-6m', 'flexible'] as const;
export const MARKET_VALUES = ['morocco', 'international'] as const;
export const MEETING_VALUES = ['in-person', 'video', 'phone'] as const;

export const CDC_MAX_SIZE = 15 * 1024 * 1024;
export const CDC_ACCEPT = '.pdf,.doc,.docx,.zip,.png,.jpg,.jpeg';
const CDC_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
];

export function createContactSchema(t: FormDictionary) {
  return z.object({
    services: z.array(z.enum(SERVICE_VALUES)).min(1, t.errors.services),
    has_cdc: z.boolean().optional(),
    attachment: z
      .instanceof(File)
      .refine((f) => f.size <= CDC_MAX_SIZE && (CDC_MIMES.includes(f.type) || f.type === ''), t.errors.file)
      .optional(),
    meeting_preference: z.enum(MEETING_VALUES).optional(),
    timeline: z.enum(TIMELINE_VALUES).optional(),
    market: z.enum(MARKET_VALUES).optional(),
    country: z.string().trim().max(80).optional(),
    name: z.string().trim().min(2, t.errors.name).max(120),
    email: z.email(t.errors.email),
    phone: z.string().trim().max(30).optional(),
    company: z.string().trim().max(120).optional(),
    message: z.string().trim().max(5000).optional(),
  });
}

export type ContactInput = z.input<ReturnType<typeof createContactSchema>>;
