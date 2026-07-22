import { Sparkles, Star, X, Search, SlidersHorizontal, Tag, Zap } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const Products = () => {
  const { products, totalProducts } = useSelector(
    (state) => state.product || { products: [], totalProducts: 0 },
  );
  const isAIPopupOpen = useSelector((state) => state.popup.isAIPopupOpen);

  const location = useLocation();

  const getParam = (key) => new URLSearchParams(location.search).get(key) || "";

  const [searchQuery, setSearchQuery] = useState(getParam("search"));
  const [selectedCategory, setSelectedCategory] = useState(getParam("category"));
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

  // Sync state when URL changes (e.g. SearchOverlay navigates to /products?search=...)
  useEffect(() => {
    const urlSearch = getParam("search");
    const urlCategory = getParam("category");
    setSearchQuery(urlSearch);
    if (urlCategory) setSelectedCategory(urlCategory);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.search]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        availability: availability === "all" ? "" : availability,
        price: `${priceRange[0]}-${priceRange[1]}`,
        category: selectedCategory,
        ratings: selectedRating,
        search: searchQuery,
        page: currentPage,
        limit: 9,
      }),
    );
  }, [
    dispatch,
    priceRange,
    selectedCategory,
    selectedRating,
    searchQuery,
    currentPage,
    availability,
  ]);

  const totalPages = Math.ceil(totalProducts / 9);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Explore Our Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover a wide selection of products with advanced filtering
            options
          </p>
        </div>

        {/* MOBILE FILTER BUTTON */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary/80 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filters
            {(selectedRating > 0 || selectedCategory || (availability && availability !== "all") || priceRange[1] < 1000000) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* SIDEBAR FILTERS */}
          <div
            className={`fixed inset-0 lg:relative lg:inset-auto z-40 lg:z-auto ${
              isMobileFilterOpen ? "flex" : "hidden"
            } lg:flex flex-col w-full lg:w-72 bg-background lg:bg-transparent overflow-y-auto`}
          >
            {/* MOBILE HEADER */}
            <div className="sticky top-0 lg:hidden flex items-center justify-between px-5 py-4 bg-background border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Filters</h2>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 hover:bg-secondary rounded-lg transition"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* FILTER PANEL */}
            <div className="lg:sticky p-4 lg:p-0 space-y-2">

              {/* HEADER - desktop only */}
              <div className="hidden lg:flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">Filters</span>
                </div>
                {(selectedRating > 0 || selectedCategory || availability || priceRange[1] < 1000000) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setPriceRange([0, 1000000]);
                      setSelectedRating(0);
                      setAvailability("all");
                      setCurrentPage(1);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* PRICE RANGE */}
              <div className="bg-secondary/60 border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <FaBangladeshiTakaSign className="text-primary text-xs" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Price Range</h3>
                  </div>
                  <span className="text-xs text-primary font-medium">
                    {priceRange[0].toLocaleString()} – {priceRange[1].toLocaleString()}
                  </span>
                </div>

                {/* Single range slider */}
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary mb-3"
                />

                {/* Input boxes */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-muted-foreground">
                    <FaBangladeshiTakaSign className="text-xs shrink-0" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        const val = raw === "" ? 0 : parseInt(raw);
                        if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
                      }}
                      className="w-full bg-transparent outline-none text-foreground"
                    />
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">—</span>
                  <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary font-semibold">
                    <FaBangladeshiTakaSign className="text-xs shrink-0" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        if (raw === "") { setPriceRange([priceRange[0], 0]); return; }
                        const val = parseInt(raw);
                        setPriceRange([priceRange[0], Math.min(val, 1000000)]);
                      }}
                      onBlur={() => {
                        if (priceRange[1] < priceRange[0]) setPriceRange([priceRange[0], priceRange[0]]);
                      }}
                      className="w-full bg-transparent outline-none text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* RATING */}
              <div className="bg-secondary/60 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-yellow-400/10 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Rating</h3>
                </div>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-sm ${
                        selectedRating === rating
                          ? "bg-primary/15 border border-primary/40 text-primary"
                          : "hover:bg-background border border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/20 fill-muted-foreground/10"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-auto text-xs font-medium">
                        {rating === 5 ? "5 only" : `${rating}+`}
                      </span>
                      {selectedRating === rating && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="bg-secondary/60 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-emerald-400/10 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Availability</h3>
                </div>
                <div className="space-y-1.5">
                  {[
                    { value: "in-stock", label: "In Stock", dot: "bg-emerald-400" },
                    { value: "limited-stock", label: "Limited Stock", dot: "bg-amber-400" },
                    { value: "out-of-stock", label: "Out of Stock", dot: "bg-red-400" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setAvailability(availability === status.value ? "" : status.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                        availability === status.value
                          ? "bg-primary/15 text-primary border border-primary/40"
                          : "hover:bg-background text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
                      {status.label}
                      {availability === status.value && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATEGORY */}
              <div className="bg-secondary/60 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Category</h3>
                </div>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      selectedCategory === ""
                        ? "bg-primary/15 text-primary border border-primary/40"
                        : "hover:bg-background text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                    All Categories
                    {selectedCategory === "" && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentPage(1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                        selectedCategory === category.name
                          ? "bg-primary/15 text-primary border border-primary/40"
                          : "hover:bg-background text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
                      {category.name}
                      {selectedCategory === category.name && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* MOBILE APPLY BUTTON */}
            <div className="lg:hidden sticky bottom-0 p-4 border-t border-border bg-background">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                View {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
              </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0">
            {/* SEARCH BAR - aligned with product grid */}
            <div className="mb-5 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition"
                />
              </div>
              <button
                className="relative inline-flex items-center justify-center p-0.5 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group 
                bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 
                group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 
                focus:outline-none focus:ring-purple-200 
                dark:focus:ring-purple-800 flex-shrink-0"
                onClick={() => dispatch(toggleAIModal())}
              >
                <span
                  className="relative w-full px-5 py-3 transition-all ease-in duration-75 
                  bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent 
                  group-hover:dark:bg-transparent flex justify-center items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>AI Search</span>
                </span>
              </button>
            </div>
            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* PAGINATION */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {/* NO RESULT */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* AI SEARCH MODAL */}
      {isAIPopupOpen && <AISearchModal />}


    </div>
  );
};

export default Products;
