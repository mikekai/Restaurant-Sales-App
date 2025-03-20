
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Component Test Page</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test card to verify that the components are working correctly.</p>
          <Button className="mt-4">Test Button</Button>
        </CardContent>
      </Card>
    </div>
  )
}
