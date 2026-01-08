import { jest, describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { sequelize } from "../config/Database.js";
import request from "supertest";

describe("Movies api integration Test", () => {
  let app:any
  let server:any; 
  
  beforeAll(async () => {

    const imported = await import("../../index.js");
    app = imported.default; 
    
    console.log('App loaded:', !!app); 
    

    
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  }, 30000);
  
  afterAll(async () => {
    
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    
 
    await sequelize.query('TRUNCATE TABLE movies CASCADE;');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (sequelize && typeof sequelize.close === 'function') {
      try {
        await sequelize.close();
      } catch (error) {
        if (!error.message.includes('already closed')) {
          console.error('Error closing sequelize:', error.message);
        }
      }
    }
    
    jest.clearAllTimers();
  }, 30000);
  
describe("POST /api/movies", () => {
  it("should create new movie", async () => {
    const response = await request(app)
      .post("/api/movies")
      .send({
        title: "New Movie Title",
        posterUrl: "https://example.com/poster.jpg",
        duration: 120,
        releaseDate: "2025-12-29",
        genre: "ACTION"
      });
        console.log('Got response:', response.status);
    expect(response.status).toBe(201);
   
      expect(response.body.data).toHaveProperty("id");
  }, 10000);
});
  describe ("GET /api/movies",()=>{
    it("should return all movies from database",async()=>{
  const response =await request(app).get("/api/movies")
  expect(response.status).toBe(200)
    })
 
  
})
  describe("PATCH /api/movies/:id",()=>{
    it("should update movies",async()=>{
    const create = await request(app)
      .post("/api/movies")
      .send({
        title: "New Movi54e Title",
        posterUrl: "https://example.com/poster.jpg",
        duration: 120,
        releaseDate: "2025-12-29",
        genre: "ACTION"
      });
        expect(create.status).toBe(201);
const movieId=create.body.data.id
const update=await request(app).patch(`/api/movies/${movieId}`).send({
      title: "Updated Movie Title",
        duration: 135
})
 expect(update.status).toBe(200);
    expect(update.body.success).toBe(true);
    expect(update.body.data.id).toBe(movieId);
    expect(update.body.data.title).toBe("Updated Movie Title");
    expect(update.body.data.duration).toBe(135);
    })
  })
});