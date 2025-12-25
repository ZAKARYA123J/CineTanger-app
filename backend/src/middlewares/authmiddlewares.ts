import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
const JWT_TOKEN = process.env.JWT_TOKEN;
const validationMiddlewares = async (req,res,next)=>{
    try {
        const authhader = req.headers.authorization
        if(!authhader){
            return res.status(400).json({message:"no token"})
        }
        const valideToken = authhader.split(" ")[1]
        if(!valideToken){
            return res.status(401).json({message:"Invalid token format"})
        }
        const valid = jwt.verify(valideToken,JWT_TOKEN)
        if(valid){
            return res.status(200).json({message:"toekn valide",valid})
        }
        next()
    } catch (error) {
        return res.status(400).json({message:"Unauthorized"})
    }
}
export default validationMiddlewares;