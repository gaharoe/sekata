import { supabase } from "@/app/utils/supabase"

export async function GET(req){
    const {searchParams} = new URL(req.url)
    const isCount = searchParams.get("count")
    if(isCount){
        return Response.json(await supabase.from("Kandidat").select("*", {count: "exact", head: true}))
    }
    let kandidat = null
    const {data, error} = await supabase.from("Kandidat").select("*").order("urutan", {ascending:true})
    if(!error){
        kandidat = data.map(d => {
            const imageURL = supabase.storage.from("Kandidat").getPublicUrl(d.foto).data.publicUrl
            return {...d, imageURL}
        })
    }
    return Response.json({data: kandidat, error})
}