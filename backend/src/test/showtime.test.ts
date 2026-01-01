import { jest ,describe,it,expect,beforeAll,afterAll} from "@jest/globals";
import {sequelize} from '../config/Database.js'
import  request  from "supertest";
describe("Showtime api test integration",()=>{
      let server:any
      let app:any
    beforeAll(async()=>{
      const imported=import("../../app.js")
      app=imported
      await sequelize.authenticate()
      await sequelize.sync({alter:true})
 
    },3000)
    afterAll(async()=>{
   if(server){
    await new Promise((resolve)=>server.close(resolve))
   }
   await sequelize.query("TRUNCATE TABLE showtimes CASCADE;")
   await new Promise(resolve=>setTimeout(resolve,1000))
   if(sequelize && typeof sequelize.close === 'function'){
  try{
sequelize.close()
  }catch(error){
   if (!error.message.includes('already closed')) {
          console.error('Error closing sequelize:', error.message);
        }
  }
  jest.clearAllTimers()
   }
    },3000)
    describe("POST should create showtime",async()=>{
    it("Should create showtime",async()=>{
       const response= (await request(app).post("/api/showtimes").send({
        
       }))
    })
    })
})