import { Poppins } from "next/font/google"

const poppins = Poppins({
    display: "swap",
    weight: ["200", "300", "400"]
})

export default function PageError({Action}) {
    return (
        <div className={`${poppins.className} w-full h-full flex justify-center items-center`}>
            <div className="w-fit h-fit flex flex-col text-sm gap-1">
                <p>Maaf Terjadi Kesalahan</p>
                <button onClick={Action} className="rounded-full bg-sky-500 px-3 py-1 text-white">Muat Ulang Halaman</button>
            </div>
        </div>
    )
}