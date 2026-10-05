/* JIMTV - Punto de entrada del frontend */

import { $, norm } from "./utils.js";
import { api } from "./api.js";
import {
  fill,
  renderList,
  renderCont,
  initRows
} from "./rows.js";
import { renderHero } from "./hero.js";
import { initModal } from "./modal.js";
import { initSearch } from "./search.js";

console.log("JIMTV: main.js iniciado");

initRows();
initModal();
initSearch();

async function init() {
  console.log("JIMTV: iniciando aplicación");

  renderCont();
  renderList();

  // ==============================
  // TENDENCIAS
  // ==============================

  try {
    const trending = await api("/api/trending");

    console.log("JIMTV: trending recibido", trending);

    if (Array.isArray(trending.results)) {

      // HERO
      const heroItems = trending.results.filter(
        (item) => item.backdrop_path
      );

      if (heroItems.length > 0) {
        const day = Math.floor(Date.now() / 86400000);

        const selected =
          heroItems[
            day % Math.min(heroItems.length, 10)
          ];

        console.log(
          "JIMTV: renderizando hero",
          selected
        );

        await renderHero(selected);
      }

      // TENDENCIAS
      const trendItems = trending.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item));

      console.log(
        "JIMTV: tarjetas de tendencias:",
        trendItems.length
      );

      fill(
        "#trend",
        trendItems,
        false
      );
    }

  } catch (error) {
    console.error(
      "JIMTV: error cargando trending:",
      error
    );
  }

  // ==============================
  // TOP SERIES
  // ==============================

  try {
    const topSeries = await api("/api/top-series");

    console.log(
      "JIMTV: top-series recibido",
      topSeries
    );

    if (Array.isArray(topSeries.results)) {

      const seriesItems = topSeries.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item, "tv"));

      console.log(
        "JIMTV: tarjetas de series:",
        seriesItems.length
      );

      fill(
        "#topS",
        seriesItems,
        true
      );
    }

  } catch (error) {
    console.error(
      "JIMTV: error cargando top-series:",
      error
    );
  }

  // ==============================
  // TOP PELÍCULAS
  // ==============================

  try {
    const topMovies = await api("/api/top-movies");

    console.log(
      "JIMTV: top-movies recibido",
      topMovies
    );

    if (Array.isArray(topMovies.results)) {

      const movieItems = topMovies.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item, "movie"));

      console.log(
        "JIMTV: tarjetas de películas:",
        movieItems.length
      );

      fill(
        "#topM",
        movieItems,
        true
      );
    }

  } catch (error) {
    console.error(
      "JIMTV: error cargando top-movies:",
      error
    );
  }

  console.log("JIMTV: aplicación cargada");
}

init();