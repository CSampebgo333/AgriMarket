"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

const categories = [
  "All Categories",
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy & Eggs",
  "Meat & Poultry",
  "Fish & Seafood",
  "Herbs & Spices",
  "Nuts & Seeds",
]

const regions = ["All Regions", "Central", "Northern", "Southern", "Eastern", "Western"]

export function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const router = useRouter()

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]))
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Add a function to handle filter application
  const applyFilters = () => {
    // Apply the current filter state to the products
    const queryParams = new URLSearchParams()

    if (selectedCategory) {
      queryParams.set("category", selectedCategory)
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 100) {
      queryParams.set("minPrice", priceRange[0].toString())
      queryParams.set("maxPrice", priceRange[1].toString())
    }

    if (selectedRating > 0) {
      queryParams.set("rating", selectedRating.toString())
    }

    // Navigate to the products page with the filters applied
    const queryString = queryParams.toString()
    router.push(`/products${queryString ? "?" + queryString : ""}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRegions([])
    setPriceRange([0, 100])
    setSearchTerm("")
  }

  return (
    <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="text-sm font-medium">
            Search Products
          </label>
          <div className="mt-1">
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Categories</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mt-1 bg-white hover:bg-gray-50 hover:text-primary"
              >
                {selectedCategories.length ? `${selectedCategories.length} selected` : "Select categories"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-white">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="text-sm font-medium">Regions</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mt-1 bg-white hover:bg-gray-50 hover:text-primary"
              >
                {selectedRegions.length ? `${selectedRegions.length} selected` : "Select regions"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-white">
              {regions.map((region) => (
                <DropdownMenuCheckboxItem
                  key={region}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => handleRegionChange(region)}
                >
                  {region}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="text-sm font-medium">
            Price Range: {priceRange[0] * 1000} - {priceRange[1] * 1000} XOF
          </label>
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters} className="flex-1 hover:text-primary hover:border-primary">
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}