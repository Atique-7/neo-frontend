export const SET_CUSTOMER_LIST = 'SET_CUSTOMER_LIST';
export const ADD_SESSION = 'ADD_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const END_SESSION = 'END_SESSION';

export const setCustomerList = (customerList) => ({
  type: SET_CUSTOMER_LIST,
  payload: customerList,
});

export const addSession = (session) => ({
  type: ADD_SESSION,
  payload: session,
});

export const updateSession = (sessionId, newData) => ({
  type: UPDATE_SESSION,
  payload: { sessionId, newData },
});

export const endSession = (sessionId) => ({
  type: END_SESSION,
  payload: { sessionId },
});