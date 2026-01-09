"use client"

import CircularBarLoader from "@/app/components/CircularBarLoader"
import { Poppins, Jersey_10 } from "next/font/google"
import { useState } from "react"
import {Eye, EyeClosed} from "lucide-react"
import Swal from "sweetalert2"

const poppins = Poppins({
    weight: "400"
})
const jersey = Jersey_10({
    weight: "400"
})

export default function Login(){
    const [loginPressed, setLoginPressed] = useState(0)
    const [NIS, setNIS] = useState(0)
    const [token, setToken] = useState("")
    const [showPassword, setShowPassword] = useState(0)

    const notify = (msg) => {
        Swal.fire({
            icon: "error",
            text: msg,
            timer: 2500,
            showConfirmButton: false,

        })
    }

    async function handleLoginButton(){
        if(!NIS || !token){
            notify("Isi data dengan lengkap!")
            return
        }
        setLoginPressed(1)
        const req = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({role: "user", NIS, token})
        })
        const {data, error} = await req.json()

        if(!error){
            location.href = "/user"
        }
        notify(error)
        setLoginPressed(0)
    }

    return (

        <div className={`${poppins.className} text-sm text-gray-600 flex flex-col pt-15 items-center w-svw h-svh relative overflow-hidden bg-linear-270 from-sky-50 to-violet-100`}>
            <div className="w-80 p-5 flex flex-col gap-3 rounded-2xl shadow-[inset_0_0_100px_0px_white] bg-white z-20 ">
                <h1 className={` font-bold text-2xl text-sky-600 my-5 text-center`}>Login Voter</h1>
                
                <div className="relative w-full">
                    <input onChange={(e) => setNIS(e.target.value)} type="text" id="nomor-induk" placeholder=" " className="peer w-full rounded-lg border border-gray-300 bg-transparent pt-6 pb-2 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                    <label htmlFor="nomor-induk" className=" pointer-events-none absolute left-2 top-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 -translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-1/4 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-1/4 peer-not-placeholder-shown:text-xs">
                        Nomor Induk
                    </label>
                </div>

                <div className="relative w-full flex rounded-lg border border-gray-300 focus:border-blue-500">
                    <input onChange={(e) => setToken(e.target.value)} type={showPassword ? "text" : "password"} id="nama" placeholder=" " className="peer w-full bg-transparent pt-6 pb-2 px-3 text-sm focus:outline-none"/>
                    <label htmlFor="nama" className=" pointer-events-none absolute left-2 top-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 -translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-1/4 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-1/4 peer-not-placeholder-shown:text-xs">
                        Password
                    </label>
                    <button onClick={() => setShowPassword(prev => !prev)} type="button" className="mx-5 cursor-pointer text-gray-500">
                        {showPassword ? (
                            <Eye width={20}/>
                        ): (
                            <EyeClosed width={20}/>
                        )}
                    </button>
                </div>
                <button onClick={handleLoginButton} disabled={loginPressed} className="bg-teal-500 h-12 flex justify-center items-center rounded-lg text-white">
                    {loginPressed ? (
                        <CircularBarLoader />
                    ) : (<p>Login</p>)}
                </button>
            </div>
            <p className="text-xs z-20 my-5">Belum Terdaftar? <span className="text-blue-600 underline">Hubungi Administrator</span></p>
            <div className={`${loginPressed ? "animate-rotate-loop" : ""} absolute w-80 h-full`}>
                <div className={` absolute transition-all z-10 top-1/4 ${loginPressed ? "animate-slideRight-scale" : ""} right-10/25  h-80 w-100 bg-sky-200 blur-3xl`}></div>
                <div className={` absolute transition-all z-10 bottom-1/5 left-1/2 h-60 w-80 ${loginPressed ? "animate-slideLeft-scale" : ""} bg-violet-200 blur-3xl`}></div>
                <div className={` absolute transition-all z-10 top-1.5 left-1/2 h-60 w-80 ${loginPressed ? "animate-slideLeft-scale" : ""} bg-violet-200 blur-3xl`}></div>
            </div>
        </div>
    )
}