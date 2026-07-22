import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const updateQuantity = (id, selectedSize, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart({ productId: id, selectedSize }));
    } else {
      dispatch(updateCartQuantity({ productId: id, selectedSize, quantity }));
    }
  };

  const totalAmount = cart
    ? cart.reduce((sum, item) => {
        const effectivePrice = item.product.discount_price > 0 && item.product.discount_price < item.product.price
          ? item.product.discount_price
          : item.product.price;
        return sum + effectivePrice * item.quantity;
      }, 0)
    : 0;

  const cartItemCount = cart
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const shipping_price = totalAmount > 5000 ? 0 : 100;
  const tax_price = Math.round(totalAmount * 0.05);
  const total = Math.round(totalAmount + tax_price + shipping_price);

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started with your shopping!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Shopping Cart
          <span className="ml-3 text-lg font-normal text-muted-foreground">
            ({cartItemCount} {cartItemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.product.selectedSize || 'no-size'}`}
                className="glass-card flex gap-4 p-4"
              >
                <img
                  src={item.product.images?.[0]?.url || "/avatar-holder.avif"}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate mb-1">
                    {item.product.name}
                  </h3>
                  {item.product.selectedSize && (
                    <span className="inline-block px-2 py-0.5 mb-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                      Size: {item.product.selectedSize}
                    </span>
                  )}
                  <div className="flex flex-col mb-3">
                    {item.product.discount_price > 0 && item.product.discount_price < item.product.price ? (
                      <>
                        <p className="text-muted-foreground text-xs line-through decoration-red-500/50 flex items-center gap-1">
                          <FaBangladeshiTakaSign className="text-[10px]" />
                          {Number(item.product.price).toLocaleString()}
                        </p>
                        <p className="text-primary font-bold flex items-center gap-1 leading-none mt-1">
                          <FaBangladeshiTakaSign className="text-xs" />
                          {Number(item.product.discount_price).toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-primary font-bold flex items-center gap-1">
                        <FaBangladeshiTakaSign className="text-xs" />
                        {Number(item.product.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-secondary border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.product.selectedSize, item.quantity - 1)}
                        className="p-2 hover:bg-primary/10 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold border-x border-border min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.product.selectedSize, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {item.quantity >= item.product.stock && (
                      <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        Only {item.product.stock} unit{item.product.stock > 1 ? "s" : ""} available
                      </p>
                    )}
                    {/* Remove */}
                    <button
                      onClick={() => dispatch(removeFromCart({ productId: item.product.id, selectedSize: item.product.selectedSize }))}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="glass-card h-fit p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal ({cartItemCount} items)</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <FaBangladeshiTakaSign className="text-xs" />
                {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax (5%)</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <FaBangladeshiTakaSign className="text-xs" />
                {tax_price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              {shipping_price === 0 ? (
                <span className="text-emerald-400 font-medium">Free</span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <FaBangladeshiTakaSign className="text-xs" />
                  {shipping_price}
                </span>
              )}
            </div>
            {shipping_price > 0 && (
              <p className="text-xs text-muted-foreground">
                Add{" "}
                <span className="inline-flex items-center gap-0.5 text-primary font-medium">
                  <FaBangladeshiTakaSign className="text-[10px]" />
                  {(5000 - totalAmount).toLocaleString()}
                </span>{" "}
                more for free shipping
              </p>
            )}
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span className="flex items-center gap-1 text-primary">
                <FaBangladeshiTakaSign className="text-sm" />
                {total.toLocaleString()}
              </span>
            </div>
            <Link
              to="/payment"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
