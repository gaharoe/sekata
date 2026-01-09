"use client"

import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LabelList} from "recharts"

export default function Chart({data}) {

    const kandidat = data.map(d => ({nama: d.nama.split(" ")[0], suara: d.suara, urutan: d.urutan}))

    return (
        <ResponsiveContainer height={"100%"} width={"100%"}  >
            <BarChart data={kandidat}>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#92cffc" />
                    <stop offset="80%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#8533ff" />
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey={"nama"} 
                    tickLine={false}
                    axisLine={false}
                    tick={{fontSize: 12, fill: "#64748b"}}
                    className={"z-0"}
                    />
                <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{fontSize: 12, fill: "#64748b"}}
                    width={30}
                    className={"z-0"}
                />
                <Tooltip wrapperClassName="text-xs rounded-md" cursor={false}/>
                <Bar 
                    dataKey={"suara"} 
                    animationDuration={1000} 
                    fill="url(#barGradient)"
                    radius={[6,6,0,0]}
                >
                    <LabelList
                        dataKey="suara"
                        position="center"
                        fill="#fff"
                        fontSize={14}
                        fontWeight={600}
                    />
                </Bar>
                
            </BarChart>
        </ResponsiveContainer>
    )
}