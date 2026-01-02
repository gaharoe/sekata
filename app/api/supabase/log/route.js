import { supabase } from "@/app/utils/supabase"

export async function POST(req){
    const data = await req.json()
    const {error} = await supabase.from("Log").insert({
        role: data.role,
        action: data.action,
        tanggal: data.tanggal,
        jam: data.jam
    })
    return Response.json({error})
}

export async function GET(req){
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get("limit")
    const role = searchParams.get("role")
    const Log = await supabase.from("Log").select("*").order("id", {ascending: false})
    let responseData = Log.data
    if(role){
        responseData = responseData.filter(log => log.role == role)
    }
    if(limit){
        responseData = responseData.slice(0, limit)
    }
    return Response.json({data: responseData, error: Log.error})
}