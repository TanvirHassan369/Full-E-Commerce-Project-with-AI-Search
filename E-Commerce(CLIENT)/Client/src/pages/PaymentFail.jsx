import { useEffect } from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

const PaymentFail = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="glass-panel text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          Something went wrong with your payment. Your order has not been placed. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/payment" className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>
          <Link to="/cart" className="btn-secondary flex items-center justify-center gap-2 py-3 px-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
