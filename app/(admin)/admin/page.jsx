"use client"

import { Lexend_Deca, Poppins } from "next/font/google"
import Chart from "../../components/Chart"
import { useEffect, useState } from "react"
import Loading from "@/app/partials/Loading"
import GradualBlur from "@/app/components/GradualBlur"
import { User, Users, Vote, ArrowUpRightFromSquare } from "lucide-react"

const lexend = Lexend_Deca()
const poppins = Poppins({
    weight: "400"
})


export default function Dashboard() {

    const [loading, setLoading] = useState(1)
    const [kandidat, setKandidat] = useState({})
    const [totalPemilih, setTotalPemilih] = useState(0)

    const totalKandidat = kandidat ? kandidat.length : 0

    async function loadData(){
        setLoading(1)
        const [dataKandidat, dataPemilih] = await Promise.all([
            fetch("/api/supabase/kandidat").then(d => d.json()),
            fetch("/api/supabase/pemilih?count=1").then(d => d.json())
        ])
        setKandidat(dataKandidat.data)
        setTotalPemilih(dataPemilih.count)
        setLoading(0)
    }

    useEffect(() => {
        loadData()
    }, [])

    if(loading){
        return (<Loading />)
    }

    return (
        <div className={`${poppins.className} flex w-full h-full`}>
            <div className="w-180 border-b border-b-gray-300 h-full flex flex-col items-center">

                <h1 className="text-3xl flex gap-3 w-full border-b border-b-gray-300 justify-center items-center py-5">Pemilihan Ketua OSIS <span className="h-fit px-2 text-sm rounded border">{(new Date().getFullYear())}</span></h1>

                <div className="flex border-b border-b-gray-300 w-full h-40">
                    <div className="flex flex-col p-2 flex-1 h-full">
                        <h1 className="flex-1 text-5xl font-bold flex justify-center items-center">{totalKandidat}</h1>
                        <div className="flex justify-between items-center text-xs text-sky-900">
                            <div className="flex gap-2 items-center">
                                <User width={18} />
                                <p className="h-fit">Kandidat Terdaftar</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col p-2 flex-1 h-full border-gray-300 border-x">
                        <h1 className="flex-1 text-5xl font-bold flex justify-center items-center">{totalPemilih}</h1>
                        <div className="flex justify-between items-center text-xs text-amber-900">
                            <div className="flex gap-2 items-center">
                                <Users width={18} />
                                <p className="h-fit">Pemilih Terdaftar</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col py-2 px-3 flex-1 h-full">
                        <h1 className="flex-1 text-5xl font-bold flex justify-center items-center">0</h1>
                        <div className="flex justify-between items-center text-xs text-emerald-900">
                            <div className="flex gap-2 items-center">
                                <Vote width={18} />
                                <p className="h-fit">Total Suara Terkumpul</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full flex flex-col items-center ">
                    {/* <p className="my-3 text-gray-600 text-center px-3 rounded-full border border-gray-400 w-fit text-xs">Kandidat Terdaftar</p> */}
                    <div className="flex-1 w-full flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:h-0 rounded-lg">
                        {kandidat.map(data => (
                            <div key={data.id} className="relative w-60 rounded-lg overflow-hidden shrink-0">
                                <img src={data.imageURL} className="absolute min-h-full object-cover"/>
                                <div className="absolute bottom-3 left-3 text-xs text-white w-7 h-7 rounded-full flex justify-center items-center border font-bold z-1010">{data.urutan}</div>
                                <GradualBlur
                                    target="parent"
                                    position="bottom"
                                    height="6rem"
                                    strength={2}
                                    divCount={4}
                                    curve="ease-in"
                                    exponential={false}
                                    opacity={1}
                                />
                            </div>
                        ))}
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