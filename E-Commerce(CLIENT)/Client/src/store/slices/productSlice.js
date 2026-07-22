import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    {
      availability = "",
      price = "0-1000000",
      category = "",
      ratings = "",
      search = "",
      page = 1,
      limit = 9,
    },
    thunkAPI,
  ) => {
    try {
      const params = new URLSearchParams();
      if (availability) params.append("availability", availability);
      if (price) params.append("price", price);
      if (category) params.append("category", category);
      if (ratings) params.append("ratings", ratings);
      if (search) params.append("search", search);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const res = await axiosInstance.get(`/products?t=${new Date().getTime()}&${params.toString()}`);
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch products");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const fetchProductDetails = createAsyncThunk(
  "product/SingleProductDetails",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/products/singleProduct/${id}?t=${Date.now()}`);
      return res.data.product;
    } catch (error) {
      toast.error(
        error.response.data.message || "Failed to fetch product details",
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const postReview = createAsyncThunk(
  "product/post/Review",
  async ({ productID, reviewData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/products/post-new/review/${productID}`,
        reviewData,
      );
      toast.success(res.data.message || "Review posted successfully");
      return res.data.review;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to post review");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/delete/Review",
  async ({ productID, reviewData }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/products/delete/review/${productID}`,
      );
      toast.success(res.data.message || "Review deleted successfully");
      return res.data.review;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to delete review");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const fetchProductWithAi = createAsyncThunk(
  "product/ai..search",
  async (userPrompt, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/products/ai-search`, {
        userPrompt: userPrompt,
      });
      thunkAPI.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch AI filtered product details";
      toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    detailLoading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    // Fetch Products with Filters and Pagination
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.newProducts = action.payload.newProducts || [];
        state.topRatedProducts = action.payload.topRatedProducts || [];
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });

    // Fetch Single Product Details

    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailLoading = true;
        state.productDetails = {};
        state.productReviews = [];
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.productDetails = action.payload;
        state.productReviews = action.payload?.reviews || [];
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.detailLoading = false;
        state.productDetails = {};
      });

    // Post Review
    builder
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        state.productReviews = [action.payload, ...state.productReviews];
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      });

    // Delete Review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        // action.payload is the deleted review object from server
        const deletedId = action.payload?.review_id || action.payload?.id;
        state.productReviews = state.productReviews.filter(
          (review) => review.review_id !== deletedId && review.id !== deletedId
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      });
    // Fetch Products with AI Filtering
    builder
      .addCase(fetchProductWithAi.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAi.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProductWithAi.rejected, (state) => {
        state.aiSearching = false;
      });
  },
});

export default productSlice.reducer;
