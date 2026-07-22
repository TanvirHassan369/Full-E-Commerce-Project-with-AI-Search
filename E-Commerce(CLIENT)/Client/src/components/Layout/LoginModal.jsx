import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Phone, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { register, verifyOTP, resendOTP, login, forgotPassword, resetPassword } from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } = useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (location.pathname.startsWith("/password/reset")) {
      setMode("reset-password");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (isAuthPopupOpen && !authUser && !location.pathname.startsWith("/password/reset")) {
      setMode("signin");
      resetForm();
    }
  }, [isAuthPopupOpen, authUser, location.pathname]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot-password") {
      dispatch(forgotPassword(formData.email)).then(() => { dispatch(toggleAuthPopup()); setMode("signin"); });
      return;
    }
    if (mode === "reset-password") {
      const token = location.pathname.split("/").pop();
      dispatch(resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword }));
      return;
    }
    if (mode === "signup") {
      dispatch(register({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }))
        .unwrap()
        .then(() => {
          setPendingEmail(formData.email);
          setOtpStep(true);
          setResendTimer(60);
        })
        .catch(() => {});
      return;
    }
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email: pendingEmail, otp: otpCode }))
      .unwrap()
      .then(() => { setOtpStep(false); resetForm(); })
      .catch(() => {});
  };

  const handleResendOTP = () => {
    dispatch(resendOTP(pendingEmail));
    setResendTimer(60);
    setOtpCode("");
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOtpStep(false);
    setOtpCode("");
    setPendingEmail("");
    setResendTimer(0);
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading = isSigningUp || isLoggingIn || isRequestingForToken;

  const titles = {
    signin: "Welcome back",
    signup: otpStep ? "Verify your email" : "Create account",
    "forgot-password": "Reset password",
    "reset-password": "New password",
  };

  const inputClass = "w-full bg-secondary border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => { dispatch(toggleAuthPopup()); resetForm(); }}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-background border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-1 w-full gradient-primary" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{titles[mode]}</h2>
          </div>
          <button
            onClick={() => { dispatch(toggleAuthPopup()); resetForm(); }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === "forgot-password" && (
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Enter your email and we'll send you a link to reset your password.
            </p>
          )}

          {/* ── OTP VERIFICATION STEP ── */}
          {mode === "signup" && otpStep ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit OTP to <span className="text-foreground font-semibold">{pendingEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Valid for 10 minutes</p>
              </div>

              {/* OTP Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-secondary border border-border rounded-xl py-3 px-4 text-center text-2xl font-bold tracking-[0.5em] text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>
                ) : "Verify & Create Account"}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Resend OTP in <span className="text-primary font-semibold">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => { setOtpStep(false); setOtpCode(""); }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                ← Back to signup
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Full Name" className={inputClass}
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            )}

            {/* Email */}
            {mode !== "reset-password" && (
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder="Email address" className={inputClass}
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            )}

            {/* Phone — signup only */}
            {mode === "signup" && (
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Phone number (01XXXXXXXXX)"
                  className={`${inputClass} pr-16`}
                  value={formData.phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setFormData({ ...formData, phone: digits });
                  }}
                  maxLength={11}
                  required
                />
                <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums pointer-events-none ${
                  formData.phone.length === 11 ? "text-emerald-400" : "text-muted-foreground"
                }`}>
                  {formData.phone.length}/11
                </span>
              </div>
            )}

            {/* Password */}
            {mode !== "forgot-password" && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "reset-password" ? "New password" : "Password"}
                  className={`${inputClass} pr-11`}
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required
                />
                <button type="button" tabIndex="-1" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Confirm Password */}
            {mode === "reset-password" && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className={`${inputClass} pr-11`}
                  value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required
                />
                <button type="button" tabIndex="-1" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Forgot link */}
            {mode === "signin" && (
              <div className="flex justify-end">
                <button type="button" onClick={() => setMode("forgot-password")}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full btn-primary py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === "reset-password" ? "Resetting..." : mode === "signup" ? "Sending OTP..." : mode === "forgot-password" ? "Sending..." : "Signing in..."}</span></>
              ) : mode === "reset-password" ? "Reset Password"
                : mode === "signup" ? "Send OTP"
                : mode === "forgot-password" ? "Send Reset Link"
                : "Sign In"}
            </button>
          </form>
          )}

          {/* Toggle */}
          {["signin", "signup"].includes(mode) && !otpStep && (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <button type="button"
                onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); resetForm(); }}
                className="text-primary hover:text-primary/80 font-semibold transition-colors">
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          )}

          {mode === "forgot-password" && (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Remember it?{" "}
              <button type="button" onClick={() => { setMode("signin"); resetForm(); }}
                className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
