import PublicLayout from "@/components/layout/PublicLayout";

const PrivacyPolicy = () => {
  return (
    <PublicLayout>
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: January 15, 2024</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Introduction</h2>
                <p className="text-muted-foreground">
                  HealthVillage ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our healthcare management platform. Please read this 
                  policy carefully to understand our practices regarding your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Personal identification information (name, email address, phone number)</li>
                  <li>Health information (medical history, appointments, prescriptions)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Communication records (messages with healthcare providers)</li>
                  <li>Payment information (if applicable)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide and maintain our healthcare management services</li>
                  <li>Facilitate communication between patients and healthcare providers</li>
                  <li>Process appointments and maintain medical records</li>
                  <li>Send appointment reminders and health-related notifications</li>
                  <li>Improve our services and develop new features</li>
                  <li>Comply with legal obligations and healthcare regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal and 
                  health information. This includes encryption of data in transit and at rest, 
                  secure server infrastructure, access controls, and regular security audits. 
                  We comply with HIPAA and other applicable healthcare data protection regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Information Sharing</h2>
                <p className="text-muted-foreground mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Healthcare providers you choose to connect with through our platform</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We never sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate data</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Receive a copy of your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to improve your experience on our 
                  platform. These help us remember your preferences, understand how you use 
                  our services, and provide personalized content. You can control cookie 
                  settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for children under 13. We do not knowingly 
                  collect personal information from children under 13. If you believe we have 
                  collected such information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of 
                  any changes by posting the new policy on this page and updating the "Last 
                  updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our data practices, 
                  please contact us at privacy@healthvillage.com or write to us at: 
                  HealthVillage Privacy Team, 123 Healthcare Drive, Boston, MA 02101.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
