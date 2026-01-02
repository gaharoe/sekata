import { supabase } from "@/app/utils/supabase";

export async function GET(req) {
    const Suara = await supabase.from("Suara").select("kandidat_id")
    return Response.json(Suara)    
}