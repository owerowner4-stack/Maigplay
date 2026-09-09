import React from 'react';
import { ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSliderProps {
  onExploreGame: (gameId: string) => void;
  onOpenTZ: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onExploreGame }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131720] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left Text */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Безопасные сделки через Гарант</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Игровая валюта, аккаунты и донат без комиссий и риска
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Покупайте у проверенных игроков или продавайте свои предметы. Деньги переводятся продавцу только после подтверждения получения.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => onExploreGame('roblox')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              >
                <span>Каталог Robux</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onExploreGame('brawlstars')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors cursor-pointer"
              >
                <span>Brawl Stars</span>
              </button>
            </div>
          </div>

          {/* Right Highlights: 2 Simple Calm Badges */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">100% Защита</div>
                <div className="text-[11px] text-slate-400">Escrow удержание</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Быстрая выдача</div>
                <div className="text-[11px] text-slate-400">От 60 секунд</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
