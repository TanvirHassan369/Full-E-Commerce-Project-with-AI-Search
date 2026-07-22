import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { toggleViewProductModal } from "../store/slices/extraSlice";
import { X, Package } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  if (!selectedProduct) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex justify-center items-start pt-6 p-4 animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl scrollbar-hide p-6 relative border-border shadow-2xl animate-slide-down mb-6">
        <button
          onClick={() => dispatch(toggleViewProductModal())}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-extrabold text-foreground mb-6 pr-8">{selectedProduct.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="grid grid-cols-2 gap-3">
            {selectedProduct.images?.length > 0 ? (
              selectedProduct.images.map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-border bg-secondary aspect-square">
                  <img src={img?.url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-2 rounded-xl border border-border bg-secondary aspect-video flex items-center justify-center">
                <Package size={40} className="text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
              <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs font-medium text-muted-foreground">
                {selectedProduct.category}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price</p>
              <div className="flex items-center gap-3">
                {selectedProduct.discount_price > 0 ? (
                  <>
                    <span className="text-muted-foreground line-through flex items-center gap-0.5 text-sm">
                      <FaBangladeshiTakaSign size={11} />{Number(selectedProduct.price).toLocaleString()}
                    </span>
                    <span className="text-primary font-bold text-lg flex items-center gap-0.5">
                      <FaBangladeshiTakaSign size={14} />{Number(selectedProduct.discount_price).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-primary font-bold text-lg flex items-center gap-0.5">
                    <FaBangladeshiTakaSign size={14} />{Number(selectedProduct.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Stock</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                selectedProduct.stock === 0
                  ? 'bg-destructive/10 text-destructive border-destructive/20'
                  : selectedProduct.stock <= 5
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {selectedProduct.stock === 0 ? 'Out of Stock' : `${selectedProduct.stock} in stock`}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rating</p>
              <span className="text-foreground font-medium">⭐ {Number(selectedProduct.ratings || 0).toFixed(1)} / 5</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Created At</p>
              <span className="text-muted-foreground">
                {new Date(selectedProduct.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
            {selectedProduct.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                <div
                  className="text-sm text-muted-foreground p-3 bg-secondary/40 rounded-xl border border-border rich-text-content max-h-40 overflow-y-auto scrollbar-hide"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <button onClick={() => dispatch(toggleViewProductModal())} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewProductModal;
