"use client"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import UserLoading from "@/app/components/UserLoading";
import GradualBlur from "@/app/components/GradualBlur";

export default function User() {
  const [userData, setUserData] = useState({})
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
      setUserData(dataUser.data)
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
      <div className="w-full flex gap-3 mt-15">
        <div className="flex flex-wrap justify-center gap-3">
          {kandidat.map(person => (
            <div key={person.id} className="relative w-full sm:w-100 rounded-xl overflow-hidden">
              <img src={person.imageURL} className="object-cover h-130 min-h-full min-w-full" />
              <GradualBlur 
                target="parent"
                exponential={true}
                height="4rem"
              />
              <div className="absolute bottom-2 left-2 flex gap-2 right-2 z-1010">
                <div className="h-8 rounded-xl w-fit bg-black flex px-3 items-center text-sm font-bold text-start text-white">{person.urutan}</div>
                <button className="h-8 rounded-xl flex-1 bg-white flex px-3 items-center text-sm font-bold text-start text-gray-600">
                  {person.nama}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
