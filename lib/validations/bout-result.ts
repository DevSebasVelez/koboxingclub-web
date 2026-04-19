import { z } from "zod";

export const boutResultSchema = z.object({
  resultStatus: z.enum(["PENDING", "COMPLETED", "NO_CONTEST", "CANCELLED"]),
  winnerFighterId: z.string().optional().or(z.literal("")),
  endMethod: z
    .enum([
      "KO",
      "TKO",
      "DECISION",
      "SPLIT_DECISION",
      "DRAW",
      "DQ",
      "NO_CONTEST",
    ])
    .optional()
    .nullable(),
  endRound: z.coerce.number().int().min(1).max(12).optional().nullable(),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type BoutResultInput = z.infer<typeof boutResultSchema>;
