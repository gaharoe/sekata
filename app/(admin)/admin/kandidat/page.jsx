"use client"

import { PanelLeftClose, PanelLeftOpen, User, Users, X, Dot} from "lucide-react"
import { Zalando_Sans, Lexend_Deca } from "next/font/google"
import { useEffect, useState } from "react"
import Loading from "@/app/partials/Loading"
import CardKandidat from "@/app/partials/CardKandidat"
import AddCandidateButton from "@/app/partials/AddCandidateButton"
import CandidateDetail from "@/app/partials/CandidateDetiail"

const zalando = Zalando_Sans({
    weight: "400"
})

const lexend = Lexend_Deca()

export default function Pemilih() {
    const [slider, setSlider] = useState(1)
    const [loading, setLoading] = useState(1)
    const [dataKandidat, setDataKandidat] = useState([])
    const [tabSelected, setTabSelected] = useState("Kandidat")
    const [tabs, setTabs] = useState(["Kandidat"])

    const listKandidat = dataKandidat.map(d => d.nama)
    const filteredKandidat = tabSelected ? dataKandidat.filter(data => data.nama == tabSelected)[0] : {}
    console.log(filteredKandidat)

    function selectTab(tableName){
        setTabSelected(tableName)
        tableName != "Kandidat" &&
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
            const req = await fetch("/api/supabase/kandidat", {signal: controller?.signal})
            const {data, error} = await req.json()
            if(!error) {
                setDataKandidat(data)
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
                    <p className={lexend.className}>Kandidat Terpilih</p>
                </div>
                <div className="m-3">
                    <AddCandidateButton onSuccess={refresh} />
                </div>
                <div className="flex flex-1 flex-col overflow-x-auto">
                    {listKandidat.map(tableName => (
                        <button key={tableName} onClick={() => {selectTab(tableName)}} className={`w-full min-h-7 flex ${tabSelected == tableName ? "bg-gray-200 text-gray-800 shadow-[inset_3px_0_0_0_rgba(0,0,0,0.5)]" : tabs.includes(tableName) ? "bg-gray-100" : ""} text-gray-600 hover:text-gray-700 h-7 text-xs justify-start items-center pl-3 gap-2 text-nowrap`}>
                            <div><User width={14}/></div>
                            {tableName.length > 25 ? tableName.slice(0,19)+" . . ." : tableName}
                        </button>
                    ))}
                    
                </div>
                <div className="text-xs h-8 border-t border-t-gray-300 flex items-center px-2 gap-2">
                    <p>total kandidat: </p>
                    <div className="flex border border-gray-400 text-gray-700 rounded w-7 h-5 justify-center items-center">{dataKandidat.length}</div>
                </div>
            </section>

            <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
                <div className="flex w-full h-10 items-center border-b border-b-gray-300">
                    <button onClick={() => setSlider(prev => !prev)} className="w-10 flex justify-center items-center border-r border-b  border-gray-300 h-10 text-gray-500 bg-gray-100">
                        {slider ? <PanelLeftClose width={18} /> : <PanelLeftOpen width={18} />}
                    </button>
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:h-0 flex-1">
                        {tabs.map((tab, index) => (
                            <button key={tab} onClick={() => setTabSelected(tab)} className={`${tabSelected == tab ? "bg-white text-gray-800" : "text-gray-500"} text-xs flex px-3 items-center gap-2 h-10 border-r border-r-gray-300 shrink-0`}>
                                <div className="flex items-center gap-2 mr-3">
                                    {!!index ? <User width={16} /> : <Users width={16} /> }
                                    <p>{tab}</p>
                                </div>
                                { !!index && <span onClick={(e) => {closeTab(e, tab)}} className={`transition-colors text-gray-300 h-5 w-5 flex justify-center items-center rounded-md hover:text-rose-600 hover:bg-rose-200`}>
                                    <X width={16}/>
                                </span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-full w-full bg-gray-50 flex flex-col min-h-0">
                    {tabSelected && tabSelected != "Kandidat" ? (
                        <CandidateDetail kandidat={filteredKandidat} />
                    ) : (
                        <div className="h-full flex flex-wrap gap-3 items-start select-none p-3 overflow-y-auto">
                            {dataKandidat.map(kandidat => (
                                <CardKandidat 
                                    key={kandidat.id} 
                                    kandidat={kandidat}
                                    onView={selectTab}
                                    onSuccess={refresh}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}