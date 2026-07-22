import { Truck, Shield, Headphones, CreditCard } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: (
      <span className="flex items-center gap-1 flex-wrap">
        Free shipping on orders over
        <span className="inline-flex items-center gap-0.5 font-medium text-primary">
          <FaBangladeshiTakaSign className="text-xs shrink-0" />
          5,000
        </span>
        nationwide
      </span>
    ),
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: (
      <span>
        <span className="font-medium text-primary">100%</span> secure payment with SSL encryption
      </span>
    ),
    color: "from-emerald-500 to-teal-600",
  },
  
  {
  icon: CreditCard,
  title: "Easy Returns",
  description: (
    <span>
      <span className="font-medium text-primary">7-day</span> hassle-free return policy
    </span>
  ),
  color: "from-emerald-500 to-teal-600",
},
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer support available anytime",
    color: "from-blue-500 to-cyan-600",
  },
  
];

const FeatureSection = () => {
  return (
    <section className="py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative rounded-2xl border border-border/50 bg-secondary/40 p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* subtle bg glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
