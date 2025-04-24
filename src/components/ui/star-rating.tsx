import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
}

// Update the StarRating component to color stars proportionally
export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= Math.floor(rating)
              ? "text-yellow-500 fill-yellow-500"
              : star <= rating
                ? "text-yellow-500 fill-yellow-500 opacity-50"
                : "text-gray-300",
          )}
        />
      ))}
    </div>
  )
}

// Add a new component for rating bars that colors proportionally
export function RatingBars({ ratings }: { ratings: Record<number, number> }) {
  const totalRatings = Object.values(ratings).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = ratings[rating] || 0
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0

        return (
          <div key={rating} className="flex items-center">
            <span className="w-10 text-sm">{rating} ★</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
              <div
                className="rating-bar-fill h-2.5 rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: `hsl(45deg 93% 47% / ${percentage}%)`,
                }}
              ></div>
            </div>
            <span className="w-10 text-sm text-right">{count}</span>
          </div>
        )
      })}
    </div>
  )
}
