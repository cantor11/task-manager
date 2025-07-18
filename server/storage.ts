import { users, type User, type InsertUser, type Task, type InsertTask } from "@shared/schema";
import { FirestoreStorage } from "./firestore";

/**
 * Interfaz que define los métodos CRUD para la capa de almacenamiento.
 * Abstrae la lógica de la base de datos para que pueda ser intercambiable.
 */
export interface IStorage {
  // Métodos para la gestión de usuarios
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Métodos para la gestión de tareas
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;
}

/**
 * Implementación de almacenamiento en memoria para los usuarios.
 * Útil para desarrollo y pruebas sin necesidad de una base de datos persistente.
 */
class MemStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, name: insertUser.name || null, avatar: insertUser.avatar || null };
    this.users.set(id, user);
    return user;
  }
}

/**
 * Clase principal de almacenamiento que combina diferentes implementaciones.
 * Utiliza MemStorage para usuarios y FirestoreStorage para tareas.
 * Esto permite desacoplar la lógica de cada entidad.
 */
class Storage implements IStorage {
  private userStorage = new MemStorage();
  private taskStorage = new FirestoreStorage();

  // Métodos de usuario delegados a MemStorage
  getUser(id: number): Promise<User | undefined> {
    return this.userStorage.getUser(id);
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    return this.userStorage.getUserByUsername(username);
  }
  createUser(user: InsertUser): Promise<User> {
    return this.userStorage.createUser(user);
  }

  // Métodos de tareas delegados a FirestoreStorage
  getTasks(): Promise<Task[]> {
    return this.taskStorage.getTasks();
  }
  getTask(id: string): Promise<Task | undefined> {
    return this.taskStorage.getTask(id);
  }
  createTask(task: InsertTask): Promise<Task> {
    return this.taskStorage.createTask(task);
  }
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    return this.taskStorage.updateTask(id, updates);
  }
  deleteTask(id: string): Promise<void> {
    return this.taskStorage.deleteTask(id);
  }
}

// Se exporta una única instancia de la clase Storage para ser utilizada en toda la aplicación.
export const storage = new Storage();
