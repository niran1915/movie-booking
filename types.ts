
export type Genre = 'Action' | 'Sci-Fi' | 'Drama' | 'Comedy' | 'Horror' | 'Adventure' | 'Fantasy';

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: Genre[];
  rating: number;
  duration: string;
  poster: string;
  backdrop: string;
  releaseDate: string;
  price: number;
  director: string;
  cast: string[];
  trailerUrl: string;
}

export type SeatStatus = 'available' | 'selected' | 'reserved';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: 'standard' | 'premium' | 'vip';
}

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  seats: string[];
  totalPrice: number;
  date: string;
  time: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
