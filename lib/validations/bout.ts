import { z } from "zod";

export const boutSchema = z.object({
  eventId: z.string().min(1, "El evento es requerido"),
  fighter1Id: z.string().min(1, "El peleador 1 es requerido"),
  fighter2Id: z.string().min(1, "El peleador 2 es requerido"),
  categoryId: z.string().optional().or(z.literal("")),
  isMainEvent: z.boolean().default(false),
  scheduledRounds: z.coerce.number().int().min(1).max(12).default(3),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type BoutInput = z.infer<typeof boutSchema>;
