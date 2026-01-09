import { NextResponse } from "next/server";

export function GET(req){
    const {searchParams} = new URL(req.url)
    const role = searchParams.get("role")
    const res = NextResponse.json({success: 1})

    if(role == "User"){
        res.cookies.delete("userToken")
    } else if (role == "Admin") {
        res.cookies.delete("adminToken")
    } else {
        return Response.json({error: "Forbidden"}, {status: 401})
    }

    return res
}