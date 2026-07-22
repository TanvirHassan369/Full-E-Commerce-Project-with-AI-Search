import { Menu, LogOut, ChevronDown, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../store/slices/authSlice";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    const url = typeof avatar === "string" ? avatar : avatar.url || "";
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${BACKEND_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const avatarUrl = getAvatarUrl(user?.avatar);

  const handleLogout = async () => {
    setShowDropdown(false);
    await dispatch(logoutAdmin());
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
      {/* Left: mobile menu button */}
      <div className="flex items-center">
        <button className="md:hidden text-foreground hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-secondary">
          <Menu size={20} />
        </button>
      </div>

      {/* Right: user */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center border border-primary/30 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-foreground leading-none">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5 flex items-center gap-1">
                <Shield size={9} className="text-primary" /> {user?.role || "Admin"}
              </p>
            </div>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-popover border border-border rounded-2xl shadow-2xl shadow-black/30 py-2 animate-fade-in-up overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center border border-primary/30 shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
