// Envuelve un handler: responde JSON y traduce errores a { error } con su status
const wrap = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

const validType = (t) => (t === "tv" ? "tv" : "movie");

module.exports = { wrap, validType };
