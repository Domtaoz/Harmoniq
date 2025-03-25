
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
  seatId: number;
  seatNumber: string;
  seatStatus: 'SeatStatus.available' | 'SeatStatus.booked';
  concertId: number;
  zoneName: string;
}


export interface Ticket {
  id: string;
  concertId: string;
  seats: Seat[];
  totalPrice: number;
  purchaseDate: string;
  userId: string;
}

export type User = {
  id: number;
  username: string;
  displayName: string; 
  profilePictureUrl?: string;
  email?: string;
};

export interface AppState {
  selectedConcert: Concert | null;
  selectedSeats: Seat[];
  tickets: Ticket[];
  auth: {
    user: User | null;
    isAuthenticated: boolean;
  };
}

export interface Zone {
  zoneId: number;
  concertId: number;
  zoneName: string;
  price: number;
}
