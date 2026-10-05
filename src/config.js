require("dotenv").config();

// Opción B: API Key asignada directamente para evitar problemas con .env en Vercel
const KEY = "03322d95cb652e0d6bf7d9014421e5e7";
const PORT = process.env.PORT || 3000;
const REGION = "MX";
const LANG = "es-MX";

if (!KEY) {
  console.error("\n[JIMTV] Falta TMDB_API_KEY. Copia .env.example a .env y agrega tu clave.\n");
  process.exit(1);
}

module.exports = { KEY, PORT, REGION, LANG };