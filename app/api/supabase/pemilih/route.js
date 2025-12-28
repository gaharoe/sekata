import { supabase } from "@/app/utils/supabase"

export async function GET(req){
    const {searchParams} = new URL(req.url)
    const isCount = searchParams.get("count") || null
    if(isCount){
        const {count, error} = await supabase.from("Pemilih").select("*", {count: "exact", head:true})
        return Response.json(!error ? {count, error: 0} : {data: null, error})
    }
    const {data, error} = await supabase.from("Pemilih").select("*").order("nama", {ascending: true})
    return Response.json(!error ? {data, error: 0} : {data: null, error})
}