const request = require("supertest");
const app = require("../app");


describe("Auth API", () => {
    it("should register user", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "john",
                email: "john@test.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("user");
    });
    it("should fail when email is missing", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "john",
                password: "123456"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("All fields are required");
    });
    it("should fail when email format is invalid", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "john",
                email: "john.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(400);
    });
})