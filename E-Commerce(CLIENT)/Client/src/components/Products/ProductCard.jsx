import React from "react";
import { Star, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, syncAddToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const normalizedProduct = {
      ...product,
      id: product.id || product._id,
      _id: product.id || product._id,
    };

    if (authUser) {
      const result = await dispatch(syncAddToCart({ productId: normalizedProduct.id, quantity: 1 }));
      if (syncAddToCart.fulfilled.match(result)) {
        toast.success(`${product.name} added to cart`);
      }
      // If server fails, fallback to local
      if (syncAddToCart.rejected.match(result)) {
        dispatch(addToCart({ product: normalizedProduct, quantity: 1 }));
        toast.success(`${product.name} added to cart`);
      }
    } else {
      dispatch(addToCart({ product: normalizedProduct, quantity: 1 }));
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <Link
      to={`/product/${product.id || product._id}`}
      className="group glass-card hover:glow-on-hover animate-smooth flex flex-col overflow-hidden rounded-2xl border border-border/50 hover:border-primary/40"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-secondary h-40 shrink-0">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900 text-slate-300">
            <Package className="w-12 h-12 text-primary" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">No image</span>
          </div>
        )}

        {/* BADGES */}
        <div className="absolute inset-x-0 top-3 px-3 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
              <span className="bg-primary text-primary-foreground text-[0.65rem] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow">
                NEW
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 items-end ml-auto">
            {product.discount_price > 0 && product.discount_price < product.price && (
              <span className="bg-red-500 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full shadow">
                -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
              </span>
            )}
            {Number(product.ratings) >= 4.5 && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[0.65rem] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow shrink-0">
                TOP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{product.ratings != null ? Number(product.ratings).toFixed(1) : "0.0"}</span>
            <span>({product.review_count || 0})</span>
          </div>
          <div className="flex flex-col items-end">
            {product.discount_price > 0 && product.discount_price < product.price ? (
              <>
                <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                  BDT {Number(product.price || 0).toFixed(2)}
                </span>
                <span className="text-base font-bold text-primary leading-none">
                  BDT {Number(product.discount_price || 0).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-primary">
                BDT {Number(product.price || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description?.replace(/<[^>]+>/g, '').slice(0, 120) || "A premium product for modern shoppers."}
        </p>

        <div className="flex items-center justify-between gap-3 mt-auto pt-1">
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
              product.stock > 5
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                : product.stock > 0
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {product.stock > 5 ? "In Stock" : product.stock > 0 ? "Limited Stock" : "Out of Stock"}
          </span>
          <button
            onClick={(e) => handleAddToCart(product, e)}
            disabled={product.stock === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
