import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 20, 2023</p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to AgriMarket. These Terms of Service ("Terms") govern your use of the AgriMarket website, mobile
              application, and services (collectively, the "Service") operated by AgriMarket ("we," "us," or "our"). By
              accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the
              Terms, you may not access the Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Definitions</h2>
            <p>
              <strong>"User"</strong> refers to any individual who accesses or uses the Service, including buyers,
              sellers, logisticians, and administrators.
            </p>
            <p>
              <strong>"Buyer"</strong> refers to a User who purchases products through the Service.
            </p>
            <p>
              <strong>"Seller"</strong> refers to a User who offers products for sale through the Service.
            </p>
            <p>
              <strong>"Logistician"</strong> refers to a User who provides logistics services through the Service.
            </p>
            <p>
              <strong>"Content"</strong> refers to text, images, photos, audio, video, and all other forms of data or
              communication posted on or transmitted through the Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              To use certain features of the Service, you must register for an account. When you register, you must
              provide accurate and complete information. You are solely responsible for the activity that occurs on your
              account, and you must keep your account password secure. You must notify us immediately of any breach of
              security or unauthorized use of your account.
            </p>
            <p>
              We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole
              discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. User Conduct</h2>
            <p>You agree not to use the Service:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>
                To transmit, or procure the sending of, any advertising or promotional material, including any "junk
                mail," "chain letter," "spam," or any other similar solicitation.
              </li>
              <li>
                To impersonate or attempt to impersonate AgriMarket, an AgriMarket employee, another user, or any other
                person or entity.
              </li>
              <li>
                To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or
                which, as determined by us, may harm AgriMarket or users of the Service or expose them to liability.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Products and Transactions</h2>
            <p>
              AgriMarket is a platform that connects Buyers and Sellers. We are not a party to any transaction between
              Buyers and Sellers. As a result, we have no control over the quality, safety, legality, or availability of
              the products offered for sale on the Service, the ability of Sellers to sell products, or the ability of
              Buyers to pay for products.
            </p>
            <p>
              Sellers are responsible for ensuring that their products comply with all applicable laws and regulations.
              Buyers are responsible for verifying the quality and condition of products before accepting delivery.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Fees and Payments</h2>
            <p>
              AgriMarket charges Sellers a commission on each sale made through the Service. The commission rate varies
              by product category and is displayed to Sellers before they list a product for sale.
            </p>
            <p>
              Buyers may be charged for delivery services, depending on their location and the delivery options
              selected. All fees and charges are clearly displayed before a transaction is completed.
            </p>
            <p>
              Payment methods accepted include mobile money, cash on delivery, and bank transfers. AgriMarket is not
              responsible for any fees or charges imposed by payment providers.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality
              are and will remain the exclusive property of AgriMarket and its licensors. The Service is protected by
              copyright, trademark, and other laws of both the countries where AgriMarket operates and foreign
              countries. Our trademarks and trade dress may not be used in connection with any product or service
              without the prior written consent of AgriMarket.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              In no event shall AgriMarket, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your
              access to or use of or inability to access or use the Service; (ii) any conduct or content of any third
              party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or
              alteration of your transmissions or content, whether based on warranty, contract, tort (including
              negligence), or any other legal theory, whether or not we have been informed of the possibility of such
              damage.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              AgriMarket
              <br />
              123 Main Street
              <br />
              Ouagadougou, Burkina Faso
              <br />
              Email: legal@agrimarket.com
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