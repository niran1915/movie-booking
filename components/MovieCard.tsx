
import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onPlayTrailer }) => {
  return (
    <div 
      className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[2/3] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-2xl"
    >
      <img 
        src={movie.poster} 
        alt={movie.title} 
        onClick={() => onClick(movie)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
      
      {/* Play Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPlayTrailer(movie);
          }}
          className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center text-black shadow-2xl pointer-events-auto transform hover:scale-110 transition-transform"
        >
          <i className="fas fa-play text-2xl ml-1"></i>
        </button>
      </div>

      <div className="absolute top-3 right-3 glass px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
        <i className="fas fa-star text-amber-500"></i>
        <span>{movie.rating}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre.slice(0, 2).map(g => (
            <span key={g} className="text-[8px] uppercase tracking-wider font-black px-1.5 py-0.5 bg-white/20 rounded backdrop-blur-sm">
              {g}
            </span>
          ))}
        </div>
        <h3 className="font-outfit font-bold text-lg leading-tight mb-1 pointer-events-auto" onClick={() => onClick(movie)}>{movie.title}</h3>
        <p className="text-xs text-slate-300 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {movie.duration} • {movie.director}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
