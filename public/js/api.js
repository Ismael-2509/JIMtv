const api = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return r.json(); };

export { api };
