// src/routes/usuarios.routes.js
import { Router } from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = Router();

// Crear usuario
router.post("/", async (req, res) => {
  try {
    const { id, nombre, email, edad } = req.body || {};
    if (id === undefined || !nombre || !email || edad === undefined) {
      return res.status(400).json({ message: "Faltan campos: id, nombre, email, edad" });
    }
    const db = getDB();
    const exists = await db.collection("usuarios").findOne({ id: Number(id) });
    if (exists) return res.status(409).json({ message: "El id ya existe" });

    const nuevo = { id: Number(id), nombre, email, edad: Number(edad), createdAt: new Date() };
    const result = await db.collection("usuarios").insertOne(nuevo);
    res.status(201).json({ message: "Usuario creado", usuario: { _id: result.insertedId, ...nuevo } });
  } catch (err) {
    console.error("POST /api/usuarios error:", err);
    res.status(500).json({ message: "Error al crear usuario", error: err.message });
  }
});

// Listar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const usuarios = await db.collection("usuarios").find().toArray();
    res.json(usuarios);
  } catch (err) {
    console.error("GET /api/usuarios error:", err);
    res.status(500).json({ message: "Error al obtener usuarios", error: err.message });
  }
});

// Obtener usuario por id (acepta id numérico o _id Mongo)
router.get("/:id", async (req, res) => {
  try {
    const raw = req.params.id;
    const db = getDB();

    if (!isNaN(raw)) {
      const usuario = await db.collection("usuarios").findOne({ id: Number(raw) });
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado (por id)" });
      return res.json(usuario);
    }

    if (ObjectId.isValid(raw)) {
      const usuario = await db.collection("usuarios").findOne({ _id: new ObjectId(raw) });
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado (por _id)" });
      return res.json(usuario);
    }

    return res.status(400).json({ message: "id inválido" });
  } catch (err) {
    console.error("GET /api/usuarios/:id error:", err);
    res.status(500).json({ message: "Error al obtener usuario", error: err.message });
  }
});

// Actualizar usuario por id numérico (o _id acepta si quieres)
router.put("/:id", async (req, res) => {
  try {
    const raw = req.params.id;
    const db = getDB();
    const updates = req.body || {};
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "No hay campos para actualizar" });

    if (!isNaN(raw)) {
      const result = await db.collection("usuarios").updateOne({ id: Number(raw) }, { $set: updates });
      if (result.matchedCount === 0) return res.status(404).json({ message: "Usuario no encontrado" });
      return res.json({ message: "Usuario actualizado" });
    }

    if (ObjectId.isValid(raw)) {
      const result = await db.collection("usuarios").updateOne({ _id: new ObjectId(raw) }, { $set: updates });
      if (result.matchedCount === 0) return res.status(404).json({ message: "Usuario no encontrado" });
      return res.json({ message: "Usuario actualizado" });
    }

    res.status(400).json({ message: "id inválido" });
  } catch (err) {
    console.error("PUT /api/usuarios/:id error:", err);
    res.status(500).json({ message: "Error al actualizar usuario", error: err.message });
  }
});

// Eliminar usuario y todas sus recetas + ingredientes de esas recetas
router.delete("/:id", async (req, res) => {
  try {
    const raw = req.params.id;
    const db = getDB();

    let usuarioDoc;
    if (!isNaN(raw)) {
      usuarioDoc = await db.collection("usuarios").findOne({ id: Number(raw) });
    } else if (ObjectId.isValid(raw)) {
      usuarioDoc = await db.collection("usuarios").findOne({ _id: new ObjectId(raw) });
    } else {
      return res.status(400).json({ message: "id inválido" });
    }

    if (!usuarioDoc) return res.status(404).json({ message: "Usuario no encontrado" });

    const userIdNum = usuarioDoc.id; // may be undefined if user created without id field, but we always use id numeric
    // borrar recetas del usuario y sus ingredientes
    const recetas = await db.collection("recetas").find({ userId: userIdNum }).toArray();
    const recetaIds = recetas.map(r => r._id);
    if (recetaIds.length > 0) {
      await db.collection("ingredientes").deleteMany({ recetaId: { $in: recetaIds } });
      await db.collection("recetas").deleteMany({ _id: { $in: recetaIds } });
    }

    // eliminar usuario
    if (usuarioDoc._id) {
      await db.collection("usuarios").deleteOne({ _id: usuarioDoc._id });
    } else {
      await db.collection("usuarios").deleteOne({ id: userIdNum });
    }

    res.json({ message: "Usuario y sus recetas (e ingredientes) eliminados" });
  } catch (err) {
    console.error("DELETE /api/usuarios/:id error:", err);
    res.status(500).json({ message: "Error al eliminar usuario", error: err.message });
  }
});

export default router;






