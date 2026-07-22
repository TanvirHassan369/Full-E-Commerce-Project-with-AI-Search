import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";
import { toast } from "react-toastify";

export const fetchAllOrders = createAsyncThunk("order/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/orders/admin/getall");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

export const updateOrderStatus = createAsyncThunk("order/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/orders/admin/update/${id}`, { status });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update order status");
  }
});

export const deleteOrder = createAsyncThunk("order/delete", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete(`/orders/admin/delete/${id}`);
    return { id, message: data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete order");
  }
});

export const fetchAllReturnRequests = createAsyncThunk("order/fetchReturns", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/returns/admin/all");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch return requests");
  }
});

export const updateReturnRequest = createAsyncThunk("order/updateReturn", async ({ returnId, status, admin_note }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/returns/admin/${returnId}`, { status, admin_note });
    toast.success(data.message);
    return { returnId, status };
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update return request");
    return rejectWithValue(error.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    returnRequests: [],
    returnsLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearOrderError: (state) => { state.error = null; },
    clearOrderMessage: (state) => { state.message = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Order updated successfully";
        const index = state.orders.findIndex(o => o.id === action.payload.order?.id);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload.order };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => { state.loading = true; })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.orders = state.orders.filter(o => o.id !== action.payload.id);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllReturnRequests.pending, (state) => { state.returnsLoading = true; })
      .addCase(fetchAllReturnRequests.fulfilled, (state, action) => {
        state.returnsLoading = false;
        state.returnRequests = action.payload.returnRequests || [];
      })
      .addCase(fetchAllReturnRequests.rejected, (state, action) => {
        state.returnsLoading = false;
        state.error = action.payload;
      })
      .addCase(updateReturnRequest.fulfilled, (state, action) => {
        const idx = state.returnRequests.findIndex(r => r.id === action.payload.returnId);
        if (idx !== -1) state.returnRequests[idx].status = action.payload.status;
        // If approved, update the corresponding order status to Returned
        if (action.payload.status === "Approved") {
          const returnReq = state.returnRequests[idx];
          if (returnReq) {
            const orderIdx = state.orders.findIndex(o => o.id === returnReq.order_id);
            if (orderIdx !== -1) {
              state.orders[orderIdx].order_status = "Returned";
              state.orders[orderIdx].payment_status = "Refunded";
            }
          }
        }
      });
  },
});

export const { clearOrderError, clearOrderMessage } = orderSlice.actions;
export default orderSlice.reducer;
