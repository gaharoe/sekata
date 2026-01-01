"use client"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function User() {
  const [userData, setUserData] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    async function getUserData(){
      const req = await fetch("/api/user/me")
      const {data} = await req.json()
      setUserData(data)
      dispatch(setUser({
        nama: data.nama,
        kelas: data.kelas,
        status: data.status,
      }))
    }


    getUserData()
  }, [])

  return (
    <div className="w-full">
      {userData.nama}
    </div>
  );
}
