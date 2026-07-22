import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../../store/slices/popupSlice";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  // {productId, selectedSize} — reducer expects object, not plain ID
  const handleUpdateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart({ productId, selectedSize }));
    } else {
      dispatch(updateCartQuantity({ productId, selectedSize, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId, selectedSize) => {
    dispatch(removeFromCart({ productId, selectedSize }));
  };

  if (!isCartOpen) return null;

  const subtotal = cart?.reduce((sum, item) => {
    const effectivePrice = item.product.discount_price > 0 && item.product.discount_price < item.product.price
      ? item.product.discount_price
      : item.product.price;
    return sum + effectivePrice * item.quantity;
  }, 0) || 0;
  const shipping_price = subtotal > 5000 ? 0 : 100;
  const tax_price = Math.round(subtotal * 0.05);
  const total = Math.round(subtotal + tax_price + shipping_price);
  const itemCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border/60 shadow-2xl z-50 animate-slide-in-right flex flex-col">
        <div className="h-0.5 gradient-primary shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">Shopping Cart</h2>
              <p className="text-xs text-muted-foreground">
                {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Empty"}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all duration-200 text-muted-foreground hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
          {!cart || cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-primary/50" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Add some products to get started!
                </p>
              </div>
              <Link
                to="/products"
                onClick={() => dispatch(toggleCart())}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.product.selectedSize || 'no-size'}`}
                className="flex gap-3 p-3 bg-secondary/40 border border-border/50 hover:border-primary/20 rounded-xl transition-all duration-200 group"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    src={item.product.images?.[0]?.url || "/avatar-holder.avif"}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => handleRemove(item.product.id, item.product.selectedSize)}
                      className="p-1 hover:bg-destructive/10 rounded-lg transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>

                  {item.product.selectedSize && (
                    <span className="inline-block px-1.5 py-0.5 mb-1 bg-primary/10 text-primary rounded text-[10px] font-semibold">
                      Size: {item.product.selectedSize}
                    </span>
                  )}

                  {item.product.discount_price > 0 && item.product.discount_price < item.product.price ? (
                    <div className="flex items-center gap-1.5 mb-2">
                      <p className="text-xs text-muted-foreground line-through decoration-red-500/50 flex items-center gap-0.5">
                        <FaBangladeshiTakaSign className="text-[9px]" />
                        {Number(item.product.price).toLocaleString()}
                      </p>
                      <p className="text-sm font-bold text-primary flex items-center gap-0.5">
                        <FaBangladeshiTakaSign className="text-xs" />
                        {Number(item.product.discount_price).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-primary flex items-center gap-0.5 mb-2">
                      <FaBangladeshiTakaSign className="text-xs" />
                      {Number(item.product.price).toLocaleString()}
                    </p>
                  )}

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.product.selectedSize, item.quantity - 1)}
                          className="p-1.5 hover:bg-primary/10 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold min-w-[1.75rem] text-center border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.product.selectedSize, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1.5 hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <FaBangladeshiTakaSign className="text-[10px]" />
                        {((item.product.discount_price > 0 && item.product.discount_price < item.product.price
                          ? item.product.discount_price
                          : item.product.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    {item.quantity >= item.product.stock && (
                      <p className="text-[10px] text-amber-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        Max stock: {item.product.stock} unit{item.product.stock > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.length > 0 && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm px-5 py-4 space-y-3 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span className="flex items-center gap-0.5 text-foreground font-medium">
                  <FaBangladeshiTakaSign className="text-[10px]" />
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tax (5%)</span>
                <span className="flex items-center gap-0.5 text-foreground font-medium">
                  <FaBangladeshiTakaSign className="text-[10px]" />
                  {tax_price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shipping</span>
                {shipping_price === 0 ? (
                  <span className="text-emerald-400 font-semibold">Free</span>
                ) : (
                  <span className="flex items-center gap-0.5 text-foreground font-medium">
                    <FaBangladeshiTakaSign className="text-[10px]" />
                    {shipping_price}
                  </span>
                )}
              </div>
            </div>

            {shipping_price > 0 && (
              <p className="text-[11px] text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                Add{" "}
                <span className="inline-flex items-center gap-0.5 text-primary font-semibold">
                  <FaBangladeshiTakaSign className="text-[9px]" />
                  {(5000 - subtotal).toLocaleString()}
                </span>{" "}
                more for free shipping
              </p>
            )}

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary flex items-center gap-1">
                <FaBangladeshiTakaSign className="text-sm" />
                {total.toLocaleString()}
              </span>
            </div>

            <Link
              to="/payment"
              onClick={() => dispatch(toggleCart())}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => { dispatch(toggleCart()); navigate("/products"); }}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
