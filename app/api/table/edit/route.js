import { supabase } from "@/app/utils/supabase"

export async function POST(req){
    const formData = await req.formData()
    const table = formData.get("table")
    const NIS = formData.get("NIS")
    const nama = formData.get("nama")
    const token = formData.get("token")
    const {error} = await supabase.from(table).update({
        nama: nama,
        token: token
    }).eq("NIS", NIS)
    return Response.json({error})
}