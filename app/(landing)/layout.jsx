"use client"

import Navbar from "../components/Navbar"
import "../globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({weight: "400"})

export default function LandingLayout({children}) {
    return (
        <html>
            <body className={`w-full ${poppins.className}`}>
                {children}
            </body>
        </html>
    )
}