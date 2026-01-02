import { NextResponse } from "next/server";

export function GET(req){
    const res = NextResponse.json({success: 1})
    res.cookies.delete("token")
    return res
}