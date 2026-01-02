import { supabase } from "@/app/utils/supabase"
import jwt from "jsonwebtoken"

export async function GET(req){
    const token = (req.cookies.get("token"))?.value
    if(!token){
        return Response.redirect(new URL("/login", req.url))
    }
    const userData = jwt.verify(token, process.env.JWT_SECRET)
    if(userData.role == "user"){
        const {data, error} = await supabase.from("Pemilih").select("*").eq("NIS", userData.NIS).single()
        return Response.json({data, error})
    } else if(userData.role == "admin"){
        const {data, error} = await supabase.from("User Administrator").select("*").eq("username", userData.username).single()
        return Response.json({data, error})
    }
    return Response.json({data: null, error: "Access Denied"})
}