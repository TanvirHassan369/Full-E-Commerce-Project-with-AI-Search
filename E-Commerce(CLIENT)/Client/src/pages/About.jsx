import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    { icon: Heart,   title: "Customer First",    description: "We put our customers at the heart of everything we do." },
    { icon: Award,   title: "Quality Products",  description: "We ensure all products meet our high standards." },
    { icon: Users,   title: "Community",         description: "Building lasting relationships with our customers." },
    { icon: Target,  title: "Innovation",        description: "Constantly improving our platform and services." },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">

        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">Who We Are</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">About Daily Bazar</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your trusted e-commerce platform for quality products and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {values.map((value, index) => (
            <div key={index} className="glass-card text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="relative rounded-2xl border border-border/60 bg-secondary/40 p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded with a vision to make online shopping simple and enjoyable, Daily Bazar has grown
              to become a trusted platform for thousands of customers worldwide. We believe that
              everyone deserves access to quality products at fair prices, backed by exceptional
              customer service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
