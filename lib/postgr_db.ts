import { Pool } from "pg";
import logger from "@/lib/logger";

// Charger les variables d'environnement
const pool = new Pool({
  user: process.env.PG_USER || "",
  host: process.env.PG_HOST || "",
  database: process.env.PG_DATABASE || "",
  password: process.env.PG_PASSWORD || "",
  port: parseInt(process.env.PG_PORT || ""),
});

// Vérifier que les variables d'environnement sont définies
if (!process.env.PG_USER || !process.env.PG_HOST || !process.env.PG_DATABASE) {
  console.error("PostgreSQL configuration missing in environment variables");
  process.exit(1);
}

// Événement de connexion pour loguer les connexions
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

/**
 * Exécute une requête SQL sécurisée en utilisant un pool PostgreSQL.
 *
 * @param text - La requête SQL sous forme de chaîne de caractères.
 * @param params - Un tableau de paramètres pour sécuriser la requête (évite les injections SQL).
 * @returns Les lignes (rows) qui résultes de la requête.
 * @throws Relance toute erreur rencontrée pour qu'elle puisse être gérée.
 */
export async function query(text: string, params?: any[]) {
  let client;
  try {
    client = await pool.connect();

    // Exécuter la requête SQL avec les paramètres fournis
    const res = await client.query(text, params);

    return res.rows;
  } catch (err) {
    // console.error("Error executing query:", {
    //   query: text,
    //   params,
    //   error: err.message,
    // });
    // Enregistrer les autres erreurs dans un fichier
    logger.error("Error", {
      message: err.message,
      query: text,
      params: params,
    });
    throw err;
  } finally {
    // Libérer le client pour le rendre disponible dans le pool
    if (client) {
      client.release();
    }
  }
}

export default pool;
