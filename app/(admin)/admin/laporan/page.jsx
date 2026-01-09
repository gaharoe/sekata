"use client"

import Chart from "@/app/components/Chart"
import ProgressPie from "@/app/components/ProgressPie"
import Loading from "@/app/partials/Loading"
import { useEffect, useRef, useState } from "react"
import { Fira_Code } from "next/font/google"
import { onValue, ref } from "firebase/database"
import { db } from "@/app/utils/firebaseClient"
import { Fullscreen } from "lucide-react"

const firacode = Fira_Code({weight: "400"})

export default function Laporan(){
    const [loading, setLoading] = useState(1)
    const [kandidat, setKandidat] = useState([])
    const [totalPemilih, setTotalPemilih] = useState(0)
    const [suara, setSuara] = useState([])
    const [log, setLog] = useState([])

    const boxRef = useRef(null)
    const suaraKandidat = suara.length > 0 ? suara.reduce((acc, item) => {
        acc[item.kandidat_id] = (acc[item.kandidat_id] || 0) + 1
        return acc
    }, {}) : []

    const dataKandidat = !kandidat ? {} : kandidat.map(person => ({...person, suara: suaraKandidat[person.id] || 0}))

    function toggleFullscreen(){
        const fullscreenElement = boxRef.current
        if(!fullscreenElement){return}
        if(!document.fullscreenElement){
            fullscreenElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    async function loadData() {
        const [dataKandidat, dataPemilih] = await Promise.all([
            loadKandidat(), loadTotalPemilih()
        ])

        setKandidat(dataKandidat.data)
        setTotalPemilih(dataPemilih.data)
        setLoading(0)
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
        const logRef = ref(db, "Log")

        const unsubSuara = onValue(suaraRef, async snap => {
            const dataSuara = snap.val()
            const newDataSuara = !dataSuara ? {} : Object.keys(dataSuara).map(id => ({id, ...dataSuara[id]}))
            setSuara(newDataSuara)
        })
        const unsubLog = onValue(logRef, snap => {
            const dataLog = snap.val()
            const newDataLog = !dataLog ? {} : Object.keys(dataLog).map(id => ({id, ...dataLog[id]})).filter(data => data.role == "User")
            console.log(dataLog)
            setLog(newDataLog)
        })

        loadData()

        return () => {
            unsubSuara()
            unsubLog()
        }
    }, [])

    if(loading){
        return (<Loading />)
    }

    return (
        <div ref={boxRef} className="w-full h-full flex bg-white relative">

            <button onClick={toggleFullscreen} className="absolute top-5 right-5 transition-all w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center bg-white opacity-100 text-gray-400 z-1000">
                <Fullscreen width={20} />
            </button>

            <div className="border-r border-gray-300 flex-1 h-full flex flex-col pt-3">
                {kandidat.length > 0 ? (
                    <Chart data={dataKandidat} />

                ): (
                    <div className="w-full h-full flex justify-center items-center">Daftarkan Kandidat untuk memulai voting</div>
                )}
                <div className="flex pl-7.5 justify-center items-center w-full h-50 border-t border-gray-300">
                    {kandidat.length > 0 ? kandidat.map(person => (
                        <div key={person.id} className="flex-1 flex justify-center items-center">
                            <div className="w-20 h-25 overflow-hidden rounded-lg">
                                <img src={person.imageURL} className="object-cover min-h-full" />
                            </div>
                        </div>
                    )): (
                        <p className="text-xs text-gray-800 italic">Tidak ada kandidat terdaftar</p>
                    )}
                </div>
            </div>
            <div className=" h-full w-90 max-w-90 flex flex-col">
                <div className="h-100 flex flex-col border-b border-gray-300">
                    <div className="flex-1 min-h-0">
                        {totalPemilih ? (
                            <ProgressPie progress={suara.length} total={totalPemilih}  />
                        ) : (
                            <div className="h-full flex justify-center items-center text-gray-800 text-xs italic">Tidak ada pemilih terdaftar</div>
                        )}
                    </div>
                    <div>
                        <div className="flex gap-3 px-3 pb-1 text-sm text-gray-700 items-center">
                            <div className="w-4 h-4 rounded bg-gray-300"></div>
                            <p>Suara Tersisa</p>
                        </div>
                        <div className="flex gap-3 px-3 pb-3 text-sm text-gray-700 items-center">
                            <div className="w-4 h-4 rounded bg-emerald-500"></div>
                            <p>Suara Terkumpul</p>
                        </div>
                    </div>
                </div>
                <div className={`${firacode.className} p-2 text-xs flex flex-col flex-1 min-h-0 min-w-0 overflow-auto`}>
                    {log.length > 0 ? log.map(logData => (
                        <p key={logData.id} className="text-nowrap">[{logData.tanggal} {logData.jam}]: {logData.action} </p>
                    )): (
                        <div className="w-full h-full flex justify-center items-center-safe text-gray-800 text-xs italic">Tidak ada aktivitas voting</div>
                    )}
                </div>
            </div>
        </div>
    )
}