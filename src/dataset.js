// dataset.js (colocar en la raíz del proyecto)
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME || "recetas";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection("usuarios").deleteMany({});
  await db.collection("recetas").deleteMany({});
  await db.collection("ingredientes").deleteMany({});

  // usuarios
  await db.collection("usuarios").insertMany([
    { id: 1, nombre: "Juan", email: "j@e.com", edad: 30, createdAt: new Date() },
    { id: 2, nombre: "Ana", email: "a@e.com", edad: 25, createdAt: new Date() }
  ]);

  // recetas
  const r1 = await db.collection("recetas").insertOne({ title: "Pollo al horno", description: "Delicioso", userId: 1, createdAt: new Date() });
  const r2 = await db.collection("recetas").insertOne({ title: "Ensalada César", description: "Fresca", userId: 2, createdAt: new Date() });

  // ingredientes
  await db.collection("ingredientes").insertMany([
    { recetaId: r1.insertedId, nombre: "pollo", createdAt: new Date() },
    { recetaId: r1.insertedId, nombre: "papas", createdAt: new Date() },
    { recetaId: r2.insertedId, nombre: "lechuga", createdAt: new Date() },
    { recetaId: r2.insertedId, nombre: "pollo", createdAt: new Date() }
  ]);

  console.log("Dataset insertado OK");
  await client.close();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


