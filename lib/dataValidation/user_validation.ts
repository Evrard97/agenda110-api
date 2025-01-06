import { z } from "zod";

// Définir un schéma de validation pour les utilisateurs
export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 50 characters"),
  password: z.string().min(9, "Password must be at least 8 characters long"),
  is_admin: z.boolean().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
