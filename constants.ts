
import { Movie } from './types';

export const MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    description: 'A cybernetic detective uncovers a conspiracy that threatens the very fabric of digital reality in the year 2088.',
    genre: ['Sci-Fi', 'Action'],
    rating: 8.9,
    duration: '2h 15m',
    poster: 'https://picsum.photos/seed/neo1/400/600',
    backdrop: 'https://picsum.photos/seed/neo2/1200/600',
    releaseDate: '2024-12-15',
    price: 15.50,
    director: 'Denis Villeneuve',
    cast: ['Cillian Murphy', 'Ana de Armas', 'Oscar Isaac'],
    trailerUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    title: 'The Silent Peak',
    description: 'An expert climber faces her ultimate challenge when a sudden storm traps her on an unexplored mountain range.',
    genre: ['Adventure', 'Drama'],
    rating: 7.4,
    duration: '1h 55m',
    poster: 'https://picsum.photos/seed/peak1/400/600',
    backdrop: 'https://picsum.photos/seed/peak2/1200/600',
    releaseDate: '2024-11-20',
    price: 12.00,
    director: 'Chloé Zhao',
    cast: ['Florence Pugh', 'Andrew Garfield'],
    trailerUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: '3',
    title: 'Midnight Echoes',
    description: 'A haunted mansion reveals secrets of a forgotten dynasty to a group of unsuspecting historians.',
    genre: ['Horror', 'Fantasy'],
    rating: 6.8,
    duration: '2h 05m',
    poster: 'https://picsum.photos/seed/echo1/400/600',
    backdrop: 'https://picsum.photos/seed/echo2/1200/600',
    releaseDate: '2025-01-05',
    price: 14.00,
    director: 'Guillermo del Toro',
    cast: ['Cate Blanchett', 'Benedict Cumberbatch'],
    trailerUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: '4',
    title: 'Velocity Prime',
    description: 'High-stakes underground racing takes a dangerous turn when a specialized driver is forced into a government heist.',
    genre: ['Action', 'Adventure'],
    rating: 8.2,
    duration: '2h 10m',
    poster: 'https://picsum.photos/seed/vel1/400/600',
    backdrop: 'https://picsum.photos/seed/vel2/1200/600',
    releaseDate: '2024-12-01',
    price: 16.50,
    director: 'Justin Lin',
    cast: ['Tom Hardy', 'Zendaya', 'John Boyega'],
    trailerUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: '5',
    title: 'Eternal Bloom',
    description: 'A botanist on a distant planet discovers a sentient flora that holds the key to humanity\'s survival.',
    genre: ['Sci-Fi', 'Drama'],
    rating: 8.5,
    duration: '2h 25m',
    poster: 'https://picsum.photos/seed/bloom1/400/600',
    backdrop: 'https://picsum.photos/seed/bloom2/1200/600',
    releaseDate: '2025-02-14',
    price: 13.50,
    director: 'Christopher Nolan',
    cast: ['Jessica Chastain', 'Timothée Chalamet'],
    trailerUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  }
];

export const GENRES = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Adventure', 'Fantasy'];

export const SEAT_PRICES = {
  standard: 0,
  premium: 5,
  vip: 15
};
