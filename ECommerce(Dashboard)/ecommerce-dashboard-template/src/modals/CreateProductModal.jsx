import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearProductError, clearProductMessage, createProduct } from "../store/slices/productsSlice";
import { toggleCreateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle, X, ImagePlus, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

const CreateProductModal = () => {
  const { loading, error, message } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const editor = React.useRef(null);

  const editorConfig = React.useMemo(() => ({
    readonly: false,
    theme: "dark",
    height: 300,
    showPlaceholder: false,
    style: {
      background: "#1e1e24", // darker background to match glass-panel
      color: "#ffffff"
    }
  }), []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "Electronics",
    stock: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const FASHION_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "39", "40", "41", "42", "43", "44"];
  const FASHION_CATEGORIES = ["Fashion"];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductError());
    }
    if (message === "Product created successfully") {
      toast.success(message);
      dispatch(clearProductMessage());
      dispatch(toggleCreateProductModal());
      setSelectedSizes([]);
    }
  }, [error, message, dispatch]);

  const categoryOptions = [
    "Electronics", "Fashion", "Home & Garden", "Sports", 
    "Books", "Beauty", "Automotive", "Kids & Baby",
  ];

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.images, ...newFiles];
    setFormData({ ...formData, images: updatedImages });
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    // Save raw Markdown to DB
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.discount_price) {
      data.append("discount_price", formData.discount_price);
    }
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("sizes", JSON.stringify(selectedSizes));

    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }

    dispatch(createProduct(data));
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex justify-center items-start pt-6 p-4 animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl scrollbar-hide p-6 relative border-border shadow-2xl animate-slide-down mb-6">
        <button
          onClick={() => dispatch(toggleCreateProductModal())}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-secondary p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Add New Product</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-border px-4 py-2 rounded-xl bg-input/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                className="w-full border border-border px-4 py-2 rounded-xl bg-input/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categoryOptions.map((cat, idx) => (
                  <option key={idx} value={cat} className="bg-popover">{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Price (৳)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-border px-4 py-2 rounded-xl bg-input/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Discount Price (৳)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.discount_price}
                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                className="w-full border border-border px-4 py-2 rounded-xl bg-input/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Stock Quantity</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full border border-border px-4 py-2 rounded-xl bg-input/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Description</label>
            <div className="jodit-container-dark rounded-xl overflow-hidden border border-border">
              <JoditEditor
                ref={editor}
                value={formData.description}
                config={editorConfig}
                onChange={(newContent) => setFormData({ ...formData, description: newContent })}
              />
            </div>
          </div>

          {/* Size Selector — only for Fashion */}
          {FASHION_CATEGORIES.includes(formData.category) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Available Sizes
                <span className="text-muted-foreground font-normal ml-1">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FASHION_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSizes((prev) =>
                        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                      )
                    }
                    className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      selectedSizes.includes(size)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-input/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSizes.length === 0 && (
                <p className="text-xs text-muted-foreground">No sizes selected — product will show as one-size.</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Product Images</label>            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-xl cursor-pointer bg-input/30 hover:bg-input/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                  <ImagePlus size={28} className="mb-2" />
                  <p className="text-sm"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                  <p className="text-xs mt-1">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => dispatch(toggleCreateProductModal())}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <><LoaderCircle size={18} className="animate-spin" /> Creating...</>
              ) : (
                <><CheckCircle size={18} /> Create Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateProductModal;
