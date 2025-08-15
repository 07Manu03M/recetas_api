// src/config/db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME || "recetas";

if (!uri) {
  console.error("Falta DB_URI en .env");
  process.exit(1);
}

const client = new MongoClient(uri, {});

let db;
export async function connect() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("🆗 MongoDB conectado!");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    throw err;
  }
}

export function getDB() {
  if (!db) throw new Error("DB no inicializada. Llama a connect() primero.");
  return db;
}

export function getClient() {
  return client;
}





