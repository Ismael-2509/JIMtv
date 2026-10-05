const $ = (s) => document.querySelector(s);
const IMG = 'https://image.tmdb.org/t/p/';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const toast = (m) => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1800); };
const norm = (x, type) => ({
  id: x.id, type: x.media_type || type || (x.first_air_date !== undefined ? 'tv' : 'movie'),
  title: x.title || x.name || '', poster: x.poster_path, backdrop: x.backdrop_path, overview: x.overview || ''
});

export { $, IMG, esc, toast, norm };