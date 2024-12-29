import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function POST(req: Request) {
  // const db = getDatabase();
  // console.log(db);
  // return db;
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Unable to register user" },
      { status: 500 }
    );
  }
}
