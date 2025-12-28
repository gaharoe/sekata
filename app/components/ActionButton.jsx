"use client"

import { Edit, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import { Zalando_Sans } from "next/font/google";

const zalando = Zalando_Sans({
    weight: "400"
})

export function EditButton({data, tableName, onSuccess}) {

    function editDataPemilih() {
        if(data.status){
            Swal.fire({
                icon: "error",
                title: "Edit Tidak Dapat Dilakukan",
                text: `${data.nama} telah melakukan pemilihan`,
                timer: 3000,
                showConfirmButton: false
            })
            return
        }

        Swal.fire({
            text: "Edit Data Pemilih",
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: "oklch(68.5% 0.169 237.323)",
            html: `
                <h1 class="${zalando.className}">Edit Data Pemilih</h1>
                <div class="mb-1 w-full text-start">
                    <label for="nama" class="text-sm">Nama:</label>
                </div>
                <input type="text" id="nama" class="w-full h-10 px-3 mb-3 outline-none text-sm rounded-sm border border-gray-500" value="${data.nama}">
                
                <div class="mb-1 w-full text-start">
                    <label for="token" class="text-sm">Token:</label>
                </div>
                <div class="w-full h-10 pl-3 mb-3 rounded-sm border text-sm gap-2 border-gray-500 flex justify-center items-center">
                    <input readonly type="number" id="token" class="flex-1 outline-none" value="${data.token}">
                    <button id="regenerate-token" class="hover:bg-teal-200 cursor-pointer px-3 h-full border-l border-l-gray-500 font-semibold text-teal-700 bg-teal-100">Perbarui Token</button>
                </div>
            `,
            didOpen: () => {
                const tokenInput = document.getElementById("token")
                const regenButton = document.getElementById("regenerate-token")
                regenButton.addEventListener("click", () => {
                    tokenInput.value = Math.floor(100000 + Math.random() * 900000)
                })
            },
            preConfirm: () => {
                const nama = document.getElementById('nama').value;
                const token = document.getElementById("token").value;
                if (nama == data.nama && token == data.token) {
                    Swal.showValidationMessage('Tidak ada perubahan!');
                    return false;
                }
                return {NIS: data.NIS, nama, token};
            }
        }).then(async result => {
            if (result.isConfirmed) {
                const newData = result.value;
                const formData = new FormData();
                formData.append("NIS", newData.NIS)
                formData.append("nama", newData.nama);
                formData.append("token", newData.token);
                formData.append("table", tableName);

                const request = await fetch("/api/supabase/pemilih/edit", {
                    method: "POST",
                    body: formData
                });

                const {error} = await request.json();
                if(error) {
                    Swal.fire({text: "gagal"});
                    return;
                }
                Swal.fire({
                    icon: "success",
                    text: "Perubahan disimpan",
                    timer: 2500,
                    showConfirmButton: false
                })
                onSuccess()
            }
        });
    }

    return (
        <button onClick={editDataPemilih} className="w-5 h-5 text-amber-500 cursor-pointer  flex justify-center items-center ">
            <Edit width={15} />
        </button>
    )
}

export function DeleteButton({data, tableName, onSuccess}) {
    function deleteDataPemilih(){
        Swal.fire(data.status ? {
            icon: "error",
            title: "Hapus Tidak Dapat Dilakukan",
            text: `${data.nama} telah melakukan pemilihan`,
            timer: 3000,
            showConfirmButton: false
        } : {
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "oklch(58.6% 0.253 17.585)",
            confirmButtonText: "Hapus",
            html: `
                <h1 class="${zalando.className}">Hapus data atas nama <b>${data.nama}?</b></h1>
                <div class="mb-1 mt-5 w-full text-start">
                    <label for="confirm" class="text-sm">Konfirmasi Password:</label>
                </div>
                <input type="password" id="confirm" class="w-full h-10 px-3 mb-3 outline-none text-sm rounded-sm border border-gray-500" placeholder="Masukkan password akun anda...">
            `,
            preConfirm: async () => {
                const confirmationPassword = document.getElementById("confirm").value
                if(confirmationPassword == "asdf"){
                    return 1
                } else {
                    Swal.showValidationMessage('Password Salah');
                    return 0
                }
            }
        }).then(async result => {
            if(result.value) {
                const formData = new FormData()
                formData.append("NIS", data.NIS)
                formData.append("table", tableName)
                const req = await fetch("/api/supabase/pemilih/delete", {
                    method: "POST",
                    body: formData
                })
                const {error} = await req.json()
                if(error){
                    Swal.fire({
                        icon: "error",
                        text: "Hapus Data Gagal",
                        timer: 2500,
                        showConfirmButton: false
                    })
                    return
                }
                Swal.fire({
                    icon: "success",
                    text: "Hapus Data Berhasil",
                    timer: 2500,
                    showConfirmButton: false
                })
                onSuccess()
            }
        })
    }

    return (
        <button onClick={deleteDataPemilih} className="w-5 h-5 text-rose-600 cursor-pointer  flex justify-center items-center ">
            <Trash2 width={15} />
        </button>
    )
}