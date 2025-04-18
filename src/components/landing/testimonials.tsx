"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { StarRating } from "@/components/ui/star-rating"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "Amadou Diallo",
    role: "Customer",
    location: "Bamako, Mali",
    content:
      "AgriMarket has transformed how I source ingredients for my restaurant. The quality of produce is exceptional, and I love supporting local farmers directly.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Fatima Ouedraogo",
    role: "Seller",
    location: "Ouagadougou, Burkina Faso",
    content:
      "Since joining AgriMarket, my business has grown by 40%. The platform makes it easy to reach customers across the region that I couldn't access before.",
    rating: 4.5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Ibrahim Maiga",
    role: "Logistician",
    location: "Niamey, Niger",
    content:
      "The delivery system is well-organized and efficient. I can manage my schedule easily and the customers are always satisfied with the service.",
    rating: 4.8,
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hear from the farmers, customers, and logisticians who use AgriMarket
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full flex flex-col bg-white dark:bg-card">
                <CardContent className="pt-6 flex-grow">
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="italic">"{testimonial.content}"</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
