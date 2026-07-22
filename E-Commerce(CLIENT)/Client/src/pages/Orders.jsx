import { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle, ShoppingBag, MapPin, Phone, Calendar, ChevronDown, ChevronUp, User, RotateCcw, Clock, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { fetchMyOrders, submitReturnRequest, fetchMyReturnRequests } from "../store/slices/orderSlice";

const RETURN_REASONS = ["Damaged product", "Wrong item received", "Not as described", "Changed mind", "Other"];
const RETURN_WINDOW_DAYS = 7;

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [returnModal, setReturnModal] = useState({ open: false, orderId: null });
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");

  const { myOrders, fetchingOrders, submittingReturn, myReturnRequests } = useSelector((state) => state.order);
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      dispatch(fetchMyOrders());
      dispatch(fetchMyReturnRequests());
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [dispatch, authUser]);

  const getReturnStatus = (orderId) => myReturnRequests?.find(r => r.order_id === orderId) || null;

  const canRequestReturn = (order) => {
    if (order.order_status !== "Delivered") return false;
    if (getReturnStatus(order.id)) return false;
    const paidAt = order.paid_at ? new Date(order.paid_at) : new Date(order.created_at);
    return (Date.now() - paidAt.getTime()) / (1000 * 60 * 60 * 24) <= RETURN_WINDOW_DAYS;
  };

  const handleReturnSubmit = async () => {
    if (!returnReason) return;
    const result = await dispatch(submitReturnRequest({ orderId: returnModal.orderId, reason: returnReason, description: returnDescription }));
    if (submitReturnRequest.fulfilled.match(result)) {
      setReturnModal({ open: false, orderId: null });
      setReturnReason(""); setReturnDescription("");
    }
  };

  if (isCheckingAuth) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  if (!authUser) return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="glass-panel text-center max-w-md w-full py-12">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Authentication Required</h2>
        <p className="text-muted-foreground mb-8">Please log in to view your order history.</p>
        <button onClick={() => { navigate("/"); import("../store/slices/popupSlice").then(m => dispatch(m.toggleAuthPopup())); }} className="btn-primary w-full py-3">
          Log In or Sign Up
        </button>
      </div>
    </div>
  );

  const filteredOrders = [...myOrders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .filter((order) => statusFilter === "all" || order.order_status === statusFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <Package className="w-4 h-4 text-yellow-400" />;
      case "Shipped":    return <Truck className="w-4 h-4 text-blue-400" />;
      case "Delivered":  return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "Cancelled":  return <XCircle className="w-4 h-4 text-red-400" />;
      case "Returned":   return <RotateCcw className="w-4 h-4 text-purple-400" />;
      default:           return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
      case "Shipped":    return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "Delivered":  return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "Cancelled":  return "bg-red-400/10 text-red-400 border-red-400/20";
      case "Returned":   return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      default:           return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">My Orders</h1>
          <p className="text-muted-foreground text-sm">{myOrders.length} {myOrders.length === 1 ? "order" : "orders"} placed</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div><h2 className="text-muted-foreground font-medium">Filter</h2></div>
          {[
            { key: "all", label: "All Orders", dot: "bg-primary" },
            { key: "Processing", label: "Processing", dot: "bg-yellow-400" },
            { key: "Shipped", label: "Shipped", dot: "bg-blue-400" },
            { key: "Delivered", label: "Delivered", dot: "bg-emerald-400" },
            { key: "Cancelled", label: "Cancelled", dot: "bg-red-400" },
            { key: "Returned", label: "Returned", dot: "bg-purple-400" },
          ].map(({ key, label, dot }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                statusFilter === key
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${dot} ${statusFilter === key ? "opacity-100" : "opacity-50"}`} />
              {label}
              {key === "all" && myOrders.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold leading-none">{myOrders.length}</span>
              )}
            </button>
          ))}
        </div>

        {fetchingOrders && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading orders...</p>
          </div>
        )}

        {!fetchingOrders && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-primary/50" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {statusFilter === "all" ? "No orders yet" : `No ${statusFilter} orders`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter === "all" ? "Place your first order to see it here." : "Try a different filter."}
              </p>
            </div>
            {statusFilter === "all" && <Link to="/products" className="btn-primary px-6 py-2.5 text-sm">Browse Products</Link>}
          </div>
        )}

        {!fetchingOrders && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="glass-card overflow-hidden">
                <div className="flex items-start justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Order ID</p>
                    <p className="text-sm font-semibold text-foreground font-mono">#{order.id?.slice(0, 8).toUpperCase()}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                      {getStatusIcon(order.order_status)} {order.order_status}
                    </span>
                    <span className="flex items-center gap-0.5 text-base font-bold text-primary">
                      <FaBangladeshiTakaSign className="text-sm" />{Number(order.total_price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {expandedOrder !== order.id && order.order_items?.length > 0 && (
                  <div className="px-5 pb-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.order_items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-background bg-secondary overflow-hidden">
                          {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground" /></div>}
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          +{order.order_items.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{order.order_items.length} {order.order_items.length === 1 ? "item" : "items"}</span>
                  </div>
                )}

                <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">
                  {expandedOrder === order.id ? <><ChevronUp className="w-3.5 h-3.5" /> Hide details</> : <><ChevronDown className="w-3.5 h-3.5" /> View details</>}
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-border/50 p-5 space-y-5">
                    {order.order_items?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Items</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                              <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-muted-foreground" /></div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                  {item.size && <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-semibold">Size: {item.size}</span>}
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="flex items-center gap-0.5 text-sm font-semibold text-primary shrink-0">
                                <FaBangladeshiTakaSign className="text-xs" />{Number(item.price).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Price Breakdown</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span className="flex items-center gap-0.5 text-foreground font-medium">
                            <FaBangladeshiTakaSign className="text-xs" />{Number((order.total_price || 0) - (order.tax_price || 0) - (order.shipping_price || 0)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tax (5%)</span>
                          <span className="flex items-center gap-0.5 text-foreground font-medium">
                            <FaBangladeshiTakaSign className="text-xs" />{Number(order.tax_price || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          {order.shipping_price === 0
                            ? <span className="text-emerald-400 font-medium">Free</span>
                            : <span className="flex items-center gap-0.5 text-foreground font-medium"><FaBangladeshiTakaSign className="text-xs" />{Number(order.shipping_price).toLocaleString()}</span>}
                        </div>
                        <div className="h-px bg-border my-1" />
                        <div className="flex justify-between font-bold text-foreground">
                          <span>Total</span>
                          <span className="flex items-center gap-0.5 text-primary">
                            <FaBangladeshiTakaSign className="text-sm" />{Number(order.total_price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.shipping_info && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Shipping Address</h4>
                        <div className="p-3 bg-secondary/40 rounded-xl space-y-1.5 text-sm">
                          <p className="font-semibold text-foreground">{order.shipping_info.full_name}</p>
                          <div className="flex items-start gap-1.5 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span>{order.shipping_info.address}, {order.shipping_info.city}, {order.shipping_info.state} - {order.shipping_info.pincode}, {order.shipping_info.country}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5 shrink-0" /><span>{order.shipping_info.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {order.order_status === "Delivered" && (
                      <div>
                        {(() => {
                          const returnReq = getReturnStatus(order.id);
                          if (returnReq) {
                            const statusMap = {
                              Pending:  { icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Return Pending" },
                              Approved: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Return Approved — Refund in progress" },
                              Rejected: { icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-destructive/10 text-destructive border-destructive/20", label: "Return Rejected" },
                            };
                            const s = statusMap[returnReq.status];
                            return (
                              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${s.color}`}>
                                {s.icon} {s.label}
                                {returnReq.admin_note && <span className="opacity-70">— {returnReq.admin_note}</span>}
                              </div>
                            );
                          }
                          if (canRequestReturn(order)) {
                            return (
                              <button
                                onClick={() => { setReturnModal({ open: true, orderId: order.id }); setReturnReason(""); setReturnDescription(""); }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Request Return
                              </button>
                            );
                          }
                          return (
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-secondary/40 text-xs text-muted-foreground">
                              <AlertCircle className="w-3.5 h-3.5" /> Return window expired (7 days)
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {returnModal.open && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-7 relative animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Request Return</h2>
                <p className="text-xs text-muted-foreground">Returns accepted within 7 days of delivery</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reason *</label>
                <div className="grid grid-cols-1 gap-2">
                  {RETURN_REASONS.map((r) => (
                    <button key={r} type="button" onClick={() => setReturnReason(r)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        returnReason === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${returnReason === r ? "border-primary" : "border-muted-foreground/40"}`}>
                        {returnReason === r && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </span>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Additional Details (optional)</label>
                <textarea value={returnDescription} onChange={(e) => setReturnDescription(e.target.value)}
                  placeholder="Describe the issue in more detail..." rows={3}
                  className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setReturnModal({ open: false, orderId: null })} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleReturnSubmit} disabled={!returnReason || submittingReturn}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {submittingReturn ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Submit Request</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
