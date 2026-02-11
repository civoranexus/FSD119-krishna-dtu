import PublicLayout from "@/components/layout/PublicLayout";

const TermsOfService = () => {
  return (
    <PublicLayout>
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-12">Last updated: January 15, 2024</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using HealthVillage, you agree to be bound by these Terms of 
                  Service and all applicable laws and regulations. If you do not agree with any 
                  of these terms, you are prohibited from using or accessing this platform. The 
                  materials contained in this platform are protected by applicable copyright and 
                  trademark law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  HealthVillage provides a healthcare management platform that enables patients 
                  to schedule appointments, access medical records, and communicate with healthcare 
                  providers. Healthcare providers can manage their schedules, patient records, and 
                  practice operations. Administrators can oversee platform operations and user management.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">To access certain features, you must create an account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Healthcare Disclaimer</h2>
                <p className="text-muted-foreground">
                  HealthVillage is a platform for healthcare management and communication. It is 
                  not a substitute for professional medical advice, diagnosis, or treatment. Always 
                  seek the advice of your physician or other qualified health provider with any 
                  questions you may have regarding a medical condition. Never disregard professional 
                  medical advice or delay in seeking it because of something you have read or 
                  accessed through HealthVillage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. User Conduct</h2>
                <p className="text-muted-foreground mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use the platform for any unlawful purpose</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the platform or servers</li>
                  <li>Attempt to gain unauthorized access to any portion of the platform</li>
                  <li>Share false or misleading health information</li>
                  <li>Violate any applicable local, state, national, or international law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The platform and its original content, features, and functionality are owned by 
                  HealthVillage and are protected by international copyright, trademark, patent, 
                  trade secret, and other intellectual property or proprietary rights laws. You 
                  may not reproduce, distribute, modify, create derivative works of, publicly 
                  display, or exploit any of our content without prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Privacy</h2>
                <p className="text-muted-foreground">
                  Your use of HealthVillage is also governed by our Privacy Policy. Please review 
                  our Privacy Policy to understand our practices regarding the collection, use, 
                  and disclosure of your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  HealthVillage shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of 
                  profits, data, use, goodwill, or other intangible losses, resulting from 
                  your access to or use of or inability to access or use the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to defend, indemnify, and hold harmless HealthVillage and its 
                  officers, directors, employees, and agents from and against any claims, 
                  liabilities, damages, judgments, awards, losses, costs, expenses, or fees 
                  arising out of or relating to your violation of these Terms or your use 
                  of the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">10. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and bar access to the platform 
                  immediately, without prior notice or liability, under our sole discretion, 
                  for any reason whatsoever and without limitation, including but not limited 
                  to a breach of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify or replace these Terms at any time. If a 
                  revision is material, we will provide at least 30 days' notice prior to 
                  any new terms taking effect. What constitutes a material change will be 
                  determined at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at 
                  legal@healthvillage.com or write to us at: HealthVillage Legal Team, 
                  123 Healthcare Drive, Boston, MA 02101.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TermsOfService;
