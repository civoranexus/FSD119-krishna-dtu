import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@healthvillage.com",
    description: "For general inquiries and support",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "1-800-HEALTH-V",
    description: "Monday to Friday, 8am to 6pm EST",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "123 Healthcare Drive, Boston, MA 02101",
    description: "Corporate headquarters",
  },
];

const Contact = () => {
  return (
    <PublicLayout>
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about HealthVillage? We're here to help. 
              Reach out and our team will respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" className="h-11" />
                  </div>
                  <div className="input-group">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" className="h-11" />
                  </div>
                </div>

                <div className="input-group">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="h-11" />
                </div>

                <div className="input-group">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="h-11" />
                </div>

                <div className="input-group">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <Button type="submit" className="w-full h-11">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Contact information</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="healthcare-card flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-foreground">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 healthcare-card bg-muted/50">
                <h3 className="font-medium text-foreground mb-2">Need urgent help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For medical emergencies, please call 911 or visit your nearest 
                  emergency room. HealthVillage support is not equipped to handle 
                  medical emergencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Contact;
