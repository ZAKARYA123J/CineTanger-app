import dotenv from "dotenv"
dotenv.config()
import { Request, Response } from "express"
import user from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const JWT_TOKEN = process.env.JWT_TOKEN;
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const Register = await user.findOne({ where: { email } })
        if (Register) {
            return res.status(409).json({ message: "Email already exists" })
        }
        const create = await user.create({ name, email, password })
        const token = jwt.sign(
            { id: create.getDataValue("id"), name, email },
            JWT_TOKEN,
            { expiresIn: "7d" }
        )

        return res.status(201).json({ message: "register User", token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: " no valide", error })
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const login = await user.findOne({ where: { email } });

        if (!login) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, login.getDataValue("password"));
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: login.getDataValue("id"), email: login.getDataValue("email"), name: login.getDataValue("name") },
            JWT_TOKEN,
            { expiresIn: "7d" }
        );

        return res.status(200).json({ message: "Login successful", login, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const me=async(req:Request,res:Response)=>{
try{
const id=req?.user.id

const user2=await user.findOne({where:{id:id}})
if(!user2){
    res.status(404).send({message:"user not found"})
}

}catch(error){
    console.log(error.message)
    res.status(500).send({success:false,message:"error list dataof me api"})
}
}
