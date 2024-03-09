// salesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

// Define the initial state
const initialState = {
  sales: [],
  status: 'idle',
  error: null,
};

// Define the async thunk for fetching sales
export const fetchSales = createAsyncThunk('sales/fetchSales', async () => {
  const response = await API.get('sales/');
  return response.data;
});

// Define the async thunk for creating a sale
export const createSale = createAsyncThunk('sales/createSale', async (saleData) => {
  const response = await API.post('sales/', saleData);
  return response.data;
});

// Define the sales slice
const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales.push(action.payload);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {} = salesSlice.actions;
export default salesSlice.reducer;
