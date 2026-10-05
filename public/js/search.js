/* Búsqueda con debounce */
import { $, toast, norm } from "./utils.js";
import { api } from "./api.js";
import { card } from "./rows.js";
import { openModal } from "./modal.js";

function initSearch() {
  let st;
  $('#q').addEventListener('input', (e) => {
    clearTimeout(st); const q = e.target.value.trim();
    st = setTimeout(async () => {
      $('#search').classList.toggle('hide', !q); $('#rows').classList.toggle('hide', !!q);
      if (!q) return;
      try {
        const d = await api('/api/search?q=' + encodeURIComponent(q));
        const g = $('#sgrid'); g.innerHTML = '';
        if (!d.results.length) g.innerHTML = '<p class="empty">Sin resultados.</p>';
        d.results.map((x) => norm(x)).forEach((it) => { const c = card(it); c.onclick = () => openModal(it); g.appendChild(c); });
      } catch { toast('Error al buscar'); }
    }, 400);
  });
}

export { initSearch };
