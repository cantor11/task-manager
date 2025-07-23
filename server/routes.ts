// server/routes.ts
import { Router, type Express } from "express";
import { createServer, type Server } from "http";

// Importamos los controladores del CRUD
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  createUser,
  getUser
} from "./controller";

export const userRoutes = Router();
userRoutes.post("/users", createUser);
userRoutes.get("/users/:id", getUser);

// Esta función registra todas las rutas y retorna el servidor HTTP
export async function registerRoutes(app: Express): Promise<Server> {
  // Prefijo común: /api
  app.get("/api/tasks", getTasks);
  app.post("/api/tasks", createTask);
  app.put("/api/tasks/:id", updateTask);
  app.delete("/api/tasks/:id", deleteTask);
  app.use("/api", userRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
