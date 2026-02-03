import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Shield, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book appointments with your healthcare providers in seconds, not hours.",
  },
  {
    icon: Shield,
    title: "Secure Records",
    description: "Your medical records are encrypted and accessible only to you and your care team.",
  },
  {
    icon: Users,
    title: "Connected Care",
    description: "Seamless communication between patients, doctors, and healthcare administrators.",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Access your health information anytime, anywhere, from any device.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up as a patient, doctor, or administrator to get started.",
  },
  {
    number: "02",
    title: "Complete Your Profile",
    description: "Add your health information or professional credentials.",
  },
  {
    number: "03",
    title: "Start Managing Health",
    description: "Book appointments, view records, and manage your healthcare journey.",
  },
];

const roles = [
  {
    title: "For Patients",
    description: "Manage appointments, access medical records, and communicate with your healthcare team.",
    href: "/patient/dashboard",
    features: ["Book appointments", "View medical history", "Secure messaging"],
  },
  {
    title: "For Doctors",
    description: "Streamline your practice with efficient scheduling and patient management tools.",
    href: "/doctor/dashboard",
    features: ["Manage schedule", "View patient records", "Set availability"],
  },
  {
    title: "For Administrators",
    description: "Oversee operations, manage users, and ensure smooth healthcare delivery.",
    href: "/admin/dashboard",
    features: ["User management", "System overview", "Analytics dashboard"],
  },
];

const Index = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance animate-fade-in">
              Healthcare Management Made{" "}
              <span className="text-primary">Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance animate-fade-in">
              HealthVillage connects patients, doctors, and administrators on a single, 
              secure platform designed for modern healthcare delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="xl" variant="hero" asChild>
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="hero-outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to simplify healthcare management for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="healthcare-card text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4">
                  <feature.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started with HealthVillage is simple and straightforward.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="healthcare-card">
                  <span className="text-4xl font-bold text-primary/20 mb-4 block">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a patient, healthcare provider, or administrator, 
              HealthVillage has the tools you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div key={role.title} className="healthcare-card flex flex-col h-full">
                <h3 className="text-xl font-semibold text-foreground mb-3">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={role.href}>
                    Explore Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="healthcare-card text-center max-w-3xl mx-auto hero-gradient text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of users who trust HealthVillage for their healthcare management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
