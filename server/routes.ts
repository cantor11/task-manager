// server/routes.ts
import type { Express } from "express";
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

// Esta función registra todas las rutas y retorna el servidor HTTP
export async function registerRoutes(app: Express): Promise<Server> {
  // Prefijo común: /api
  app.get("/api/tasks", getTasks);
  app.post("/api/tasks", createTask);
  app.put("/api/tasks/:id", updateTask);
  app.delete("/api/tasks/:id", deleteTask);
  app.post("/api/users", createUser);
  app.get("/api/users/:id", getUser);

  const httpServer = createServer(app);
  return httpServer;
}
