import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup, toggleCart, toggleSearchBar, toggleSidebar } from "../../store/slices/popupSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      {/* subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10 active:scale-95 transition-all duration-200 group"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="hidden sm:inline text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Menu
              </span>
            </button>

            <div className="h-5 w-px bg-border hidden sm:block" />

            <button
              onClick={handleLogoClick}
              className="group flex items-center gap-2"
              aria-label="Go to home"
            >
              {/* logo mark */}
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-xs">DB</span>
              </div>
              <span className="text-lg font-bold text-foreground group-hover:text-gradient transition-all">
                Daily Bazar
              </span>
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-primary/10 active:scale-95 transition-all duration-200 text-muted-foreground hover:text-primary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2.5 rounded-xl hover:bg-primary/10 active:scale-95 transition-all duration-200 text-muted-foreground hover:text-primary"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2.5 rounded-xl hover:bg-primary/10 active:scale-95 transition-all duration-200 text-muted-foreground hover:text-primary"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 rounded-xl hover:bg-primary/10 active:scale-95 transition-all duration-200 text-muted-foreground hover:text-primary"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 gradient-primary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center border-2 border-background shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
