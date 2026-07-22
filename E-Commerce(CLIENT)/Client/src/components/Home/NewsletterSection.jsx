import { useState } from "react";
import { Mail, Send, Sparkles } from "lucide-react";
import { axiosInstance } from "../../lib/axios";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/newsletter/subscribe", { email });
      setMessage(res.data.message);
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitted(true);
    } finally {
      setLoading(false);
      setTimeout(() => { setSubmitted(false); setMessage(""); }, 5000);
    }
  };

  return (
    <section className="py-16">
      <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-secondary/30 p-10 text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-xl mx-auto">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-3">Stay in the loop</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special offers.
          </p>

          {submitted ? (
            <div className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl border font-medium ${
              message.toLowerCase().includes("already") || message.toLowerCase().includes("wrong")
                ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
                : "bg-accent/10 border-accent/30 text-accent"
            }`}>
              <Mail className="w-5 h-5 shrink-0" />
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground placeholder:text-muted-foreground text-sm transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Send className="w-4 h-4" /> Subscribe</>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
