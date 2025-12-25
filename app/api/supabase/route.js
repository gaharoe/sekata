import { supabase } from "@/app/utils/supabase"

export async function GET(req){
    const {searchParams} = new URL(req.url)
    const tableName = searchParams.get("table")

    if(!tableName) {return Response.json({data: null})}
    const {data, error} = await supabase.from(tableName).select("*").order("nama", {ascending: true})
    return Response.json(!error ? {data, error: 0} : {data: null, error})
}