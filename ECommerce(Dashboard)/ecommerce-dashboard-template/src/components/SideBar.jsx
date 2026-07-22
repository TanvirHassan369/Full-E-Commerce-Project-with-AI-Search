import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, ShoppingCart, 
  Users, Mail, Zap, RotateCcw, MessageSquare
} from "lucide-react";
import { useSelector } from "react-redux";

const menuItems = [
  { path: "/",            icon: LayoutDashboard, label: "Dashboard" },
  { path: "/products",    icon: Package,         label: "Products" },
  { path: "/orders",      icon: ShoppingCart,    label: "Orders" },
  { path: "/users",       icon: Users,           label: "Users" },
  { path: "/subscribers", icon: Mail,            label: "Subscribers" },
  { path: "/returns",     icon: RotateCcw,       label: "Returns" },
  { path: "/messages",    icon: MessageSquare,   label: "Messages" },
];

const SideBar = () => {
  const location = useLocation();
  const { returnRequests } = useSelector((state) => state.order);
  const pendingReturns = returnRequests?.filter(r => r.status === "Pending").length || 0;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col z-20 shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sidebar-foreground font-extrabold text-base tracking-tight">Daily Bazar</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto filter-sidebar">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 pb-2 pt-1">Main Menu</p>
        {menuItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/60 rounded-r-full" />
              )}
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-muted-foreground group-hover:text-sidebar-accent-foreground transition-colors"}
              />
              <span className={`font-medium text-sm ${isActive ? "text-white" : ""}`}>{label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-white/70 animate-pulse" />
              )}
              {!isActive && path === "/returns" && pendingReturns > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none">
                  {pendingReturns}
                </span>
              )}            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
