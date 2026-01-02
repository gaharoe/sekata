"use client"

import CircularBarLoader from "@/app/components/CircularBarLoader"
import { Poppins, Jersey_10 } from "next/font/google"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/userSlice"

const poppins = Poppins({
    weight: "400"
})
const jersey = Jersey_10({
    weight: "400"
})

export default function Login(){
    const [loginPressed, setLoginPressed] = useState(0)
    const [showPwd, setShowPwd] = useState(0)
    const [NIS, setNIS] = useState(0)
    const [token, setToken] = useState("")
    const dispatch = useDispatch()

    const notify = (msg) => {
        toast.error(msg, {
            position: "top-right",
            closeOnClick: true,
            autoClose: 3000,
            pauseOnHover: true,
            
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

        <div className={`${poppins.className} text-sm text-gray-600 flex justify-center items-center w-svw h-svh relative overflow-hidden bg-linear-270 from-sky-50 to-violet-100`}>
            <ToastContainer />
            <div className="w-80 p-5 flex flex-col gap-3 rounded-lg shadow-[inset_0_0_100px_0px_white] bg-[rgba(255,255,255,.4)] z-20 backdrop-blur-2xl">
                <h1 className={`${jersey.className} text-4xl text-sky-600 my-2 text-center`}>LOGIN VOTER</h1>
                <div>
                    <label htmlFor="induk">Nomor Induk:</label>
                    <input onChange={(e) => setNIS(e.target.value)} type="number" id="induk" className="px-2 h-10 flex justify-center items-center rounded-lg border bg-white border-gray-200 w-full" />
                </div>
                <div>
                    <label htmlFor="token">Token:</label>
                    <input onChange={(e) => setToken(e.target.value)} type={showPwd ? "text" : "password"} id="token" className="px-2 h-10 flex justify-center items-center rounded-lg border bg-white border-gray-200 w-full" />
                    <div className="flex gap-2 text-xs items-center mt-1 ml-1">
                        <input onChange={() => setShowPwd(prev => !prev)} type="checkbox" id="showpwd" />
                        <label htmlFor="showpwd">Show</label>
                    </div>
                </div>
                <button onClick={handleLoginButton} disabled={loginPressed} className="bg-teal-500 h-10 flex justify-center items-center rounded-lg text-white">
                    {loginPressed ? (
                        <CircularBarLoader />
                    ) : (<p>Login</p>)}
                </button>
            </div>
            <div className={`${loginPressed ? "animate-rotate-loop" : ""} absolute w-80 h-full`}>
                <div className={` absolute transition-all z-10 top-1/4 ${loginPressed ? "animate-slideRight-scale" : ""} right-10/25  h-80 w-100 bg-sky-200 blur-3xl`}></div>
                <div className={` absolute transition-all z-10 bottom-1/5 left-1/2 h-60 w-80 ${loginPressed ? "animate-slideLeft-scale" : ""} bg-violet-200 blur-3xl`}></div>
                <div className={` absolute transition-all z-10 top-1.5 left-1/2 h-60 w-80 ${loginPressed ? "animate-slideLeft-scale" : ""} bg-violet-200 blur-3xl`}></div>
            </div>
        </div>
    )
}