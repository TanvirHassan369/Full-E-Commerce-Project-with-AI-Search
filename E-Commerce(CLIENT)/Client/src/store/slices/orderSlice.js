import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch my orders
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/orders/me?t=${new Date().getTime()}`);
      return res.data.orders;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Place new order — returns paymentUrl (Online) or orderId (COD)
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/orders/new", orderData);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Submit a return request
export const submitReturnRequest = createAsyncThunk(
  "order/submitReturn",
  async ({ orderId, reason, description }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/returns/${orderId}`, { reason, description });
      toast.success("Return request submitted successfully.");
      return { orderId, returnRequest: res.data.returnRequest };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit return request");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Fetch my return requests
export const fetchMyReturnRequests = createAsyncThunk(
  "order/fetchMyReturns",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/returns/my/requests");
      return res.data.returnRequests;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    myReturnRequests: [],
    fetchingOrders: false,
    placingOrder: false,
    submittingReturn: false,
    finalPrice: null,
    orderStep: 1,
    paymentUrl: "",
  },
  reducers: {
    setOrderStep: (state, action) => {
      state.orderStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.fetchingOrders = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload || [];
      })
      .addCase(fetchMyOrders.rejected, (state) => { state.fetchingOrders = false; });

    builder
      .addCase(placeOrder.pending, (state) => { state.placingOrder = true; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.finalPrice = action.payload.total_price;
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(placeOrder.rejected, (state) => { state.placingOrder = false; });

    builder
      .addCase(submitReturnRequest.pending, (state) => { state.submittingReturn = true; })
      .addCase(submitReturnRequest.fulfilled, (state, action) => {
        state.submittingReturn = false;
        state.myReturnRequests.push(action.payload.returnRequest);
      })
      .addCase(submitReturnRequest.rejected, (state) => { state.submittingReturn = false; });

    builder
      .addCase(fetchMyReturnRequests.fulfilled, (state, action) => {
        state.myReturnRequests = action.payload || [];
      });
  },
});

export const { setOrderStep } = orderSlice.actions;
export default orderSlice.reducer;
