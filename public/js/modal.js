/* Modal integrado con servidores diferenciados por idioma (Español vs Inglés). */
import { $, IMG, esc, toast, norm } from "./utils.js";
import { api } from "./api.js";
import { inList, toggleList, saveCont } from "./lists.js";

let cur = null, details = null, curTab = "player", currentLang = "latino";

async function openModal(it, opts = {}) {
  cur = { ...norm(it, it.type), season: it.season || 1, episode: it.episode || 1 };
  details = null;
  currentLang = $("#langSel")?.value || "latino";
  $("#mt").textContent = cur.title;
  $("#modal").classList.add("open");
  document.body.style.overflow = "hidden";

  api(`/api/details?type=${cur.type}&id=${cur.id}`)
    .then((d) => { details = d; if (curTab === "info") showTab("info"); })
    .catch(() => {});

  showTab(opts.tab || "player");
}

function closeModal() {
  $("#pane").innerHTML = "";
  $("#modal").classList.remove("open");
  document.body.style.overflow = "";
}

function showTab(t) {
  curTab = t;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("on", b.dataset.t === t));
  if (t === "player") tabPlayer();
  else tabInfo();
}

function tabPlayer() {
  const pane = $("#pane");
  saveCont(cur);

  let embedUrl = "";

  if (currentLang === "latino" || currentLang === "castellano") {
    // Servidor con fuentes en Español (Latino / Castellano)
    if (cur.type === "movie") {
      embedUrl = `https://vidsrc.su/embed/movie/${cur.id}`;
    } else {
      embedUrl = `https://vidsrc.su/embed/tv/${cur.id}/${cur.season}/${cur.episode}`;
    }
  } else {
    // Servidor en Inglés
    if (cur.type === "movie") {
      embedUrl = `https://vidsrc.me/embed/movie?tmdb=${cur.id}`;
    } else {
      embedUrl = `https://vidsrc.me/embed/tv?tmdb=${cur.id}&season=${cur.season}&episode=${cur.episode}`;
    }
  }

  pane.innerHTML = `<div class="vid">
    <iframe
      src="${embedUrl}"
      allowfullscreen
      allow="autoplay; encrypted-media; picture-in-picture"
      frameborder="0"
      style="width:100%;height:100%;border:none;">
    </iframe>
  </div>`;
}

function tabInfo() {
  const pane = $("#pane");
  if (!details) { pane.innerHTML = '<p class="empty">Cargando detalles…</p>'; return; }

  const d = details;
  const year = (d.release_date || d.first_air_date || "").slice(0, 4);
  const dur = cur.type === "movie"
    ? (d.runtime ? `${d.runtime} min` : "")
    : (d.number_of_seasons ? `${d.number_of_seasons} temp.` : "");
  const on = inList(cur);

  pane.innerHTML = `<div class="meta">
      ${year ? `<span>${year}</span>` : ""}
      ${dur ? `<span>· ${dur}</span>` : ""}
      ${d.vote_average ? `<span>· ★ ${d.vote_average.toFixed(1)}</span>` : ""}
    </div>
    <div class="gen">${(d.genres || []).map((g) => `<span>${esc(g.name)}</span>`).join("")}</div>
    <p style="line-height:1.5;color:#d2d2d7;margin:12px 0;">${esc(d.overview || cur.overview || "Sin sinopsis disponible.")}</p>
    <div class="actions">
      <button class="btn" id="mPlay">▶ Reproducir</button>
      <button class="circ ${on ? "on" : ""}" id="mAdd">${on ? "✓" : "+"}</button>
    </div>
    <div id="epWrap"></div>`;

  $("#mPlay").onclick = () => showTab("player");
  $("#mAdd").onclick = () => { toggleList(cur); tabInfo(); };
  if (cur.type === "tv") seasonsUI(d);
}

function seasonsUI(d) {
  const seasons = (d.seasons || []).filter((s) => s.season_number > 0);
  if (!seasons.length) return;

  const sel = cur.season && seasons.some((s) => s.season_number === cur.season)
    ? cur.season : seasons[0].season_number;

  $("#epWrap").innerHTML =
    `<select id="sSel">${seasons.map((s) =>
      `<option value="${s.season_number}" ${s.season_number === sel ? "selected" : ""}>Temporada ${s.season_number}</option>`
    ).join("")}</select><div class="eps" id="eps"></div>`;

  $("#sSel").onchange = (e) => loadEps(+e.target.value);
  loadEps(sel);
}

async function loadEps(season) {
  const box = $("#eps");
  if (!box) return;
  box.innerHTML = '<p class="empty">Cargando episodios…</p>';

  let d;
  try {
    d = await api(`/api/episodes?tv_id=${cur.id}&season=${season}`);
  } catch {
    box.innerHTML = '<p class="empty">No se pudieron cargar los episodios.</p>';
    return;
  }

  box.innerHTML = "";
  (d.episodes || []).forEach((ep) => {
    const b = document.createElement("button");
    b.className = "ep" + (cur.season === season && cur.episode === ep.episode_number ? " on" : "");
    b.innerHTML =
      (ep.still_path ? `<img loading="lazy" src="${IMG}w300${ep.still_path}" alt="">` : '<div class="ph"></div>') +
      `<div class="b"><div class="n">Episodio ${ep.episode_number}${ep.runtime ? ` · ${ep.runtime} min` : ""}</div>
      <div class="nm">${esc(ep.name)}</div><div class="o">${esc(ep.overview || "Sin sinopsis.")}</div></div>`;

    b.onclick = () => {
      cur.season = season;
      cur.episode = ep.episode_number;
      saveCont(cur, { season, episode: ep.episode_number });
      box.querySelectorAll(".ep").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      toast(`Seleccionado T${season} · E${ep.episode_number}`);
      showTab("player");
    };
    box.appendChild(b);
  });
}

function initModal() {
  $("#close").onclick = closeModal;
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#modal").classList.contains("open")) closeModal();
  });
  document.querySelectorAll(".tab").forEach((b) => (b.onclick = () => cur && showTab(b.dataset.t)));

  const langSelect = $("#langSel");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      currentLang = e.target.value;
      if (cur && curTab === "player") tabPlayer();
    });
  }
}

export { openModal, initModal };