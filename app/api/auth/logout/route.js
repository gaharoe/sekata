import { NextResponse } from "next/server";

export function GET(req){
    const res = NextResponse.redirect(new URL("/login", req.url))
    res.cookies.delete("token")
    return res
}