"use client"

export default function Landing(){
    return (
        <div className="w-svw h-svh flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-sky-500 text-white rounded-full flex items-center justify-center text-3xl">se</div>
            <p className="mt-1 text-xl font-bold text-gray-500">Sekata</p>
            <p className="text-sm text-gray-500 mb-10">Satu Kata, Satu Tujuan!</p>
            <p className="mb-5 text-xs text-gray-600 w-60 text-center">Gunakan hak pilihmu dengan bijak dan bertanggung jawab. Setiap suara yang kamu berikan ikut menentukan arah kepemimpinan sekolah ke depan.</p>
            <div className="flex gap-2">
                <a href="/login" className="text-sm py-2 px-5 border border-sky-600 rounded-full text-sky-700">Masuk</a>
            </div>
        </div>
    )
}