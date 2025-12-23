import { supabase } from "@/app/utils/supabase"

export async function GET(req){
    const {searchParams} = new URL(req.url)
    const tableName = searchParams.get("table")
    if(!tableName) {return Response({error: 1})}
    const {error} = await supabase.from("Pemilih").delete().eq("group", tableName)
    return Response.json({error})
}