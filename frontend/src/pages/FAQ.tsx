import PublicLayout from "@/components/layout/PublicLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is HealthVillage?",
        a: "HealthVillage is a comprehensive healthcare management platform that connects patients, doctors, and administrators. It provides tools for appointment scheduling, medical record management, and seamless communication between all parties involved in healthcare delivery.",
      },
      {
        q: "Who can use HealthVillage?",
        a: "HealthVillage is designed for patients seeking to manage their healthcare, healthcare providers looking to streamline their practice, and administrators who oversee healthcare operations. Each role has access to tailored features and dashboards.",
      },
      {
        q: "Is HealthVillage free to use?",
        a: "HealthVillage offers different plans for individuals and healthcare organizations. Patients can create a free account to manage their health information and book appointments. Healthcare providers and organizations may have subscription options based on their needs.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Get Started' button on the homepage, fill in your details including your role (patient or healthcare provider), create a password, and verify your email. Your account will be ready to use immediately.",
      },
      {
        q: "Is my health information secure?",
        a: "Yes, security is our top priority. HealthVillage uses industry-standard encryption, secure data centers, and complies with healthcare regulations including HIPAA. Your data is only accessible to you and the healthcare providers you authorize.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot password?' on the login page, enter your email address, and we'll send you a secure link to reset your password. The link expires after 24 hours for security purposes.",
      },
    ],
  },
  {
    category: "Appointments",
    questions: [
      {
        q: "How do I book an appointment?",
        a: "Log into your patient dashboard, navigate to 'Appointments,' and click 'Book New Appointment.' Select your preferred healthcare provider, choose an available date and time, and confirm your booking. You'll receive a confirmation email immediately.",
      },
      {
        q: "Can I cancel or reschedule an appointment?",
        a: "Yes, you can cancel or reschedule appointments from your dashboard up to 24 hours before the scheduled time. Navigate to your appointments, find the booking you want to change, and select the appropriate option.",
      },
      {
        q: "Will I receive appointment reminders?",
        a: "Yes, HealthVillage sends automatic reminders via email 48 hours and 2 hours before your appointment. You can customize notification preferences in your account settings.",
      },
    ],
  },
  {
    category: "For Healthcare Providers",
    questions: [
      {
        q: "How do I set my availability?",
        a: "Access your doctor dashboard, go to 'Availability,' and configure your working hours for each day of the week. You can also block specific dates for vacations or other commitments.",
      },
      {
        q: "Can I access patient records?",
        a: "Yes, you can view the medical records of patients who have scheduled appointments with you or who have granted you access. All access is logged for security and compliance purposes.",
      },
      {
        q: "How do I manage my practice through HealthVillage?",
        a: "Your dashboard provides an overview of upcoming appointments, patient inquiries, and practice analytics. You can manage your schedule, view patient information, and communicate with patients all from one place.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <PublicLayout>
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about HealthVillage. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${section.category}-${index}`}
                      className="healthcare-card px-6 py-0 border-none"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 text-center healthcare-card bg-muted/50">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions or concerns.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default FAQ;
