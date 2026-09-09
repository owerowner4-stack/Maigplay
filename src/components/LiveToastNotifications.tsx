import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShoppingBag } from 'lucide-react';
import { LiveOrderEvent } from '../types';
import { INITIAL_LIVE_ORDERS } from '../data/mockData';

export const LiveToastNotifications: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<LiveOrderEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let orderIndex = 0;
    
    // Initial delay then loop every 9 seconds
    const interval = setInterval(() => {
      const order = INITIAL_LIVE_ORDERS[orderIndex % INITIAL_LIVE_ORDERS.length];
      orderIndex++;

      setCurrentToast(order);
      setIsVisible(true);

      // Hide after 4.5 seconds
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      return () => clearTimeout(hideTimeout);
    }, 9500);

    return () => clearInterval(interval);
  }, []);

  if (!currentToast || !isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 max-w-xs animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_10px_25px_rgba(168,85,247,0.4),0_0_15px_rgba(6,182,212,0.3)]">
        <div className="w-full bg-[#120c29]/95 rounded-[14px] p-3 backdrop-blur-xl flex items-center justify-between gap-3 border border-purple-800/30">
          
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={currentToast.gameIcon}
                alt={currentToast.gameName}
                className="w-9 h-9 rounded-xl object-cover border border-purple-500/40"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#120c29] flex items-center justify-center text-[8px] font-black text-black">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Новый заказ на сайте!</span>
              </div>
              <div className="text-xs font-bold text-white line-clamp-1">
                {currentToast.itemTitle}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentToast.gameName} • <span className="text-white font-bold">{currentToast.price} ₽</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  );
};
