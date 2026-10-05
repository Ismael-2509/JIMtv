// Listados del inicio y búsqueda
const { Router } = require("express");
const { tmdb } = require("../services/tmdb");
const { wrap } = require("../utils/http");

const router = Router();

router.get("/trending", wrap(() => tmdb("/trending/all/week")));

router.get("/top-movies", wrap(async () => {
  const d = await tmdb("/movie/top_rated");
  return { results: d.results.slice(0, 10) };
}));

router.get("/top-series", wrap(async () => {
  const d = await tmdb("/tv/top_rated");
  return { results: d.results.slice(0, 10) };
}));

router.get("/search", wrap(async (req) => {
  const q = (req.query.q || "").trim();
  if (!q) return { results: [] };
  const d = await tmdb("/search/multi", { query: q, include_adult: "false" });
  return { results: d.results.filter((x) => x.media_type !== "person" && x.poster_path) };
}));

module.exports = router;
