/* JIMTV - Punto de entrada del frontend */
import { norm } from "./utils.js";
import { api } from "./api.js";
import { fill, renderList, renderCont, initRows } from "./rows.js";
import { renderHero } from "./hero.js";
import { initModal } from "./modal.js";
import { initSearch } from "./search.js";

initRows();
initModal();
initSearch();

async function init() {
  renderCont();
  renderList();

  // Tendencias + hero
  try {
    const trending = await api("/api/trending");
    if (Array.isArray(trending.results)) {
      const heroItems = trending.results.filter((item) => item.backdrop_path);
      if (heroItems.length > 0) {
        const day = Math.floor(Date.now() / 86400000);
        const selected = heroItems[day % Math.min(heroItems.length, 10)];
        await renderHero(selected);
      }
      const trendItems = trending.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item));
      fill("#trend", trendItems, false);
    }
  } catch (error) {
    console.error("JIMTV: error cargando trending:", error);
  }

  // Top series
  try {
    const topSeries = await api("/api/top-series");
    if (Array.isArray(topSeries.results)) {
      const seriesItems = topSeries.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item, "tv"));
      fill("#topS", seriesItems, true);
    }
  } catch (error) {
    console.error("JIMTV: error cargando top-series:", error);
  }

  // Top películas
  try {
    const topMovies = await api("/api/top-movies");
    if (Array.isArray(topMovies.results)) {
      const movieItems = topMovies.results
        .filter((item) => item.poster_path)
        .map((item) => norm(item, "movie"));
      fill("#topM", movieItems, true);
    }
  } catch (error) {
    console.error("JIMTV: error cargando top-movies:", error);
  }
}

init();