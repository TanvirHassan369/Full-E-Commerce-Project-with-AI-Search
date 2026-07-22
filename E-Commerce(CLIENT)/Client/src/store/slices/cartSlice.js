import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// ── Async Thunks ──

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/cart");
      return res.data.cart;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch cart");
    }
  }
);

export const syncAddToCart = createAsyncThunk(
  "cart/syncAdd",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/cart/add", { productId, quantity });
      return res.data.cart;
    } catch {
      return thunkAPI.rejectWithValue("Failed to add to cart");
    }
  }
);

export const syncUpdateCart = createAsyncThunk(
  "cart/syncUpdate",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/cart/update", { productId, quantity });
      return res.data.cart;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update cart");
    }
  }
);

export const syncRemoveFromCart = createAsyncThunk(
  "cart/syncRemove",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/cart/remove/${productId}`);
      return res.data.cart;
    } catch {
      return thunkAPI.rejectWithValue("Failed to remove from cart");
    }
  }
);

export const syncClearCart = createAsyncThunk(
  "cart/syncClear",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.delete("/cart/clear");
      return [];
    } catch {
      return thunkAPI.rejectWithValue("Failed to clear cart");
    }
  }
);

// ── Slice ──

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    // Local-only actions (used when user is not logged in)
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      // Bug 6 FIX: Support size — same product with different size = different cart item
      const existingItem = state.cart.find(
        (item) => item.product.id === product.id && item.product.selectedSize === product.selectedSize
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    removeFromCart: (state, action) => {
      const { productId, selectedSize } = action.payload;
      state.cart = state.cart.filter(
        (item) => !(item.product.id === productId && item.product.selectedSize === selectedSize)
      );
    },
    updateCartQuantity: (state, action) => {
      const { productId, selectedSize, quantity } = action.payload;
      const item = state.cart.find(
        (item) => item.product.id === productId && item.product.selectedSize === selectedSize
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    // All server responses replace local cart state
    const replaceCart = (state, action) => {
      state.cart = action.payload;
    };

    builder
      .addCase(fetchCart.fulfilled, replaceCart)
      .addCase(syncAddToCart.fulfilled, replaceCart)
      .addCase(syncUpdateCart.fulfilled, replaceCart)
      .addCase(syncRemoveFromCart.fulfilled, replaceCart)
      .addCase(syncClearCart.fulfilled, replaceCart);
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
