import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/products?t=${new Date().getTime()}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/products/admin/create", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create product");
  }
});

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/products/admin/update/${id}`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update product");
  }
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete(`/products/admin/delete/${id}`);
    return { id, message: data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete product");
  }
});

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    error: null,
    message: null,
  },
  reducers: {
    clearProductError: (state) => { state.error = null; },
    clearProductMessage: (state) => { state.message = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Product created successfully";
        state.products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => { state.loading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Product updated successfully";
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if(index !== -1) state.products[index] = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => { state.loading = true; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.products = state.products.filter(p => p.id !== action.payload.id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, clearProductMessage } = productSlice.actions;
export default productSlice.reducer;
