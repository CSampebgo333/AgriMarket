"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample sales data for the chart
const data = [
  { date: "Apr 01", sales: 5000 },
  { date: "Apr 05", sales: 8000 },
  { date: "Apr 10", sales: 12000 },
  { date: "Apr 15", sales: 9500 },
  { date: "Apr 20", sales: 15000 },
  { date: "Apr 25", sales: 18000 },
  { date: "Apr 30", sales: 21000 },
]

export function SalesChart() {
  const { theme } = useTheme()

  // Determine colors based on theme
  // const textColor = theme === "dark" ? "#f8fafc" : "#0f172a"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"
  const lineColor = "#8b5cf6" // Purple color for the line

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" stroke={gridColor} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke={gridColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Sales</span>
                        <span className="font-bold">{payload[0]?.value?.toLocaleString() ?? 0} XOF</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke={lineColor}
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: lineColor, opacity: 0.8 },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}