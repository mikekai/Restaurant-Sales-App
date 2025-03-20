
"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BarChart3, Check, CreditCard, Heart, MapPin, Phone, Search, Star, Timer, Wallet, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompetitorReviewChart } from "@/components/competitor-review-chart"
import { MenuPriceComparison } from "@/components/menu-price-comparison"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ROIChart } from "@/components/roi-chart"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BusinessInfo {
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  hours: string;
  phone: string;
  address: string;
}

interface Competitor {
  id: string;
  name: string;
  rating: number;
  vicinity: string;
  types: string[];
  strengths: string[];
  weaknesses: string[];
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

  // Simplified assumptions for ROI calculation
  const foodCost = 35 // % of revenue
  const laborCost = 30 // % of revenue
  const otherExpenses = 20 // % of revenue

  // Calculate current profit
  const currentProfit = monthlyRevenue * (1 - (foodCost + laborCost + otherExpenses) / 100)

  // Calculate projected profit with POS (assuming 5% revenue increase, 2% food cost reduction, 3% labor cost reduction)
  const projectedRevenue = monthlyRevenue * 1.05
  const projectedFoodCost = foodCost - 2
  const projectedLaborCost = laborCost - 3
  const projectedProfit = projectedRevenue * (1 - (projectedFoodCost + projectedLaborCost + otherExpenses) / 100)

  // Calculate ROI
  const monthlySavings = projectedProfit - currentProfit
  const annualSavings = monthlySavings * 12
  const posInvestment = 10000 // Assumed POS system cost
  const roi = (annualSavings / posInvestment) * 100
  const paybackPeriod = posInvestment / monthlySavings

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

      // Process business details
      if (data.businessDetails) {
        const businessDetails = data.businessDetails
        setBusinessInfo({
          name: businessDetails.name || location.split(',')[0].trim(),
          category: businessDetails.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
          rating: businessDetails.rating || 4.0,
          reviewCount: businessDetails.user_ratings_total || 100,
          hours: businessDetails.opening_hours?.weekday_text?.join(', ') || 'Hours not available',
          phone: businessDetails.formatted_phone_number || 'Phone not available',
          address: businessDetails.formatted_address || data.formattedAddress,
        })
      } else {
        // If no business details found, use the address as the business name
        setBusinessInfo({
          name: location.split(',')[0].trim(),
          category: 'Restaurant',
          rating: 4.0,
          reviewCount: 100,
          hours: 'Mon-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 9:00 PM',
          phone: 'Phone not available',
          address: data.formattedAddress,
        })
      }

      // Process competitors
      if (data.competitors && data.competitors.length > 0) {
        const competitorsObj: Record<string, Competitor> = {}
        
        // Generate random strengths and weaknesses for each competitor
        const possibleStrengths = ['Food quality', 'Service', 'Ambiance', 'Value perception', 'Menu variety', 'Location']
        const possibleWeaknesses = ['Wait times', 'Price point', 'Limited menu', 'Ambiance', 'Service inconsistency', 'Food quality']
        
        data.competitors.forEach((comp: any, index: number) => {
          // Randomly select 2 strengths and 2 weaknesses
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
      } else {
        // If no competitors found, use mock data
        setCompetitors({
          competitorA: {
            id: 'mock-a',
            name: "Trattoria Milano",
            rating: 4.3,
            vicinity: "Nearby location",
            types: ["restaurant"],
            strengths: ["Ambiance", "Value perception"],
            weaknesses: ["Service speed", "Food consistency"]
          },
          competitorB: {
            id: 'mock-b',
            name: "The Hungry Fork",
            rating: 4.1,
            vicinity: "Nearby location",
            types: ["restaurant"],
            strengths: ["Value perception", "Menu variety"],
            weaknesses: ["Ambiance", "Wait times"]
          },
          competitorC: {
            id: 'mock-c',
            name: "Coastal Bites",
            rating: 4.6,
            vicinity: "Nearby location",
            types: ["restaurant"],
            strengths: ["Food quality", "Service"],
            weaknesses: ["Value perception", "Limited menu"]
          }
        })
      }

      setSearchPerformed(true)
    } catch (err) {
      console.error('Error fetching location data:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const formatRevenue = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-bold text-xl">SpotOn</span>
        </Link>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">Competitor Analysis & ROI Calculator</h1>
              <p className="text-muted-foreground">
                See how your restaurant compares to local competitors and calculate your potential ROI with SpotOn
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
