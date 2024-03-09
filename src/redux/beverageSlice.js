// beverageSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

const initialState = {
  beverages: [],
  status: 'idle',
  error: null,
};

export const fetchBeverages = createAsyncThunk('beverages/fetchBeverages', async () => {
  const response = await  API.get('beverages/');
  console.log(response.data)
  return response.data;
});

export const createBeverage = createAsyncThunk('beverages/createBeverage', async (beverageData) => {
  const response = await  API.post('beverages/', beverageData);
  return response.data;
});

export const beverageSlice = createSlice({
  name: 'beverages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeverages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBeverages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.beverages = action.payload;
      })
      .addCase(fetchBeverages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createBeverage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.beverages.push(action.payload);
      });
  },
});

export const selectAllBeverages = (state) => state.beverages.beverages;

export default beverageSlice.reducer;
