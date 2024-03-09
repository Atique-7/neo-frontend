import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

const initialState = {
    list: [],
    filteredList: [],
    todaysList: [],
    customList:[], // Added for individual customer or date filtering
    loading: false,
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async () => {
        const response = await API.get("transactions/");
        return response.data;
    }
);

export const fetchTransactionsByCustomer = createAsyncThunk(
    'transactions/fetchTransactionsByCustomer',
    async (customerId) => {
        const response = await API.get(`transactions/?customer=${customerId}`);
        return response.data;
    }
);

export const fetchTransactionsByDate = createAsyncThunk(
    'transactions/fetchTransactionsByDate',
    async ({startDate, endDate, custom}) => {
        const response = await API.get(
            `transactions/?start_date=${startDate}&end_date=${endDate}`
        );
        return {data: response.data, type: custom};
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async (requestData) => { // transactionData will contain id and updated fields
        const response = await API.patch(`transactions/${requestData.id}/`, requestData);
        return response.data; // Assuming the updated transaction is returned
    }
);

// export const fetchTransactionsByDate = createAsyncThunk(
//     'transactions/fetchTransactionsByDate',
//     async ({ customerId, startDate, endDate }) => {
//       const url = customerId
//         ? `${API_URL}?customer=${customerId}&start_date=${startDate}&end_date=${endDate}`
//         : `${API_URL}?start_date=${startDate}&end_date=${endDate}`;
//       const response = await API.get(url);
//       return response.data;
//     }
//   );

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        // Add any necessary reducers for non-API actions, e.g., clearing filters
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchTransactionsByCustomer.pending, (state) => {
                state.filteredList = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsByCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredList = action.payload; // Update filtered list
            })
            .addCase(fetchTransactionsByCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchTransactionsByDate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsByDate.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.custom)
                if(action.payload.type === true) {
                    state.customList = action.payload.data;
                    console.log(state.customList)
                } else {
                    state.todaysList = action.payload.data;
                }
            })
            .addCase(fetchTransactionsByDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateTransaction.pending, (state) => {
                state.loading = true; // Or specific status for updating
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                // Update either 'list' or 'filteredList' as needed based on your store 
                // const updatedTransaction = action.payload;
                // const existingIndex = state.list.findIndex(t => t.id === updatedTransaction.id);
                // if (existingIndex !== -1) {
                //     state.list[existingIndex] = updatedTransaction;
                // }
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { actions } = transactionSlice;
export default transactionSlice.reducer;
