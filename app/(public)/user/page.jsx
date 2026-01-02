"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import UserLoading from "@/app/components/UserLoading";
import GradualBlur from "@/app/components/GradualBlur";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import {Link as ScrollLink, animateScroll as scroll} from "react-scroll"


export default function User() {
  const [loading, setLoading] = useState(1)
  const [kandidat, setKandidat] = useState({})
  const dispatch = useDispatch()

  async function loadData(){
    const [dataUser, dataKandidat] = await Promise.all([
      fetch("/api/user/me").then(d => d.json()),
      fetch("/api/supabase/kandidat").then(d => d.json())
    ])
    if(!dataUser.error && !dataKandidat.error){
      const user = dataUser.data
      const kandidat = dataKandidat.data
      setKandidat(kandidat)
      dispatch(setUser({
        nama: user.nama,
        kelas: user.group,
        status: user.status,
      }))
      setLoading(0)      
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if(loading) {
    return (
      <UserLoading />
    )
  }

  return (
    <div className="px-3 w-full">
      <div className="pb-15 flex flex-col items-center gap-2 justify-center h-svh">
        <p className="font-extrabold text-black/70">Tentukan Kandidat Terbaik</p>
        <p className="text-xs text-black/50 w-40 text-center">Lihat Visi dan Misi Kandidat untuk mempertimbangkan pilihan anda</p>
        <ScrollLink to={"kandidat"} smooth={true} duration={500} className=" bottom-5 right-5 px-3 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-200 flex justify-center items-center h-10">Lihat Kandidat</ScrollLink>
      </div>
      <div id="kandidat" className="pt-30 w-full flex justify-center items-center font-bold text-xl text-black/50 border-b border-black/10 pb-5">Kandidat Ketua OSIS</div>
      <div className="w-full flex gap-3 py-15 border-b border-black/10">
        <div className="flex flex-wrap justify-center gap-20">
          {kandidat.map(person => (
            <div key={person.id} className="peer relative w-50 rounded-2xl overflow-hidden">
              <img src={person.imageURL} className="transition-all hover:scale-120 object-cover h-60 min-h-full min-w-full" />
              <GradualBlur 
                target="parent"
                exponential={true}
                height="4rem"
              />
              <div className="absolute text-xs bottom-2 left-2 flex gap-2 right-2 z-1010">
                <div className="h-8 rounded-xl flex-1 bg-white flex px-2 gap-1 border border-black/40 items-center font-bold text-start text-gray-600">
                  <UserIcon width={14} />
                  Kandidat {person.urutan}
                </div>
                <button className="h-8 rounded-xl bg-blue-400 flex px-3 items-center font-bold text-start text-white border border-white/40">
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-15 flex flex-col items-center gap-2 justify-center h-svh">
        <p className="font-extrabold text-black/70">Pilih Kandidat Terbaik</p>
        <p className="text-xs text-black/50 w-1/2 text-center">Mulai Voting Untuk Memilih Kandidat Terbaikmu</p>
        <Link href={"/user/vote"} className=" bottom-5 right-5 px-3 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-200 flex justify-center items-center h-10">Mulai Voting</Link>
      </div>
    </div>
  );
}
