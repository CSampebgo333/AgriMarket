import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to the most common questions about AgriMarket, our services, and how our platform works.
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">What is AgriMarket?</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                AgriMarket is a digital marketplace that connects farmers in Burkina Faso, Mali, and Niger directly with
                buyers, eliminating middlemen and ensuring fair prices. Our platform allows farmers to list their
                products, and buyers to purchase fresh, local produce directly from the source.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">How do I create an account?</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                To create an account, click on the &quot;Sign Up&quot; button in the top right corner of the page. You&apos;ll need to
                provide your name, email address, phone number, and choose whether you&apos;re registering as a customer,
                seller, logistician, or administrator. Once you&apos;ve filled out the form, click &quot;Create account&quot; to
                complete the registration process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">How do payments work?</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                AgriMarket supports multiple payment methods including mobile money (like Orange Money and MTN Mobile
                Money), cash on delivery, and bank transfers. When checking out, you can select your preferred payment
                method. For mobile money and bank transfers, you&apos;ll receive instructions on how to complete the payment.
                For cash on delivery, you&apos;ll pay when you receive your order.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">How is delivery handled?</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                We work with a network of local logistics partners to ensure timely delivery of products. Delivery times
                and costs vary depending on your location and the seller&apos;s location. During checkout, you&apos;ll see the
                estimated delivery time and cost. You can track your order through your customer dashboard once it&apos;s
                been placed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">
                I&apos;m a farmer. How do I sell my products on AgriMarket?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                To sell on AgriMarket, first create an account as a seller. Once your account is approved, you can add
                your products through your seller dashboard. You&apos;ll need to provide details such as product name,
                description, price, quantity available, and photos. Our team may verify your information before your
                products go live on the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">
                What fees does AgriMarket charge?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                For sellers, AgriMarket charges a small commission on each sale, typically 5-10% depending on the
                product category. This fee covers the cost of maintaining the platform, payment processing, and customer
                support. Buyers do not pay any fees to use the platform, but may be charged for delivery depending on
                their location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">How do I track my order?</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Once you&apos;ve placed an order, you can track it through your customer dashboard. Log in to your account,
                go to &quot;My Orders,&quot; and select the order you want to track. You&apos;ll see the current status of your order
                and estimated delivery time. You&apos;ll also receive SMS and email updates as your order progresses.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">
                What if I&apos;m not satisfied with my order?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Customer satisfaction is our priority. If you&apos;re not satisfied with your order, please contact our
                customer support team within 24 hours of receiving your order. Depending on the issue, we may offer a
                refund, replacement, or partial credit. Please note that perishable items have specific return policies
                due to their nature.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">
                How can I contact customer support?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                You can contact our customer support team through the &quot;Contact&quot; page on our website, by email at
                support@agrimarket.com, or by phone at +226 XX XX XX XX. Our support hours are Monday to Friday, 8:00 AM
                to 6:00 PM West Africa Time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium py-4">
                Is AgriMarket available in my region?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Currently, AgriMarket operates in Burkina Faso, Mali, and Niger. We&apos;re working on expanding to other
                West African countries. If you&apos;re in one of our current service areas, you can use the platform to buy
                or sell agricultural products. If you&apos;re outside these regions, please check back later as we continue
                to grow.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
            <p className="mb-4">
              If you couldn&apos;t find the answer to your question, please don&apos;t hesitate to contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@agrimarket.com"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}