require("dotenv").config();

const KEY = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 3000;
const REGION = "MX";
const LANG = "es-MX";

if (!KEY) {
  console.error("\n[JIMTV] Falta TMDB_API_KEY. Copia .env.example a .env y agrega tu clave.\n");
  process.exit(1);
}

module.exports = { KEY, PORT, REGION, LANG };
