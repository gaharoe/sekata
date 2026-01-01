"use client"

import Chart from "@/app/components/Chart"
import ProgressPie from "@/app/components/ProgressPie"
import Loading from "@/app/partials/Loading"
import { useEffect, useState } from "react"



export default function Laporan(){
    const [kandidat, setKandidat] = useState([])
    const [loading, setLoading] = useState(1)

    async function loadData() {
        const [dataKandidat] = await Promise.all([
            fetch("/api/supabase/kandidat").then(d => d.json())
        ])
        setKandidat(dataKandidat.data)
        setLoading(0)
    }

    useEffect(() => {
        document.title = "Grafik dan Laporan - Sekata"
        loadData()
    }, [])

    if(loading){
        return (<Loading />)
    }

    return (
        <div className="w-full h-full flex">
            <div className="border-r border-gray-300 flex-1 h-full flex flex-col pt-3">
                <Chart data={kandidat} />
                <div className="flex pl-7.5 w-full h-50 border-t border-gray-300">
                    {kandidat.map(person => (
                        <div key={person.id} className="flex-1 flex justify-center items-center">
                            <div className="w-20 h-25 overflow-hidden rounded-lg">
                                <img src={person.imageURL} className="object-cover min-h-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className=" h-full w-90">
                <div className="h-100 flex flex-col border-b border-gray-300">
                    <div className="flex-1 min-h-0">
                        <ProgressPie  />
                    </div>
                    <div>
                        <div className="flex gap-3 px-3 pb-3 text-sm text-gray-700 items-center">
                            <div className="w-5 h-5 rounded bg-gray-300"></div>
                            <p>Total Pemilih</p>
                        </div>
                        <div className="flex gap-3 px-3 pb-3 text-sm text-gray-700 items-center">
                            <div className="w-5 h-5 rounded bg-emerald-500"></div>
                            <p>Suara Terkumpul</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}