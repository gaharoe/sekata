"use client"

import { useSelector } from "react-redux"
import GradualBlur from "./GradualBlur"
import { Poppins } from "next/font/google"
import { User, LucideChevronRight, Check, X, LogOut, EllipsisVertical} from "lucide-react"
import { useState } from "react"

const poppins = Poppins({
    weight: "400"
})

export default function Navbar(){
    const user = useSelector(state => state.user)
    const [slide, setSlide] = useState(0)

    async function handleLogout(){
        const req = await fetch("/api/auth/logout")
        const {success} = await req.json()
        if(success){
            location.href = "/login"
        }
    }

    return (
        <>
        <GradualBlur 
            target="page"
            position="top"
            height="6rem"
            exponential={true}
            zIndex="10"
        />
        <nav className={`${poppins.className} fixed top-0 left-0 right-0 h-fit flex items-center gap-3 p-3 z-1011 bg-linear-0 from-transparent to-white pb-15`}>
            <button onClick={()=>setSlide(1)} className="cursor-pointer w-10 h-10 transition-all hover:bg-black/20 rounded-full border border-black/10 text-gray-400 flex justify-center items-center">
                <EllipsisVertical width={18} />
            </button>
            <div>
                <button onClick={() => setSlide(1)} className={`cursor-pointer select-none flex items-center gap-2 text-lg font-bold text-gray-600`}>
                    Peserta Voting
                    <LucideChevronRight width={16} />
                </button>
                {/* <p className={`text-xs rounded-full px-2 ${user.status ? "bg-teal-500" : "bg-gray-400"} w-fit text-white`}>{user.status ? "sudah memilih" : "belum memilih"}</p> */}
            </div>
        </nav>
        <section className={`${!slide && "hidden"} ${poppins.className} flex flex-col gap-3 z-2012 p-3 fixed top-15 left-3 w-70 backdrop-blur-lg border rounded-xl border-black/10 bg-white/50`}>
            <div className="flex justify-between pb-3 border-b border-gray-200">
                <div className="flex gap-3">
                    <div className={`${user.status ? "border-teal-500 text-teal-500" : " border-black/20 text-black/20"} relative rounded-full w-10 h-10 flex justify-center items-center border-2`}>
                        <User />
                        <div className={`${!user.status && "hidden"} absolute w-4 h-4 outline-3 -top-1 -right-1 outline-white rounded-full bg-teal-500 flex justify-center items-center text-white`}>
                            <Check width={10}/>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold text-gray-600">{user.nama}</p>
                        <p className="text-xs text-gray-500">{user.kelas}</p>
                    </div>
                </div>
                <div>
                    <button onClick={() => setSlide(0)} className="text-gray-500 cursor-pointer">
                        <X width={18}/>
                    </button>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full h-10 rounded-md bg-rose-600 hover:bg-rose-700 transition-all text-white text-sm flex gap-3 justify-center items-center">
                <LogOut width={18}/>
                Logout
            </button>
        </section>
        </>
    )
}