import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ProductSlider = ({ title, products = [] }) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  console.log(`ProductSlider ${title} - products:`, products.length, products);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (product, event) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizedProduct = {
      ...product,
      id: product.id || product._id,
      _id: product.id || product._id, // Ensure both id formats work
    };

    dispatch(addToCart({ product: normalizedProduct, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.25em] text-primary mb-2">
          Latest Collection
        </p>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          {title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our newest arrivals with premium quality and exceptional value
        </p>
      </div>

      <div className="relative group">
        {/* Navigation Arrows — outside scroll, vertically centered on image area (~h-52) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-[104px] -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white text-foreground transition-all duration-200 active:scale-95 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-[104px] -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white text-foreground transition-all duration-200 active:scale-95 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product) => (
            <Link
              key={product.id || product._id}
              to={`/product/${product.id || product._id}`}
              className="group flex-shrink-0 min-w-[240px] sm:min-w-[260px] max-w-[260px] glass-card hover:glow-on-hover animate-smooth"
            >
              <div className="relative overflow-hidden rounded-t-xl bg-secondary h-52">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900 text-slate-300">
                    <Package className="w-12 h-12 text-primary" />
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold">
                      No image
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 top-3 px-4 flex items-start justify-between gap-2">
                  {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
                    <span className="bg-primary text-primary-foreground text-[0.65rem] font-semibold uppercase tracking-[0.24em] px-3 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {Number(product.ratings) >= 4.5 && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[0.65rem] font-semibold uppercase tracking-[0.24em] px-3 py-1 rounded-full">
                      TOP
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{product.ratings != null ? Number(product.ratings).toFixed(1) : "0.0"}</span>
                    <span>({product.review_count || 0})</span>
                  </div>
                  <span className="text-base font-bold text-primary">
                    BDT {Number(product.price || 0).toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description?.replace(/<[^>]+>/g, '').slice(0, 120) ||
                    "A premium product for modern shoppers."}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 5
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : product.stock > 0
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                      ? "Limited Stock"
                      : "Sold Out"}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock === 0}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
