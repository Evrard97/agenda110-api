import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  req.headers.set("user", JSON.stringify(decoded)); // Optionnel : transmettre l'utilisateur à la route

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*"], // Routes protégées par ce middleware
};
