import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, logoutAdmin, clearAuthError } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      navigate("/");
    } else if (isAuthenticated && user && user?.role !== "Admin") {
      toast.error("Access denied. Admin only.");
      dispatch(logoutAdmin());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password }));
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] rounded-full bg-emerald-500/8 blur-[80px] pointer-events-none" />

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div>
            <p className="font-extrabold text-foreground text-lg leading-none">Daily Bazar</p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-extrabold text-foreground leading-tight tracking-tight">
              Manage your<br />
              <span className="text-gradient">store smarter.</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed max-w-sm">
              Full control over products, orders, users, and analytics — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "📦", label: "Product & Inventory Management" },
              { icon: "📊", label: "Real-time Sales Analytics" },
              { icon: "🚚", label: "Order Tracking & Fulfillment" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-base shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-muted-foreground font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50">© 2025 Daily Bazar. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <p className="font-extrabold text-foreground text-lg">Daily Bazar</p>
          </div>

          <div className="glass-panel p-8 animate-fade-in-up">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <ShieldCheck size={13} className="text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide">Admin Access Only</span>
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground text-sm mt-1">Sign in to your admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-input/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <Link to="/password/forgot" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-11 py-2.5 border border-border rounded-xl bg-input/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm [&::-ms-reveal]:hidden"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm mt-2 justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
