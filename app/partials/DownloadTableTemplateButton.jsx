"use client"

import { Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function DownloadTableTemplateButton(){
    const [open, setOpen] = useState(false)
    const [render, setRender] = useState(false)

    useEffect(() => {
        if (open) {
            setRender(true)
        } else {
            const timeout = setTimeout(() => setRender(false), 500) // durasi animasi
            return () => clearTimeout(timeout)
        }
    }, [open])
    
    return (
        <div className="w-full relative">
            <button onBlur={() => setOpen(prev => !prev)} onClick={() => setOpen(prev => !prev)} className=" w-full h-7 rounded-sm bg-gray-500 text-white text-xs flex gap-2 items-center pl-3">
                <Download width={13} />
                Unduh Template Table
            </button>

            {render && (
                <div 
                    className={`
                        transition-all absolute text-xs 
                        text-gray-600 left-0 right-0 bg-white 
                        border border-gray-300 shadow top-8 rounded-sm 
                        px-3 flex flex-col items-center duration-200
                        ${open
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 -translate-y-1"}
                    `}
                >
                    <a download={true} href="/Tabel Pemilih.csv" className="w-full h-7 border-b border-gray-200 flex justify-center items-center">Unduh CSV</a>
                    <a download={true} href="/Tabel Pemilih.xlsx" className="w-full h-7 flex justify-center items-center">Unduh XLSX</a>
                </div>
            )}
        </div>
    )
}