# 📌 Plataforma de Recetas Culinarias - API REST

API REST desarrollada en **Node.js + Express + MongoDB + Dotenv** para la gestión de **usuarios**, **recetas** e **ingredientes**.  
Permite registrar usuarios, crear recetas, agregar ingredientes y realizar búsquedas avanzadas.

---

## 📂 Tecnologías usadas
- Node.js
- Express
- MongoDB (Driver oficial)
- Dotenv
- Nodemon (modo desarrollo)

---

## 🚀 Instalación y ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/07Manu03M/recetas_api.git
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz con:
   ```
   PORT=3000
   DB_URI=mongodb://127.0.0.1:27017
   DB_NAME=recetas
   ```

4. **Inicializar la base de datos con datos de prueba**
   ```bash
   node src/dataset.js
   ```

5. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

6. **La API estará disponible en:**
   ```
   http://localhost:3000
   ```

---

## 📌 Endpoints

### **1. Gestión de Usuarios**
| Método | URL | Descripción |
|--------|-----|-------------|
| POST   | `/api/usuarios` | Crear un nuevo usuario |
| GET    | `/api/usuarios` | Listar todos los usuarios |
| GET    | `/api/usuarios/:id` | Obtener usuario por ID |
| PUT    | `/api/usuarios/:id` | Actualizar datos de usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario y sus recetas |

**Ejemplo Request - Crear usuario**
```json
POST /api/usuarios
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "edad": 30
}
```

---

### **2. Gestión de Recetas**
| Método | URL | Descripción |
|--------|-----|-------------|
| POST   | `/api/recetas` | Crear receta |
| GET    | `/api/recetas` | Listar todas las recetas |
| GET    | `/api/recetas/:id` | Obtener receta por ObjectId con ingredientes |
| PUT    | `/api/recetas/:id` | Editar título o descripción |
| DELETE | `/api/recetas/:id` | Eliminar receta |
| GET    | `/api/recetas/usuario/:userId` | Listar recetas de un usuario |

**Ejemplo Request - Crear receta**
```json
POST /api/recetas
{
  "usuarioId": 1,
  "titulo": "Pollo al horno",
  "descripcion": "Receta casera con especias."
}
```

---

### **3. Gestión de Ingredientes**
| Método | URL | Descripción |
|--------|-----|-------------|
| POST   | `/api/ingredientes` | Agregar ingrediente a una receta |
| GET    | `/api/ingredientes/receta/:recetaId` | Ver ingredientes de una receta |
| DELETE | `/api/ingredientes/:id` | Eliminar ingrediente |
| GET    | `/api/ingredientes/buscar?ingrediente=pollo` | Buscar recetas que contengan un ingrediente específico |

**Ejemplo Request - Agregar ingrediente**
```json
POST /api/ingredientes
{
  "recetaId": "64acb2d4f50fc728842b4cf4",
  "nombre": "Pollo"
}
```

---

## 📦 Script de Datos de Prueba (`dataset.js`)
Este script inserta datos iniciales para pruebas:
- Usuarios
- Recetas
- Ingredientes

Ejecutar con:
```bash
node src/dataset.js
```

---

## 📽 Video de demostración
🎥 **Link del video:** [https://drive.google.com/drive/folders/1WvxnQ_oi7UBAZOPBtex0jJhE-bve5_P7?usp=sharing] 
En el video se muestra:
- CRUD de usuarios
- CRUD de recetas
- CRUD de ingredientes
- Listado de recetas por usuario
- Búsqueda de recetas por ingrediente

---

## 👥 Integrantes
- **Manuel Larrotta Meneses**
- **Karina Sanabria Casas**


