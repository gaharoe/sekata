"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import UserLoading from "@/app/components/UserLoading"
import { setUser } from "@/store/userSlice"
import Swal from "sweetalert2"
import { logger } from "@/app/utils/logger"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Vote() {
    const [loading, setLoading] = useState(1)
    const [kandidat, setKandidat] = useState({})
    const dispatch = useDispatch()
    const router = useRouter()
    
    const user = useSelector(state => state.user)
    console.log(user);

    async function loadUserData(){
        const req = await fetch("/api/user/me")
        const {data, error} = await req.json()
        if(!error){
            dispatch(setUser({
                nama: data.nama,
                kelas: data.group,
                status: data.status,
                NIS: data.NIS
            }))
        }
    }
    
    async function loadKandidat(){
        const req = await fetch("/api/supabase/kandidat")
        const {data, error} = await req.json()
        if(!error){
            setKandidat(data)
        }
    }
    

    async function loadData() {
        await loadUserData()
        await loadKandidat()
        setLoading(0)
    }

    function handleVote(kandidat){
        Swal.fire({
            html: `
                <div class="flex flex-col w-full items-center gap-3">
                    <div class="w-40 h-50 rounded-lg overflow-hidden">
                        <img src="${kandidat.imageURL}" class="object-cover min-h-full min-w-full" />
                    </div>
                    <p class="w-fit">Pilih Kandidat ${kandidat.urutan}?</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "oklch(68.5% 0.169 237.323)",
            confirmButtonText: "Pilih",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if(result.isConfirmed){
                const req = await fetch("/api/firebase/vote", {
                    method: "POST",
                    body: JSON.stringify({id: kandidat.id})
                })
                const {error} = await req.json()
                if(!error){
                    logger(`peserta ${user.NIS} telah memilih`, 'User')
                    Swal.fire({
                        icon: "success",
                        timer: 2500,
                        title: "Behasil",
                        text: "Terimakasih telah memilih"
                    }).then(() => router.push("/user"))
                }
            }
        })
    }

    useEffect(() => {
        loadData()
    }, [])

    if(loading) {return (<UserLoading />)}

    return (
        <div className="py-15 w-full px-3 flex flex-wrap justify-center gap-40">
            <Link href={"/user"} className={"bg-gray-900 rounded-full border border-white/40 px-4 py-2 fixed text-white bottom-3 left-3 flex items-center gap-2"}>
                <ArrowLeft width={18} />
                Kembali
            </Link>
            {kandidat.map(person => (
                <div key={person.id} className="flex gap-3 w-50 items-center flex-col">
                    <div className="w-50 h-60 rounded-xl overflow-hidden">
                        <img src={person.imageURL} className="object-cover min-h-full min-w-full" />
                    </div>
                    <div className="flex items-center  flex-col">
                        <p className="text-xs text-gray-500">Kandidat {person.urutan}</p>
                        <p className="text-gray-700 font-bold text-center">{person.nama}</p>
                    </div>
                    {user.status ? (
                        <button className="w-full rounded-full text-white py-1 bg-gray-300" disabled={true}>Pilih</button>
                    ) : (
                        <button onClick={() => handleVote(person)} className="w-full rounded-full text-white py-1 bg-sky-500">Pilih</button>
                    )}
                </div>
            ))}
        </div>
    )
}