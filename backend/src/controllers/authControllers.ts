import dotenv from "dotenv"
dotenv.config()
import user from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const JWT_TOKEN = process.env.JWT_TOKEN;
export const register = async (req:any, res:any) => {
    const { name, email, password } = req.body
    try {
        const Register = await user.findOne({where:{email}})
        if (!Register) {
            return res.status(200).json({ message: "register create"})
        }
        const token = jwt.sign({name:name,email:email,password:password},
            JWT_TOKEN,
            {expiresIn:"7d"}
        )
        await user.create({ name, email, password })
        return res.status(201).json({message:"register User",token,Register})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: " no valide" ,error})
    }
}

export const login = async (req, res) => {
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
