import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Lock } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const { authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill and sync name, email, phone from logged-in user profile
  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      }));
    }
  }, [authUser?.name, authUser?.email, authUser?.phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      setError("Please log in to send a message.");
      return;
    }

    // Enforce that email matches logged-in user
    if (formData.email !== authUser.email) {
      setError("You can only send messages using your registered email address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/contact/submit", formData);
      setSuccess(true);
      setFormData(prev => ({ ...prev, subject: "", message: "", phone: "" }));
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail,   label: "Email",   value: "22103220@iubat.edu" },
    { icon: Phone,  label: "Phone",   value: "(+880)1404640381" },
    { icon: MapPin, label: "Address", value: "Ashkona Medical Road, Dakshin Khan Dhaka-1230" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">

        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">Get In Touch</p>
          <h1 className="text-4xl font-bold text-foreground mb-3">Contact Us</h1>
          <p className="text-muted-foreground">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-5">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-primary/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-0.5">{label}</h3>
                  <p className="text-muted-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="relative rounded-2xl border border-border/60 bg-secondary/40 p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

            {/* Not logged in warning */}
            {!authUser && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-5">
                <Lock className="w-4 h-4 shrink-0" />
                Please <button onClick={() => navigate("/")} className="underline font-bold mx-1">log in</button> to send a message.
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm transition"
                  required
                  disabled={!authUser}
                />
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 pr-10 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm cursor-not-allowed opacity-70"
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                </div>
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                readOnly
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm cursor-not-allowed opacity-70"
                disabled={!authUser}
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!authUser}
              />
              <textarea
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm resize-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!authUser}
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
              {success && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Your message has been sent successfully!
                </div>
              )}
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
