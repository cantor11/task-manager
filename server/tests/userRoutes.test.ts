import supertest from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

// Mock completo de Firebase Admin
jest.mock('../taskService/firebase', () => {
  return {
    db: {
      collection: jest.fn(() => ({
        add: jest.fn().mockResolvedValue({ id: '1' }),
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({ id: '1', username: 'laura' }),
            id: '1'
          })
        }),
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: '1',
              data: () => ({ username: 'laura' })
            }
          ]
        })
      }))
    },
    tasksCollection: {
      add: jest.fn(),
      doc: jest.fn(),
      get: jest.fn()
    }
  };
});

// Mock de Firebase Admin SDK
jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn()
    },
    firestore: jest.fn(() => ({
      collection: jest.fn()
    }))
  };
});

describe("Pruebas de integración - Rutas de usuarios", () => {
  const app = express();
  app.use(express.json());

  beforeAll(async () => {
    await registerRoutes(app);
  });

  it("POST /api/users debe crear un usuario", async () => {
    const res = await supertest(app).post("/api/users").send({
      username: "laura",
      password: "1234",
    });

    expect(res.statusCode).toBe(201);
  });
});
