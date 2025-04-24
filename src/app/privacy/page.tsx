import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 20, 2023</p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              AgriMarket ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our website, mobile
              application, and services (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access the Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you register for an account, create or modify
              your profile, make a purchase, or communicate with us. This information may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Personal Information: Name, email address, phone number, mailing address, and payment information.
              </li>
              <li>Profile Information: Username, password, profile picture, and user preferences.</li>
              <li>
                Transaction Information: Products purchased, payment methods, delivery addresses, and order history.
              </li>
              <li>Communications: Messages sent to us through the Service, including customer support inquiries.</li>
            </ul>
            <p>We also automatically collect certain information when you use the Service, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device Information: IP address, browser type, operating system, and device identifiers.</li>
              <li>Usage Information: Pages visited, time spent on pages, links clicked, and search queries.</li>
              <li>
                Location Information: General location based on IP address or more precise location if you grant
                permission.
              </li>
              <li>
                Cookies and Similar Technologies: Information collected through cookies, web beacons, and similar
                technologies.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Providing and maintaining the Service</li>
              <li>Processing transactions and delivering products</li>
              <li>Managing your account and providing customer support</li>
              <li>Sending you updates, notifications, and promotional messages</li>
              <li>Personalizing your experience and showing you relevant content</li>
              <li>Analyzing usage patterns and improving the Service</li>
              <li>Detecting, preventing, and addressing technical issues and security breaches</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Other Users: When you make a purchase, we share your information with the seller to facilitate the
                transaction. When you sell a product, we share your information with the buyer.
              </li>
              <li>
                Service Providers: We may share your information with third-party vendors, consultants, and other
                service providers who need access to such information to carry out work on our behalf.
              </li>
              <li>
                Business Transfers: If we are involved in a merger, acquisition, or sale of all or a portion of our
                assets, your information may be transferred as part of that transaction.
              </li>
              <li>
                Legal Requirements: We may disclose your information if required to do so by law or in response to valid
                requests by public authorities.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no method of transmission over the Internet or method of
              electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your
              personal information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Data Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access: You can request access to the personal information we hold about you.</li>
              <li>Correction: You can request that we correct inaccurate or incomplete information.</li>
              <li>Deletion: You can request that we delete your personal information in certain circumstances.</li>
              <li>
                Restriction: You can request that we restrict the processing of your information in certain
                circumstances.
              </li>
              <li>
                Data Portability: You can request a copy of your personal information in a structured, machine-readable
                format.
              </li>
              <li>
                Objection: You can object to our processing of your personal information in certain circumstances.
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children under 18. If you are a parent or guardian and you are aware that your child has
              provided us with personal information, please contact us so that we can take necessary actions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You
              are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              AgriMarket
              <br />
              123 Main Street
              <br />
              Ouagadougou, Burkina Faso
              <br />
              Email: privacy@agrimarket.com
              <br />
              Phone: +226 XX XX XX XX
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}