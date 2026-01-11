"use client"

import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function DeleteLogButton(){

    function deleteLog(){
        Swal.fire({
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "oklch(58.6% 0.253 17.585)",
            confirmButtonText: "Hapus",
            html: `
                <h1>Hapus log?</h1>
                <div class="mb-1 mt-5 w-full text-start">
                    <label for="confirm" class="text-sm">Konfirmasi Password:</label>
                </div>
                <input type="password" id="confirm" class="w-full h-10 px-3 mb-3 outline-none text-sm rounded-sm border border-gray-500" placeholder="Masukkan password akun anda...">
            `,
            preConfirm: async () => {
                const confirmationPassword = document.getElementById("confirm").value
                if(!confirmationPassword){
                    Swal.showValidationMessage("Harap Masukkan Password Anda");
                    return 0
                }

                const req = await fetch("/api/auth/pwd-confirm", {method: "POST", body: JSON.stringify({password: confirmationPassword})})
                const res = await req.json()
                if(!res.error){
                    return 1
                } else {
                    Swal.showValidationMessage(res.error);
                    return 0
                }
            }
        }).then(async result => {
            if(result.value) {
                const req = await fetch("/api/firebase/log/delete")
                const res = await req.json()
                if(res.error){
                    Swal.fire({
                        icon:"error",
                        timer: 2000,
                        text: res.error,
                        showConfirmButton: false
                    })
                } else {
                    Swal.fire({
                        icon:"success",
                        timer: 2000,
                        text: "berhasil",
                        showConfirmButton: false
                    })
                }
            }
        })
    }
    

    return (
        <button onClick={deleteLog} className="flex justify-center items-center rounded-md text-white bg-rose-600 w-9.5 h-9.5">
            <Trash2 width={18}/>
        </button>
    )
}