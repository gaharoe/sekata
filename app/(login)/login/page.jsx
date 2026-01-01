"use client"

export default function Login(){
    return (
        <div className="flex justify-center items-center w-svw h-svh relative overflow-hidden">
            <div className="w-80 h-100 rounded-lg shadow-[inset_0_0_100px_0px_white] bg-[rgba(255,255,255,.4)] z-20 backdrop-blur-2xl"></div>
            <div className="absolute z-10 bottom-1/2 right-1/2 h-50 w-80 bg-sky-300 blur-3xl"></div>
            <div className="absolute z-10 bottom-0 left-1/2 h-70 w-80 bg-violet-200 blur-3xl"></div>
        </div>
    )
}