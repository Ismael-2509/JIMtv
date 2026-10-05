// Punto de entrada: solo arranca el servidor
const { PORT } = require("./src/config");
const app = require("./src/app");

app.listen(PORT, () => console.log(`JIMTV listo en http://localhost:${PORT}`));
