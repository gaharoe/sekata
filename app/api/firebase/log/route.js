import { adminDb } from "@/app/utils/firebase-admin"

export async function POST(req){
    const data = await req.json()
    let error = null
    await adminDb.ref("Log").push({
        role: data.role,
        action: data.action,
        tanggal: data.tanggal,
        jam: data.jam
    }).catch(err => {error = err})
    return Response.json({error})
}

export async function GET(req){
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get("limit")
    const role = searchParams.get("role")
    let responseData = []
    let error = null
    const snapLog = await adminDb.ref("Log").once("value")
    if(snapLog.val()){
        responseData = Object.keys(snapLog.val()).map(logId => ({id: logId, ...snapLog.val()[logId]}))
        if(role){
            responseData = responseData.filter(log => log.role == role)
        }
        if(limit){
            responseData = responseData.slice(0, limit)
        }
    }
    return Response.json({data: responseData, error})
}