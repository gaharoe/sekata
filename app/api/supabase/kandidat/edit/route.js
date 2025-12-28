import { supabase } from "@/app/utils/supabase"

export async function POST(req){
    const formData = await req.formData()
    const kandidatID = formData.get("id")
    const file = formData.get("file") || false
    const kandidat = {
        urutan: formData.get("urutan"),
        nama: formData.get("nama"), 
        kelas: formData.get("kelas"), 
        visi: formData.get("visi"), 
        misi: formData.get("misi")
    }
    if(file && file.size > 0){
        kandidat.foto = `Kandidat ${kandidat.urutan}-${Date.now()}.${file.name.split(".").at(-1)}`
        const {data, error} = await supabase.from("Kandidat").select("foto").eq("id", kandidatID)
        const oldFoto = data[0].foto
        await supabase.storage.from("Kandidat").remove([oldFoto])
        await supabase.storage.from("Kandidat").upload(kandidat.foto, file)
    }
    const {error} = await supabase.from("Kandidat").update(kandidat).eq("id", kandidatID)
    return Response.json({error})
}