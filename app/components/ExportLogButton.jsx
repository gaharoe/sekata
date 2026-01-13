import { Download } from "lucide-react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export default function ExportLogButton({logs}){
    function generateTable(){
        const doc = new jsPDF()
        doc.setFont("Times New Roman")
        doc.text(`Log Aktivitas - Sekata`, 14, 15)
        autoTable(doc, {
            startY: 20,
            head: [["No", "ID", "Waktu", "Role", "Aksi"]],
            body: logs.map((log, index) => [
                index+1,
                log.id,
                `${log.tanggal} ${log.jam}`,
                log.role,
                log.action
            ])
        })
        doc.save(`log-sekata.pdf`)
    }


    return(
        <button onClick={generateTable} className="bg-sky-600 text-white border border-white/20 flex items-center gap-2 text-sm w-full h-10 flex justify-center items-center rounded-md">
            <Download width={18} />
            <p>Export Log</p>
        </button>
    )
}