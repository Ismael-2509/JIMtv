/* Punto de entrada del frontend */
import { $, norm } from "./utils.js";
import { api } from "./api.js";
import { fill, renderList, renderCont, initRows } from "./rows.js";
import { renderHero } from "./hero.js";
import { initModal } from "./modal.js";
import { initSearch } from "./search.js";

initRows();
initModal();
initSearch();

(async function init() {
  renderCont(); renderList();
  try {
    const [tr, ts, tm] = await Promise.all([api('/api/trending'), api('/api/top-series'), api('/api/top-movies')]);
    const items = tr.results.filter((x) => x.backdrop_path);
    const day = Math.floor(Date.now() / 864e5);
    if (items.length) renderHero(items[day % Math.min(items.length, 10)]); // destacado del día
    fill('#topS', ts.results.map((x) => norm(x, 'tv')), true);
    fill('#topM', tm.results.map((x) => norm(x, 'movie')), true);
    fill('#trend', tr.results.map((x) => norm(x)));
  } catch (e) {
    $('#hero').innerHTML = '<div class="hero-in"><h1>JIMTV</h1><p class="syn">No se pudo conectar con el servidor. Revisa tu TMDB_API_KEY en el archivo .env.</p></div>';
  }
})();
