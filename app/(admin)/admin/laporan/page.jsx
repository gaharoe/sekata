"use client"

import Chart from "@/app/components/Chart"
import ProgressPie from "@/app/components/ProgressPie"
import Loading from "@/app/partials/Loading"
import { useEffect, useState } from "react"
import { Fira_Code } from "next/font/google"
import { onValue, ref } from "firebase/database"
import { db } from "@/app/utils/firebaseClient"

const firacode = Fira_Code({weight: "400"})

export default function Laporan(){
    const [loading, setLoading] = useState(1)
    const [kandidat, setKandidat] = useState([])
    const [totalPemilih, setTotalPemilih] = useState(0)
    const [suara, setSuara] = useState([])
    const [log, setLog] = useState([])

    const suaraKandidat = suara.reduce((acc, item) => {
            acc[item.kandidat_id] = (acc[item.kandidat_id] || 0) + 1
            return acc
        }, {})
    const dataKandidat = !kandidat ? {} : kandidat.map(person => ({...person, suara: suaraKandidat[person.id] || 0}))

    async function loadData() {
        const [dataKandidat, dataPemilih, dataLog] = await Promise.all([
            loadKandidat(), loadTotalPemilih(), loadLog()
        ])

        setKandidat(dataKandidat.data)
        setTotalPemilih(dataPemilih.data)
        setLog(dataLog.data)
        setLoading(0)
    }

    async function loadLog(){
        const req = await fetch("/api/supabase/log?role=User")
        const {data, error} = await req.json()
        return {data, error}
    }

    async function loadTotalPemilih(){
        const req = await fetch("/api/supabase/pemilih?count=1")
        const {count, error} = await req.json()
        return {data: count, error}
    }

    async function loadKandidat(){
        const req = await fetch("/api/supabase/kandidat")
        const {data, error} = await req.json()
        return {data, error}
    }

    useEffect(() => {
        document.title = "Grafik dan Laporan - Sekata"
        
        const suaraRef = ref(db, "Suara")
        const unsub = onValue(suaraRef, async snap => {
            const dataSuara = snap.val()
            const suaraKandidat = Object.keys(dataSuara).map(suara => dataSuara[suara])
            const log = await loadLog()
            setLog(log.data)
            setSuara(suaraKandidat)
        })
        loadData()

        return () => {
            unsub()
        }
    }, [])

    if(loading){
        return (<Loading />)
    }

    return (
        <div className="w-full h-full flex">
            <div className="border-r border-gray-300 flex-1 h-full flex flex-col pt-3">
                <Chart data={dataKandidat} />
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
            <div className=" h-full w-90 max-w-90 flex flex-col">
                <div className="h-100 flex flex-col border-b border-gray-300">
                    <div className="flex-1 min-h-0">
                        <ProgressPie progress={suara.length} total={totalPemilih}  />
                    </div>
                    <div>
                        <div className="flex gap-3 px-3 pb-3 text-sm text-gray-700 items-center">
                            <div className="w-5 h-5 rounded bg-gray-300"></div>
                            <p>Suara Tersisa</p>
                        </div>
                        <div className="flex gap-3 px-3 pb-3 text-sm text-gray-700 items-center">
                            <div className="w-5 h-5 rounded bg-emerald-500"></div>
                            <p>Suara Terkumpul</p>
                        </div>
                    </div>
                </div>
                <div className={`${firacode.className} p-2 text-xs flex flex-col flex-1 min-h-0 min-w-0 overflow-auto`}>
                    {log.map(logData => (
                        <p key={logData.id} className="text-nowrap">[{logData.tanggal} {logData.jam}]: {logData.action} </p>
                    ))}
                </div>
            </div>
        </div>
    )
}