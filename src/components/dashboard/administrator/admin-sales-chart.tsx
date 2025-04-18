"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample sales data for the chart
const data = [
  { date: "Apr 01", burkina: 5000, mali: 4000, niger: 3000 },
  { date: "Apr 05", burkina: 8000, mali: 6500, niger: 4500 },
  { date: "Apr 10", burkina: 12000, mali: 9000, niger: 7000 },
  { date: "Apr 15", burkina: 9500, mali: 8500, niger: 6500 },
  { date: "Apr 20", burkina: 15000, mali: 12000, niger: 9000 },
  { date: "Apr 25", burkina: 18000, mali: 14000, niger: 11000 },
  { date: "Apr 30", burkina: 21000, mali: 16000, niger: 13000 },
]

export function AdminSalesChart() {
  const { theme } = useTheme()

  // Determine colors based on theme
  const textColor = theme === "dark" ? "#f8fafc" : "#0f172a"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  // Country colors
  const burkinaColor = "#8b5cf6" // Purple
  const maliColor = "#10b981" // Green
  const nigerColor = "#f59e0b" // Amber

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Burkina Faso</span>
                        <span className="font-bold" style={{ color: burkinaColor }}>
                          {payload[0]?.value.toLocaleString()} XOF
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Mali</span>
                        <span className="font-bold" style={{ color: maliColor }}>
                          {payload[1]?.value.toLocaleString()} XOF
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Niger</span>
                        <span className="font-bold" style={{ color: nigerColor }}>
                          {payload[2]?.value.toLocaleString()} XOF
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="burkina" fill={burkinaColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="mali" fill={maliColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="niger" fill={nigerColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}