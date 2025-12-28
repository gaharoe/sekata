import { Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ExportPDFButton({fileName, data}){
    function generateTable(){
        const doc = new jsPDF()
        doc.setFont("Times New Roman")
        doc.text(`${fileName} - Peserta Pemilihan Ketua OSIS 2025`, 14, 15)
        autoTable(doc, {
            startY: 20,
            head: [["No", "Nama", "Token"]],
            body: data.map((row, index) => [
                index+1,
                row.nama,
                row.token
            ])
        })
        doc.save(`${fileName}.pdf`)
    }

    return (
        <button onClick={generateTable} className="px-2 h-7 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs flex justify-center items-center gap-2" >
            <Download width={18} />
            Export PDF
        </button>
    )
}