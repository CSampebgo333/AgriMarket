"use client"

import { ShoppingBag, Truck, CreditCard, Users } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: ShoppingBag,
    title: "Browse Products",
    description: "Explore a wide range of food crops from local farmers across West Africa.",
  },
  {
    icon: CreditCard,
    title: "Place Your Order",
    description: "Select products, add to cart, and complete your purchase with mobile money.",
  },
  {
    icon: Truck,
    title: "Track Delivery",
    description: "Follow your order from the farm to your doorstep with real-time updates.",
  },
  {
    icon: Users,
    title: "Rate & Review",
    description: "Share your experience and help other customers make informed decisions.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How AgriMarket Works
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform makes it easy to connect farmers with customers across West Africa
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-white dark:bg-card p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}