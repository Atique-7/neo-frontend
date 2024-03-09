import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

const initialState = {
    list: [],
    selectedCustomer: null,
    loading: false,
    error: null,
};

export const getCustomers = createAsyncThunk(
    'customers/getCustomers',
    async () => {
        const response = await API.get('customers/'); // Replace with your API endpoint
        return response.data;
    }
);

export const searchCustomers = createAsyncThunk(
    'customers/searchCustomers',
    async (searchTerm) => {
        const response = await API.get(`customers/?username=${searchTerm}`); // Replace with your API endpoint
        return response.data;
    }
);

export const createUser = createAsyncThunk(
    'customers/createUser',
    async (formData) => {
        const response = await API.post('customers/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for FormData
            },
        });
        return response.data;
    }
);

export const getCustomerById = createAsyncThunk(
    'customers/getCustomerById',
    async (customerId) => {
        const response = await API.get(`customers/${customerId}`); // Replace with your API endpoint
        return response.data;
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(searchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(searchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                // Handle successful creation (e.g., reset form, show success message)
                console.log('User created successfully:', action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                // Handle creation error (e.g., show error message)
            })
            .addCase(getCustomerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCustomer = action.payload;
            })
            .addCase(getCustomerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default customerSlice.reducer;
