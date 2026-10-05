const { PORT } = require("./src/config");
const app = require("./src/app");

// Vercel utiliza la aplicación como función serverless.
module.exports = app;

// Para ejecutar localmente con npm start.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`JIMTV listo en http://localhost:${PORT}`);
  });
}