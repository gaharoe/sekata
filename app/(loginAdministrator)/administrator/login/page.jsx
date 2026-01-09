"use client"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import Swal from "sweetalert2"
import {useRouter} from "next/navigation"

export default function AdminLogin(){
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(0)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e){
        e.preventDefault()
        if(!username || !password){
            Swal.fire({
                icon: "error",
                text: "Isi Data Dengan Lengkap!",
                timer: 2500,
                showConfirmButton: false
            })
            return
        }
        
        const req = await fetch("/api/auth/login/admin", {method: "POST", body: JSON.stringify({username, password})})
        if(req.status != 200){
            Swal.fire({
                icon: "error",
                text: "Terjadi Masalah!",
                timer: 2500,
                showConfirmButton: false
            })
            return
        }
        
        const {error} = await req.json()
        if(error) {
            Swal.fire({
                icon: "error",
                text: error,
                timer: 2500,
                showConfirmButton: false
            })
            return
        }

        location.href = "/admin"
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="my-15 text-xl font-bold text-gray-600">Login Administrator</h1>
            <form onSubmit={(e) => handleSubmit(e)} className="w-80 flex flex-col gap-3">
                <div className="relative w-full">
                    <input onChange={(e) => setUsername(e.target.value)} type="text" id="nama" placeholder=" " className="peer w-full rounded-lg border border-gray-300 bg-transparent pt-6 pb-2 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                    <label htmlFor="nama" className=" pointer-events-none absolute left-3 top-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 -translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-1/4 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-1/4 peer-not-placeholder-shown:text-xs">
                        Username atau Email
                    </label>
                </div>
                <div className="relative w-full flex rounded-lg border border-gray-300 focus:border-blue-500">
                    <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} id="password" placeholder=" " className="peer w-full bg-transparent pt-6 pb-2 px-3 text-sm focus:outline-none"/>
                    <label htmlFor="nama" className=" pointer-events-none absolute left-3 top-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 -translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-1/4 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-1/4 peer-not-placeholder-shown:text-xs">
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
                <button className="h-12 rounded-lg text-white w-full bg-sky-500">Login</button>
                <p className="text-center mt-3 text-xs text-gray-600" >Lupa Password? <a className="underline text-blue-600" href="https://wa.me/+6202313380653">Hubungi Operator</a></p>
            </form>
        </div>
    )
}