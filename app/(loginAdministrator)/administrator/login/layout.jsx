"use client"

import "../../../globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({weight: "400"})

export default function AdministratorLogin({children}){
    return (
        <html>
        <body>
            <main className={`${poppins.className} w-svw h-svh bg-white flex justify-center`}>
                {children}
            </main>
        </body>
        </html>
    )
}