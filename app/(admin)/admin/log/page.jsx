"use client"

import { Poppins } from "next/font/google"
import { db } from "@/app/utils/firebaseClient"
import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { Download, Search } from "lucide-react"
import ExportLogButton from "@/app/components/ExportLogButton"
import { DeleteLogButton } from "@/app/components/deleteLogButton"
import Loading from "@/app/partials/Loading"

const poppins = Poppins({weight: "400"})

export default function Log(){
    const [searchLog ,setSearchLog] = useState("")
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(1)

    const logDataToDisplay = !searchLog ? logs : logs.filter(log => log.id.toLowerCase().includes(searchLog.toLowerCase()) || log.role.toLowerCase().includes(searchLog.toLowerCase()))

    useEffect(() => {
        const logRef = ref(db, "Log")
        const logUnsub = onValue(logRef, snap => {
            const logData = snap.val()
            const newLogData = !logData? [] : Object.keys(logData).map(logID => ({id: logID, ...logData[logID]}))
            setLogs(newLogData)
            setLoading(0)
        })

        return () => {
            logUnsub( )
        }
    }, [])

    if(loading){
        <Loading />
    }

    return (
        <div className={`w-full h-full flex ${poppins.className} pr-3`}>
            <div className="w-60 h-full"></div>
            <div className="flex flex-col flex-1 h-full min-h-0 min-w-0">
                <div className="h-40 flex items-center">Log Aktivitas</div>
                <div className="h-15 flex items-center justify-between">
                    <div className="flex gap-3">
                        <div className="border border-gray-300 flex text-sm text-gray-600 items-center w-80 px-3 rounded">
                            <input type="text" className="py-2 w-full" onChange={(e) => setSearchLog(e.target.value)} placeholder="Cari ID atau Role..."/>
                            <Search width={18} />
                        </div>
                        <ExportLogButton logs={logs}/>
                    </div>
                    <DeleteLogButton />
                </div>
                <div className="flex-1 min-h-0 border border-gray-200 min-w-0 items-center rounded-xl overflow-hidden bg-white">
                    <table className="relative border-collapse rounded-full text-xs w-full table-fixed" >
                        <thead className="bg-gray-600 text-white">
                            <tr className="h-10">
                                <th className="border-b border-black/10 w-50">ID</th>
                                <th className=" border border-t-0 border-black/10 w-30">Waktu</th>
                                <th className=" border border-t-0 border-black/10 w-20">Role</th>
                                <th className=" border-b border-black/10">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {logDataToDisplay && logDataToDisplay.map(log => (
                            <tr key={log.id} className="h-10">
                                <td className=" px-3 border border-l-0 border-black/10">{log.id}</td>
                                <td className=" text-center border border-black/10">{log.tanggal} {log.jam}</td>
                                <td className=" text-center border border-black/10">{log.role}</td>
                                <td className=" whitespace-nowrap overflow-hidden text-ellipsis px-3 border border-r-0 border-black/10">{log.action}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}