"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import UserLoading from "@/app/components/UserLoading"
import { setUser } from "@/store/userSlice"
import Swal from "sweetalert2"
import { logger } from "@/app/utils/logger"

export default function Vote() {
    const [loading, setLoading] = useState(1)
    const [kandidat, setKandidat] = useState({})
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)


    async function loadData() {
        const [dataUser, dataKandidat] = await Promise.all([
            fetch("/api/user/me").then(d => d.json()),
            fetch("/api/supabase/kandidat").then(d => d.json())
        ])
        const kandidat = dataKandidat.data
        setKandidat(kandidat)
        const user = dataUser.data
        dispatch(setUser({
            nama: user.nama,
            kelas: user.group,
            status: user.status,
        }))
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
                const req = await fetch("/api/user/vote", {
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
                    })
                }
            }
        })
    }

    useEffect(() => {
        if (!user.nama) {
            loadData()
        } else {
            setLoading(0)
        }
    }, [])

    if(loading) {return (<UserLoading />)}

    return (
        <div className="py-15 w-full px-3 flex flex-wrap justify-center gap-40">
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