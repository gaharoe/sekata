"use client"

import { Plus, PanelLeftClose, PanelLeftOpen, Table2, X, Search, RefreshCcw, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { Zalando_Sans, Lexend_Deca } from "next/font/google"
import { useEffect, useState } from "react"
import Loading from "@/app/partials/Loading"
import TablePemilih from "@/app/partials/TablePemilih"
import Swal from "sweetalert2"

const zalando = Zalando_Sans({
    weight: "400"
})

const lexend = Lexend_Deca()

async function loadData() {
    const req = await fetch("/api/supabase?table=Pemilih")
    const {data, error} = await req.json()
    if(!error) {
        const kelas = [...new Set(data.map(d => d.group))]
        console.log(kelas);
        
    }
}



export default function Pemilih() {
    const [slider, setSlider] = useState(1)
    const [loading, setLoading] = useState(1)
    const [dataPemilih, setDataPemilih] = useState([])
    const [pageData, setPageData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [tablePage, setTablePage] = useState(1)
    const [groupKelas, setGroupKelas] = useState([])
    const [tabSelected, setTabSelected] = useState("")
    const [tabs, setTabs] = useState([])
    const [refresh, setRefresh] = useState(0)

    function uploadTable() {
        Swal.fire({
        text: "Import Data Pemilih",
        html: `
        <label for="table-name">Nama Tabel</label>
        <input type="text" id="table-name" class="w-full h-10 px-3 mb-3 outline-none text-xs rounded-sm border border-slate-300" placeholder="Nama tabel: Kelas X MIPA 1, Kelas X TKJ 3...">
        <label for="file-import" class="w-full h-30 rounded-sm  hover:bg-slate-100 border border-slate-300 border-dashed flex items-center justify-center text-xs text-slate-400 ">
            <input type="file" id="file-import" class="hidden" accept=".csv,.xlsx">
            <p id="file-name">+ Pilih file CSV/XLSX</p>
        </label>  
        `,
        showCancelButton: true,
        confirmButtonText: 'Upload',
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
            return {file, tableName};
        }
        }).then(async result => {
        if (result.isConfirmed) {
            const data = result.value;
            const formData = new FormData();
            formData.append("tableName", data.tableName);
            formData.append("sheets", data.file);

            const request = await fetch("/api/table/import", {
                method: "POST",
                body: formData
            });

            const {error} = await request.json();
            if(error) {
                Swal.fire({
                    text: "gagal"
                });
                return;
            }
            setRefresh(!refresh)
            setTabSelected(data.tableName)
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
                fetch(`/api/table/delete?table=${tableName}`).then(res => res.json()).then(res => {
                    if(!res.error){
                        setRefresh(!refresh)
                        setTabs(prev => prev.filter(tab => tab != tableName))
                    }
                });
            }
        });
    }

    useEffect(() => {
        (async () => {
            document.title = "Sekata - Data Pemilih"
            setTablePage(1)
            setLoading(1)
            setGroupKelas([])
            const req = await fetch("/api/supabase?table=Pemilih")
            const {data, error} = await req.json()
            if(!error) {
                setDataPemilih(data)
                const kelas = [...new Set(data.map(d => d.group))]
                setGroupKelas(kelas)
                setLoading(0)
            }       
        })()
    }, [refresh])

    useEffect(() => {
        (() => {
            if(tablePage != 1) setTablePage(1)
            const filterData = dataPemilih.filter(data => data.group == tabSelected)
            setFilteredData(filterData)
            setPageData(() => {
                return filterData.slice(0, 15)
            })
        })()
    },[tabSelected])

    useEffect(() => {
        (() => {
            const start = (tablePage - 1) * 15
            setPageData(() => {
                return filteredData.slice(start, start + 15)
            })
        })()
    },[tablePage])

    if(loading) {
        return <Loading />
    }

    return(
        <div className={`${zalando.className} flex w-full h-full`}>
            <section className={`${slider ? "" : "-ml-50"} transition-all h-full w-50 border-r border-r-gray-300 shrink-0`}>
                <div className="h-10 font-bold text-gray-500 border-b border-b-gray-300 px-3 items-center flex">
                    <p className={lexend.className}>Table Pemilih</p>
                </div>
                <div className="m-3">
                    <button onClick={uploadTable} className=" w-full h-7 rounded-sm hover:bg-gray-100 border border-gray-500 text-gray-800 text-xs flex gap-2 items-center pl-3">
                        <Plus width={13} />
                        Import CSV/XLSX
                    </button>
                </div>
                <div className="flex flex-col">
                    {groupKelas.map(d => (
                        <button key={d} onClick={() => {
                            setTabSelected(d)
                            setTabs(prev => {
                                const exist = prev.find(tab => tab == d)
                                if(exist) return prev
                                return [...prev, d]
                            })
                        }} className={`w-full flex ${tabSelected == d ? "bg-gray-200 text-gray-800 shadow-[inset_3px_0_0_0_rgba(0,0,0,0.5)]" : tabs.includes(d) ? "bg-gray-100" : ""} text-gray-600 hover:text-gray-700 h-7 text-xs justify-start items-center pl-3 gap-2`}>
                            <Table2 width={14} />
                            {d}
                        </button>
                    ))}
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
                                    <Table2 width={16}/>
                                    <p>{tab}</p>
                                </div>
                                <span onClick={(e) => {
                                    e.stopPropagation()
                                    setTabs(prev => {
                                        const newTabs = prev.filter(t => t !== tab)
                                        if (tab === tabSelected) {
                                            if (newTabs.length > 0) {setTabSelected(newTabs[newTabs.length - 1])} 
                                            else {setTabSelected("")}
                                        }
                                        return newTabs
                                    })
                                }} className={`transition-colors text-gray-300 h-5 w-5 flex justify-center items-center rounded-md hover:text-rose-600 hover:bg-rose-200`}>
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
                                <form className="h-7  flex border border-gray-400 rounded-md pr-2 bg-white">
                                    <input type="text" className="w-60 text-xs p-2 outline-none" placeholder="Cari nama atau id..." />
                                    <div className="text-gray-400"><Search width={16} /></div>
                                </form>
                                <button onClick={() => setRefresh(!refresh)} className="w-7 h-7 rounded-md border border-emerald-500 bg-emerald-100 text-emerald-600 flex justify-center items-center" ><RefreshCcw width={18} /></button>
                                <button onClick={() => deleteTable(tabSelected)} className="w-7 h-7 rounded-md border border-rose-500 bg-rose-100 text-rose-600 flex justify-center items-center" ><Trash2 width={18} /></button>
                            </div>
                            <div className="h-full max-h-full min-h-0 overflow-auto">
                                <TablePemilih data={pageData} page={tablePage} />
                            </div>
                            <div className="h-10 border-t border-t-gray-300 w-full flex items-center px-1.5 bg-white text-xs gap-2">
                                <button onClick={() => setTablePage(prev => {
                                    if(prev != 1) return prev-1
                                    return prev
                                })} className="flex border border-gray-400 text-gray-500 rounded w-7 bg-gray-100 h-5 justify-center items-center"><ArrowLeft width={15} /></button>
                                <p>Page:</p>
                                <div className="flex border border-gray-400 text-gray-700 rounded w-7  h-5 justify-center items-center">{tablePage}</div>
                                <p>of {Math.ceil(filteredData.length / 15)}</p>

                                <button onClick={() => setTablePage(prev => {
                                    if( prev == Math.ceil(filteredData.length / 15)) return prev
                                    return prev+1
                                })} className="flex border border-gray-400 text-gray-500 rounded w-7 bg-gray-100 h-5 justify-center items-center"><ArrowRight width={15} /></button>
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
                                            <th className="border border-gray-400">Nama</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-2">1</td>
                                            <td className="border border-gray-300 px-2">Nama Pemilih...</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-2">2</td>
                                            <td className="border border-gray-300 px-2">Nama Pemilih...</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-2">3</td>
                                            <td className="border border-gray-300 px-2">Nama Pemilih...</td>
                                        </tr>
                                        <tr>
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