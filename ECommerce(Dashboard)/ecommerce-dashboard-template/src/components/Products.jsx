import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../store/slices/productsSlice";
import { toggleCreateProductModal, toggleUpdateProductModal } from "../store/slices/extraSlice";
import { Plus, Edit2, Trash2, Search, PackageOpen, Star } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import CreateProductModal from "../modals/CreateProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import DeleteModal from "../modals/DeleteModal";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { isCreateProductModalOpened, isUpdateProductModalOpened } = useSelector((state) => state.extra);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    dispatch(toggleUpdateProductModal());
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await dispatch(deleteProduct(deleteModal.id)).unwrap();
        setDeleteModal({ isOpen: false, id: null });
      } catch (err) {
        toast.error(err || "Failed to delete product");
        setDeleteModal({ isOpen: false, id: null });
      }
    }
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your store's inventory and catalog.</p>
        </div>
        <button
          onClick={() => dispatch(toggleCreateProductModal())}
          className="btn-primary shrink-0"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="glass-panel p-0 overflow-hidden animate-fade-in-up">
        {/* Search bar */}
        <div className="p-4 border-b border-border bg-card/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-input/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 w-full transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-muted-foreground gap-3">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <PackageOpen size={28} className="opacity-50" />
              </div>
              <p className="font-medium">No products found.</p>
              <p className="text-xs opacity-60">Try adjusting your search or add a new product.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-secondary overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/30 transition-colors">
                          {product.images?.[0] ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              <PackageOpen size={16} />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-foreground line-clamp-2 text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-medium text-muted-foreground border border-border whitespace-nowrap">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      <span className="flex items-center gap-1 text-sm"><FaBangladeshiTakaSign size={12} />{product.price}</span>
                    </td>
                    <td className="px-5 py-4">
                      {Number(product.ratings) > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
                          <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                          <span className="text-amber-400 font-bold text-xs">{Number(product.ratings).toFixed(1)}</span>
                          <span className="text-amber-400/50 text-[10px] font-medium">/ 5</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary border border-border whitespace-nowrap">
                          <Star size={12} className="text-muted-foreground/40 shrink-0" />
                          <span className="text-muted-foreground/60 text-xs font-medium">No ratings</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {product.stock === 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                          <span className="text-destructive text-xs font-semibold">Out of stock</span>
                        </div>
                      ) : product.stock <= 5 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-amber-400 text-xs font-semibold">{product.stock} left</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-emerald-400 text-xs font-semibold">{product.stock} in stock</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && <UpdateProductModal selectedProduct={selectedProduct} />}
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={confirmDelete} 
        title="Delete Product" 
        message="Are you sure you want to delete this product? This action cannot be undone." 
      />
    </div>
  );
};

export default Products;
