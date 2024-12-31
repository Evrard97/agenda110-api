import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { query } from "../../../../lib/postgr_db";
import { generateToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  try {
    const users = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      "1h"
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Unable to log in" }, { status: 500 });
  }
}
