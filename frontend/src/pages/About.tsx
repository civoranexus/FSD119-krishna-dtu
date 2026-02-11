import PublicLayout from "@/components/layout/PublicLayout";
import { Heart, Shield, Users, Award } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "Every feature we build starts with the question: How does this improve patient outcomes?",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "We implement the highest standards of data protection to keep health information safe.",
  },
  {
    icon: Users,
    title: "Collaborative Approach",
    description: "We believe healthcare works best when patients and providers communicate seamlessly.",
  },
  {
    icon: Award,
    title: "Excellence in Service",
    description: "We continuously improve our platform based on feedback from healthcare professionals.",
  },
];

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Chief Medical Officer",
    bio: "Former head of digital health at a leading hospital network with 15+ years of clinical experience.",
  },
  {
    name: "James Chen",
    role: "Chief Technology Officer",
    bio: "Previously led engineering teams at major healthcare technology companies.",
  },
  {
    name: "Dr. Maria Rodriguez",
    role: "Head of Patient Experience",
    bio: "Practicing physician and advocate for accessible, patient-friendly healthcare technology.",
  },
];

const About = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-3xl mx-auto text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Transforming Healthcare Delivery
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              HealthVillage was founded with a simple mission: make healthcare 
              management accessible, efficient, and secure for everyone involved 
              in the care journey.
            </p>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <img src="/about-us.jpg" alt="HealthVillage Team" className="rounded-2xl shadow-xl w-full max-w-md object-cover" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                HealthVillage was born from firsthand experience with the frustrations 
                of navigating the healthcare system. Our founders—a team of physicians, 
                technologists, and patients—came together with a shared vision of 
                creating a platform that truly serves everyone in the healthcare ecosystem.
              </p>
              <p>
                We recognized that the healthcare industry was ripe for innovation. 
                Patients struggled to book appointments, access their records, and 
                communicate with their care teams. Doctors spent too much time on 
                administrative tasks. Administrators lacked the tools to oversee 
                operations effectively.
              </p>
              <p>
                Today, HealthVillage serves thousands of users across the country, 
                connecting patients with healthcare providers and streamlining 
                administrative workflows. We're proud of the impact we've made, 
                but we know there's more work to be done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="healthcare-card">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4">
                  <value.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to improving healthcare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="healthcare-card text-center">
                <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-accent-foreground">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
