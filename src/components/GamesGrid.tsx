import React from 'react';
import { Game } from '../types';
import { ChevronRight } from 'lucide-react';

interface GamesGridProps {
  games: Game[];
  selectedGameId: string | null;
  onSelectGame: (gameId: string | null) => void;
}

export const GamesGrid: React.FC<GamesGridProps> = ({
  games,
  selectedGameId,
  onSelectGame
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-white">
          Популярные игры
        </h2>

        {selectedGameId && (
          <button
            onClick={() => onSelectGame(null)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Показать все игры</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {games.map((game) => {
          const isSelected = selectedGameId === game.id;
          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(isSelected ? null : game.id)}
              className={`rounded-xl p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'bg-[#181e2b] border-blue-500/60 ring-1 ring-blue-500/30'
                  : 'bg-[#131720] border-white/[0.06] hover:bg-[#181d28] hover:border-white/[0.12]'
              }`}
            >
              <img 
                src={game.icon} 
                alt={game.name}
                className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-semibold text-white truncate">
                  {game.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  от {game.minPrice} ₽
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
