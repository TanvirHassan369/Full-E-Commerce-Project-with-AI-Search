import {
  Home, Package, Info, HelpCircle, ShoppingCart, List,
  Phone, User, LogOut, ChevronLeft, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, toggleAuthPopup } from "../../store/slices/popupSlice";
import { logout } from "../../store/slices/authSlice";
import { useEffect } from "react";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.popup);

  useEffect(() => {
    if (isSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isSidebarOpen]);

  if (!isSidebarOpen) return null;

  const navigationItems = [
    { name: "Home",     path: "/",        icon: Home,         description: "Go to homepage" },
    { name: "Products", path: "/products", icon: Package,      description: "Browse all products" },
    { name: "Cart",     path: "/cart",     icon: ShoppingCart, description: "View your cart" },
    { name: "Orders",   path: "/orders",   icon: List,         description: "Your order history" },
  ];

  const supportItems = [
    { name: "About",   path: "/about",   icon: Info,        description: "About Daily Bazar" },
    { name: "FAQ",     path: "/faq",     icon: HelpCircle,  description: "Frequently asked questions" },
    { name: "Contact", path: "/contact", icon: Phone,       description: "Get in touch" },
  ];

  const NavItem = ({ item, onClick }) => (
    <Link
      to={item.path}
      onClick={onClick}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-primary/10 active:scale-95"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary border border-border/50 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-200">
        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {item.name}
      </span>
    </Link>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in cursor-pointer"
        onClick={() => dispatch(toggleSidebar())}
        role="button" tabIndex={0} aria-label="Close sidebar"
        onKeyDown={(e) => { if (e.key === "Escape") dispatch(toggleSidebar()); }}
      />

      <div
        className="fixed top-0 left-0 h-full w-72 bg-background border-r border-border/60 z-50 animate-slide-in-left shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* top accent line */}
        <div className="h-0.5 w-full gradient-primary shrink-0" />

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">DB</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">Daily Bazar</h2>
              <p className="text-xs text-muted-foreground">Your shopping</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all active:scale-95"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* USER SECTION */}
        {authUser ? (
          <div className="px-4 py-3 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/15">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{authUser.name || "User"}</p>
                <p className="text-xs text-primary truncate">{authUser.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-border/50 shrink-0">
            <p className="text-xs text-muted-foreground mb-2.5 text-center">Welcome to Daily Bazar</p>
            <button
              onClick={() => { dispatch(toggleSidebar()); dispatch(toggleAuthPopup()); }}
              className="btn-primary w-full py-2.5 text-sm"
            >
              Sign In
            </button>
          </div>
        )}

        {/* NAV */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-5">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 px-3">Navigation</p>
            <nav className="space-y-0.5">
              {navigationItems.map((item) => (
                <NavItem key={item.name} item={item} onClick={() => dispatch(toggleSidebar())} />
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 px-3">Support</p>
            <nav className="space-y-0.5">
              {supportItems.map((item) => (
                <NavItem key={item.name} item={item} onClick={() => dispatch(toggleSidebar())} />
              ))}
            </nav>
          </div>

          {authUser && (
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 px-3">Account</p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => { dispatch(logout()); dispatch(toggleSidebar()); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-95"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-border/50 shrink-0">
          <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} Daily Bazar</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
