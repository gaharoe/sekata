"use client"

import { Poppins } from "next/font/google"

const poppins = Poppins({weight: "400"})

export default function Log(){
    return (
        <div className={`w-full h-full flex ${poppins.className}`}>
            <div className="w-60 h-full"></div>
            <div className="flex flex-col flex-1 h-full min-h-0 min-w-0">
                <div className="h-50 flex items-center">Log Aktivitas</div>
                <div className="h-50 flex-1 min-h-0 min-w-0 items-center pr-3">
                    <table className="border-collapse border w-full">
                        <thead>
                            <tr>
                                <th className="border ">1</th>
                                <th className="border">1</th>
                                <th className="border">1</th>
                                <th className="border">1</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2</td>
                                <td>3</td>
                                <td>4</td>
                                <td>5</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}