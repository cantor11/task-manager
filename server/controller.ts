// server/controller.ts
import { Request, Response } from "express";
import { tasksCollection } from "./taskService/firebase";

// Obtener todas las tareas
export const getTasks = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      console.log('Filtrando por userId:', userId);
      let snapshot;
      if (userId) {
        snapshot = await tasksCollection.where('userId', '==', userId).get();
      } else {
        snapshot = await tasksCollection.get();
      }
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(tasks);
    } catch (error) {
      console.error("🔥 Error al obtener tareas:", error);
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  };
  

// Crear una nueva tarea
export const createTask = async (req: Request, res: Response) => {
    try {
      console.log("BODY RECIBIDO:", req.body);
  
      const { title, completed, dueDate, flagged, userId } = req.body;
  
      if (!title || typeof completed !== "boolean") {
        return res.status(400).json({ message: "Datos inválidos" });
      }
  
      const newTask = {
        title,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        flagged: flagged ?? false,
        userId: userId ?? null
      };
  
      const docRef = await tasksCollection.add(newTask);
  
      res.status(201).json({ id: docRef.id, ...newTask });
    } catch (error) {
      console.error("Error al crear tarea:", error);
      res.status(500).json({ message: "Error al crear tarea" });
    }
  };
  

// Editar una tarea
export const updateTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;
  
      await tasksCollection.doc(id).update({ title, completed });
  
      res.json({ message: "Tarea actualizada" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar tarea" });
    }
  };

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      await tasksCollection.doc(id).delete();
  
      res.json({ message: "Tarea eliminada" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar tarea" });
    }
  };

// --- Controladores de usuarios ---
let users: any[] = [];
let nextUserId = 1;

export const resetUsers = () => {
  users = [];
  nextUserId = 1;
};

export const createUser = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Datos inválidos" });
  const user = { id: nextUserId++, username, password };
  users.push(user);
  res.status(201).json(user);
};

export const getUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(user);
};
