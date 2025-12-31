import { jest, describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { sequelize } from "../config/Database.js";
import request from "supertest";

describe("Movies api integration Test", () => {
  let app; // This will store your Express app
  let server; // For the HTTP server
  
  beforeAll(async () => {
    // ⬇️ REMOVE THE "const" - it creates a new local variable
    const imported = await import("../../index.js");
    app = imported.app || imported.default || imported; // Handle different export styles
    
    console.log('App loaded:', !!app); // Debug log
    
    // If your index.js starts the server, you might need to not start it for tests
    // Or if it does start automatically, get the app before it listens
    
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  }, 30000);
  
  afterAll(async () => {
    // 1. Close server first
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    
    // 2. Clean database
    await sequelize.query('TRUNCATE TABLE movies CASCADE;');
    
    // 3. Wait for all promises
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. Close sequelize with proper check
    if (sequelize && typeof sequelize.close === 'function') {
      try {
        await sequelize.close();
      } catch (error) {
        // Ignore already closed errors
        if (!error.message.includes('already closed')) {
          console.error('Error closing sequelize:', error.message);
        }
      }
    }
    
    // 5. Clear any remaining timeouts/intervals
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
        releaseDate: "2025-12-29", // Changed from ISO string to YYYY-MM-DD format
        genre: "ACTION"
      });
        console.log('Got response:', response.status);
    expect(response.status).toBe(201);
  }, 10000);
});
});