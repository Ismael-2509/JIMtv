/* Punto de entrada del frontend */

import { $, norm } from "./utils.js";
import { api } from "./api.js";
import { fill, renderList, renderCont, initRows } from "./rows.js";
import { renderHero } from "./hero.js";
import { initModal } from "./modal.js";
import { initSearch } from "./search.js";

console.log("JIMTV: main.js iniciado");

initRows();
initModal();
initSearch();

(async function init() {
  console.log("JIMTV: iniciando carga");

  renderCont();
  renderList();

  let trending = null;
  let topSeries = null;
  let topMovies = null;

  // =========================
  // TENDENCIAS
  // =========================
  try {
    trending = await api("/api/trending");
    console.log("JIMTV: trending cargado", trending);

    if (Array.isArray(trending.results)) {
      const items = trending.results.filter(
        (item) => item.backdrop_path
      );

      // Hero
      if (items.length > 0) {
        const day = Math.floor(Date.now() / 86400000);
        const selected =
          items[day % Math.min(items.length, 10)];

        console.log("JIMTV: hero seleccionado", selected);

        await renderHero(selected);
      }

      // Tendencias
      const trendItems = trending.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item));

      console.log(
        "JIMTV: renderizando tendencias",
        trendItems.length
      );

      fill("#trend", trendItems, false);
    }
  } catch (error) {
    console.error("JIMTV: error en trending", error);
  }

  // =========================
  // TOP SERIES
  // =========================
  try {
    topSeries = await api("/api/top-series");

    console.log(
      "JIMTV: top-series cargado",
      topSeries
    );

    if (Array.isArray(topSeries.results)) {
      const seriesItems = topSeries.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item, "tv"));

      console.log(
        "JIMTV: renderizando series",
        seriesItems.length
      );

      fill("#topS", seriesItems, true);
    }
  } catch (error) {
    console.error("JIMTV: error en top-series", error);
  }

  // =========================
  // TOP PELÍCULAS
  // =========================
  try {
    topMovies = await api("/api/top-movies");

    console.log(
      "JIMTV: top-movies cargado",
      topMovies
    );

    if (Array.isArray(topMovies.results)) {
      const movieItems = topMovies.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item, "movie"));

      console.log(
        "JIMTV: renderizando películas",
        movieItems.length
      );

      fill("#topM", movieItems, true);
    }
  } catch (error) {
    console.error("JIMTV: error en top-movies", error);
  }

  console.log("JIMTV: carga terminada");
})();