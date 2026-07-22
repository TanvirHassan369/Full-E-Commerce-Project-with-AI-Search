import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
  name: "extra",
  initialState: {
    openedComponent: "Dashboard",
    isNavbarOpened: false,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
  },
  reducers: {
    toggleCreateProductModal: (state) => {
      state.isCreateProductModalOpened = !state.isCreateProductModalOpened;
    },
    toggleUpdateProductModal: (state) => {
      state.isUpdateProductModalOpened = !state.isUpdateProductModalOpened;
    },
    toggleViewProductModal: (state) => {
      state.isViewProductModalOpened = !state.isViewProductModalOpened;
    }
  },
});

export const { 
  toggleCreateProductModal, 
  toggleUpdateProductModal, 
  toggleViewProductModal 
} = extraSlice.actions;

export default extraSlice.reducer;
