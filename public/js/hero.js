/* Destacado principal */
import { $, IMG, esc, norm } from "./utils.js";
import { api } from "./api.js";
import { inList, toggleList, onListChange } from "./lists.js";
import { openModal } from "./modal.js";

let heroItem = null;
async function renderHero(raw) {
  const it = norm(raw); heroItem = it;
  const hero = $('#hero');
  if (it.backdrop) hero.style.backgroundImage = `url(${IMG}original${it.backdrop})`;
  let d = {}; try { d = await api(`/api/details?type=${it.type}&id=${it.id}`); } catch {}
  const year = (d.release_date || d.first_air_date || '').slice(0, 4);
  const dur = it.type === 'movie' ? (d.runtime ? `${Math.floor(d.runtime / 60)}h ${d.runtime % 60}m` : '')
    : (d.number_of_seasons ? `${d.number_of_seasons} temporada${d.number_of_seasons > 1 ? 's' : ''}` : '');
  const gen = (d.genres || []).slice(0, 3).map((g) => g.name).join(' · ');
  hero.innerHTML = `<div class="hero-in"><h1>${esc(it.title)}</h1>
    <div class="meta"><span>${it.type === 'tv' ? 'Serie' : 'Película'}</span>${gen ? `<span>· ${esc(gen)}</span>` : ''}${year ? `<span>· ${year}</span>` : ''}${dur ? `<span>· ${dur}</span>` : ''}</div>
    <div class="meta"><span class="badge">4K</span><span class="badge">Dolby Atmos</span><span class="badge">15+</span></div>
    <p class="syn">${esc(it.overview)}</p>
    <div class="actions"><button class="btn" id="hPlay">▶ Reproducir</button><button class="circ" id="hAdd" title="Añadir a mi lista">+</button></div></div>`;
  $('#hPlay').onclick = () => openModal(it, { tab: 'trailer' });
  $('#hAdd').onclick = () => toggleList(it);
  refreshHeroButtons();
}
function refreshHeroButtons() {
  const b = $('#hAdd'); if (!b || !heroItem) return;
  const on = inList(heroItem); b.classList.toggle('on', on); b.textContent = on ? '✓' : '+';
}

onListChange(refreshHeroButtons);

export { renderHero };
