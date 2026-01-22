
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MovieCard from './components/MovieCard';
import SeatPicker from './components/SeatPicker';
import AIChatAssistant from './components/AIChatAssistant';
import { MOVIES, GENRES, SEAT_PRICES } from './constants';
import { Movie, Booking, Seat } from './types';
import { gemini } from './services/geminiService';

declare const confetti: any;

// Simple Video Modal Component
const VideoModal: React.FC<{ movie: Movie; onClose: () => void }> = ({ movie, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl aspect-video glass rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <video 
          src={movie.trailerUrl} 
          className="w-full h-full object-contain" 
          controls 
          autoPlay
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <h2 className="text-2xl font-outfit font-black italic uppercase tracking-tighter text-amber-500">
            Now Playing: {movie.title} Trailer
          </h2>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'profile'>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [insight, setInsight] = useState<string>('');
  const [isBookingStep, setIsBookingStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const savedBookings = localStorage.getItem('cinequest_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      setInsight('');
      gemini.getMovieInsight(selectedMovie).then(setInsight);
    }
  }, [selectedMovie]);

  const calculateTotalPrice = () => {
    if (!selectedMovie) return 0;
    const base = selectedSeats.length * selectedMovie.price;
    const extras = selectedSeats.reduce((sum, s) => sum + SEAT_PRICES[s.type], 0);
    return base + extras;
  };

  const handleBookNow = () => {
    setIsBookingStep(true);
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const confirmBooking = () => {
    if (!selectedMovie || selectedSeats.length === 0) return;

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const totalPrice = calculateTotalPrice();
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        seats: selectedSeats.map(s => s.id),
        totalPrice: totalPrice,
        date: new Date().toLocaleDateString(),
        time: "19:30",
        timestamp: Date.now()
      };

      const updatedBookings = [newBooking, ...bookings];
      setBookings(updatedBookings);
      localStorage.setItem('cinequest_bookings', JSON.stringify(updatedBookings));
      
      fireConfetti();
      
      setIsProcessing(false);
      setIsBookingStep(false);
      setSelectedMovie(null);
      setSelectedSeats([]);
      setActiveTab('bookings');
    }, 2000);
  };

  const filteredMovies = activeGenre === 'All' 
    ? MOVIES 
    : MOVIES.filter(m => m.genre.includes(activeGenre as any));

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && !selectedMovie && (
          <>
            <section className="mb-12">
              <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl group">
                <img 
                  src={MOVIES[0].backdrop} 
                  className="w-full h-full object-cover brightness-50 transition-transform duration-1000 group-hover:scale-105" 
                  alt="Featured" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-10 flex flex-col justify-end">
                  <div className="flex gap-2 mb-4">
                    {MOVIES[0].genre.map(g => (
                      <span key={g} className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter mb-4 italic uppercase">
                    {MOVIES[0].title}
                  </h1>
                  <p className="max-w-xl text-slate-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-2">
                    {MOVIES[0].description}
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setTrailerMovie(MOVIES[0])}
                      className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-amber-500 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-play"></i> Watch Trailer
                    </button>
                    <button 
                      onClick={() => setSelectedMovie(MOVIES[0])}
                      className="px-8 py-3 glass font-bold rounded-xl hover:bg-white/10 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-3">
                  {['All', ...GENRES].map(genre => (
                    <button
                      key={genre}
                      onClick={() => setActiveGenre(genre)}
                      className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        activeGenre === genre 
                          ? 'bg-amber-500 text-black' 
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredMovies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={setSelectedMovie} 
                    onPlayTrailer={setTrailerMovie} 
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {selectedMovie && (
          <div className="animate-in fade-in duration-500">
            <button 
              onClick={() => { setSelectedMovie(null); setIsBookingStep(false); setSelectedSeats([]); }}
              className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-500 transition-colors"
            >
              <i className="fas fa-arrow-left"></i> Back to Catalog
            </button>

            {!isBookingStep ? (
              <div className="grid md:grid-cols-[1fr,400px] gap-12">
                <div>
                  <div className="relative h-[450px] rounded-3xl overflow-hidden mb-8 group">
                    <img 
                      src={selectedMovie.backdrop} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={selectedMovie.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-center justify-center">
                      <button 
                        onClick={() => setTrailerMovie(selectedMovie)}
                        className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(245,158,11,0.5)] transform hover:scale-110 transition-transform"
                      >
                        <i className="fas fa-play text-3xl ml-1"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMovie.genre.map(g => (
                      <span key={g} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-amber-500">
                        {g}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-outfit font-black mb-6 uppercase tracking-tighter italic">
                    {selectedMovie.title}
                  </h2>

                  <div className="flex gap-8 mb-8 pb-8 border-b border-white/5 overflow-x-auto no-scrollbar">
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Release Date</span>
                      <span className="font-bold">{selectedMovie.releaseDate}</span>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Duration</span>
                      <span className="font-bold">{selectedMovie.duration}</span>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Director</span>
                      <span className="font-bold">{selectedMovie.director}</span>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Rating</span>
                      <div className="flex items-center gap-1">
                        <i className="fas fa-star text-amber-500"></i>
                        <span className="font-bold">{selectedMovie.rating}/10</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                    {selectedMovie.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Starring</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedMovie.cast.map(c => (
                        <div key={c} className="px-4 py-2 glass rounded-xl text-xs font-medium border border-white/5">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {insight && (
                    <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-in slide-in-from-right-4">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="fas fa-sparkles text-amber-500"></i>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">CineAI Insight</span>
                      </div>
                      <p className="text-sm font-medium italic text-slate-200 leading-relaxed">
                        "{insight}"
                      </p>
                    </div>
                  )}

                  <div className="glass p-8 rounded-3xl border border-white/5 sticky top-24">
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Tickets Starting From</h3>
                      <p className="text-4xl font-outfit font-black text-amber-500">${selectedMovie.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-400 text-sm">Select Show Date</span>
                        <span className="font-bold text-sm">Today, Oct 24</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-400 text-sm">Cinema Hall</span>
                        <span className="font-bold text-sm">Screen 4 (IMAX)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <button className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase border border-white/5 transition-colors">17:30</button>
                      <button className="py-3 bg-amber-500 text-black rounded-xl text-xs font-black uppercase transition-colors">19:30</button>
                      <button className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase border border-white/5 transition-colors">21:00</button>
                      <button className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase border border-white/5 transition-colors">23:15</button>
                    </div>

                    <button 
                      onClick={handleBookNow}
                      className="w-full py-4 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                    >
                      Choose Your Seats
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl font-outfit font-black text-center mb-16 uppercase italic tracking-tighter">
                    Choose Your Experience
                  </h2>
                  
                  <div className="mb-16">
                    <SeatPicker 
                      onSelectionChange={setSelectedSeats} 
                      basePrice={selectedMovie.price} 
                    />
                  </div>

                  <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Seats Selected</p>
                        <p className="text-xl font-black font-outfit">
                          {selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Final Total</p>
                        <p className="text-xl font-black font-outfit text-amber-500">
                          ${calculateTotalPrice().toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={confirmBooking}
                      disabled={selectedSeats.length === 0 || isProcessing}
                      className="w-full md:w-auto px-12 py-4 bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors relative overflow-hidden"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-spinner animate-spin"></i> Processing...
                        </span>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-4xl font-outfit font-black mb-10 uppercase italic tracking-tighter">
              My Tickets
            </h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-ticket text-3xl text-slate-600"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                <p className="text-slate-400 mb-8">Ready for your next cinematic adventure?</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Explore Movies
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookings.map(booking => (
                  <div key={booking.id} className="glass rounded-3xl overflow-hidden flex flex-col sm:flex-row border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="w-full sm:w-40 h-48 sm:h-auto overflow-hidden">
                      <img 
                        src={MOVIES.find(m => m.id === booking.movieId)?.poster} 
                        alt={booking.movieTitle} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-outfit font-bold uppercase tracking-tight italic">{booking.movieTitle}</h3>
                          <span className="text-[10px] font-black px-2 py-1 bg-green-500/20 text-green-400 rounded-md uppercase">Confirmed</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500">Date & Time</p>
                            <p className="text-xs font-bold">{booking.date} • {booking.time}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500">Seats</p>
                            <p className="text-xs font-bold">{booking.seats.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500">Ticket ID</p>
                            <p className="text-xs font-mono text-slate-400">CQ-{booking.id.toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500">Total Paid</p>
                            <p className="text-xs font-bold text-amber-500">${booking.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button className="flex-grow py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 transition-colors">
                          View QR Code
                        </button>
                        <button className="py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-black uppercase transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="glass p-10 rounded-3xl border border-white/5 text-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/30 p-1 mx-auto mb-6">
                <img src="https://picsum.photos/seed/user1/200" alt="Profile" className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-3xl font-outfit font-black mb-1 uppercase tracking-tight italic">Alex Rivers</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium">Member since Oct 2024 • Gold Level</p>
              
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-2xl font-black font-outfit text-amber-500">{bookings.length}</p>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Movies Seen</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-2xl font-black font-outfit text-indigo-400">12</p>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Popcorn pts</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-2xl font-black font-outfit text-emerald-400">4</p>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Favorites</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase flex items-center justify-between px-6 transition-all">
                  <span>Account Settings</span>
                  <i className="fas fa-chevron-right text-slate-600"></i>
                </button>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase flex items-center justify-between px-6 transition-all">
                  <span>Payment Methods</span>
                  <i className="fas fa-chevron-right text-slate-600"></i>
                </button>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase flex items-center justify-between px-6 transition-all">
                  <span>Privacy & Security</span>
                  <i className="fas fa-chevron-right text-slate-600"></i>
                </button>
                <button className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 rounded-xl text-xs font-black uppercase transition-all mt-8">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {trailerMovie && (
        <VideoModal 
          movie={trailerMovie} 
          onClose={() => setTrailerMovie(null)} 
        />
      )}

      <AIChatAssistant />
    </Layout>
  );
};

export default App;
