const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");

const app = express();

// Configura las credenciales de acceso para ti y tu grupo
const USERS = {
  admin: "jimtv2026", // usuario: contraseña
  amigo: "clave123"
};

// Aplicar autenticación básica antes de las rutas y estáticos
app.use(
  basicAuth({
    users: USERS,
    challenge: true, // Despliega la ventana flotante del navegador
    realm: "JIMTV Private Area"
  })
);

// Servir la carpeta pública
app.use(express.static(path.join(__dirname, "../public")));

// Si tienes rutas de API dentro de src/ (ejemplo: router de Express), se incluyen aquí:
// const apiRoutes = require("./routes");
// app.use("/api", apiRoutes);

module.exports = app;