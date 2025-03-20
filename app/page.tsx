
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container min-h-screen py-10">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">SpotOn Restaurant Solutions</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Empower your restaurant with data-driven insights and cutting-edge tools
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>Analyze your local competition and market position</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/competitor-analysis">
                <Button className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Components</CardTitle>
              <CardDescription>View UI component examples</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test">
                <Button className="w-full">
                  View Components <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
