import { adminDb } from "@/app/utils/firebase-admin";

export async function GET(req){
    try{
        await adminDb.ref("Log").remove()
        return Response.json({error: 0})
    } catch {
        return Response.json({error: "Terjadi Masalah"})
    }

}