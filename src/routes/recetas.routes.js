// src/routes/recetas.routes.js
import { Router } from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = Router();

// Crear receta
// Body: { title, description, userId }  (userId = número que corresponde a usuarios.id)
router.post("/", async (req, res) => {
  try {
    const { title, description, userId } = req.body || {};
    if (!title || !description || userId === undefined) {
      return res.status(400).json({ message: "Faltan campos: title, description, userId" });
    }
    const db = getDB();
    // opcional: verificar que userId exista
    const user = await db.collection("usuarios").findOne({ id: Number(userId) });
    if (!user) return res.status(404).json({ message: "Usuario (userId) no encontrado" });

    const receta = { title, description, userId: Number(userId), createdAt: new Date() };
    const result = await db.collection("recetas").insertOne(receta);
    res.status(201).json({ message: "Receta creada", receta: { _id: result.insertedId, ...receta } });
  } catch (err) {
    console.error("POST /api/recetas error:", err);
    res.status(500).json({ message: "Error al crear receta", error: err.message });
  }
});

// Listar todas las recetas
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const recetas = await db.collection("recetas").find().toArray();
    res.json(recetas);
  } catch (err) {
    console.error("GET /api/recetas error:", err);
    res.status(500).json({ message: "Error al listar recetas", error: err.message });
  }
});

// Obtener receta por _id con ingredientes
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id inválido" });
    const _id = new ObjectId(id);
    const db = getDB();
    const receta = await db.collection("recetas").findOne({ _id });
    if (!receta) return res.status(404).json({ message: "Receta no encontrada" });

    const ingredientes = await db.collection("ingredientes").find({ recetaId: _id }).toArray();
    res.json({ ...receta, ingredientes });
  } catch (err) {
    console.error("GET /api/recetas/:id error:", err);
    res.status(500).json({ message: "Error al obtener receta", error: err.message });
  }
});

// Editar receta (title/description)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id inválido" });
    const _id = new ObjectId(id);
    const { title, description } = req.body || {};
    const update = {};
    if (title) update.title = title;
    if (description) update.description = description;
    if (Object.keys(update).length === 0) return res.status(400).json({ message: "No hay campos para actualizar" });

    const db = getDB();
    const result = await db.collection("recetas").updateOne({ _id }, { $set: update });
    if (result.matchedCount === 0) return res.status(404).json({ message: "Receta no encontrada" });
    res.json({ message: "Receta actualizada" });
  } catch (err) {
    console.error("PUT /api/recetas/:id error:", err);
    res.status(500).json({ message: "Error al actualizar receta", error: err.message });
  }
});

// Eliminar receta y sus ingredientes
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id inválido" });
    const _id = new ObjectId(id);
    const db = getDB();
    await db.collection("ingredientes").deleteMany({ recetaId: _id });
    const result = await db.collection("recetas").deleteOne({ _id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Receta no encontrada" });
    res.json({ message: "Receta e ingredientes eliminados" });
  } catch (err) {
    console.error("DELETE /api/recetas/:id error:", err);
    res.status(500).json({ message: "Error al eliminar receta", error: err.message });
  }
});

// Listar recetas por usuario (userId numérico)
router.get("/usuario/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) return res.status(400).json({ message: "userId inválido" });
    const db = getDB();
    const recetas = await db.collection("recetas").find({ userId }).toArray();
    res.json(recetas);
  } catch (err) {
    console.error("GET /api/recetas/usuario/:userId error:", err);
    res.status(500).json({ message: "Error al listar recetas por usuario", error: err.message });
  }
});

export default router;



