import { createLogger, format, transports } from "winston";

// Configuration du format des logs
const logger = createLogger({
  level: "error", // On enregistre uniquement les logs de niveau "error"
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    // Enregistrer les erreurs dans un fichier
    new transports.File({ filename: "errors.log" }),
  ],
});

export default logger;
