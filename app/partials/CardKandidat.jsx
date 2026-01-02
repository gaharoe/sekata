import { Edit, Trash2, Eye} from "lucide-react"
import { Zalando_Sans } from "next/font/google";
import Swal from "sweetalert2"
import { logger } from "../utils/logger";

const zalando = Zalando_Sans()

export default function CardKandidat ({kandidat, onSuccess, onView}) {
    function editKandidat() {
        let file = null
        Swal.fire({
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: "oklch(68.5% 0.169 237.323)",
            html: `
                <h1 class="${zalando.className} mb-5">Edit Data Kandidat</h1>
                
                <div class="flex gap-5 mb-5">
                    <div class="flex flex-col gap-2">
                        <img id="foto-kandidat" src="${kandidat.imageURL}" class="object-cover w-30 h-35 rounded"/>
                        <label for="input-foto" class="flex justify-center items-center text-xs hover:bg-sky-600 text-white bg-sky-500 h-7 rounded ">
                            <input hidden type="file" name="foto" id="input-foto" />
                            <p id="label-input-foto">Pilih foto kandidat</p>
                        </label>
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="relative w-full">
                            <input type="text" id="nama" value="${kandidat.nama}" placeholder=" " class="peer w-full rounded-lg border border-gray-300 bg-transparent h-10 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                            <label for="nama" class=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">
                                Nama Lengkap
                            </label>
                        </div>
                        <div class="relative w-full">
                            <input type="number" id="urutan" value="${kandidat.urutan}" placeholder=" " class="peer w-full rounded-lg border border-gray-300 bg-transparent h-10 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                            <label for="urutan" class=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">
                                Kandidat ke
                            </label>
                        </div>
                        <div class="relative w-full">
                            <input type="text" id="kelas" value="${kandidat.kelas}" placeholder=" " class="peer w-full rounded-lg border border-gray-300 bg-transparent h-10 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                            <label for="kelas" class=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">
                                Kelas
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="relative w-full mb-5">
                    <textarea name="visi" id="visi" class="pt-2 peer w-full rounded-lg border border-gray-300 bg-transparent h-20 px-3 text-sm focus:border-blue-500 focus:outline-none">${kandidat.visi}</textarea>
                    <label for="visi" class=" pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:text-blue-500">
                        Visi
                    </label>
                </div>

                <div class="relative w-full">
                    <textarea name="misi" id="misi" class="pt-2 peer w-full rounded-lg border border-gray-300 bg-transparent h-20 px-3 text-sm focus:border-blue-500 focus:outline-none">${kandidat.misi}</textarea>
                    <label for="misi" class=" pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:text-blue-500">
                        Misi
                    </label>
                </div>
            `,
            didOpen: () => {
                const inputFoto = document.getElementById("input-foto")
                const img = document.getElementById("foto-kandidat")
                inputFoto.addEventListener("change", (e) => {
                    file = inputFoto.files[0]
                    if(!file) return
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        img.src = e.target.result
                    }
                    reader.readAsDataURL(file)
                })
            },
            preConfirm: () => {
                const urutan = document.getElementById('urutan').value;
                const nama = document.getElementById('nama').value;
                const kelas = document.getElementById("kelas").value;
                const visi = document.getElementById("visi").value;
                const misi = document.getElementById("misi").value;
                if (
                    nama == kandidat.nama && 
                    kelas == kandidat.kelas && 
                    visi == kandidat.visi && 
                    misi == kandidat.misi &&
                    urutan == kandidat.urutan && !file
                ) {
                    Swal.showValidationMessage('Tidak ada perubahan!');
                    return false;
                }
                return {id: kandidat.id, urutan, nama, kelas, visi, misi, file};
            }
        }).then(async result => {
            if (result.isConfirmed) {
                const newData = result.value;
                const formData = new FormData()
                Object.entries(newData).forEach(([key, value]) => {
                    formData.append(key, value)
                })

                const request = await fetch("/api/supabase/kandidat/edit", {
                    method: "POST",
                    body: formData
                });

                const {error} = await request.json();
                if(error) {
                    Swal.fire({
                        icon: "error",
                        title: "Edit Gagal",
                        text: error.code == 23505 ? `Kandidat urutan ke ${newData.urutan} sudah tersedia` : "terjadi kesalahan",
                        timer: 2500,
                        showConfirmButton: false
                    });
                    return;
                }
                
                Swal.fire({
                    icon: "success",
                    text: "Perubahan disimpan",
                    timer: 2500,
                    showConfirmButton: false
                })
                logger(`edit kandidat ${kandidat.urutan}`, 'Admin')
                onSuccess()
            }
        });
    }


    function deleteKandidat(){
        Swal.fire({
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "oklch(58.6% 0.253 17.585)",
            confirmButtonText: "Hapus",
            html: `
                <h1 class="${zalando.className}">Hapus <b>Kandidat ${kandidat.urutan}?</b></h1>
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
                const req = await fetch("/api/supabase/kandidat/delete", {
                    method: "POST",
                    body: JSON.stringify({id: kandidat.id})
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
                logger(`delete kandidat ${kandidat.urutan}`, 'Admin')
                onSuccess()
            }
        })
    }


    return (
        <div className="w-60 h-fit rounded-sm p-3 overflow-hidden bg-white shadow-lg/10 ">
            <div className="overflow-hidden h-60 flex justify-center items-center rounded-sm mb-2">
                <img src={kandidat.imageURL} className="object-cover min-h-full"/>
            </div>
            <div>
                <p className="text-xs px-2 border border-gray-300 text-gray-700 rounded-full w-fit">Kandidat {kandidat.urutan}</p>
                <p className="h-12">{kandidat.nama}</p>
                <div className="text-xs flex justify-between items-center">
                    <p>Suara - {kandidat.suara}</p>
                    <div className="flex gap-1">
                        <button onClick={() => onView(kandidat.nama)} className="hover:scale-120 transition-all px-1 rounded-sm cursor-pointer bg-blue-500 text-white"><Eye width={18} /></button>
                        <button onClick={editKandidat} className="hover:scale-120 transition-all px-1 rounded-sm cursor-pointer bg-amber-500 text-white"><Edit width={18} /></button>
                        <button onClick={deleteKandidat} className="hover:scale-120 transition-all px-1 rounded-sm cursor-pointer bg-rose-500 text-white"><Trash2 width={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
} 