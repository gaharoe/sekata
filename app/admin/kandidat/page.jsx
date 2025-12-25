import { Lexend_Deca } from "next/font/google"

const lexend = Lexend_Deca()

export default function Page(){
    return (
        <div className={`${lexend.className} px-3 w-full h-full`}>
            <h1 className="text-2xl my-5">
                Kandidat Terpilih
            </h1>
        </div>
    )
}