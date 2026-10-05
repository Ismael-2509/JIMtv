const api = async (url) => {
  console.log("JIMTV API →", url);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");

    throw new Error(
      `${url} → HTTP ${response.status} ${response.statusText} ${text}`
    );
  }

  const data = await response.json();

  console.log(
    "JIMTV API ←",
    url,
    data
  );

  return data;
};

export { api };