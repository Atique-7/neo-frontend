// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import sessionSlice from './sessionSlice';
// import customerSlice from './customerSlice';
// import transactionSlice from './transactionSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     sessio: sessionSlice,
//     customers: customerSlice,
//     transactions: transactionSlice, 
//   },
// });

// export default store;
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import sessionSlice from './sessionSlice';
import customerSlice from './customerSlice';
import transactionSlice from './transactionSlice';
import beverageSlice from './beverageSlice';
import salesSlice from './salesSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  sessio: sessionSlice,
  customers: customerSlice,
  transactions: transactionSlice,
  beverage: beverageSlice,
  sale: salesSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };

