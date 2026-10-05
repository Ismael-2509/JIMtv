const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");

const app = express();

// Credenciales de acceso
const USERS = {
  admin: "clave123",
  amigo: "clave123"
};

// Autenticación básica
app.use(
  basicAuth({
    users: USERS,
    challenge: true,
    realm: "JIMTV Private Area"
  })
);

// Rutas de la API
const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

// Archivos públicos
app.use(express.static(path.join(__dirname, "../public")));

module.exports = app;