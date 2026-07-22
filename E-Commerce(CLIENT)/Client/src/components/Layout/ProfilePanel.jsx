import { useState, useEffect } from "react";
import {
  X,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup, closeAuthPopup } from "../../store/slices/popupSlice";
import {
  logout,
  updateProfile,
  updatePassword,
} from "../../store/slices/authSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth,
  );

  // --- CLOUDINARY FIX: Handle the Cloudinary URL object correctly ---
  const getAvatarUrl = (user) => {
    if (!user || !user.avatar) return "";
    
    let path = "";
    
    // 1. Extract the path
    if (typeof user.avatar === "string") {
      path = user.avatar;
    } else if (typeof user.avatar === "object") {
      path = user.avatar.secure_url || user.avatar.url || "";
    }

    if (!path) return "";

    // 2. If it's already a full Cloudinary URL or a local preview, return it
    if (path.startsWith("http") || path.startsWith("data:")) {
      return path;
    }

    // 3. Your actual backend base URL
    const BACKEND_URL = "http://localhost:4000"; 
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  // Profile form states
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [phone, setPhone] = useState(authUser?.phone || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(getAvatarUrl(authUser));
  const [profileErrors, setProfileErrors] = useState({});

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Update form when authUser changes
  useEffect(() => {
    if (authUser) {
      setName(authUser?.name || "");
      setEmail(authUser?.email || "");
      setPhone(authUser?.phone || "");
      setAvatarPreview(getAvatarUrl(authUser));
      setProfileErrors({});
      setPasswordErrors({});
    }
  }, [authUser, isAuthPopupOpen]);

  // Handle avatar selection and preview (Local Preview Before Upload)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setProfileErrors({ avatar: "File size must be less than 10MB" });
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setProfileErrors({ avatar: "Please select a valid image file" });
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Sets the local preview base64 string
      };
      reader.readAsDataURL(file);
      setProfileErrors({});
    }
  };

  // Validate profile form
  const validateProfile = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format";
    if (phone && !/^01[3-9]\d{8}$/.test(phone))
      errors.phone = "Enter a valid 11-digit BD number (01XXXXXXXXX)";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePassword = () => {
    const errors = {};
    if (!currentPassword)
      errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (newPassword && newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone || "");
    if (avatar) {
      formData.append("avatar", avatar);
    }

    dispatch(updateProfile(formData))
      .unwrap()
      .then((response) => {
        setAvatar(null);
        setProfileErrors({});
        
        // Handle nested response objects from the backend
        const updatedUser = response?.user || response?.data || response;
        
        if (updatedUser) {
          // Update preview with the new Cloudinary URL
          setAvatarPreview(getAvatarUrl(updatedUser));
        }
      })
      .catch(() => {
        // Error is already handled by toast in the thunk
      });
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    // Bug 3 FIX: send plain JSON, not FormData — server reads req.body
    dispatch(updatePassword({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    }))
      .unwrap()
      .then(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordErrors({});
      })
      .catch(() => {
        // Error is already handled by toast in the thunk
      });
  };

  // Bug 4 FIX: use closeAuthPopup instead of toggle — logout was reopening login modal
  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeAuthPopup());
  };

  if (!isAuthPopupOpen || !authUser) return null;

  return (
    <>
      {/* COMBINED OVERLAY AND WRAPPER */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity flex justify-end animate-fade-in"
        onClick={() => dispatch(toggleAuthPopup())}
      >
        {/* SIDE PANEL */}
        <div
          className="h-full w-full max-w-md bg-background shadow-2xl border-l border-border/60 flex flex-col transition-colors duration-200 animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* top accent line */}
          <div className="h-0.5 gradient-primary shrink-0" />

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-background shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Profile
              </h2>
            </div>
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none"
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-6 space-y-8">
              {/* AVATAR SECTION */}
              <div className="text-center flex flex-col items-center">
                <div className="relative group mb-4">
                  <img
                    src={avatarPreview || getAvatarUrl(authUser) || "/avatar-holder.avif"}
                    alt={authUser?.name}
                    className="relative w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover bg-secondary transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/avatar-holder.avif";
                    }}
                  />

                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
                    title="Change avatar"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Change</span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {authUser?.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {authUser?.email}
                </p>
              </div>

              {/* PERSONAL INFORMATION FORM */}
              <form
                onSubmit={handleUpdateProfile}
                className="bg-secondary/40 border border-border/60 p-5 rounded-2xl space-y-4"
              >
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-primary" />
                  Personal Information
                </h3>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground transition-all ${
                      profileErrors.name
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {profileErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground transition-all ${
                      profileErrors.email
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {profileErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                        setPhone(digits);
                        if (profileErrors.phone) setProfileErrors({ ...profileErrors, phone: "" });
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`w-full pl-10 pr-16 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground transition-all ${
                        profileErrors.phone ? "border-destructive" : "border-border"
                      }`}
                    />
                    <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums pointer-events-none ${
                      phone.length === 11 ? "text-emerald-400" : "text-muted-foreground"
                    }`}>
                      {phone.length}/11
                    </span>
                  </div>
                  {profileErrors.phone && (
                    <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {profileErrors.phone}
                    </p>
                  )}
                </div>

                {/* Update Profile Button */}
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="btn-primary w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>

              {/* PASSWORD CHANGE FORM */}
              <form
                onSubmit={handleUpdatePassword}
                className="bg-secondary/40 border border-border/60 p-5 rounded-2xl space-y-4"
              >
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-primary" />
                  Security Settings
                </h3>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className={`w-full pl-4 pr-11 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground transition-all ${
                        passwordErrors.currentPassword
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className={`w-full pl-4 pr-11 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground transition-all ${
                        passwordErrors.newPassword
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`w-full pl-4 pr-11 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 text-foreground transition-all ${
                        passwordErrors.confirmPassword
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Update Password Button */}
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="btn-secondary w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isUpdatingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* FOOTER - LOGOUT */}
          <div className="border-t border-border/50 p-6 bg-background shrink-0">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl hover:bg-destructive/20 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
