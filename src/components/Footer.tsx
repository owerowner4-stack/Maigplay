import React from 'react';
import { Gamepad2, FileCode } from 'lucide-react';

interface FooterProps {
  onOpenTZ: () => void;
  onSelectGame: (gameId: string | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTZ, onSelectGame }) => {
  const scrollToFaq = () => {
    const el = document.getElementById('faq');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#090c10] pt-10 pb-20 sm:pb-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectGame(null)}>
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">
                Magic<span className="text-blue-400">Play</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Торговая площадка цифровых игровых ценностей и услуг. Все сделки защищены системой Escrow.
            </p>
          </div>

          {/* Col 2: Покупателям */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Покупателям
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={scrollToFaq} className="hover:text-slate-200 transition-colors cursor-pointer text-left">Как работает Escrow</button></li>
              <li><button onClick={scrollToFaq} className="hover:text-slate-200 transition-colors cursor-pointer text-left">Гарантии возврата</button></li>
              <li><button onClick={scrollToFaq} className="hover:text-slate-200 transition-colors cursor-pointer text-left">Частые вопросы (FAQ)</button></li>
            </ul>
          </div>

          {/* Col 3: Продавцам */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Продавцам
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={scrollToFaq} className="hover:text-slate-200 transition-colors cursor-pointer text-left">Как начать продавать</button></li>
              <li><button onClick={scrollToFaq} className="hover:text-slate-200 transition-colors cursor-pointer text-left">Комиссии и тарифы</button></li>
              <li><button onClick={scrollToFaq} className="hover:text-slate-200 transition-colors cursor-pointer text-left">Безопасность сделок</button></li>
            </ul>
          </div>

          {/* Col 4: Документация и ТЗ */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Для разработчиков
            </h4>
            <div className="p-3 rounded-xl bg-[#131720] border border-white/[0.06] space-y-2">
              <p className="text-[11px] text-slate-400">
                Техническое задание проекта, компоненты и исходный код.
              </p>
              <button
                onClick={onOpenTZ}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Открыть ТЗ и Код</span>
              </button>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © 2026 MagicPlay. Все права защищены.
          </div>
          <div>
            Безопасный игровой маркетплейс
          </div>
        </div>

      </div>
    </footer>
  );
};
