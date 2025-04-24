"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"

// Testimonial data with avatar images
const testimonials = [
  {
    id: 1,
    content:
      "AgriMarket has transformed how I sell my produce. I now reach customers directly and earn 30% more than before. The platform is easy to use even with my basic smartphone.",
    author: {
      name: "Amadou Diallo",
      role: "Grain Farmer, Mali",
      avatar: "/images/amadou_diallo.jpg",
    },
  },
  {
    id: 2,
    content:
      "As a restaurant owner, I need consistent quality and reliable delivery. AgriMarket connects me directly with the best farmers in the region. The produce is always fresh and arrives on time.",
    author: {
      name: "Fatima Ouedraogo",
      role: "Restaurant Owner, Burkina Faso",
      avatar: "/images/fatima_ouderaogo.jpeg",
    },
  },
  {
    id: 3,
    content:
      "The transparency on AgriMarket is what I value most. I can see exactly where my food comes from, who grew it, and how it was transported. This builds trust and supports our local farmers.",
    author: {
      name: "Ibrahim Maiga",
      role: "Consumer, Niger",
      avatar: "/images/ibrahim_maiga.jpeg",
    },
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Hear from farmers, buyers, and logistics partners who use AgriMarket every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="relative mb-6 pb-6 border-b">
                    <div className="absolute -top-8 left-0">
                      <svg
                        className="h-8 w-8 text-primary/20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage
                        src={testimonial.author.avatar || "/placeholder.svg"}
                        alt={testimonial.author.name}
                      />
                      <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.author.role}</p>
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