import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
// Assuming auth action for forgot password will be added later or done here via axios directly
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass the dashboard URL so the server can build a correct reset link
      const dashboardUrl = window.location.origin;
      const { data } = await axiosInstance.post(
        `/auth/password/forgot?frontendUrl=${encodeURIComponent(dashboardUrl)}`,
        { email }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 glass-panel z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Reset Password</h2>
          <p className="text-muted-foreground">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-input/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 transition-all"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          
          <div className="text-center mt-4">
             <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
