"use client"

import { Plus, PanelLeftClose, PanelLeftOpen, Table2, X, Search, RefreshCcw, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { Zalando_Sans, Lexend_Deca } from "next/font/google"
import { useEffect, useState } from "react"
import Loading from "@/app/partials/Loading"
import TablePemilih from "@/app/partials/TablePemilih"
import Swal from "sweetalert2"
import ExportPDFButton from "@/app/components/ExportPDFButton"

const zalando = Zalando_Sans({
    weight: "400"
})

const lexend = Lexend_Deca()

export default function Pemilih() {
    const [slider, setSlider] = useState(1)
    const [loading, setLoading] = useState(1)
    const [dataPemilih, setDataPemilih] = useState([])
    const [tablePage, setTablePage] = useState(1)
    const [tabSelected, setTabSelected] = useState("")
    const [tabs, setTabs] = useState([])
    const [search, setSearch] = useState("")

    const listTableName = [...new Set(dataPemilih.map(d => d.group))]
    const filteredData = tabSelected ? dataPemilih.filter(data => data.group == tabSelected).map((row, index) => ({...row, no: index+1})) : []
    const pageData = filteredData.slice((tablePage - 1) * 15, tablePage * 15)
    const searchData = search ? filteredData.filter(data => data.nama.toLowerCase().includes(search) || data.NIS == search) : ""

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
                    document.getElementById("file-name").innerText = file.files[0].name;
                });
            },
            preConfirm: () => {
                const file = document.getElementById('file-import').files[0];
                const tableName = document.getElementById("table-name").value;
                if (!file || !tableName) {
                    Swal.showValidationMessage('Isi data dengan lengkap');
                    return false;
                }
                if(listTableName.includes(tableName)){
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
                    Swal.fire({text: "gagal"});
                    return;
                }
                refresh()
            }
        });
    }

    function deleteTable(tableName) {
        Swal.fire({
            icon: "question",
            text: `Hapus tabel ${tableName}`,
            showCancelButton: true,
        }).then(async result => {
            if(result.isConfirmed){
                fetch(`/api/supabase/pemilih/delete?table=${tableName}`).then(res => res.json()).then(res => {
                    if(!res.error){
                        refresh()
                        closeTab(null ,tableName)
                    }
                });
            }
        });
    }
    
    function prevPageButton(){
        setTablePage(prev => {
            if(prev != 1) return prev-1
            return prev
        })
    }

    function nextPageButton(totalPage){
        setTablePage(prev => {
            if( prev == totalPage) return prev
            return prev+1
        })
    }

    function selectTab(tableName){
        setTabSelected(tableName)
        setTabs(prev => {
            const exist = prev.find(tab => tab == tableName)
            if(exist) return prev
            return [...prev, tableName]
        })
    }

    function closeTab(e = null, tab){
        if(e){e.stopPropagation()}
        setTabs(prev => {
            const newTabs = prev.filter(t => t !== tab)
            if (tab === tabSelected) {
                if (newTabs.length > 0) {setTabSelected(newTabs[newTabs.length - 1])} 
                else {setTabSelected("")}
            }
            return newTabs
        })
    }
    
    async function loadData(controller = null) {
        setLoading(1)
        try {
            const req = await fetch("/api/supabase/pemilih?table=Pemilih", {signal: controller?.signal})
            const {data, error} = await req.json()
            if(!error) {
                setDataPemilih(data)
                setLoading(0)
            }
        } catch(err){
            if(err.name == "AbortError"){
                return
            }
        }
    }

    async function refresh(){
        loadData()
    }

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            document.title = "Sekata - Data Pemilih"
            loadData(controller)
        })()
        return () => {controller.abort("load cencel")}
    }, [])

    if(loading) {return <Loading />}
    return(
        <div className={`${zalando.className} flex w-full h-full`}>
            <section className={`${slider ? "" : "-ml-50"} flex flex-col transition-all h-full w-50 border-r border-r-gray-300 shrink-0`}>
                <div className="h-10 font-bold text-gray-500 border-b border-b-gray-300 px-3 items-center flex">
                    <p className={lexend.className}>Table Pemilih</p>
                </div>
                <div className="m-3">
                    <button onClick={uploadTable} className=" w-full h-7 rounded-sm hover:bg-gray-100 border border-gray-500 text-gray-800 text-xs flex gap-2 items-center pl-3">
                        <Plus width={13} />
                        Import CSV/XLSX
                    </button>
                </div>
                <div className="flex flex-1 flex-col overflow-x-auto">
                    {listTableName.map(tableName => (
                        <button key={tableName} onClick={() => {selectTab(tableName); setTablePage(prev => (prev != 1 ? 1 : prev))}} className={`w-full min-h-7 flex ${tabSelected == tableName ? "bg-gray-200 text-gray-800 shadow-[inset_3px_0_0_0_rgba(0,0,0,0.5)]" : tabs.includes(tableName) ? "bg-gray-100" : ""} text-gray-600 hover:text-gray-700 h-7 text-xs justify-start items-center pl-3 gap-2`}>
                            <Table2 width={14}/>
                            {tableName}
                        </button>
                    ))}
                    
                </div>
                <div className="text-xs h-8 border-t border-t-gray-300 flex items-center px-2 gap-2">
                    <p>total pemilih: </p>
                    <div className="flex border border-gray-400 text-gray-700 rounded w-7 h-5 justify-center items-center">{dataPemilih.length}</div>
                </div>
            </section>

            <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
                <div className="flex w-full h-10 items-center border-b border-b-gray-300">
                    <button onClick={() => setSlider(prev => !prev)} className="w-10 flex justify-center items-center border-r border-b  border-gray-300 h-10 text-gray-500 bg-gray-100">
                        {slider ? <PanelLeftClose width={18} /> : <PanelLeftOpen width={18} />}
                    </button>
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:h-0 flex-1">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setTabSelected(tab)} className={`${tabSelected == tab ? "bg-white text-gray-800" : "text-gray-500"} text-xs flex px-3 items-center gap-5 h-10 border-r border-r-gray-300 shrink-0`}>
                                <div className="flex items-center gap-2">
                                    <Table2 width={16} />
                                    <p>{tab}</p>
                                </div>
                                <span onClick={(e) => {closeTab(e, tab)}} className={`transition-colors text-gray-300 h-5 w-5 flex justify-center items-center rounded-md hover:text-rose-600 hover:bg-rose-200`}>
                                    <X width={16}/>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-full w-full bg-gray-50 flex flex-col min-h-0">
                    {tabSelected ? (
                        <>
                            <div className="bg-white flex gap-2 w-full h-13 border-b border-b-gray-300 p-3">
                                <div className="h-7  flex border border-gray-400 rounded-md pr-2 bg-white">
                                    <input onChange={(e) => setSearch(e.target.value.toLowerCase())} type="text" className="w-60 text-xs p-2 outline-none" placeholder="Cari nama atau NIS..." />
                                    <div className="text-gray-400"><Search width={16} /></div>
                                </div>
                                <button onClick={refresh} className="w-7 h-7 rounded-md bg-emerald-500 hover:bg-emerald-600  text-white flex justify-center items-center" ><RefreshCcw width={18} /></button>
                                <button onClick={() => deleteTable(tabSelected)} className="w-7 h-7 rounded-md bg-rose-500 hover:bg-rose-600 text-white flex justify-center items-center" ><Trash2 width={18} /></button>
                                <ExportPDFButton fileName={tabSelected} data={filteredData} tableName={tabSelected} />
                            </div>
                            <div className="h-full max-h-full min-h-0 overflow-auto">
                                <TablePemilih data={search ? searchData : pageData} page={tablePage} refreshTrigger={refresh}/>
                            </div>
                            <div className="h-8 min-h-8 border-t border-t-gray-300 w-full flex justify-between items-center px-1.5 bg-white text-xs">
                                <div className="flex items-center gap-2">
                                    <button onClick={prevPageButton} className="flex border border-gray-400 text-gray-500 rounded w-7 bg-gray-100 h-5 justify-center items-center"><ArrowLeft width={15} /></button>
                                    <p>Page:</p>
                                    <div className="flex border border-gray-400 text-gray-700 rounded w-7  h-5 justify-center items-center">{tablePage}</div>
                                    <p>of {Math.ceil(filteredData.length / 15)}</p>
                                    <button onClick={() => {nextPageButton(Math.ceil(filteredData.length / 15))}} className="flex border border-gray-400 text-gray-500 rounded w-7 bg-gray-100 h-5 justify-center items-center"><ArrowRight width={15} /></button>
                                </div>
                                <div className="flex items-center text-sm gap-2">
                                    <p>total: </p>
                                    <div className="flex border border-gray-400 text-gray-700 rounded w-7 text-xs h-5 justify-center items-center">{filteredData.length}</div>
                                </div>
                            </div>
                        </> 
                    ) : (
                        <div className="h-full flex justify-center items-center opacity-50 select-none">
                            <div className="w-70 text-xs text-center">
                                <p>import data CSV atau XLXS</p>
                                <p>Dengan Format Tabel Berikut</p>
                                <table className="w-full border-collapse mt-5">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-400 w-10">No</th>
                                            <th className="border border-gray-400 w-30">NIS</th>
                                            <th className="border border-gray-400">Nama</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-2">1</td>
                                            <td className="border border-gray-300 px-2">0000000000</td>
                                            <td className="border border-gray-300 px-2">Nama Pemilih...</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-2">2</td>
                                            <td className="border border-gray-300 px-2">0000000000</td>
                                            <td className="border border-gray-300 px-2">Nama Pemilih...</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-2">3</td>
                                            <td className="border border-gray-300 px-2">0000000000</td>
                                            <td className="border border-gray-300 px-2">Nama Pemilih...</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-2">...</td>
                                            <td className="border border-gray-300 px-2">...</td>
                                            <td className="border border-gray-300 px-2">...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}