import { Plus } from "lucide-react"
import Swal from "sweetalert2"
import { Zalando_Sans } from "next/font/google";

const zalando = Zalando_Sans()

export default function AddCandidateButton({onSuccess}) {
    function uploadKandidat() {
        let file = null
        Swal.fire({
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: "oklch(68.5% 0.169 237.323)",
            html: `
                <h1 class="${zalando.className} mb-5">Tambah Kandidat Baru</h1>
                
                <div class="flex gap-5 mb-5">
                    <div class="flex flex-col gap-2">
                        <div id="foto-placeholder" class="w-30 h-35 border border-gray-400 rounded bg-gray-50 text-xs flex justify-center items-center">Foto Kandidat</div>
                        <img id="foto-kandidat" src="" class="object-cover w-30 h-35 rounded hidden"/>
                        <label for="input-foto" class="flex justify-center items-center text-xs hover:bg-sky-600 text-white bg-sky-500 h-7 rounded ">
                            <input hidden type="file" name="foto" id="input-foto" />
                            <p id="label-input-foto">Pilih foto kandidat</p>
                        </label>
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="relative w-full">
                            <input type="text" id="nama" placeholder=" " class="peer w-full rounded-lg border border-gray-300 bg-transparent h-10 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                            <label for="nama" class=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">
                                Nama Lengkap
                            </label>
                        </div>
                        <div class="relative w-full">
                            <input type="number" id="urutan" placeholder=" " class="peer w-full rounded-lg border border-gray-300 bg-transparent h-10 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                            <label for="urutan" class=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">
                                Kandidat ke
                            </label>
                        </div>
                        <div class="relative w-full">
                            <input type="text" id="kelas" placeholder=" " class="peer w-full rounded-lg border border-gray-300 bg-transparent h-10 px-3 text-sm focus:border-blue-500 focus:outline-none"/>
                            <label for="kelas" class=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">
                                Kelas
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="relative w-full mb-5">
                    <textarea name="visi" id="visi" class="pt-2 peer w-full rounded-lg border border-gray-300 bg-transparent h-20 px-3 text-sm focus:border-blue-500 focus:outline-none"></textarea>
                    <label for="visi" class=" pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:text-blue-500">
                        Visi
                    </label>
                </div>

                <div class="relative w-full">
                    <textarea name="misi" id="misi" class="pt-2 peer w-full rounded-lg border border-gray-300 bg-transparent h-20 px-3 text-sm focus:border-blue-500 focus:outline-none"></textarea>
                    <label for="misi" class=" pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:text-blue-500">
                        Misi
                    </label>
                </div>
            `,
            didOpen: () => {
                const inputFoto = document.getElementById("input-foto")
                const img = document.getElementById("foto-kandidat")
                const imgPlaceholder = document.getElementById("foto-placeholder")
                inputFoto.addEventListener("change", (e) => {
                    file = inputFoto.files[0]
                    if(!file) return
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        img.src = e.target.result
                        img.classList.remove("hidden")
                        imgPlaceholder.classList.add("hidden")
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
                    !nama && 
                    !kelas && 
                    !urutan
                ) {
                    Swal.showValidationMessage('Isi data dengan lengkap');
                    return false
                }
                return {urutan, nama, kelas, visi, misi, file};
            }
        }).then(async result => {
            if (result.isConfirmed) {
                const formData = new FormData()
                const newData = result.value
                Object.entries(newData).forEach(([key, value]) => {
                    formData.append(key, value)
                })

                const request = await fetch("/api/supabase/kandidat/add", {
                    method: "POST",
                    body: formData
                })

                const {error} = await request.json();
                if(error) {
                    Swal.fire({
                        icon: "error",
                        title: "Edit Gagal",
                        text: error.code == 23505 ? `Kandidat urutan ke ${newData.urutan} sudah terdaftar` : "terjadi kesalahan",
                        timer: 2500,
                        showConfirmButton: false
                    })
                    return
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
        <button onClick={uploadKandidat} className=" w-full h-7 rounded-sm hover:bg-gray-100 border border-gray-500 text-gray-800 text-xs flex gap-2 items-center pl-3">
            <Plus width={13} />
            Tambah Kandidat
        </button>
    )
}