// Información de un título: detalles, episodios, tráiler y plataformas
const { Router } = require("express");
const { tmdb } = require("../services/tmdb");
const { wrap, validType } = require("../utils/http");
const { LANG, REGION } = require("../config");

const router = Router();

// Endpoint para redireccionar al reproductor externo de LasPelis
router.get("/embed", (req, res) => {
  const type = validType(req.query.type);
  const id = encodeURIComponent(req.query.id);
  const season = encodeURIComponent(req.query.season || 1);
  const episode = encodeURIComponent(req.query.episode || 1);

  let embedUrl = "";
  if (type === "movie") {
    embedUrl = `https://laspelis.org/embed/movie/${id}`;
  } else if (type === "tv") {
    embedUrl = `https://laspelis.org/embed/tv/${id}/${season}/${episode}`;
  } else {
    return res.status(400).send("Tipo de contenido no válido.");
  }

  res.redirect(embedUrl);
});

router.get("/episodes", wrap((req) =>
  tmdb(`/tv/${encodeURIComponent(req.query.tv_id)}/season/${encodeURIComponent(req.query.season || 1)}`)));

// Detalles de un título
router.get("/details", wrap((req) =>
  tmdb(`/${validType(req.query.type)}/${encodeURIComponent(req.query.id)}`)));

// Tráiler oficial (YouTube): prioriza español, con respaldo en inglés
router.get("/videos", wrap(async (req) => {
  const type = validType(req.query.type);
  const id = encodeURIComponent(req.query.id);
  const pick = (list) => {
    const yt = (list || []).filter((v) => v.site === "YouTube");
    return (
      yt.find((v) => v.type === "Trailer" && v.official) ||
      yt.find((v) => v.type === "Trailer") ||
      yt.find((v) => v.type === "Teaser") ||
      yt[0]
    );
  };
  for (const language of [LANG, "en-US"]) {
    const d = await tmdb(`/${type}/${id}/videos`, { language });
    const v = pick(d.results);
    if (v) return { key: v.key, name: v.name, language };
  }
  return { key: null };
}));

// Plataformas legales disponibles en México
router.get("/providers", wrap(async (req) => {
  const d = await tmdb(`/${validType(req.query.type)}/${encodeURIComponent(req.query.id)}/watch/providers`);
  const r = (d.results && d.results[REGION]) || null;
  if (!r) return { available: false };
  const map = (a) => (a || []).map((p) => ({ name: p.provider_name, logo: p.logo_path }));
  return { available: true, link: r.link, flatrate: map(r.flatrate), rent: map(r.rent), buy: map(r.buy) };
}));

module.exports = router;