// src/routes/ingredientes.routes.js
import { Router } from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = Router();

// Agregar ingrediente a receta
// POST /api/ingredientes
// Body: { recetaId: "<ObjectId>", nombre: "pollo" }
router.post("/", async (req, res) => {
  try {
    const { recetaId, nombre } = req.body || {};
    if (!recetaId || !nombre) return res.status(400).json({ message: "Faltan campos: recetaId, nombre" });
    if (!ObjectId.isValid(recetaId)) return res.status(400).json({ message: "recetaId inválido" });

    const db = getDB();
    const receta = await db.collection("recetas").findOne({ _id: new ObjectId(recetaId) });
    if (!receta) return res.status(404).json({ message: "Receta no encontrada" });

    const ing = { recetaId: new ObjectId(recetaId), nombre, createdAt: new Date() };
    const result = await db.collection("ingredientes").insertOne(ing);
    res.status(201).json({ message: "Ingrediente agregado", ingrediente: { _id: result.insertedId, ...ing } });
  } catch (err) {
    console.error("POST /api/ingredientes error:", err);
    res.status(500).json({ message: "Error al agregar ingrediente", error: err.message });
  }
});

// Listar ingredientes de una receta
// GET /api/ingredientes/receta/:recetaId
router.get("/receta/:recetaId", async (req, res) => {
  try {
    const recetaId = req.params.recetaId;
    if (!ObjectId.isValid(recetaId)) return res.status(400).json({ message: "recetaId inválido" });
    const db = getDB();
    const ings = await db.collection("ingredientes").find({ recetaId: new ObjectId(recetaId) }).toArray();
    res.json(ings);
  } catch (err) {
    console.error("GET /api/ingredientes/receta/:recetaId error:", err);
    res.status(500).json({ message: "Error al listar ingredientes", error: err.message });
  }
});

// Eliminar ingrediente por _id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id inválido" });
    const db = getDB();
    const result = await db.collection("ingredientes").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Ingrediente no encontrado" });
    res.json({ message: "Ingrediente eliminado" });
  } catch (err) {
    console.error("DELETE /api/ingredientes/:id error:", err);
    res.status(500).json({ message: "Error al eliminar ingrediente", error: err.message });
  }
});

// Buscar recetas por ingrediente (query param o path)
// GET /api/ingredientes/buscar?ingrediente=pollo
// devuelve recetas que contienen ese ingrediente (case-insensitive)
router.get("/buscar", async (req, res) => {
  try {
    const ingrediente = req.query.ingrediente;
    if (!ingrediente) return res.status(400).json({ message: "Falta query param: ingrediente" });
    const db = getDB();
    const ings = await db.collection("ingredientes")
      .find({ nombre: { $regex: ingrediente, $options: "i" } })
      .toArray();
    const recetaIds = ings.map(i => i.recetaId).filter(Boolean);
    // recetaIds are ObjectId objects
    const recetas = recetaIds.length > 0
      ? await db.collection("recetas").find({ _id: { $in: recetaIds } }).toArray()
      : [];
    res.json(recetas);
  } catch (err) {
    console.error("GET /api/ingredientes/buscar error:", err);
    res.status(500).json({ message: "Error buscando recetas por ingrediente", error: err.message });
  }
});

export default router;



