import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { query } from "../../../../lib/postgr_db";

export async function POST(req: Request) {
  try {
    const { username, password, is_admin = false } = await req.json();

    // Vérifier les champs requis
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

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
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Unable to register user" },
      { status: 500 }
    );
  }
}
