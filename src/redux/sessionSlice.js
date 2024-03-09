import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import API from '../utils/api'; // Assuming API is defined elsewhere

const initialState = {
  customerList: [],
  sessions: [],
  loading: false, // Flag to indicate data fetching state (optional)
  endedSessions: [],
  error: null, // Placeholder for error messages (optional)
};

export const deleteSession = createAsyncThunk(
  'sessions/deleteSession',
  async (sessionId) => {
    const response = await API.delete(`sessions/${sessionId}`);
    return response.data;
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCustomerList: (state, action) => {
      state.customerList = action.payload;
    },
    addSession: (state, action) => {
      state.sessions.push(action.payload);
    },
    updateSession: (state, action) => {
      const { sessionId, newData } = action.payload;
      const sessionIndex = state.sessions.findIndex(
        (session) => session.sessionId === sessionId
      );
      console.log(newData);
      console.log(sessionIndex);

      if (sessionIndex !== -1) {
        const updatedSession = { ...state.sessions[sessionIndex], ...newData };
        console.log(updatedSession);
        // Create a new array with the updated session object
        return {
          ...state,
          sessions: [
            ...state.sessions.slice(0, sessionIndex),
            updatedSession,
            ...state.sessions.slice(sessionIndex + 1),
          ],
        };
      } else {
        // Handle case where session is not found (optional)
        return state;
      }
    },
    endSession: (state, action) => {
      const { sessionId } = action.payload;
      state.sessions = state.sessions.filter((session) => session.sessionId !== sessionId);
      state.endedSessions = state.endedSessions.filter((session) => session.sessionId !== sessionId);
    },
    shiftToPayment: (state, action) => {
      const { sessionId } = action.payload;
      const sessionIndex = state.sessions.findIndex((session) => session.sessionId === sessionId);
  
      if (sessionIndex !== -1) {
        const endedSession = { ...state.sessions[sessionIndex]};
        state.endedSessions = [...state.endedSessions, endedSession];
        state.sessions = state.sessions.filter((session) => session.sessionId !== sessionId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSession.pending, (state) => {
        state.loading = true; // Set loading flag to true
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.loading = false; // Set loading flag to false
        state.sessions = state.sessions.filter(
          (session) => session.sessionId !== action.payload.id // Update sessions based on response data (assuming 'id' property exists)
        );
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.loading = false; // Set loading flag to false
        state.error = action.error.message; // Handle errors (optional)
      });
  },
});

export const { setCustomerList, addSession, updateSession, endSession, shiftToPayment } = sessionSlice.actions;
// export const shiftToPayment = createAction('session/shiftToPayment', (sessionId) => ({ sessionId }));
export default sessionSlice.reducer;
