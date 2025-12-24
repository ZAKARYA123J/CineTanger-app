import dotenv from "dotenv"
dotenv.config()
import user from "../models/User.js";
import jwt from "jsonwebtoken"

const JWT_TOKEN = process.env.JWT_TOKEN;
export const loginUser = async (req:any, res:any) => {
    const { name, email, password } = req.body
    try {
        const register = await user.findOne({where:{email}})
        if (register) {
            return res.status(200).json({ message: "login valide"})
        }
        await user.create({ name, email, password })
        const token = jwt.sign({name:name,email:email,password:password},
            JWT_TOKEN,
            {expiresIn:"7d"}
        )
        
        return res.status(201).json({message:"register User",token,register})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: " no valide" })
    }
}