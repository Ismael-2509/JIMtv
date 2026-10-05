/* Tarjetas y filas horizontales */
import { $, IMG, esc } from "./utils.js";
import { getList, getCont, removeCont, clearCont, onListChange, onContChange } from "./lists.js";
import { openModal } from "./modal.js";

function card(it, rank, extra = '') {
  const el = document.createElement('div');
  el.className = 'card' + (rank ? ' top' : '');
  el.innerHTML = (rank ? `<span class="rank">${rank}</span>` : '') +
    (it.poster ? `<img class="p" loading="lazy" src="${IMG}w342${it.poster}" alt="${esc(it.title)}">` : `<div class="p"></div>`) +
    extra + `<div class="t">${esc(it.title)}</div>`;
  return el;
}
function fill(sel, items, ranked, onClick) {
  const box = $(sel); box.innerHTML = '';
  items.forEach((it, i) => {
    const c = card(it, ranked ? i + 1 : 0);
    c.onclick = () => (onClick || ((x) => openModal(x)))(it);
    box.appendChild(c);
  });
}
function renderList() {
  const l = getList();
  $("#list").classList.toggle("hide", !l.length);
  fill("#listS", l);
}
function renderCont() {
  const l = getCont();
  $('#cont').classList.toggle('hide', !l.length);
  const box = $('#contS'); box.innerHTML = '';
  l.forEach((it) => {
    const tag = it.type === 'tv' && it.season ? `<div class="tag">T${it.season} · E${it.episode ?? 1}</div>` : '';
    const c = card(it, 0, tag + `<div class="bar"><i style="width:${Math.max(3, Math.round(it.progress || 0))}%"></i></div>`);
    c.onclick = () => openModal(it, { tab: 'player', start: it.time || 0 });
    const rm = document.createElement('button');
    rm.className = 'rm'; rm.textContent = '✕';
    rm.title = rm.ariaLabel = 'Quitar de Continuar viendo';
    rm.onclick = (e) => { e.stopPropagation(); removeCont(it); };
    c.appendChild(rm);
    box.appendChild(c);
  });
}

function initRows() {
  onListChange(renderList);
  onContChange(renderCont);
  $("#contClear").onclick = clearCont;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.arr'); if (!a) return;
    const s = a.parentElement.querySelector('.scroll');
    s.scrollBy({ left: (a.classList.contains('l') ? -1 : 1) * s.clientWidth * 0.8, behavior: 'smooth' });
  });
}

export { card, fill, renderList, renderCont, initRows };