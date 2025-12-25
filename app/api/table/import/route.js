import { NextResponse } from "next/server"
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
    let errorMessage = 0;
    if(fileType == "xlsx"){
        const xlsxBuffer = new Buffer.from(await sheets.arrayBuffer())
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(xlsxBuffer)

        const worksheet = workbook.getWorksheet(1)
        worksheet.eachRow((row) => {
            const cleanRow = row.values.filter(sheetData => sheetData != null || sheetData != undefined);
            tableData.push({
                NIS: cleanRow[1],
                nama: cleanRow[2],
                token: Math.floor(100000 + Math.random() * 900000),
                status: false,
                group: tableName,
                "waktu pemilihan" : "-",
            });
        })
        tableData.shift()
        const {error} = await supabase.from("Pemilih").insert(tableData)
        errorMessage = error ? error : 0
        
    } else if(fileType == "csv"){
        const fileContent = await sheets.text()
        const parsed = Papa.parse(fileContent, {
            skipEmptyLines: true,
            skipFirstNLines: true
        })
        parsed.data.shift()
        parsed.data.forEach(cell => {
            tableData.push({
                NIS: cell[1],
                nama: cell[2],
                token: Math.floor(100000 + Math.random() * 900000),
                status: false,
                group: tableName,
                "waktu pemilihan" : "-"
            })
        });
        const {error} = await supabase.from("Pemilih").insert(tableData)
        errorMessage = error ? error : 0
    } else {
        errorMessage = {error: "upload excel atau csv, selain itu gaboleh"}
    }
    
    return Response.json({errorMessage})
}