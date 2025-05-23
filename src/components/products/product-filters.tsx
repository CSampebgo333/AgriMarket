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

const countries = ["All Countries", "Niger", "Burkina Faso", "Mali"]

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    country_of_origin?: string;
  }) => void;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [searchTerm, setSearchTerm] = useState("")

  const handleCategoryChange = (category: string) => {
    const newCategories = category === "All Categories" ? [] : [category]
    setSelectedCategories(newCategories)
    applyFilters({
      category: category === "All Categories" ? undefined : category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      country_of_origin: selectedCountries.length > 0 && selectedCountries[0] !== "All Countries" ? selectedCountries[0] : undefined
    })
  }

  const handleCountryChange = (country: string) => {
    const newCountries = country === "All Countries" ? [] : [country]
    setSelectedCountries(newCountries)
    applyFilters({
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      country_of_origin: country === "All Countries" ? undefined : country
    })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    applyFilters({
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      minPrice: values[0],
      maxPrice: values[1],
      country_of_origin: selectedCountries.length > 0 && selectedCountries[0] !== "All Countries" ? selectedCountries[0] : undefined
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const applyFilters = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    country_of_origin?: string;
  }) => {
    onFiltersChange(filters)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedCountries([])
    setPriceRange([0, 100000])
    setSearchTerm("")
    onFiltersChange({})
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
          <label className="text-sm font-medium">Countries</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mt-1 bg-white hover:bg-gray-50 hover:text-primary"
              >
                {selectedCountries.length ? selectedCountries[0] : "Select country"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-white">
              {countries.map((country) => (
                <DropdownMenuCheckboxItem
                  key={country}
                  checked={selectedCountries.includes(country)}
                  onCheckedChange={() => handleCountryChange(country)}
                >
                  {country}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="text-sm font-medium">
            Price Range: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} XOF
          </label>
          <Slider
            defaultValue={[0, 100000]}
            max={100000}
            step={1000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}