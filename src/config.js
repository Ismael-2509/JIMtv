require("dotenv").config();

const KEY = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 3000;
const REGION = "MX";
const LANG = "es-MX";

module.exports = { KEY, PORT, REGION, LANG };