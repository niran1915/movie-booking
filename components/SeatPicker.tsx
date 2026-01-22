
import React, { useState, useEffect } from 'react';
import { Seat, SeatStatus } from '../types';
import { SEAT_PRICES } from '../constants';

interface SeatPickerProps {
  onSelectionChange: (selectedSeats: Seat[]) => void;
  basePrice: number;
}

const SeatPicker: React.FC<SeatPickerProps> = ({ onSelectionChange, basePrice }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 10;

  useEffect(() => {
    // Generate mock seats
    const newSeats: Seat[] = [];
    rows.forEach(row => {
      for (let i = 1; i <= cols; i++) {
        const isReserved = Math.random() < 0.15;
        const type = row === 'A' || row === 'B' ? 'vip' : row === 'C' || row === 'D' ? 'premium' : 'standard';
        newSeats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: isReserved ? 'reserved' : 'available',
          type
        });
      }
    });
    setSeats(newSeats);
  }, []);

  const toggleSeat = (id: string) => {
    setSeats(prev => {
      const updated = prev.map(seat => {
        if (seat.id === id) {
          if (seat.status === 'reserved') return seat;
          return {
            ...seat,
            status: seat.status === 'selected' ? 'available' : 'selected' as SeatStatus
          };
        }
        return seat;
      });
      
      const selected = updated.filter(s => s.status === 'selected');
      onSelectionChange(selected);
      
      return updated;
    });
  };

  const toggleRow = (rowLabel: string) => {
    setSeats(prev => {
      const rowSeats = prev.filter(s => s.row === rowLabel && s.status !== 'reserved');
      const allRowSelected = rowSeats.length > 0 && rowSeats.every(s => s.status === 'selected');
      
      const updated = prev.map(seat => {
        if (seat.row === rowLabel && seat.status !== 'reserved') {
          return {
            ...seat,
            status: allRowSelected ? 'available' : 'selected' as SeatStatus
          };
        }
        return seat;
      });

      const selected = updated.filter(s => s.status === 'selected');
      onSelectionChange(selected);
      return updated;
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'reserved') return 'bg-slate-800 cursor-not-allowed opacity-50';
    if (seat.status === 'selected') return 'bg-amber-500 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)] border-white/50';
    if (seat.type === 'vip') return 'bg-indigo-600/40 border border-indigo-400/50 hover:bg-indigo-500/60';
    if (seat.type === 'premium') return 'bg-purple-600/40 border border-purple-400/50 hover:bg-purple-500/60';
    return 'bg-slate-700/50 border border-slate-500/30 hover:bg-slate-600/50';
  };

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalExtra = selectedSeats.reduce((sum, s) => sum + SEAT_PRICES[s.type], 0);
  const totalAmount = (selectedSeats.length * basePrice) + totalExtra;

  return (
    <div className="flex flex-col items-center">
      {/* Screen */}
      <div className="w-full max-w-lg mb-16 relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent cinema-screen rounded-t-[100%]"></div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 tracking-[0.6em] uppercase font-black opacity-50">Screen</div>
      </div>

      {/* Seat Grid with Row Selectors */}
      <div className="flex flex-col gap-2 md:gap-4 mb-12 w-full max-w-3xl overflow-x-auto no-scrollbar py-4 px-2">
        {rows.map(rowLabel => (
          <div key={rowLabel} className="flex items-center gap-4 min-w-max justify-center">
            {/* Row Selector Button */}
            <button 
              onClick={() => toggleRow(rowLabel)}
              className="w-10 h-8 rounded bg-white/5 border border-white/10 text-[10px] font-black hover:bg-white/10 hover:border-amber-500/50 transition-all flex items-center justify-center group"
            >
              <span className="group-hover:text-amber-500">Row {rowLabel}</span>
            </button>
            
            <div className="flex gap-2 md:gap-4">
              {seats.filter(s => s.row === rowLabel).map(seat => {
                const seatPrice = basePrice + SEAT_PRICES[seat.type];
                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat.id)}
                    disabled={seat.status === 'reserved'}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-lg transition-all duration-300 relative group ${getSeatColor(seat)}`}
                  >
                    <span className="sr-only">{seat.id} - ${seatPrice.toFixed(2)}</span>
                    {/* Tooltip on hover */}
                    {seat.status !== 'reserved' && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {seat.id} • ${seatPrice.toFixed(2)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Price Legend & Selection Info */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[10px] uppercase font-black tracking-widest text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-slate-700/50 border border-slate-500/30"></div>
            <span>Standard (+${SEAT_PRICES.standard})</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-purple-600/40 border border-purple-400/50"></div>
            <span>Premium (+${SEAT_PRICES.premium})</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-indigo-600/40 border border-indigo-400/50"></div>
            <span>VIP (+${SEAT_PRICES.vip})</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span>Selected</span>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="flex-grow glass p-5 rounded-2xl border border-white/10 animate-in slide-in-from-right-4">
            <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] mb-3">Live Selection Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Selected Seats:</span>
                <span className="font-bold">{selectedSeats.map(s => s.id).join(', ')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Base Cost:</span>
                <span className="font-bold">${(selectedSeats.length * basePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Type Upgrades:</span>
                <span className="font-bold text-amber-500">+${totalExtra.toFixed(2)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Selection</span>
                <span className="text-lg font-outfit font-black text-white">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatPicker;
