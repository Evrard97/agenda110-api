import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// Générer un token JWT
export function generateToken(payload: object, expiresIn = "1h"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Vérifier et décoder un token JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

// Vérifier si un utilisateur est admin
export function isAdmin(token: string): boolean {
  const decoded = verifyToken(token);

  if (!decoded) {
    return false;
  }

  return Boolean(decoded.is_admin); // Vérifie si "is_admin" est défini et vrai
}

// Force l'utilisation de Node.js Runtime
export const config = {
  runtime: "nodejs",
};
