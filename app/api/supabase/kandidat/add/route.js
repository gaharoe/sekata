import { supabase } from "@/app/utils/supabase"

export async function POST(req){
    const formData = await req.formData()
    const kandidat = Object.fromEntries(formData.entries())
    if(kandidat.file && kandidat.file.size > 0){
        kandidat.foto = `Kandidat ${kandidat.urutan}-${Date.now()}.${kandidat.file.name.split(".").at(-1)}`
        await supabase.storage.from("Kandidat").upload(kandidat.foto, kandidat.file)
    }
    const {error} = await supabase.from("Kandidat").insert({
        nama: kandidat.nama,
        urutan: kandidat.urutan,
        kelas: kandidat.kelas,
        visi: kandidat.visi,
        misi: kandidat.misi,
        foto: kandidat.foto
    })
    console.log(error)
    return Response.json({error})
}