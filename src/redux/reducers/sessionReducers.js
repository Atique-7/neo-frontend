import { SET_CUSTOMER_LIST, ADD_SESSION, UPDATE_SESSION, END_SESSION  } from '../actions/sessionActions'

const initialState = {
  sessio: [], // Array to store multiple sessions
  customerList: [],
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMER_LIST:
      return {
        ...state,
        customerList: action.payload,
      };
    case ADD_SESSION:
      return {
        ...state,
        sessio: [...state.sessio, action.payload],
      };
    case UPDATE_SESSION:
      const { sessionId, newData } = action.payload;
      return {
        ...state,
        sessio: state.sessio.map((session) =>
          session.sessionId === sessionId
            ? { ...session, ...newData }
            : session
        ),
      };
    case END_SESSION:
        const { sessionId: endedSessionId } = action.payload;
        return {
        ...state,
        sessio: state.sessio.filter((session) => session.sessionId !== endedSessionId),
        };
    default:
      return state;
  }
};

export default sessionReducer;
// import { SET_CUSTOMER_LIST, ADD_SESSION, UPDATE_SESSION, END_SESSION } from '../actions/sessionActions';

// const initialState = {
//   sessions: [], // Array to store multiple sessions
//   customerList: [],
// };

// const sessionReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_CUSTOMER_LIST:
//       return {
//         ...state,
//         customerList: action.payload,
//       };
//     case ADD_SESSION:
//       return {
//         ...state,
//         sessions: [...state.sessions, action.payload],
//       };
//     case UPDATE_SESSION:
//       const { sessionId, newData } = action.payload;
//       return {
//         ...state,
//         sessions: state.sessions.map((session) =>
//           session.sessionId === sessionId ? { ...session, ...newData } : session
//         ),
//       };
//     case END_SESSION:
//       const { sessionId: endedSessionId } = action.payload;
//       return {
//         ...state,
//         sessions: state.sessions.filter((session) => session.sessionId !== endedSessionId),
//       };
//     default:
//       return state;
//   }
// };

// export default sessionReducer;
