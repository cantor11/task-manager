import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

describe("Pruebas de integración - Rutas de usuarios", () => {
  const app = express();
  app.use(express.json());

  beforeAll(async () => {
    await registerRoutes(app);
  });

  it("POST /api/users debe crear un usuario", async () => {
    const res = await request(app).post("/api/users").send({
      username: "laura",
      password: "1234",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.username).toBe("laura");
  });

  it("GET /api/users/:id debe retornar un usuario", async () => {
    const res = await request(app).get("/api/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
  });
});
