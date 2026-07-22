import { useState, useEffect } from "react";
import { X, Search, TrendingUp, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);

  const popularSearches = [
    "Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty",
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSearchBarOpen) dispatch(toggleSearchBar());
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchBarOpen, dispatch]);

  useEffect(() => {
    if (isSearchBarOpen) {
      setTimeout(() => document.getElementById("search-input")?.focus(), 100);
    }
  }, [isSearchBarOpen]);

  if (!isSearchBarOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    dispatch(toggleSearchBar());
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const handlePopularSearch = (term) => {
    dispatch(toggleSearchBar());
    navigate(`/products?category=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" onClick={() => dispatch(toggleSearchBar())}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 flex items-start justify-center pt-24 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-2xl bg-background border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
          {/* top accent */}
          <div className="h-0.5 gradient-primary" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Search Products</h2>
              <button
                onClick={() => dispatch(toggleSearchBar())}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-11 pr-12 py-3.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </form>

            {/* Popular searches */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Popular</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(term)}
                    className="group flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary border border-border/60 hover:border-primary/40 hover:bg-primary/8 rounded-xl text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                  >
                    {term}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
