import ExcelJS from "exceljs"
import Papa from "papaparse"
import { supabase } from "@/app/utils/supabase"

export async function POST(req){
    const formData = await req.formData()
    const sheets = formData.get("sheets")
    const tableName = formData.get("tableName")
    if(!sheets || ! tableName) {
        return Response.json({error: "isi data dengan lengkap"})
    }
    const fileType = sheets.name.split(".").at(-1).toLowerCase()
    const tableData = [];
    const tableFormat = ["no", "nis", "nama"]

    let errorMessage = 0;

    if(fileType == "xlsx"){
        const xlsxBuffer = new Buffer.from(await sheets.arrayBuffer())
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(xlsxBuffer)
        const worksheet = workbook.getWorksheet(1)
        
        let headerIndex = 0
        for(let i = 1; i <= worksheet.rowCount; i++){
            const row = worksheet.getRow(i)
            const cleanRow = row.values.filter(sheetData => sheetData != null || sheetData != undefined )
            cleanRow.length > 0 && ++headerIndex
            if(headerIndex == 1){
                if(cleanRow.length != tableFormat.length){
                    return Response.json({error: "Format tabel tidak sesuai. Unduh template tabel yang tersedia"})
                } else {
                    const same = tableFormat.every(item => (
                        cleanRow.some(cell => cell.toLowerCase() == item)
                    ))
                    if(!same){return Response.json({error: "Format tabel tidak sesuai. Unduh template tabel yang tersedia"})}
                }
            } 
        }

        worksheet.eachRow((row) => {
            const cleanRow = row.values.filter(sheetData => sheetData != null || sheetData != undefined);
            tableData.push({
                NIS: cleanRow[1],
                nama: cleanRow[2],
                token: Math.floor(100000 + Math.random() * 900000),
                status: false,
                group: tableName,
                "waktu pemilihan" : null,
            });
        })
        tableData.shift()
        const {error} = await supabase.from("Pemilih").insert(tableData)
        console.log(error)
        errorMessage = error ? error : 0
        
    } else if(fileType == "csv"){
        const fileContent = await sheets.text()
        const parsed = Papa.parse(fileContent, {
            skipEmptyLines: true,
            skipFirstNLines: true
        })
        const same = tableFormat.every(item => (
            parsed.data[0].some(cell => cell.toLowerCase() == item)
        ))
        if(!same){return Response.json({error: "Format tabel tidak sesuai. Unduh template tabel yang tersedia"})}
        parsed.data.shift()
        parsed.data.forEach(cell => {
            tableData.push({
                NIS: cell[1],
                nama: cell[2],
                token: Math.floor(100000 + Math.random() * 900000),
                status: false,
                group: tableName,
                "waktu pemilihan" : null
            })
        });
        const {error} = await supabase.from("Pemilih").insert(tableData)
        errorMessage = error ? error : 0
        errorMessage = 1
    } else {
        errorMessage = {error: "Upload File CSV atau XLSX berisi data pemilih!"}
    }
    
    return Response.json({error: errorMessage})
}