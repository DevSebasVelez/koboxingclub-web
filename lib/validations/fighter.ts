import { z } from "zod";

export const fighterSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").max(100),
  lastName: z.string().min(1, "El apellido es requerido").max(100),
  photoUrl: z.string().url().optional().or(z.literal("")),
  photoKey: z.string().optional().or(z.literal("")),
  wins: z.coerce.number().int().min(0).default(0),
  losses: z.coerce.number().int().min(0).default(0),
  draws: z.coerce.number().int().min(0).default(0),
  winsKo: z.coerce.number().int().min(0).default(0),
  lossesKo: z.coerce.number().int().min(0).default(0),
  rounds: z.coerce.number().int().min(0).default(0),
  debut: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  cedula: z.string().max(20).optional().or(z.literal("")),
  nationality: z.string().max(100).optional().or(z.literal("")),
  residence: z.string().max(200).optional().or(z.literal("")),
  club: z.string().max(200).optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export type FighterInput = z.infer<typeof fighterSchema>;
