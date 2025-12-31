"use client"
import { PieChart, Pie, Cell } from "recharts";

const total = 1588;
const progress = total/4;

const data = [
  { name: "Done", value: progress },
  { name: "Remaining", value: total - progress },
];

const rawPercent = (progress/total*100)
const progressPercent = Number.isInteger(rawPercent) ? rawPercent.toString() : rawPercent.toFixed(2)

const COLORS = ["#22c55e", "#e5e7eb"];

export default function ProgressPie() {

  const renderLabel = ({ x, y, value }) => {
    return (
      <text
        x={x}
        y={y}
        fill="#334155"   // ← warna teks di sini
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {value}
      </text>
    );
  };

  return (
    <PieChart width={"100%"}>
      <Pie
        data={data}
        innerRadius={60}
        outerRadius={100}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        label={renderLabel}
      >
        <text
          x={"50%"}
          y={"50%"}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="24"
          fontWeight="600"
          fill="#111827"
        >
          {progressPercent}%
        </text>
        <Cell key={0} fill={"oklch(69.6% 0.17 162.48)"} stroke="0"/>
        <Cell key={1} fill={"#d1d5dc"} stroke="0"/>
      </Pie>
    </PieChart>
  );
}
