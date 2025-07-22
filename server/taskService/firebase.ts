// taskService/firebase.ts
import admin from 'firebase-admin';

// Opción 1: Usar variables de entorno (recomendado para CI/CD)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const db = admin.firestore();
export const tasksCollection = db.collection('tasks');
