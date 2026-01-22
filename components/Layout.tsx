
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'bookings' | 'profile';
  setActiveTab: (tab: 'home' | 'bookings' | 'profile') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
            <i className="fas fa-film text-black font-bold"></i>
          </div>
          <span className="font-outfit font-black text-xl tracking-tighter uppercase italic">CineQuest</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setActiveTab('home')}
            className={`hover:text-white transition-colors ${activeTab === 'home' ? 'text-amber-500' : ''}`}
          >
            Movies
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`hover:text-white transition-colors ${activeTab === 'bookings' ? 'text-amber-500' : ''}`}
          >
            My Bookings
          </button>
          <button className="hover:text-white transition-colors">Cinemas</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <i className="fas fa-search"></i>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden border-2 border-white/10"
          >
            <img src="https://picsum.photos/seed/user1/100" alt="Avatar" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <main className="flex-grow pt-16 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 h-16 flex items-center justify-around px-4">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-amber-500' : 'text-slate-500'}`}
        >
          <i className="fas fa-house text-lg"></i>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'bookings' ? 'text-amber-500' : 'text-slate-500'}`}
        >
          <i className="fas fa-ticket text-lg"></i>
          <span className="text-[10px] font-bold">Bookings</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-amber-500' : 'text-slate-500'}`}
        >
          <i className="fas fa-user text-lg"></i>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </footer>
    </div>
  );
};

export default Layout;
