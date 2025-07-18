import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { type Task, type InsertTask } from '@shared/schema';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Obtiene las credenciales de la cuenta de servicio de Firebase desde las variables de entorno
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

// Valida que las credenciales existan
if (!serviceAccountBase64) {
  throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_BASE64 no está definida.');
}

// Decodifica las credenciales de Base64 a formato JSON
const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

// Inicializa la aplicación de Firebase Admin con las credenciales
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Obtiene una instancia de la base de datos de Firestore
const db = admin.firestore();

/**
 * Clase que gestiona la lógica de almacenamiento de tareas en Firestore.
 * Implementa los métodos CRUD para interactuar con la colección 'tasks'.
 */
export class FirestoreStorage {
  private tasksCollection = db.collection('tasks');

  /**
   * Obtiene todas las tareas de la base de datos.
   * @returns Una promesa que se resuelve con un array de tareas.
   */
  async getTasks(): Promise<Task[]> {
    const snapshot = await this.tasksCollection.get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id, // El ID del documento de Firestore se usa como ID de la tarea
            title: data.title,
            description: data.description,
            dueDate: data.dueDate.toDate(), // Convierte el Timestamp de Firestore a un objeto Date
            priority: data.priority,
            status: data.status,
            flagged: data.flagged,
            userId: data.userId
        } as unknown as Task; // Se usa 'unknown' para conciliar los tipos entre Firestore y el esquema
    });
  }

  /**
   * Obtiene una tarea específica por su ID.
   * @param id - El ID de la tarea a obtener.
   * @returns Una promesa que se resuelve con la tarea encontrada o undefined si no existe.
   */
  async getTask(id: string): Promise<Task | undefined> {
    const doc = await this.tasksCollection.doc(id).get();
    if (!doc.exists) {
      return undefined;
    }
    const data = doc.data();
    if (!data) {
        return undefined;
    }
    return {
        id: doc.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toDate(),
        priority: data.priority,
        status: data.status,
        flagged: data.flagged,
        userId: data.userId
    } as unknown as Task;
  }

  /**
   * Crea una nueva tarea en la base de datos.
   * @param task - El objeto de la tarea a crear.
   * @returns Una promesa que se resuelve con la nueva tarea creada.
   */
  async createTask(task: InsertTask): Promise<Task> {
    const docRef = await this.tasksCollection.add(task);
    const newTask = await this.getTask(docRef.id);
    if (!newTask) {
        throw new Error('Error al crear la tarea.');
    }
    return newTask;
  }

  /**
   * Actualiza una tarea existente en la base de datos.
   * @param id - El ID de la tarea a actualizar.
   * @param updates - Un objeto con los campos a actualizar.
   * @returns Una promesa que se resuelve con la tarea actualizada.
   */
  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    await this.tasksCollection.doc(id).update(updates);
    return await this.getTask(id);
  }

  /**
   * Elimina una tarea de la base de datos.
   * @param id - El ID de la tarea a eliminar.
   */
  async deleteTask(id: string): Promise<void> {
    await this.tasksCollection.doc(id).delete();
  }
}
