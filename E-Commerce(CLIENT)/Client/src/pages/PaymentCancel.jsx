import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Ban, ArrowLeft, ShoppingBag } from "lucide-react";

const PaymentCancel = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="glass-panel text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
          <Ban className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          You cancelled the payment. Your cart items are still saved. You can complete the purchase anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/payment" className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
            <ShoppingBag className="w-4 h-4" />
            Complete Purchase
          </Link>
          <Link to="/products" className="btn-secondary flex items-center justify-center gap-2 py-3 px-6">
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
