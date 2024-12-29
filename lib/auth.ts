import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Générer un token JWT
export function generateToken(payload: object, expiresIn = "1h") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Vérifier et décoder un token JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

// Vérifier si un utilisateur est admin
export function isAdmin(token: string): boolean {
  const decoded = verifyToken(token);

  if (!decoded || typeof decoded !== "object") {
    return false;
  }

  return Boolean(decoded.is_admin); // Vérifie si is_admin est vrai
}
