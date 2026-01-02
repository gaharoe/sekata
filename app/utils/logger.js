export async function logger(action, role){
    const time = new Date()

    const dd = String(time.getDate()).padStart(2, "0")
    const mm = String(time.getMonth() + 1).padStart(2, "0")
    const yy = String(time.getFullYear()).slice(-2)

    const hh = String(time.getHours()).padStart(2, "0")
    const min = String(time.getMinutes()).padStart(2, "0")

    const tanggal = `${dd}/${mm}/${yy}`
    const jam = `${hh}:${min}`

    console.log(tanggal)
    console.log(jam)

    const req = await fetch("/api/supabase/log", {method: "POST", body: JSON.stringify({action, role, tanggal, jam})})
    const {error} = await req.json()
    if(error) {console.log(error)}
}