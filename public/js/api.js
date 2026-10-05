const api = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`${url} → HTTP ${response.status} ${response.statusText} ${text}`);
  }

  return await response.json();
};

export { api };