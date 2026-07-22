import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight, Download, Loader, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { clearCart, syncClearCart } from "../store/slices/cartSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const isCOD = searchParams.get("method") === "cod";
  const { myOrders, fetchingOrders } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);
  const [invoiceReady, setInvoiceReady] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    dispatch(clearCart());
    dispatch(syncClearCart());
    dispatch(fetchMyOrders()).then(() => setInvoiceReady(true));
  }, [dispatch]);

  // Most recent order — sort by created_at descending to always get the latest
  const latestOrder = myOrders?.length > 0
    ? [...myOrders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;

  const handleDownloadInvoice = () => {
    if (!latestOrder) return;

    const order = latestOrder;
    const date = order.created_at
      ? new Date(order.created_at).toLocaleDateString("en-BD", {
          year: "numeric", month: "long", day: "numeric",
        })
      : new Date().toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" });

    const itemsHTML = (order.order_items || []).map((item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${item.title || "Product"}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.size ? `<span style="background:#f3f0ff;color:#7c3aed;padding:2px 8px;border-radius:4px;font-size:12px;">${item.size}</span>` : "—"}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">৳ ${Number(item.price).toLocaleString()}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">৳ ${(Number(item.price) * item.quantity).toLocaleString()}</td>
      </tr>
    `).join("");

    const subtotal = Number(order.total_price) - Number(order.tax_price || 0) - Number(order.shipping_price || 0);
    const shipping = order.shipping_info;

    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${order.id?.slice(0, 8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #7c3aed; }
    .brand { font-size: 26px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px; }
    .brand span { color: #111827; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 20px; font-weight: 700; color: #7c3aed; margin-bottom: 4px; }
    .invoice-meta p { font-size: 13px; color: #6b7280; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 6px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 20px; }
    .info-box h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 10px; }
    .info-box p { font-size: 13px; color: #374151; line-height: 1.7; }
    .info-box strong { color: #111827; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #7c3aed; color: #fff; }
    thead th { padding: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
    thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    tbody tr:hover { background: #faf5ff; }
    tbody td { white-space: nowrap; }
    tbody td:first-child { white-space: normal; word-break: break-word; max-width: 260px; }
    .totals { margin-left: auto; width: 280px; }
    .totals table { margin-bottom: 0; }
    .totals td { padding: 7px 12px; font-size: 13px; color: #6b7280; }
    .totals td:last-child { text-align: right; color: #111827; font-weight: 500; }
    .totals .total-row td { font-size: 15px; font-weight: 700; color: #7c3aed; border-top: 2px solid #7c3aed; padding-top: 10px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
    @media print {
      body { padding: 20px; }
      @page { margin: 15mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Daily <span>Bazar</span></div>
      <p style="font-size:13px;color:#6b7280;margin-top:4px;">Your trusted e-commerce store</p>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p><strong>#${order.id?.slice(0, 8).toUpperCase()}</strong></p>
      <p>Date: ${date}</p>
      <div class="badge">✓ Payment Confirmed</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h4>Billed To</h4>
      <p>
        <strong>${authUser?.name || shipping?.full_name || "Customer"}</strong><br/>
        ${authUser?.email || ""}<br/>
        ${shipping?.phone || ""}
      </p>
    </div>
    <div class="info-box">
      <h4>Shipping Address</h4>
      <p>
        <strong>${shipping?.full_name || "—"}</strong><br/>
        ${shipping?.address || ""}<br/>
        ${shipping?.city || ""}${shipping?.state ? ", " + shipping.state : ""}<br/>
        ${shipping?.pincode || ""}, ${shipping?.country || "Bangladesh"}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center;">Size</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Unit Price</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Subtotal</td><td>৳ ${Number(subtotal).toLocaleString()}</td></tr>
      <tr><td>Tax (5%)</td><td>৳ ${Number(order.tax_price || 0).toLocaleString()}</td></tr>
      <tr><td>Shipping</td><td>${Number(order.shipping_price) === 0 ? "Free" : "৳ " + Number(order.shipping_price).toLocaleString()}</td></tr>
      <tr class="total-row"><td>Total Paid</td><td>৳ ${Number(order.total_price).toLocaleString()}</td></tr>
    </table>
  </div>

  <div class="footer">
    <p style="margin-top:6px;">Thank you for shopping with Daily Bazar! For support, contact us at support@dailybazar.com</p>
    <p style="margin-top:6px;">This is a computer-generated invoice and does not require a signature.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");

    // printWindow can be null if browser blocks popups
    
    if (!printWindow) {
      alert("Please allow popups for this site to download the invoice.");
      URL.revokeObjectURL(url);
      return;
    }
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(url);
    };
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="glass-panel text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
          {isCOD ? (
            <Truck className="w-10 h-10 text-emerald-400" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isCOD ? "Order Placed!" : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground mb-2">
          {isCOD
            ? "Your order has been placed successfully."
            : "Your order has been placed and payment confirmed."}
        </p>
        {isCOD && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Truck className="w-4 h-4" />
            Pay ৳{myOrders?.[0]?.total_price?.toLocaleString() || ""} when your order arrives
          </div>
        )}

        {/* Invoice download button */}
        <div className="mb-6">
          {fetchingOrders || !invoiceReady ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
              <Loader className="w-4 h-4 animate-spin" />
              Preparing invoice...
            </div>
          ) : latestOrder ? (
            <button
              onClick={handleDownloadInvoice}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 font-semibold text-sm transition-all duration-200 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download Invoice / Receipt
            </button>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
            <ShoppingBag className="w-4 h-4" />
            View My Orders
          </Link>
          <Link to="/products" className="btn-secondary flex items-center justify-center gap-2 py-3 px-6">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
