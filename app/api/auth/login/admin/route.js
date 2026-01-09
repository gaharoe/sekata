import { adminDb } from "@/app/utils/firebase-admin"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req){
    const {username, password} = await req.json()
    if(!username || !password){
        return Response.json({error: `Forbidden`})
    }
    
    const userLoad = (await adminDb.ref("Administrator").once("value")).val()
    if(!userLoad){
        return Response.json({error: `${username} belum terdaftar!`})
    }

    const user = Object.values(userLoad).filter(data => (data.username == username || data.email == username) && data.password == password)
    if(user.length == 0){
        return Response.json({error: `Username atau Password salah!`})
    }

    const token = jwt.sign({role: "Admin", username: username}, process.env.JWT_SECRET, {expiresIn: "1d"})
    const res = NextResponse.json({error: null})
    res.cookies.set("adminToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: "/"
    })
    return res
}