import { adminDb } from "@/app/utils/firebase-admin"
import jwt from "jsonwebtoken"

export async function POST(req){
    const {password} = await req.json()
    const token = (req.cookies.get("adminToken"))?.value
    let userData = {}    
    try {
        userData = jwt.verify(token, process.env.JWT_SECRET)
        const adminUser = Object.values((await adminDb.ref("Administrator").once("value")).val())
        const userCorrect = adminUser.find(user => user.username == userData.username && user.password == password)
        if(userCorrect){
            return Response.json({error: 0})
        }
        return Response.json({error: "Password Salah"})
    } catch (err){
        console.log(err)
        return Response.json({error: "Akses Dilarang, harap login kembali!"})
    }
}