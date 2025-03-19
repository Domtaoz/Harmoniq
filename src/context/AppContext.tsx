
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Concert, Seat, Ticket, User } from '@/types';

// Initial state
const initialState: AppState = {
  selectedConcert: null,
  selectedSeats: [],
  tickets: [],
  auth: {
    user: null,
    isAuthenticated: false
  }
};

// Action types
type Action =
  | { type: 'SELECT_CONCERT'; payload: Concert }
  | { type: 'ADD_SEAT'; payload: Seat }
  | { type: 'REMOVE_SEAT'; payload: string }
  | { type: 'CLEAR_SEATS' }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

// Reducer
const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SELECT_CONCERT':
      return {
        ...state,
        selectedConcert: action.payload
      };
    case 'ADD_SEAT':
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload]
      };
    case 'REMOVE_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(seat => seat.id !== action.payload)
      };
    case 'CLEAR_SEATS':
      return {
        ...state,
        selectedSeats: []
      };
    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [...state.tickets, action.payload]
      };
    case 'LOGIN':
      return {
        ...state,
        auth: {
          user: action.payload,
          isAuthenticated: true
        }
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          user: null,
          isAuthenticated: false
        }
      };
    default:
      return state;
  }
};

// Create the context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
