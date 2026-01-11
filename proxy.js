import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export function proxy(req){
    const adminURL = [
        "/admin",
        "/admin/kandidat",
        "/admin/pemilih",
        "/admin/laporan",
        "/admin/pengaturan",
        "/admin/log",
    ]

    const userURL = [
        "/user",
        "/vote"
    ]

    const {pathname} = new URL(req.url)
    const userToken = req.cookies.get("userToken")?.value
    const adminToken = req.cookies.get("adminToken")?.value

    if(adminURL.includes(pathname)){
        if(!adminToken){
            return NextResponse.redirect(new URL("/administrator/login", req.url))
        }

        try {
            jwt.verify(adminToken, process.env.JWT_SECRET)
            return NextResponse.next()
        } catch {
            return NextResponse.redirect(new URL("/administrator/login", req.url))
        }
    }

    if(userURL.includes(pathname)){
        if(!userToken){
            return NextResponse.redirect(new URL("/login", req.url))
        }

        try {
            jwt.verify(userToken, process.env.JWT_SECRET)
            return NextResponse.next()
        } catch {
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }
}

export const config = {
    matcher: [
        "/user",
        "/vote",
        "/admin",
        "/admin/kandidat",
        "/admin/pemilih",
        "/admin/laporan",
        "/admin/pengaturan",
        "/admin/log",
    ]
}