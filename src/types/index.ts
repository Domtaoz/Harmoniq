
export interface Concert {
  id: string;
  name: string;
  date: string;
  image: string;
  genre?: string;
  description?: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  status: 'available' | 'selected' | 'unavailable';
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
}

export interface Ticket {
  id: string;
  concertId: string;
  concertName: string;
  date: string;
  seat: {
    row: string;
    number: number;
  };
  price: number;
  qrCode?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AppState {
  selectedConcert: Concert | null;
  selectedSeats: Seat[];
  tickets: Ticket[];
  auth: AuthState;
}
