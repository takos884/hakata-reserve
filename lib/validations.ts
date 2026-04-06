import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  visitDate: z.string().min(1, "Visit date is required"),
  visitTime: z.string().min(1, "Visit time is required"),
  partySize: z.number().min(1).max(8),
  courseId: z.string().min(1, "Course selection is required"),
  notes: z.string().optional(),
  lang: z.string(),
});

export const agencyInquirySchema = z.object({
  agencyName: z.string().min(1, "Agency name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  tourCode: z.string().optional(),
  visitDate: z.string().min(1, "Visit date is required"),
  partySize: z.number().min(9),
  billingInfo: z.string().min(1, "Billing info is required"),
  notes: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type AgencyInquiryInput = z.infer<typeof agencyInquirySchema>;
