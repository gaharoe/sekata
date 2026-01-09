"use client"

import { Lexend_Deca, Poppins, Fira_Code } from "next/font/google"
import Chart from "../../components/Chart"
import { useEffect, useState } from "react"
import Loading from "@/app/partials/Loading"
import { User, Users, Vote, Table2, ChartColumn, Dot } from "lucide-react"

const poppins = Poppins({
    weight: "400"
})

const firacode = Fira_Code({
    weight: "400"
})

export default function Dashboard() {

    const [loading, setLoading] = useState(1)
    const [kandidat, setKandidat] = useState({})
    const [pemilih, setPemilih] = useState({})
    const [totalSuara, setTotalSuara] = useState(0)
    const [log, setLog] = useState([])

    const totalKandidat = kandidat ? kandidat.length : 0
    const totalPemilih = pemilih ? pemilih.length : 0

    const tablePemilih = !pemilih.length ? {} : Object.values(
        pemilih.reduce((acc, item) => {
            const group = item.group
            if (!acc[group]) {
                acc[group] = { group: group, total: 0 }
            }
            acc[group].total += 1
            return acc
        }, {})
    )

    async function loadData(){
        setLoading(1)
        const [dataKandidat, dataPemilih, dataSuara, dataLog] = await Promise.all([
            fetch("/api/supabase/kandidat").then(kandidat => kandidat.json()),
            fetch("/api/supabase/pemilih?").then(pemilih => pemilih.json()),
            fetch("/api/firebase/vote").then(suara => suara.json()),
            fetch("/api/firebase/log?limit=10").then(log => log.json())
        ])

        const suaraKandidat = !dataSuara ? {} : dataSuara.data.reduce((acc, item) => {
            acc[item.kandidat_id] = (acc[item.kandidat_id] || 0) + 1
            return acc
        }, {})

        const newDataKandidat = !dataKandidat ? {} : dataKandidat.data.map(person => ({...person, suara: suaraKandidat[person.id] || 0}))
        setTotalSuara(dataSuara.data.length)
        setKandidat(newDataKandidat)
        setPemilih(dataPemilih.data)
        setLog(dataLog.data)
        setLoading(0)
    }

    useEffect(() => {
        document.title = "Dashboard - Sekata"
        loadData()
    }, [])

    if(loading){
        return (<Loading />)
    }

    return (
        <div className={`${poppins.className} flex w-full h-full`}>
            <div className="w-180 border-b border-b-gray-300 h-full flex flex-col items-center">

                <h1 className="text-3xl flex gap-3 w-full border-b border-b-gray-300 justify-center items-center py-5">Pemilihan Ketua OSIS <span className="h-fit px-2 text-sm rounded border">{(new Date().getFullYear())}</span></h1>

                <div className="flex w-full flex-1 min-h-0">
                    <div className="flex flex-col border-r border-r-gray-300 flex-1 min-w-0">
                        <div className="flex flex-col p-2 w-full h-40 shrink-0 border-b border-b-gray-300">
                            <h1 className="flex-1 text-5xl font-bold flex justify-center items-center">{totalPemilih}</h1>
                            <div className="flex justify-between items-center text-xs text-amber-900">
                                <div className="flex gap-2 items-center">
                                    <Users width={18} />
                                    <p className="h-fit">Pemilih Terdaftar</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col overflow-y-auto bg-gray-100 min-h-0 flex-1 border-b border-gray-300">
                            {tablePemilih.map(table => (
                                <div key={table.group} className="flex items-center px-2 border-b border-gray-300 h-10 w-full shrink-0 bg-gray-50 text-xs justify-between">
                                    <div className="flex gap-2 items-center">
                                        <Table2 width={16} className="text-gray-500" />
                                        <p className="h-fit">{table.group}</p>
                                    </div>
                                    <p>{table.total}</p>
                                </div>
                            ))}
                        </div>

                        <div className={`${firacode.className} flex-1 min-h-0 p-2 overflow-auto flex flex-col text-xs [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0`}>
                            {log.map(logData => (
                                <div key={logData.id} className="flex items-center w-full h-5 text-gray-700 shrink-0 text-nowrap">[{logData.tanggal}] {logData.role}: {logData.action}</div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-2 flex flex-col">
                        <div className="flex border-b border-b-gray-300 h-40">
                            <div className="flex flex-col p-2 flex-1 h-full border-gray-300 border-r">
                                <h1 className="flex-1 text-5xl font-bold flex justify-center items-center">{totalKandidat}</h1>
                                <div className="flex justify-between items-center text-xs text-sky-900">
                                    <div className="flex gap-2 items-center">
                                        <User width={18} />
                                        <p className="h-fit">Kandidat Terdaftar</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col py-2 px-3 flex-1 h-full">
                                <h1 className="flex-1 text-5xl font-bold flex justify-center items-center">{totalSuara}</h1>
                                <div className="flex justify-between items-center text-xs text-emerald-900">
                                    <div className="flex gap-2 items-center">
                                        <Vote width={18} />
                                        <p className="">Total Suara Terkumpul</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`flex-1 min-h-0 overflow-y-auto`}>
                            {kandidat.map(person => (
                                <div key={person.id} className="border-b border-gray-300 w-full h-40 p-2 flex gap-2">
                                    <div className="h-full w-30 overflow-hidden">
                                        <img src={person.imageURL} className="object-cover min-h-full"/>
                                    </div>
                                    <div className="flex-1 p-3 flex flex-col gap-3">
                                        <div className="border-b border-gray-200 flex flex-col gap-2 ">
                                            <p className="w-full font-bold text-gray-700 ">{person.nama}</p>
                                            <div className="text-xs flex gap-3 mb-3 items-center">
                                                <p className="text-gray-600">Kandidat {person.urutan}</p>
                                                <Dot />
                                                <p className="text-gray-700">{person.kelas}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full flex items-center gap-3 font-bold text-lg text-gray-700">
                                            <ChartColumn width={30} className="text-gray-400"/>
                                            <p className="h-fit">{person.suara}</p> 
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 flex-1">
                <div className="w-full bg-white border border-t-0 border-gray-300 flex flex-col items-center">
                    <p className="my-3 text-gray-600 text-center px-3 rounded-full border border-gray-400 w-fit text-xs">Grafik Suara</p>
                    <Chart data={kandidat}/>
                </div>
            </div>
        </div>
    )
}