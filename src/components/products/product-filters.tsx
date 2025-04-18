
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample filter options
const categories = [
  { id: "grains", label: "Grains" },
  { id: "vegetables", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
  { id: "tubers", label: "Tubers" },
  { id: "herbs", label: "Herbs" },
]

const origins = [
  { id: "burkina-faso", label: "Burkina Faso" },
  { id: "mali", label: "Mali" },
  { id: "niger", label: "Niger" },
]

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleOriginChange = (originId: string) => {
    setSelectedOrigins((prev) => (prev.includes(originId) ? prev.filter((id) => id !== originId) : [...prev, originId]))
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const resetFilters = () => {
    setPriceRange([0, 5000])
    setSelectedCategories([])
    setSelectedOrigins([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["categories", "price", "origins"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 5000]}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <span>{priceRange[0].toLocaleString()} XOF</span>
                <span>{priceRange[1].toLocaleString()} XOF</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="origins">
          <AccordionTrigger>Origin</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {origins.map((origin) => (
                <div key={origin.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`origin-${origin.id}`}
                    checked={selectedOrigins.includes(origin.id)}
                    onCheckedChange={() => handleOriginChange(origin.id)}
                  />
                  <Label htmlFor={`origin-${origin.id}`}>{origin.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ratings">
          <AccordionTrigger>Ratings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`}>{rating} Stars & Above</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
}
