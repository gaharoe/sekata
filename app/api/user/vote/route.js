import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { supabase } from "@/app/utils/supabase";

export async function POST(req){
    const token = (req.cookies.get("token")).value
    const kandidatID = await req.json()
    const timeNow = Date.now()
    if(!token) {
        return Response.json({error: "Forbidden"})
    }
    const user = jwt.verify(token, process.env.JWT_SECRET)
    if(!user){
        return Response.json({error: "Forbidden"})
    }

    const {error: errKandidat} = await supabase.from("Suara").insert({
        kandidat_id: kandidatID.id,
        created_at: timeNow
    })
    const {error: errPemilih} = await supabase.from("Pemilih").update({status: true, "waktu pemilihan" : timeNow}).eq("NIS", user.NIS)
    console.log(errKandidat)
    return Response.json({error: null})
}