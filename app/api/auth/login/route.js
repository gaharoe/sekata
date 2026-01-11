import jwt from "jsonwebtoken"
import { supabase } from "@/app/utils/supabase"
import { NextResponse } from "next/server"

export async function POST(req){
    const userData = await req.json()
    let payload = null
    let token = null

    if(userData.role == "user"){
        const {data, error} = await supabase.from("Pemilih").select("*").eq("NIS", userData.NIS).eq("token", userData.token).single()
        if(error || data?.length < 1){
            return Response.json({error: "NIS atau token salah"})
        }

        payload = {role: "user", nama: data.nama, kelas: data.group, NIS: data.NIS}
        token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})
    } 
    
    else if(userData.role == "admin"){
        const {data, error} = await supabase.from("User Administrator").select("*").eq("username", userData.username).eq("password", userData.password).single()
        if(data.length < 1){
            return Response.json({error: "Username atau Password salah"})
        }

        payload = {role: "admin", nama: data.nama, username: data.username}
        token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})
    } 
    
    else {return Response.json({error: "Access Denied"})}
    
    const res = NextResponse.json({data: payload, error: null})
    res.cookies.set("userToken", token, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24
    })
    return res
}