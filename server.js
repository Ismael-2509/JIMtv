const app = require("./src/app");
const { PORT } = require("./src/config");

// En local (npm start) arranca el servidor; en Vercel solo se exporta la app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`JIMTV corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;