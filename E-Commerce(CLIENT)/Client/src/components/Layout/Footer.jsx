import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { axiosInstance } from "../../lib/axios";

const Footer = () => {
  const [subEmail, setSubEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubLoading(true);
    try {
      const res = await axiosInstance.post("/newsletter/subscribe", { email: subEmail });
      setSubMsg(res.data.message);
      setSubEmail("");
    } catch (err) {
      setSubMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubLoading(false);
      setTimeout(() => setSubMsg(""), 5000);
    }
  };
  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
    ],
    customer: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative mt-20 border-t border-border/50 bg-background">
      {/* top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <h2 className="text-xl font-bold text-gradient">Daily Bazar</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Your trusted partner for online shopping. Discover amazing products with exceptional quality and service.
            </p>
            <div className="space-y-2.5">
              {[
                { icon: Mail, text: "22103220@iubat.edu" },
                { icon: Phone, text: "(+880)1404640381" },
                { icon: MapPin, text: "Ashkona Medical Road, Dakshin Khan Dhaka-1230" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Company", links: footerLinks.company },
            { title: "Customer Service", links: footerLinks.customer },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="relative rounded-2xl border border-border/60 bg-secondary/40 p-8 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">Get exclusive deals and updates straight to your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} className="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              required
              className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm transition"
            />
            <button type="submit" disabled={subLoading} className="btn-primary whitespace-nowrap disabled:opacity-60">
              {subLoading ? "..." : "Subscribe"}
            </button>
          </form>
          {subMsg && <p className="text-center text-xs mt-2 text-primary">{subMsg}</p>}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40">
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-xl bg-secondary/60 border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-muted-foreground transition-all duration-200"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground">© 2026 Daily Bazar. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Developed by CodeWithZeeshu</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
