import request from "supertest";
import express from "express";
import { userRoutes } from "../../routes";
import { resetUsers } from "../../controller";

jest.mock('firebase-admin', () => ({
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({})),
  })),
}));

describe("E2E - Usuarios", () => {
  const app = express();
  app.use(express.json());
  app.use('/api', userRoutes);

  beforeEach(() => {
    resetUsers();
  });

  it("POST /api/users debe crear un usuario", async () => {
    const res = await request(app).post("/api/users").send({
      username: "e2e_laura",
      password: "1234",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("GET /api/users/:id debe retornar un usuario", async () => {
    // First, create a user to ensure one exists
    await request(app).post("/api/users").send({
      username: "e2e_testuser",
      password: "password",
    });

    const res = await request(app).get("/api/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body.username).toBe("e2e_testuser");
  });
});
