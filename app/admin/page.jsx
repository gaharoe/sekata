import { Lexend_Deca, Poppins } from "next/font/google"

const lexend = Lexend_Deca()
const poppins = Poppins({
    weight: "400"
})


export default function Dashboard() {
    return (
        <div className={`${poppins.className} w-full h-full p-3`}>
            <div className="w-full border-b border-b-gray-300 h-50 flex justify-between items-center">
                <h1 className="text-2xl flex gap-3">Pemilihan Ketua OSIS <span className="h-fit px-2 text-sm rounded border">{(new Date().getFullYear())}</span></h1>
                <div className="flex gap-3">
                    <div className="flex flex-col p-2 w-40 h-20 rounded-xl bg-linear-0 from-sky-500 to-blue-50">
                        <p className="text-xs text-sky-900">Kandidat Terdaftar</p>
                        <h1 className="flex-1 text-2xl font-bold text-white flex items-center">4</h1>
                    </div>
                    <div className="flex flex-col p-2 w-40 h-20 rounded-xl bg-linear-0 from-amber-500 to-amber-50">
                        <p className="text-xs text-amber-900">Pemilih</p>
                        <h1 className="flex-1 text-2xl font-bold text-white flex items-center">40</h1>
                    </div>
                    <div className="flex flex-col p-2 w-40 h-20 rounded-xl bg-linear-30 from-emerald-500 to-emerald-100"></div>
                </div>
            </div>
        </div>
    )
}