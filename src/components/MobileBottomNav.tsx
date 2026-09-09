import React from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenTZ: () => void;
  onSelectGame: (gameId: string | null) => void;
  ordersCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onSelectGame,
  ordersCount
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f131a]/95 border-t border-white/[0.08] backdrop-blur-md px-4 py-2">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        
        {/* Главная */}
        <button
          onClick={() => {
            onTabChange('home');
            onSelectGame(null);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'home' 
              ? 'text-blue-400 font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Главная</span>
        </button>

        {/* Сделки */}
        <button
          onClick={() => onTabChange('orders')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'orders' 
              ? 'text-blue-400 font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {ordersCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">Сделки</span>
        </button>

        {/* Профиль */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'profile' 
              ? 'text-blue-400 font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Профиль</span>
        </button>

      </div>
    </nav>
  );
};
