"use client"

import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Globe, Heart, Leaf, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Updated team members data with the requested names
const teamMembers = [
  {
    name: "Clément Sampebgo",
    role: "CEO & Founder",
    bio: "With over 15 years of experience in agricultural supply chains across West Africa, Clément founded AgriMarket to empower local farmers.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Debora Stanley Suday",
    role: "CTO",
    bio: "Debora leads our technology team, bringing her expertise in building digital platforms that work reliably even in areas with limited connectivity.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Ester Michael Mkuya",
    role: "Operations Director",
    bio: "Ester oversees our logistics network, ensuring smooth delivery of products from farms to customers across the region.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Ousmane Boubacar Bako",
    role: "Marketing Director",
    bio: "Ousmane develops our marketing strategies, focusing on connecting farmers with buyers and promoting sustainable agriculture across West Africa.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Ramatou Salah Hassane",
    role: "Community Manager",
    bio: "Ramatou works directly with our farmer communities, providing training and support to help them succeed on our platform.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Values data
const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "We prioritize the needs of our farming communities and customers in everything we do.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We promote sustainable farming practices that protect the environment and ensure long-term food security.",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "We believe in honest, clear communication with all our stakeholders.",
  },
  {
    icon: Globe,
    title: "Regional Impact",
    description: "We're committed to strengthening food systems across West Africa through technology and innovation.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/img1.jpg')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Mission</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                AgriMarket is on a mission to transform food systems in West Africa by connecting farmers directly with
                buyers, eliminating middlemen, and ensuring fair prices for all. We&apos;re building a more sustainable,
                transparent, and efficient agricultural marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="cursor-pointer">
                  <Link href="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="cursor-pointer">
                  <Link href="/products">Explore Products</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
                <div className="space-y-4">
                  <p>
                    AgriMarket was founded in 2020 with a simple idea: to create a digital marketplace that would
                    connect farmers in Burkina Faso, Mali, and Niger directly with buyers, eliminating middlemen and
                    ensuring fair prices for all.
                  </p>
                  <p>
                    Our founder, Clément Sampebgo, grew up in a farming family in rural Burkina Faso. He witnessed
                    firsthand the challenges farmers faced in getting fair prices for their crops and accessing reliable
                    markets.
                  </p>
                  <p>
                    After studying agricultural economics and working with several international development
                    organizations, Clément decided to leverage technology to solve these persistent challenges. He
                    assembled a team of experts in technology, logistics, and agriculture to build AgriMarket.
                  </p>
                  <p>
                    Today, AgriMarket serves thousands of farmers and buyers across West Africa, facilitating the trade
                    of local food crops and helping to build a more resilient regional food system.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="relative h-[400px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/images/img1.jpg"
                  alt="Farmers in West Africa"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight">Our Values</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                These core principles guide everything we do at AgriMarket
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
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
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight">Our Team</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Meet the passionate people behind AgriMarket
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full bg-white dark:bg-card">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-primary font-medium mb-2 text-sm">{member.role}</p>
                        <p className="text-muted-foreground text-sm">{member.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="relative h-[400px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/images/img1.jpg"
                  alt="AgriMarket Impact"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Impact</h2>
                <div className="space-y-4">
                  <p>
                    Since our launch, we&apos;ve helped thousands of farmers across West Africa connect with buyers and
                    get better prices for their crops. We&apos;ve also helped buyers access fresh, high-quality produce
                    directly from farmers.
                  </p>
                  <p>
                    Our platform has facilitated the trade of over 10,000 tons of local food crops, supporting
                    sustainable agriculture and food security in the region.
                  </p>
                  <p>
                    We&apos;re proud of our impact, but we know there&apos;s still much more to do. We&apos;re committed to
                    continuing to grow and improve our platform to better serve our community.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Join the AgriMarket Community</h2>
              <p className="text-lg mb-8">
                Whether you&apos;re a farmer looking to sell your crops, a buyer seeking quality produce, or an investor
                interested in supporting our mission, we&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="cursor-pointer">
                  <Link href="/auth/signup">Create an Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="cursor-pointer bg-transparent border-white hover:bg-white/10"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
