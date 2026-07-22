import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2, Plus, Minus, Loader, X, ChevronLeft, ChevronRight, ZoomIn, Zap } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import ReviewsContainer from "../components/Products/ReviewsContainer";

/* ── Image Lightbox Modal ── */
const ImageLightbox = ({ images, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);

  const goPrev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const goNext = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "unset";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main image */}
      <div
        className="max-w-4xl max-h-[85vh] mx-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]?.url}
          alt={`Product image ${current + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-fade-in"
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? "border-white scale-110" : "border-white/30 opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productState = useSelector((state) => state.product);
  const product = productState?.productDetails;
  const loading = productState?.loading;
  const productReviews = productState?.productReviews;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    setSelectedImage(0);
    setQuantity(1);
    setSelectedSize(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [dispatch, id]);
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleAddToCart = async () => {
    if (hasSizes && !selectedSize) {
      return;
    }
    dispatch(addToCart({ product: { ...product, selectedSize }, quantity }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    if (hasSizes && !selectedSize) {
      return;
    }
    dispatch(addToCart({ product: { ...product, selectedSize }, quantity }));
    navigate("/payment");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading product details...</p>
      </div>
    );
  }

  // Not found
  if (!product || !product.id) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist or may have been removed.
          </p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = Number(product.ratings) || 0;
  const reviewCount = productReviews?.length || product.numOfReviews || 0;
  const isOutOfStock = !product.stock || product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="text-foreground">{product.category}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* LEFT: Image Gallery */}
          <div>
            <div className="glass-card p-3 mb-3 overflow-hidden group">
              {product.images && product.images.length > 0 ? (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                    onClick={() => setLightboxOpen(true)}
                    className="w-full h-[420px] object-contain p-2 rounded-lg transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                  />
                  {/* Zoom hint */}
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    Click to zoom
                  </div>
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <span className="px-5 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.discount_price > 0 && product.discount_price < product.price && (
                    <div className="absolute top-4 right-4 z-10 pointer-events-none">
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-[420px] bg-secondary/50 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-primary scale-105"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col gap-5">

            {/* Category */}
            {product.category && (
              <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3">
              {product.discount_price > 0 && product.discount_price < product.price ? (
                <>
                  <div className="flex items-center gap-1 text-xl font-semibold text-muted-foreground line-through decoration-red-500/50">
                    <FaBangladeshiTakaSign className="text-lg" />
                    <span>{Number(product.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-3xl font-bold text-primary">
                    <FaBangladeshiTakaSign className="text-2xl" />
                    <span>{Number(product.discount_price || 0).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-3xl font-bold text-primary">
                  <FaBangladeshiTakaSign className="text-2xl" />
                  <span>{Number(product.price || 0).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Stock */}
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Only {product.stock} left — order soon
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                In Stock
              </span>
            )}

            <div className="h-px bg-border" />

            {/* Size Selector */}
            {hasSizes && (
              <div className="flex items-start gap-4">
                <span className="text-sm font-medium text-muted-foreground gap-4 shrink-0 pt-1">Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 active:scale-95 ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                          : "bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {hasSizes && !selectedSize && (
              <p className="text-xs text-amber-400 -mt-2">Please select a size before adding to cart.</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground w-20 shrink-0">Quantity</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center bg-secondary border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val) || val < 1) {
                        setQuantity(1);
                      } else if (val > product.stock) {
                        setQuantity(product.stock);
                      } else {
                        setQuantity(val);
                      }
                    }}
                    onBlur={(e) => {
                      if (!e.target.value || parseInt(e.target.value) < 1) setQuantity(1);
                    }}
                    className="w-14 py-2 text-sm font-semibold text-center border-x border-border bg-transparent text-foreground focus:outline-none focus:bg-primary/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="p-2.5 hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {quantity >= product.stock && !isOutOfStock && (
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    Maximum available stock is {product.stock} unit{product.stock > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || (hasSizes && !selectedSize)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  addedToCart
                    ? "bg-emerald-500 text-white"
                    : "btn-primary"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || (hasSizes && !selectedSize)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm border border-primary text-primary hover:bg-primary/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>

              <button
                onClick={() => setWishlisted((w) => !w)}
                className={`p-3.5 rounded-xl border transition-all duration-200 active:scale-95 ${
                  wishlisted
                    ? "bg-red-500/10 border-red-500/30 text-red-500"
                    : "border-border hover:bg-secondary text-muted-foreground"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500" : ""}`} />
              </button>

              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="p-3.5 rounded-xl border border-border hover:bg-secondary text-muted-foreground transition-all duration-200 active:scale-95"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex border-b border-border mb-8">            {[
              { key: "description", label: "Description" },
              { key: "reviews", label: `Reviews (${reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-3.5 text-sm font-semibold transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="glass-card w-full">
              <div
                className="description-content rich-text-content"
                dangerouslySetInnerHTML={{
                  __html: product.description || "<p>No description available.</p>"
                }}
              />
            </div>
          )}

          {activeTab === "reviews" && (
            <ReviewsContainer product={product} productReviews={productReviews} />
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && product.images?.length > 0 && (
        <ImageLightbox
          images={product.images}
          initialIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
