import { Poppins } from "next/font/google"
import {School2, User, Vote } from "lucide-react"

const poppins = Poppins({
    weight: ["200", "300", "400"],
    display: "swap",
    style: "normal"
})

export default function CandidateDetail({kandidat}){
    return (
        <>
            <div className={`${poppins.className} text-gray-700 h-full max-h-full min-h-0 overflow-auto p-5 flex gap-5 bg-white`}>
                <div className="h-full w-95 rounded-lg overflow-hidden flex items-center">
                    <img src={kandidat.imageURL} className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col gap-5">
                    <div className="rounded flex flex-col gap-3">
                        <p className="text-4xl font-bold ">{kandidat.nama}</p>
                        <div className="flex gap-10 text-gray-400">
                            <div className="flex gap-2 items-center">
                                <User width={16} />
                                <p className="text-gray-600">Kandidat {kandidat.urutan}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <School2 width={16} />
                                <p className="text-gray-600">{kandidat.kelas}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Vote width={16} />
                                <p className="text-gray-600">{kandidat.suara}</p>
                            </div>
                        </div>
                    </div>
                    <div className={` flex gap-5 flex-1`}>
                        <div className="rounded flex-1 bg-gray-100 p-3">
                            <h1 className="font-bold text-center text-gray-500">Visi</h1>
                            <p className="text-xs text-gray-600 text-justify leading-4.5 mt-3">{kandidat.visi}</p>
                        </div>
                            
                        <div className="rounded flex-1 bg-gray-100 p-3">
                            <h1 className="font-bold text-center text-gray-500">Misi</h1>
                            <p className="text-xs text-gray-600 text-justify leading-4.5 mt-3">{kandidat.misi}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-8 min-h-8 border-t border-t-gray-300 w-full flex justify-between items-center px-3 bg-white text-xs">
                <div className="flex items-center gap-2">
                    <p>Kandidat ke:</p>
                    <div className="flex border border-gray-400 text-gray-700 rounded w-7  h-5 justify-center items-center">{kandidat.urutan}</div>
                </div>
            </div>
        </> 
    )
}