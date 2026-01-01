import jwt from "jsonwebtoken"
import { supabase } from "@/app/utils/supabase"
import { NextResponse } from "next/server"

export async function POST(req){
    const userData = await req.json()
    const {data, error} = await supabase.from("Pemilih").select("*").eq("NIS", userData.NIS).eq("token", userData.token)
    if(data.length < 1){
        return Response.json({error: "NIS atau token salah"})
    }
    const token = jwt.sign({nama: data.nama, kelas: data.group, status: data.status}, process.env.JWT_SECRET, {expiresIn: "1h"})
    const res = NextResponse.json({error})

    res.cookies.set("token", token, {
        path: "/",
        httpOnly: true,
        secure: true,

    })

    return res
}