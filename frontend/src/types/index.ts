
export interface Concert {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  description: string;
  price: string;
  genre: string;
  artists: {
    name: string;
    image: string;
  }[];
}



export interface Seat {
  id: string;
  section: string;
  row: string;
  number: number;
  price: number;
  status: 'available' | 'unavailable' | 'selected';
}

export interface Ticket {
  id: string;
  concertId: string;
  seats: Seat[];
  totalPrice: number;
  purchaseDate: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  avatar?: string;
  name?: string;
}

export interface AppState {
  selectedConcert: Concert | null;
  selectedSeats: Seat[];
  tickets: Ticket[];
  auth: {
    user: User | null;
    isAuthenticated: boolean;
  };
}