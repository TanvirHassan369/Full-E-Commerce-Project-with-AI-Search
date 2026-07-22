import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin, Phone, User, Building2, Hash,
  ShoppingBag, ArrowRight, ArrowLeft, Loader, Lock, Truck, CreditCard, CheckCircle,
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { placeOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { placingOrder } = useSelector((state) => state.order);

  const [form, setForm] = useState({
    full_name: authUser?.name || "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Online"); // "Online" | "COD"

  useEffect(() => {
    if (!isCheckingAuth && authUser && (!cart || cart.length === 0)) navigate("/cart");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [authUser, cart, navigate, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
        <div className="glass-panel text-center max-w-md w-full py-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">
            Please log in or sign up to proceed with the checkout process.
          </p>
          <button 
            onClick={() => {
              navigate("/");
              import("../store/slices/popupSlice").then(module => dispatch(module.toggleAuthPopup()));
            }} 
            className="btn-primary w-full py-3"
          >
            Log In or Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Price calculations — use discount_price when available (matches backend logic)
  const subtotal = cart?.reduce((sum, item) => {
    const effectivePrice = item.product.discount_price > 0
      ? item.product.discount_price
      : item.product.price;
    return sum + effectivePrice * item.quantity;
  }, 0) || 0;
  const shipping_price = subtotal > 5000 ? 0 : 100;
  const tax_price = Math.round(subtotal * 0.05);
  const total_price = Math.round(subtotal + tax_price + shipping_price);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Name is required";
    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Phone is required";
    } else if (!/^01[3-9]\d{8}$/.test(form.phone_number)) {
      newErrors.phone_number = "Enter a valid 11-digit BD number (e.g. 01XXXXXXXXX)";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip_code.trim()) newErrors.zip_code = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    const orderData = {
      ...form,
      ordered_Items: cart,
      payment_method: paymentMethod,
    };

    const result = await dispatch(placeOrder(orderData));

    if (placeOrder.fulfilled.match(result)) {
      const { paymentMethod: method, paymentUrl, orderId } = result.payload;
      if (method === "COD") {
        // Clear cart and go to success page
        dispatch(clearCart());
        navigate("/payment/success?method=cod");
      } else {
        window.location.href = paymentUrl;
      }
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-secondary border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition ${errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/cart" className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground text-sm">Fill in your shipping details to place the order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Shipping Form ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`${inputClass("full_name")} pl-10`}
                    />
                  </div>
                  {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={(e) => {
                        // Only allow digits, max 11
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                        setForm({ ...form, phone_number: digits });
                        if (errors.phone_number) setErrors({ ...errors, phone_number: "" });
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`${inputClass("phone_number")} pl-10 pr-16`}
                    />
                    <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums ${
                      form.phone_number.length === 11 ? "text-emerald-400" : "text-muted-foreground"
                    }`}>
                      {form.phone_number.length}/11
                    </span>
                  </div>
                  {errors.phone_number && <p className="text-xs text-destructive mt-1">{errors.phone_number}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House no, road, area"
                      className={`${inputClass("address")} pl-10`}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">City</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Dhaka"
                      className={`${inputClass("city")} pl-10`}
                    />
                  </div>
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">State / Division</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Dhaka"
                      className={`${inputClass("state")} pl-10`}
                    />
                  </div>
                  {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                </div>

                {/* ZIP */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">ZIP / Postal Code</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="zip_code"
                      value={form.zip_code}
                      onChange={handleChange}
                      placeholder="1000"
                      className={`${inputClass("zip_code")} pl-10`}
                    />
                  </div>
                  {errors.zip_code && <p className="text-xs text-destructive mt-1">{errors.zip_code}</p>}
                </div>
              </div>
            </div>

            {/* ── Payment Method ── */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Online */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Online")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === "Online"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/40 hover:border-primary/40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === "Online" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === "Online" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${paymentMethod === "Online" ? "text-primary" : "text-foreground"}`}>
                      Online Payment
                    </p>
                    <p className="text-xs text-muted-foreground">Card, Mobile Banking via SSLCommerz</p>
                  </div>
                  {paymentMethod === "Online" && (
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  )}
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === "COD"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border bg-secondary/40 hover:border-emerald-500/40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === "COD" ? "bg-emerald-500/20" : "bg-secondary"
                  }`}>
                    <Truck className={`w-5 h-5 ${paymentMethod === "COD" ? "text-emerald-400" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${paymentMethod === "COD" ? "text-emerald-400" : "text-foreground"}`}>
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                  {paymentMethod === "COD" && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="space-y-4">
            <div className="glass-card p-5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
                {cart?.map((item) => (
                  <div key={`${item.product.id}-${item.product.selectedSize || 'no-size'}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || "/avatar-holder.avif"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-0.5 shrink-0">
                      <FaBangladeshiTakaSign className="text-[10px]" />
                      {((item.product.discount_price > 0 ? item.product.discount_price : item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border mb-4" />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="flex items-center gap-0.5 text-foreground font-medium">
                    <FaBangladeshiTakaSign className="text-xs" />
                    {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (5%)</span>
                  <span className="flex items-center gap-0.5 text-foreground font-medium">
                    <FaBangladeshiTakaSign className="text-xs" />
                    {tax_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  {shipping_price === 0 ? (
                    <span className="text-emerald-400 font-semibold">Free</span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-foreground font-medium">
                      <FaBangladeshiTakaSign className="text-xs" />
                      {shipping_price}
                    </span>
                  )}
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span className="flex items-center gap-0.5 text-primary text-base">
                    <FaBangladeshiTakaSign className="text-sm" />
                    {total_price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className={`w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  paymentMethod === "COD"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "btn-primary"
                }`}
              >
                {placingOrder ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === "COD" ? (
                  <>
                    <Truck className="w-4 h-4" />
                    Place Order (COD)
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Go For Payment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Note */}
              <p className="text-center text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                {paymentMethod === "COD" ? (
                  <><Truck className="w-3 h-3" /> Pay when your order arrives</>
                ) : (
                  <><Lock className="w-3 h-3" /> Secured by SSLCommerz</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
