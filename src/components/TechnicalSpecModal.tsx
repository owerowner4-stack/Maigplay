import React, { useState } from 'react';
import { TECHNICAL_SPECIFICATION } from '../data/specificationData';
import { 
  X, 
  Copy, 
  Check, 
  FileCode, 
  Palette, 
  BookOpen, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Layout, 
  Layers,
  Code2
} from 'lucide-react';

interface TechnicalSpecModalProps {
  onClose: () => void;
}

export const TechnicalSpecModal: React.FC<TechnicalSpecModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tz' | 'ui' | 'html-css' | 'js'>('tz');
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(key);
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-5xl h-[92vh] rounded-2xl bg-[#131720] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full bg-[#131720] rounded-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:px-6 py-3.5 border-b border-white/[0.06] bg-[#131720] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>MagicPlay • Документация и ТЗ</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    v1.0.0
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Техническое задание, UI-спецификация, архитектура и компоненты
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="px-4 sm:px-6 py-2 bg-[#0d1017] border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
            
            <button
              onClick={() => setActiveTab('tz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'tz'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Техническое задание (ТЗ)</span>
            </button>

            <button
              onClick={() => setActiveTab('ui')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'ui'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>2. Дизайн-система & UI Kit</span>
            </button>

            <button
              onClick={() => setActiveTab('html-css')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'html-css'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>3. HTML/CSS Карточки товара</span>
            </button>

            <button
              onClick={() => setActiveTab('js')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'js'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>4. JS Сценарии и Анимации</span>
            </button>

          </div>

          {/* Tab Contents Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0b0e14] text-slate-300">
            
            {/* TAB 1: ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ТЗ) */}
            {activeTab === 'tz' && (
              <div className="space-y-6 max-w-4xl mx-auto leading-relaxed text-sm">
                
                {/* Intro Card */}
                <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Общие сведения о проекте "MagicPlay"
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    <strong>MagicPlay</strong> — современная высоконагруженная торговая C2C/B2C площадка цифровых игровых ценностей (аккаунты, игровая валюта, донат, лицензионные ключи, услуги бустинга и прокачки). Основная бизнес-модель построена на защите сделок по принципу <strong>Escrow (Гарант)</strong> с удержанием комиссии с продавца (от 2% до 7%).
                  </p>
                </div>

                {/* 1.1 Архитектурный стек */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    1. Архитектурный стек технологий
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#120c29] border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300 block mb-1">Frontend Client</span>
                      <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
                        <li>React 19 + TypeScript (модульная архитектура)</li>
                        <li>Tailwind CSS v4 (утилитарные стили, Glassmorphism)</li>
                        <li>Motion (анимации переходов, свайпы, fly-in)</li>
                        <li>Lucide React (геймифицированная иконографика)</li>
                        <li>PWA ServiceWorker (Push-уведомления о сделках)</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#120c29] border border-purple-900/30">
                      <span className="text-xs font-bold text-cyan-300 block mb-1">Backend & Escrow Service</span>
                      <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
                        <li>Node.js / Express API Gateway</li>
                        <li>WebSocket / Socket.io (живой чат, индикация набора текста)</li>
                        <li>MagicEscrow Smart Engine (двухфазная фиксация средств)</li>
                        <li>Anti-Fraud & Telegram Bot для продавцов</li>
                        <li>Redis (кэширование лотов и очередей уведомлений)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 1.2 Бизнес-логика сделки */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    2. Пайплайн безопасной сделки (Escrow Гарант)
                  </h4>
                  <div className="p-4 rounded-xl bg-[#120c29] border border-purple-900/30 space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">1</span>
                      <div>
                        <strong className="text-white">Оформление и Холд средств:</strong> Покупатель нажимает «Купить». С его внутреннего баланса или платежного шлюза списывается сумма заказа. Деньги замораживаются на системном счете Escrow.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">2</span>
                      <div>
                        <strong className="text-white">Комната сделки и чат:</strong> Открывается персональный диалог. При авто-доставке (ключи, логин:пароль) данные выдаются мгновенно. При ручной доставке продавец получает push-уведомление и передает товар в чате.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">3</span>
                      <div>
                        <strong className="text-white">Проверка товара покупателем:</strong> Покупатель заходит на игровой аккаунт, активирует ключ или проверяет зачисление валюты. Срок гарантии (от 24 до 120 часов) защищает от отзыва доната.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 border border-emerald-500/40">4</span>
                      <div>
                        <strong className="text-white">Подтверждение и выплата:</strong> Покупатель жмет «Подтвердить получение». Средства моментально поступают на баланс продавца за вычетом комиссии сервиса. Если возникает спор — арбитраж подключается в чат в течение 15 минут.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.3 Безопасность и защита от мошенников */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    3. Требования к безопасности
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <li className="p-3 rounded-xl bg-[#120c29] border border-purple-900/30">
                      🛡️ <strong>Анти-фишинг фильтр в чате:</strong> Автоматическое скрытие внешних ссылок (Discord, Telegram, сторонние платежки).
                    </li>
                    <li className="p-3 rounded-xl bg-[#120c29] border border-purple-900/30">
                      🔐 <strong>Двухфакторная аутентификация (2FA):</strong> Обязательна для вывода средств с баланса и изменения платежных реквизитов.
                    </li>
                    <li className="p-3 rounded-xl bg-[#120c29] border border-purple-900/30">
                      ⚡ <strong>DDoS & Rate Limiting:</strong> Защита API шлюза от парсинга цен и флуда сообщениями.
                    </li>
                    <li className="p-3 rounded-xl bg-[#120c29] border border-purple-900/30">
                      ⭐ <strong>Динамический скоринг продавца:</strong> Заморозка вывода средств на 24 часа для продавцов-новичков.
                    </li>
                  </ul>
                </div>

              </div>
            )}

            {/* TAB 2: ДИЗАЙН-СИСТЕМА И UI KIT */}
            {activeTab === 'ui' && (
              <div className="space-y-6 max-w-4xl mx-auto text-xs sm:text-sm">
                
                <div>
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    Цветовая палитра "Cosmic Magic Gamer"
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#090614] border border-purple-900/40">
                      <div className="w-full h-12 rounded-lg bg-[#090614] border border-purple-800 mb-2" />
                      <div className="font-bold text-white text-xs">Cosmic Black</div>
                      <div className="text-[11px] text-slate-400 font-mono">#090614</div>
                      <div className="text-[10px] text-slate-500">Основной фон</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#130d2a] border border-purple-900/40">
                      <div className="w-full h-12 rounded-lg bg-[#130d2a] border border-purple-700/50 mb-2" />
                      <div className="font-bold text-white text-xs">Deep Purple Glass</div>
                      <div className="text-[11px] text-slate-400 font-mono">#130D2A</div>
                      <div className="text-[10px] text-slate-500">Карточки, панели</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#130d2a] border border-purple-900/40">
                      <div className="w-full h-12 rounded-lg bg-[#a855f7] shadow-[0_0_15px_#a855f7] mb-2" />
                      <div className="font-bold text-white text-xs">Neon Violet</div>
                      <div className="text-[11px] text-slate-400 font-mono">#A855F7</div>
                      <div className="text-[10px] text-slate-500">Акцент, рамки, свечение</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#130d2a] border border-purple-900/40">
                      <div className="w-full h-12 rounded-lg bg-[#06b6d4] shadow-[0_0_15px_#06b6d4] mb-2" />
                      <div className="font-bold text-white text-xs">Glowing Cyan</div>
                      <div className="text-[11px] text-slate-400 font-mono">#06B6D4</div>
                      <div className="text-[10px] text-slate-500">CTA кнопки, бейджи</div>
                    </div>
                  </div>
                </div>

                {/* Typography & Radii */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#120c29] border border-purple-900/30 space-y-2">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-300">
                      Типографика
                    </h4>
                    <p className="text-xs text-slate-300">
                      <strong>Outfit / Plus Jakarta Sans</strong> — современные сан-сериф гарнитуры с открытой апертурой и выраженным технологичным геометрическим характером, обеспечивающим идеальную читаемость на мобильных экранах.
                    </p>
                    <ul className="text-xs space-y-1 text-slate-400 font-mono">
                      <li>H1 Display: 32px – 48px / Font-Weight 800-900</li>
                      <li>H2 Section: 20px – 24px / Font-Weight 700</li>
                      <li>Card Title: 14px – 15px / Font-Weight 700</li>
                      <li>Body / Subtext: 12px – 13px / Font-Weight 500</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#120c29] border border-purple-900/30 space-y-2">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-300">
                      Формы и Скругления (Radii)
                    </h4>
                    <ul className="text-xs space-y-1 text-slate-300">
                      <li><strong>Карточки товаров:</strong> <code>border-radius: 16px</code> (внутренний вкладыш 15px)</li>
                      <li><strong>Кнопки действий (CTA):</strong> <code>border-radius: 12px</code></li>
                      <li><strong>Информационные бейджи:</strong> <code>border-radius: 9999px</code> (pill-форма)</li>
                      <li><strong>Размытие матового стекла:</strong> <code>backdrop-filter: blur(14px-16px)</code></li>
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: HTML & CSS КОД КАРТОЧКИ ТОВАРА */}
            {activeTab === 'html-css' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-cyan-400" />
                      HTML & CSS Карточки с эффектом свечения
                    </h3>
                    <p className="text-xs text-slate-400">
                      Готовый чистый код со стилями ховера (scale: 1.03), матовым стеклом и градиентной кнопкой
                    </p>
                  </div>
                </div>

                {/* HTML Block */}
                <div className="rounded-2xl border border-purple-900/40 bg-[#120c29] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#170f33] border-b border-purple-900/40 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">product-card.html</span>
                    <button
                      onClick={() => handleCopy(TECHNICAL_SPECIFICATION.htmlSnippet, 'html')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/80 hover:bg-purple-900 border border-purple-700/40 text-purple-300 hover:text-white transition-colors"
                    >
                      {copiedState === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'html' ? 'Скопировано!' : 'Копировать HTML'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-72">
                    <code>{TECHNICAL_SPECIFICATION.htmlSnippet}</code>
                  </pre>
                </div>

                {/* CSS Block */}
                <div className="rounded-2xl border border-purple-900/40 bg-[#120c29] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#170f33] border-b border-purple-900/40 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300">product-card.css</span>
                    <button
                      onClick={() => handleCopy(TECHNICAL_SPECIFICATION.cssSnippet, 'css')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/80 hover:bg-purple-900 border border-purple-700/40 text-purple-300 hover:text-white transition-colors"
                    >
                      {copiedState === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'css' ? 'Скопировано!' : 'Копировать CSS'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-80">
                    <code>{TECHNICAL_SPECIFICATION.cssSnippet}</code>
                  </pre>
                </div>

              </div>
            )}

            {/* TAB 4: JAVASCRIPT СЦЕНАРИИ И АНИМАЦИИ */}
            {activeTab === 'js' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Сценарии JavaScript для микро-взаимодействий
                    </h3>
                    <p className="text-xs text-slate-400">
                      Реализация плавного появления при скролле, живого счетчика заказов и всплывающих пузырей
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(TECHNICAL_SPECIFICATION.jsSnippet, 'js')}
                    className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md hover:shadow-cyan-500/30 transition-all"
                  >
                    {copiedState === 'js' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedState === 'js' ? 'Скрипт скопирован!' : 'Скопировать весь JS'}</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-purple-900/40 bg-[#120c29] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#170f33] border-b border-purple-900/40 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">magicplay-interactions.js</span>
                    <span className="text-[11px] text-slate-400">IntersectionObserver + CountUp + Toasts</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96">
                    <code>{TECHNICAL_SPECIFICATION.jsSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:px-6 bg-[#110b26] border-t border-purple-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-400 hidden sm:inline">
              MagicPlay Design & Engineering Architecture Documentation
            </span>
            <button
              onClick={onClose}
              className="ml-auto px-5 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white transition-colors"
            >
              Закрыть документацию
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
