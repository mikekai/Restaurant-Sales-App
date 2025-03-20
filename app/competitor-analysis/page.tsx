
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CompetitorReviewChart } from "@/components/competitor-review-chart"

interface BusinessInfo {
  name: string
  category: string
  rating: number
  reviewCount: number
  hours: string
  phone: string
  address: string
}

interface Competitor {
  id: string
  name: string
  rating: number
  vicinity: string
  types: string[]
  strengths: string[]
  weaknesses: string[]
}

export default function CompetitorAnalysis() {
  const [location, setLocation] = useState("")
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    category: "",
    rating: 0,
    reviewCount: 0,
    hours: "",
    phone: "",
    address: "",
  })
  const [competitors, setCompetitors] = useState<Record<string, Competitor>>({})

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/google-maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: location,
          type: 'geocode'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch location data')
      }

      const data = await response.json()

      if (data.competitors && data.competitors.length > 0) {
        const competitorsObj: Record<string, Competitor> = {}

        data.competitors.forEach((comp: any, index: number) => {
          const possibleStrengths = ['Food quality', 'Service', 'Ambiance', 'Value perception', 'Menu variety', 'Location']
          const possibleWeaknesses = ['Wait times', 'Price point', 'Limited menu', 'Ambiance', 'Service inconsistency']

          const strengths = [...possibleStrengths].sort(() => 0.5 - Math.random()).slice(0, 2)
          const weaknesses = [...possibleWeaknesses]
            .filter(w => !strengths.includes(w))
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)

          competitorsObj[`competitor${String.fromCharCode(65 + index)}`] = {
            ...comp,
            strengths,
            weaknesses
          }
        })

        setCompetitors(competitorsObj)
      }

      setSearchPerformed(true)
    } catch (err) {
      console.error('Error fetching location data:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-bold text-xl">SpotOn</span>
        </Link>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Competitor Analysis</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[400px]">
              <CompetitorReviewChart restaurantName="Your Restaurant" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
