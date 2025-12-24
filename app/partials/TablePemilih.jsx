"use client"

import { Zalando_Sans } from "next/font/google"
import {EditButton, DeleteButton} from "../components/EditButton"
import {Copy} from "lucide-react"

const zalando = Zalando_Sans({
    weight: "400"
})

export default function TablePemilih({data, page, refreshTrigger}) {
    const start = (page - 1) * 15
    return (
        <table className={zalando.className+ " text-xs w-full border-collapse min-w-0"}>
            <thead>
                <tr className="h-7 bg-gray-200">
                    <th className="border-b font-normal border-b-gray-300 w-10 min-w-10"></th>
                    <th className="border font-normal border-gray-300 border-t-0 border-l-0 w-10 min-w-10">No</th>
                    <th className="border font-normal border-gray-300 border-t-0 w-20 min-w-20">ID</th>
                    <th className="border font-normal border-gray-300 border-t-0 text-nowrap">Nama Pemilih</th>
                    <th className="border font-normal border-gray-300 border-t-0 w-20 min-w-20">Token</th>
                    <th className="border font-normal border-gray-300 border-t-0 w-30 min-w-30">Status</th>
                    <th className="border font-normal border-gray-300 border-t-0 w-40 min-2-40">Waktu Pemilihan</th>
                </tr>
            </thead>
            <tbody>
            {data.map((d, index) => (
                <tr key={d.id} className="h-7 bg-white">
                    <td className="border-b border-b-gray-300 text-center pl-3">
                        <div className="flex gap-2 hover:scale-120 transition-all">
                            <EditButton data={d} tableName={"Pemilih"} onSuccess={refreshTrigger} />
                            <DeleteButton data={d} tableName={"Pemilih"} onSuccess={refreshTrigger} />
                        </div>
                    </td>
                    <td className="border border-gray-300 border-l-0 text-center">{start+index+1}</td>
                    <td className="border border-gray-300 text-center">{d.id}</td>
                    <td className="border border-gray-300 px-2 text-nowrap">{d.nama}</td>
                    <td className="border border-gray-300 text-center">{d.token}</td>
                    <td className="border border-gray-300 text-center pl-2 text-nowrap">{d.status ? <div className="text-white bg-teal-500 rounded-full px-1">Sudah Memilih</div> : <div className="text-gray-600 bg-gray-200 rounded-full w-fit px-2">Belum Memilih</div>}</td>
                    <td className="border border-gray-300 text-center">{d['waktu pemilihan']}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}