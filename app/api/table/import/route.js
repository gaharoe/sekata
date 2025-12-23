import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import papapars from "papaparse"
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
    if(fileType == "xlsx"){
        const xlsxBuffer = new Buffer.from(await sheets.arrayBuffer())
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(xlsxBuffer)

        const worksheet = workbook.getWorksheet(1)
        worksheet.eachRow((row, rowNumber) => {
            const cleanRow = row.values.filter(sheetData => sheetData != null || sheetData != undefined);
            let tableRow = {
                nama: cleanRow[1],
                token: Math.floor(100000 + Math.random() * 900000),
                status: false,
                group: tableName,
                "waktu pemilihan" : "-",
            };
            tableData.push(tableRow);
        })
        tableData.shift()
        const {error} = await supabase.from("Pemilih").insert(tableData)
        if(error) {
            return NextResponse.json({error: 1})
        }
        return NextResponse.json({error: 0})
    } else if(fileType == "csv"){
        return NextResponse.json({sheets: "csv bro"})
    } else {
        return NextResponse.json({error: "upload excel atau csv, selain itu gaboleh"})
    }
}