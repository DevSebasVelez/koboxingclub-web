import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es requerida"),
  venue: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  country: z.string().max(100).default("Ecuador"),
  posterUrl: z.string().url().optional().or(z.literal("")),
  posterKey: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export type EventInput = z.infer<typeof eventSchema>;
