import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, max = 5, size = "md" }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = max - fullStars - (partialStar > 0 ? 1 : 0)

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const sizeClass = starSizes[size]

  return (
    <div className="flex">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClass} fill-primary text-primary`} />
      ))}

      {/* Partial star */}
      {partialStar > 0 && (
        <div className="relative">
          <Star className={`${sizeClass} text-muted`} />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
            <Star className={`${sizeClass} fill-primary text-primary`} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass} text-muted`} />
      ))}
    </div>
  )
}