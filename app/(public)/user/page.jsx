"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import UserLoading from "@/app/components/UserLoading";
import GradualBlur from "@/app/components/GradualBlur";
import { UserIcon } from "lucide-react";
import {Link as ScrollLink, animateScroll as scroll} from "react-scroll"
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function User() {
  const [loading, setLoading] = useState(1)
  const [kandidat, setKandidat] = useState({})
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const router = useRouter()

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
        NIS: user.NIS
      }))
      setLoading(0)      
    }
  }

  function visitVote(){
    if(user.status){
      Swal.fire({
        icon:"error",
        timer: 2500,
        text: "Anda Sudah Memilih",
        showConfirmButton: false
      })
      return
    }
    router.push("/user/vote")
  }

  function kandidatDetail(person){
    Swal.fire({
      html: `
        <div class="mt-20 w-full h-100 flex flex-col gap-2 items-center">
          <p class="text-gray-500 text-sm font-bold">Kandidat ${person.urutan}</p>
          <div class="w-50 h-60 shrink-0 rounded-lg overflow-hidden flex items-center">
            <img src="${person.imageURL}" class="object-cover min-h-full min-w-full" />
          </div>
          <div>
            <p class="text-gray-700 font-bold">${person.nama}</p>
            <p class="text-gray-500 text-sm">${person.kelas}</p>
          </div>
          <div class="mt-10 flex flex-col gap-10">
            <div>
              <h1 class="font-bold text-gray-700 text-sm">VISI</h1>
              <p class="text-xs">${person.visi}</p>
            </div>
            <div>
              <h1 class="font-bold text-gray-700 text-sm">MISI</h1>
              <p class="text-xs">${person.misi}</p>
            </div>
          </div>
        </div>
      `,  
      
    })
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
                <button onClick={() => kandidatDetail(person)} className="h-8 rounded-xl bg-blue-400 flex px-3 items-center font-bold text-start text-white border border-white/40">
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
        <button onClick={visitVote} className=" bottom-5 right-5 px-3 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-200 flex justify-center items-center h-10">Mulai Voting</button>
      </div>
    </div>
  );
}
