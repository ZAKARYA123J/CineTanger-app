import express, { type Request, type Response } from "express"
const app = express()
app.get('/', (_req: Request, res: Response) => {
    res.send("hello word")
})
const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})