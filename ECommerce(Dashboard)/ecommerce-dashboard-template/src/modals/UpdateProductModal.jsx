import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, clearProductError, clearProductMessage } from "../store/slices/productsSlice";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle, X, CheckCircle, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

const UpdateProductModal = ({ selectedProduct }) => {
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
    category: "",
    stock: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const FASHION_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "39", "40", "41", "42", "43", "44"];
  const FASHION_CATEGORIES = ["Fashion"];

  const categoryOptions = [
    "Electronics", "Fashion", "Home & Garden", "Sports", 
    "Books", "Beauty", "Automotive", "Kids & Baby",
  ];

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        discount_price: selectedProduct.discount_price || "",
        category: selectedProduct.category || "Electronics",
        stock: selectedProduct.stock || "",
      });
      setNewImages([]);
      setNewImagePreviews([]);
      setExistingImages(selectedProduct.images || []);
      setSelectedSizes(selectedProduct.sizes || []);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductError());
    }
    if (message === "Product updated successfully") {
      toast.success(message);
      dispatch(clearProductMessage());
      dispatch(toggleUpdateProductModal());
    }
  }, [error, message, dispatch]);

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
    e.target.value = "";
  };

  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
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

    // Send remaining existing images as JSON
    data.append("existingImages", JSON.stringify(existingImages));

    for (let i = 0; i < newImages.length; i++) {
      data.append("images", newImages[i]);
    }

    dispatch(updateProduct({ id: selectedProduct.id, productData: data }));
  };

  if (!selectedProduct) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex justify-center items-start pt-6 p-4 animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl scrollbar-hide p-6 relative border-border shadow-2xl animate-slide-down mb-6">
        <button
          onClick={() => dispatch(toggleUpdateProductModal())}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-secondary p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Update Product</h2>

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

          {/* Current Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Current Images
                <span className="text-muted-foreground font-normal ml-1">(hover to remove)</span>
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 group">
                    <img src={img.url} alt={`img-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(i)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {existingImages.length === 0 && selectedProduct.images?.length > 0 && (
            <p className="text-xs text-destructive/80">All current images removed. Upload new ones below.</p>
          )}

          {/* Upload New Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Replace / Add Images <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-border border-dashed rounded-xl cursor-pointer bg-input/30 hover:bg-input/50 transition-colors">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <ImagePlus size={24} className="mb-1" />
                <p className="text-sm"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                <p className="text-xs mt-0.5">PNG, JPG or WEBP (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
            </label>

            {newImagePreviews.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {newImagePreviews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary/40 flex-shrink-0 group">
                    <img src={src} alt="New preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
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
              onClick={() => dispatch(toggleUpdateProductModal())}
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
                <><LoaderCircle size={18} className="animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle size={18} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UpdateProductModal;
