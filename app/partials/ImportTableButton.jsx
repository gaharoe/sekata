"use client"

import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import { Zalando_Sans } from "next/font/google";

const zalando = Zalando_Sans({
    weight: "400"
})

export default function ImportTableButton({onSuccess, tableExist}){
    function uploadTable() {
        Swal.fire({
            html: `
                <h1 class="${zalando.className}">Import Data Pemilih</h1>
                <div class="mb-1 w-full text-start">
                    <label for="table-name" class="text-sm">Nama Tabel</label>
                </div>
                <input type="text" id="table-name" class="w-full h-10 px-3 mb-3 outline-none text-sm rounded-sm border border-gray-500" placeholder="Contoh: X MIPA 1, X TKJ 3, Guru, MPK...">
                <div class="mb-1 w-full text-start">
                    <p class="text-sm">Upload File</p>
                </div>
                <label for="file-import" class="w-full h-30 rounded-sm  hover:bg-slate-100 border border-gray-500 border-dashed flex items-center justify-center text-sm text-gray-500 ">
                    <input type="file" id="file-import" class="hidden" accept=".csv,.xlsx">
                    <p id="file-name">+ Pilih file CSV/XLSX</p>
                </label>  
            `,
            showCancelButton: true,
            confirmButtonText: 'Upload',
            confirmButtonColor: "oklch(70.4% 0.14 182.503)",
            didOpen: () => {
                const file = document.getElementById('file-import');
                file.addEventListener("change", () => {
                    document.getElementById("file-name").innerText = file.files[0]?.name || "Upload File";
                });
            },
            preConfirm: () => {
                const file = document.getElementById('file-import').files[0];
                const tableName = document.getElementById("table-name").value;
                if (!file || !tableName) {
                    Swal.showValidationMessage('Isi data dengan lengkap');
                    return false;
                }
                if(tableExist.includes(tableName)){
                    Swal.showValidationMessage('Tabel Sudah Tersedia');
                    return false;
                }
                return {file, tableName};
            }
        }).then(async result => {
            if (result.isConfirmed) {
                const data = result.value;
                const formData = new FormData();
                formData.append("tableName", data.tableName);
                formData.append("sheets", data.file);

                const request = await fetch("/api/supabase/pemilih/import", {
                    method: "POST",
                    body: formData
                });

                const {error} = await request.json();
                if(error) {
                    const errorMessage = 
                        error == 1 ? "Terjadi Masalah!" : error
                    Swal.fire({
                        icon: "error",
                        text: errorMessage,
                        timer: 2500,
                        showConfirmButton: false
                    });
                    return;
                }
                onSuccess()
            }
        });
    }

    return (
        <button onClick={uploadTable} className=" w-full h-7 rounded-sm hover:bg-gray-100 border border-gray-500 text-gray-800 text-xs flex gap-2 items-center pl-3">
            <Plus width={13} />
            Import CSV/XLSX
        </button>
    )
}