"use client"

import "../globals.css"
import {Zalando_Sans, Limelight, Funnel_Display, Spectral} from "next/font/google"
import { User, LayoutDashboard, Users, Vote, ChartPie, Settings, ScrollText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

const limelight = Limelight({
  weight: "400"
})

const spectral = Spectral({
  weight: ["200", "300", "400", "500", "600"]
})

const zalando = Zalando_Sans({
  weight: "400"
})

const funnel = Funnel_Display({
  weight: "400"
})


export default function DashboardLayout({ children }) {
  const [slider, setSlider] = useState(0)
  // const []
  const pathName = usePathname()

  return (
    <html lang="en">
      <body className={``}>

        <nav className={`${zalando.className} flex items-center gap-5 px-4 w-full h-13 border-b border-b-gray-200`}>
          <div className={` flex items-center gap-2 text-gray-800`}>
            <div className="w-7 h-7 flex justify-center items-center rounded-full  border-gray-300"><User width={18} /></div>
            <p className="">Administrator</p>
          </div>
          <p className="text-gray-300">/</p>
          <p className="text-gray-700">{pathName.split("/").at(-1)}</p>
        </nav>

        <main className="w-full ">
          <section onMouseOver={() => setSlider(1)} onMouseLeave={() => setSlider(0)} className={`${zalando.className} ${slider? "w-65" : "w-15"} fixed top-13 bottom-0 left-0 transition-all text-sm py-3 overflow-x-hidden border-r border-r-gray-300 flex flex-col gap-2 text-gray-600 flex-nowrap bg-white`}>
            <Link href={"/admin"} className="flex items-center">
              <div className="px-4">
                <div className={`px-1 rounded-md ${pathName == "/admin" ? "bg-teal-100 text-teal-500" : ""}`}>
                  <LayoutDashboard width={18}/>
                </div>
              </div>
              <p className={`${pathName == "/admin" ? "text-teal-600":""} text-nowrap`}>Dashboard</p>
            </Link>
            
            <Link href={"/admin/kandidat"} className="flex items-center">
              <div className="px-4">
                <div className={`px-1 rounded-md ${pathName == "/admin/kandidat" ? "bg-teal-100 text-teal-500" : ""}`}>
                  <Users width={18}/>
                </div>
              </div>
              <p className={`${pathName == "/admin/kandidat" ? "text-teal-600":""} text-nowrap`}>Manajemen Kandidat</p>
            </Link>
            
            <Link href={"/admin/pemilih"} className="flex items-center">
              <div className="px-4">
                <div className={`px-1 rounded-md ${pathName == "/admin/pemilih" ? "bg-teal-100 text-teal-500" : ""}`}>
                  <Vote width={18}/>
                </div>
              </div>
              <p className={`${pathName == "/admin/pemilih" ? "text-teal-600":""} text-nowrap`}>Manajemen Pemilih</p>
            </Link>
            
            <Link href={"/admin/laporan"} className="flex items-center">
              <div className="px-4">
                <div className={`px-1 rounded-md ${pathName == "/admin/laporan" ? "bg-teal-100 text-teal-500" : ""}`}>
                  <ChartPie width={18}/>
                </div>
              </div>
              <p className={`${pathName == "/admin/laporan" ? "text-teal-600":""} text-nowrap`}>Grafik dan Laporan</p>
            </Link>
            
            <Link href={"/admin/pengaturan"} className="flex items-center">
              <div className="px-4">
                <div className={`px-1 rounded-md ${pathName == "/admin/pengaturan" ? "bg-teal-100 text-teal-500" : ""}`}>
                  <Settings width={18}/>
                </div>
              </div>
              <p className={`${pathName == "/admin/pengaturan" ? "text-teal-600":""} text-nowrap`}>Pengaturan</p>
            </Link>
            
            <Link href={"/admin/log"} className="flex items-center">
              <div className="px-4">
                <div className={`px-1 rounded-md ${pathName == "/admin/log" ? "bg-teal-100 text-teal-500" : ""}`}>
                  <ScrollText width={18}/>
                </div>
              </div>
              <p className={`${pathName == "/admin/log" ? "text-teal-600":""} text-nowrap`}>Log Aktivitas</p>
            </Link>

          </section>
          
          <div className="w-[calc(100svw-15*4px)] h-[calc(100svh-13*4px)] overflow-auto ml-15">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
