const { KEY, REGION, LANG } = require("../config");

const BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint, params = {}) {
  if (!KEY) {
    throw new Error("Falta TMDB_API_KEY en las variables de entorno.");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", LANG || "es-MX");
  url.searchParams.set("region", REGION || "MX");

  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `Error TMDB: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

module.exports = {
  tmdb: fetchFromTMDB,
  fetchFromTMDB
};