import request from "supertest";

const API_URL = "http://localhost:5000";

describe("E2E - Usuarios", () => {
  beforeAll(async () => {
    // Espera a que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it("POST /api/users debe crear un usuario", async () => {
    const res = await request(API_URL).post("/api/users").send({
      username: "e2e_laura",
      password: "1234",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("GET /api/users/:id debe retornar un usuario", async () => {
    const res = await request(API_URL).get("/api/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
  });
});
