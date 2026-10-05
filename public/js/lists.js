/* Mi lista y Continuar viendo (localStorage). Solo datos; el dibujo está en rows.js */
import { store } from "./storage.js";
import { toast } from "./utils.js";

const LIST = "jimtv_list", CONT = "jimtv_continue";

// Mini sistema de eventos para avisar a la UI cuando cambian los datos
const listeners = { list: [], cont: [] };
const onListChange = (fn) => listeners.list.push(fn);
const onContChange = (fn) => listeners.cont.push(fn);
const emit = (k) => listeners[k].forEach((fn) => fn());

const getList = () => store.get(LIST, []);
// Los títulos de Continuar viendo se borran solos si pasa un mes sin verlos
const CONT_TTL = 30 * 24 * 60 * 60 * 1000;
function getCont() {
  const all = store.get(CONT, []);
  const l = all.filter((x) => !x.ts || Date.now() - x.ts < CONT_TTL);
  if (l.length !== all.length) store.set(CONT, l);
  return l;
}

const inList = (it) => store.get(LIST, []).some((x) => x.id === it.id && x.type === it.type);
function toggleList(it) {
  let l = store.get(LIST, []);
  if (inList(it)) { l = l.filter((x) => !(x.id === it.id && x.type === it.type)); toast('Quitado de Mi lista'); }
  else { l.unshift({ id: it.id, type: it.type, title: it.title, poster: it.poster, backdrop: it.backdrop }); toast('Añadido a Mi lista'); }
  store.set(LIST, l); emit("list");
}
function saveCont(it, patch = {}) {
  let l = getCont();
  const old = l.find((x) => x.id === it.id && x.type === it.type) || {};
  l = l.filter((x) => !(x.id === it.id && x.type === it.type));
  l.unshift({ id: it.id, type: it.type, title: it.title, poster: it.poster, backdrop: it.backdrop,
    season: it.season ?? old.season ?? null, episode: it.episode ?? old.episode ?? null,
    progress: old.progress ?? 0, time: old.time ?? 0, ts: Date.now(), ...patch });
  store.set(CONT, l.slice(0, 20)); emit("cont");
}
function removeCont(it) {
  store.set(CONT, getCont().filter((x) => !(x.id === it.id && x.type === it.type)));
  emit("cont"); toast("Quitado de Continuar viendo");
}
function clearCont() {
  store.set(CONT, []); emit("cont"); toast("Continuar viendo vaciado");
}

export { inList, toggleList, saveCont, removeCont, clearCont, getList, getCont, onListChange, onContChange };