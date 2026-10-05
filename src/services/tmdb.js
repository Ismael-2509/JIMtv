const fetch = require("node-fetch");
const { KEY, LANG } = require("../config");

// Llamada genérica a TMDb (la clave nunca llega al navegador)
async function tmdb(endpoint, params = {}) {
  const url = new URL("https://api.themoviedb.org/3" + endpoint);
  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", params.language || LANG);
  Object.entries(params).forEach(([k, v]) => k !== "language" && v != null && url.searchParams.set(k, v));
  const r = await fetch(url.toString());
  if (!r.ok) {
    const e = new Error("TMDb respondió " + r.status);
    e.status = r.status;
    throw e;
  }
  return r.json();
}

module.exports = { tmdb };
