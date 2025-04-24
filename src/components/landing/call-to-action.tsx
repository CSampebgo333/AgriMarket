import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CallToAction() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our marketplace today and start buying or selling fresh produce from West Africa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto">Sign Up Now</Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Browse Products</Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 