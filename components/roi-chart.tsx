"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ROIChartProps {
  currentProfit: number
  projectedProfit: number
  investment: number
}

export function ROIChart({ currentProfit, projectedProfit, investment }: ROIChartProps) {
  const monthlySavings = projectedProfit - currentProfit

  // Generate data for 24 months
  const data = Array.from({ length: 24 }, (_, i) => {
    const month = i + 1
    const currentTotal = currentProfit * month
    const projectedTotal = projectedProfit * month - investment
    const breakEvenPoint = investment / monthlySavings

    return {
      month: `Month ${month}`,
      current: currentTotal,
      projected: projectedTotal,
      breakEven: month === Math.ceil(breakEvenPoint) ? projectedTotal : null,
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        <Legend />
        <Area type="monotone" dataKey="current" name="Current Profit" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="projected" name="Projected Profit (with POS)" stroke="#82ca9d" fill="#82ca9d" />
        <Area
          type="monotone"
          dataKey="breakEven"
          name="Break-even Point"
          stroke="#ff7300"
          fill="#ff7300"
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}