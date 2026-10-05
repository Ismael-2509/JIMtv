const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");

const app = express();

const USERS = {
  admin: "clave123",
  amigo: "clave123"
};

// Autenticación
app.use(
  basicAuth({
    users: USERS,
    challenge: true,
    realm: "JIMTV Private Area"
  })
);

// API
const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

// Archivos del frontend
app.use(express.static(path.join(__dirname, "../public")));

module.exports = app;