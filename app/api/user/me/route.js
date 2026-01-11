import { supabase } from "@/app/utils/supabase"
import jwt from "jsonwebtoken"

export async function GET(req){
    const {searchParams} = new URL(req.url)
    const role = searchParams.get("role")

    if(role == "User"){
        const userToken = (req.cookies.get("userToken"))?.value
        if(!userToken){
            return Response.redirect(new URL("/login", req.url))
        }
        const userData = jwt.verify(userToken, process.env.JWT_SECRET)
        const {data, error} = await supabase.from("Pemilih").select("*").eq("NIS", userData.NIS).single()
        return Response.json({data, error})
    } 
    
    else if(role == "Admin"){
        const adminToken = (req.cookies.get("adminToken"))?.value
        if(!adminToken){
            return Response.redirect(new URL("/administrator/login", req.url))
        }
        const {data, error} = await supabase.from("User Administrator").select("*").eq("username", userData.username).single()
        return Response.json({data, error})
    }
    return Response.json({data: null, error: "Access Denied"})
}