import { adminDb } from "@/app/utils/firebase-admin"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { supabase } from "@/app/utils/supabase"

export const runtime = "nodejs"

export async function POST(req){
    const token = (req.cookies.get("userToken")).value
    if(!token) {
        return Response.json({error: "Forbidden"})
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    if(!user){
        return Response.json({error: "Forbidden"})
    }

    
    let kandidatID = null
    try {
        const {id} = await req.json()
        kandidatID = id 
    } catch {
        kandidatID = null
    }

    if(!kandidatID){
        return NextResponse.json({error: "Forbidden"}, {status: 400})
    }

    const timeNow = Date.now()
    const {error} = await supabase.from("Pemilih").update({status: true, "waktu pemilihan" : timeNow}).eq("NIS", user.NIS)
    if(!error){
        await adminDb.ref("Suara").push({
            kandidat_id: kandidatID,
            created_at: timeNow
        })
    }    
    
    return NextResponse.json({error})
}

export async function GET(req){
    const snapshot = await adminDb.ref("Suara").once("value")
    const suara = snapshot.val()
    const data = Object.keys(suara).map(id => ({ id , ...suara[id]}))

    return Response.json({data: data, error: null})
}