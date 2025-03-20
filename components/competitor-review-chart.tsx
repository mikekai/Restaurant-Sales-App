"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// This function will be called with the restaurant name from the page
export function CompetitorReviewChart({ restaurantName = "Your Restaurant" }) {
  // Generate competitor names based on the restaurant's location/type
  // In a real app, these would come from actual competitor data
  const competitorNames = {
    competitorA: "Trattoria Milano",
    competitorB: "The Hungry Fork",
    competitorC: "Coastal Bites"
  }

  const data = [
    {
      name: restaurantName,
      food: 4.5,
      service: 4.2,
      ambiance: 4.3,
      value: 3.8,
      overall: 4.2,
    },
    {
      name: competitorNames.competitorA,
      food: 4.3,
      service: 3.9,
      ambiance: 4.5,
      value: 4.1,
      overall: 4.2,
    },
    {
      name: competitorNames.competitorB,
      food: 4.1,
      service: 4.0,
      ambiance: 3.8,
      value: 4.2,
      overall: 4.0,
    },
    {
      name: competitorNames.competitorC,
      food: 4.6,
      service: 4.3,
      ambiance: 4.0,
      value: 3.7,
      overall: 4.1,
    },
    {
      name: "Local Average",
      food: 4.2,
      service: 4.0,
      ambiance: 4.1,
      value: 4.0,
      overall: 4.1,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="food" name="Food Quality" fill="#8884d8" />
        <Bar dataKey="service" name="Service" fill="#82ca9d" />
        <Bar dataKey="ambiance" name="Ambiance" fill="#ffc658" />
        <Bar dataKey="value" name="Value" fill="#ff8042" />
        <Bar dataKey="overall" name="Overall" fill="#0088fe" />
      </BarChart>
    </ResponsiveContainer>
  )
}