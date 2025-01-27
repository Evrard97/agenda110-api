import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { query } from "@/lib/postgr_db";
import { userSchema } from "@/lib/dataValidation/user_validation";
import logger from "@/lib/logger";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    // Récupérer et valider les données utilisateur
    const body = await req.json();
    const validatedData = userSchema.parse(body); // Validation via zod
    const { username, password, is_admin = false } = validatedData;

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = await query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    await query(
      "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3)",
      [username, hashedPassword, is_admin]
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    // Gérer les erreurs de validation
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Enregistrer les autres erreurs dans un fichier
    logger.error("Unknown error during registration", { error });


    return NextResponse.json(
      { error: "Unable to register user" },
      { status: 500 }
    );
  }
}
