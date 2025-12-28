import { supabase } from "@/app/utils/supabase"

export async function POST(req){
    const {id} = await req.json()
    const {error} = await supabase.from("Kandidat").delete().eq("id", id)
    return Response.json({error})
}