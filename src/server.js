// src/server.js
console.log("→ ejecutando server.js");
import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";

import usuariosRoutes from "./routes/usuarios.routes.js";
import recetasRoutes from "./routes/recetas.routes.js";
import ingredientesRoutes from "./routes/ingredientes.routes.js";

dotenv.config();
const app = express();

app.use(express.json()); // MUST be before routes

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/recetas", recetasRoutes);
app.use("/api/ingredientes", ingredientesRoutes);

app.get("/", (req, res) => res.json({ message: "API funcionando" }));

const PORT = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("No se pudo conectar a la BD. Abortando.", err.message);
    process.exit(1);
  });










