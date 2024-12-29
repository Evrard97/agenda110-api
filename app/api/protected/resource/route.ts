import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = req.headers.get("user"); // Récupérer l'utilisateur depuis le middleware

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedUser = JSON.parse(user);

  return NextResponse.json({
    message: "Protected resource accessed successfully",
    user: parsedUser,
  });
}
