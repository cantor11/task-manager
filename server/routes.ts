import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Todas las rutas de la API deben tener el prefijo /api

  // --- Rutas para la gestión de Tareas ---

  /**
   * @route GET /api/tasks
   * @description Obtiene todas las tareas.
   * @returns {Task[]} - Un array de objetos de tareas.
   */
  app.get("/api/tasks", async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  /**
   * @route GET /api/tasks/:id
   * @description Obtiene una tarea específica por su ID.
   * @param {string} id - El ID de la tarea.
   * @returns {Task} - El objeto de la tarea encontrada.
   * @returns {404} - Si la tarea no se encuentra.
   */
  app.get("/api/tasks/:id", async (req, res) => {
    const task = await storage.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  });

  /**
   * @route POST /api/tasks
   * @description Crea una nueva tarea.
   * @body {InsertTask} - El objeto de la tarea a crear.
   * @returns {Task} - La nueva tarea creada.
   */
  app.post("/api/tasks", async (req, res) => {
    const newTask = await storage.createTask(req.body);
    res.status(201).json(newTask);
  });

  /**
   * @route PUT /api/tasks/:id
   * @description Actualiza una tarea existente.
   * @param {string} id - El ID de la tarea a actualizar.
   * @body {Partial<InsertTask>} - Los campos de la tarea a actualizar.
   * @returns {Task} - La tarea actualizada.
   * @returns {404} - Si la tarea no se encuentra.
   */
  app.put("/api/tasks/:id", async (req, res) => {
    const updatedTask = await storage.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  });

  /**
   * @route DELETE /api/tasks/:id
   * @description Elimina una tarea.
   * @param {string} id - El ID de la tarea a eliminar.
   * @returns {204} - Sin contenido.
   */
  app.delete("/api/tasks/:id", async (req, res) => {
    await storage.deleteTask(req.params.id);
    res.status(204).send();
  });

  // Aquí se pueden añadir más rutas para otras entidades (ej. usuarios)

  const httpServer = createServer(app);

  return httpServer;
}
