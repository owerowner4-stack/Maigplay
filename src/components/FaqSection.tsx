import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  Wallet, 
  ShoppingBag, 
  Zap, 
  Search, 
  MessageCircleQuestion, 
  CheckCircle2 
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'general' | 'buyers' | 'sellers' | 'security';
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'security',
    question: 'Как работает безопасная сделка через Escrow-гарант?',
    answer: 'Все покупки на MagicPlay защищены системой Escrow. Когда вы оплачиваете заказ, средства не поступают продавцу сразу, а замораживаются на защищенном депозитном счете сервиса. Продавец получает деньги только после того, как передаст товар, а вы проверите его и нажмете кнопку подтверждения в чате сделки.',
    highlight: 'Деньги продавцу переводятся только после вашего личного подтверждения.'
  },
  {
    id: 'faq-2',
    category: 'buyers',
    question: 'Что делать, если продавец не отвечает или прислал неверные данные?',
    answer: 'Если продавец долго не выходит на связь или возникли разногласия по товару, вы можете в один клик открыть спор в чате сделки. К диалогу подключится арбитраж службы безопасности MagicPlay, проверит переписку и историю передачи, после чего вернет средства на ваш баланс в полном объеме.',
    highlight: 'Арбитраж вмешивается и возвращает 100% средств при любых нарушениях со стороны продавца.'
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Как быстро происходит зачисление и передача товара?',
    answer: 'Товары с меткой «Моментальная выдача» передаются в течение 1–5 минут сразу после открытия чата сделки. Большинство продавцов находятся онлайн круглосуточно. Среднее время первого ответа продавца на платформе составляет менее 2 минут.',
    highlight: 'Среднее время завершения заказа — от 2 до 5 минут.'
  },
  {
    id: 'faq-4',
    category: 'sellers',
    question: 'Как начать продавать игровые ценности, валюту и аккаунты?',
    answer: 'Нажмите кнопку «Продать» в верхней панели сайта или перейдите в профиль. Выберите игру, укажите название предложения, категорию, цену и условия передачи. После публикации лот сразу появится в общем каталоге и станет доступен тысячам покупателей.',
    highlight: 'Публикация предложений бесплатна, модерация происходит автоматически.'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'Какие способы пополнения баланса доступны и есть ли комиссия?',
    answer: 'Вы можете пополнить баланс через Систему быстрых платежей (СБП) по QR-коду без комиссии (0%), а также банковскими картами МИР, Visa и MasterCard. Зачисление на баланс происходит мгновенно.',
    highlight: 'Пополнение через СБП — 0% комиссии.'
  },
  {
    id: 'faq-6',
    category: 'security',
    question: 'Насколько защищены личные данные и аккаунты?',
    answer: 'Передача всех данных на платформе шифруется по протоколу SSL/TLS. Пароли от аккаунтов никогда не передаются третьим лицам без вашего ведома. Рекомендуем вести все диалоги и обмен данными исключительно во встроенном защищенном чате сделки MagicPlay.',
    highlight: 'Никогда не переходите в сторонние мессенджеры для сохранения гарантии Escrow.'
  },
  {
    id: 'faq-7',
    category: 'sellers',
    question: 'Какая комиссия сервиса для продавцов и когда можно вывести деньги?',
    answer: 'Базовая комиссия платформы минимальна и удерживается только с успешно завершенных заказов. Средства поступают на ваш баланс сразу после подтверждения сделки покупателем, после чего их можно использовать для покупок или вывести удобным способом.',
    highlight: 'Комиссия берется только с успешных сделок.'
  },
  {
    id: 'faq-8',
    category: 'buyers',
    question: 'Сколько действует гарантия на купленный товар?',
    answer: 'Для каждого лота действует гарантийный период (обычно от 24 до 48 часов, указан в карточке товара). В течение этого времени вы защищены от восстановления доступа к аккаунту или отзыва ключа.',
    highlight: 'Гарантия до 48 часов с возможностью бесплатной замены или возврата.'
  }
];

interface FaqSectionProps {
  onOpenTopup?: () => void;
  onOpenSell?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenTopup, onOpenSell }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'buyers' | 'sellers' | 'security'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true // First item open by default for immediate engagement
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section 
      id="faq" 
      aria-label="Часто задаваемые вопросы"
      itemScope 
      itemType="https://schema.org/FAQPage"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
    >
      {/* Frosted Glass Container */}
      <div className="relative rounded-3xl p-6 sm:p-10 backdrop-blur-md bg-white/[0.02] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.36)] overflow-hidden">
        
        {/* Subtle Ambient Light Accents (Calm & Non-intrusive) */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/[0.04] blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-2xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>База знаний и помощь</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            Часто задаваемые вопросы
          </h2>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Ответы на главные вопросы о защите сделок Escrow, пополнении баланса, покупке и продаже игровых товаров на MagicPlay.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="relative z-10 flex flex-col md:flex-row gap-3 mb-8">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по вопросам (например: гарантия, сбп, возврат)..."
              className="w-full bg-[#0b0e14]/80 backdrop-blur-sm border border-white/[0.08] focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Все вопросы' },
              { id: 'security', label: 'Безопасность & Гарант' },
              { id: 'buyers', label: 'Покупателям' },
              { id: 'sellers', label: 'Продавцам' },
              { id: 'general', label: 'Общее' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.07] border border-white/[0.04]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* FAQ Accordion List with Microdata Schema.org */}
        <div className="relative z-10 space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <article
                  key={faq.id}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className={`rounded-2xl transition-colors border backdrop-blur-md overflow-hidden ${
                    isOpen
                      ? 'bg-[#131720]/90 border-blue-500/30'
                      : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.06]'
                  }`}
                >
                  {/* Question Button */}
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span 
                      itemProp="name" 
                      className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                        isOpen ? 'text-white' : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      {faq.question}
                    </span>

                    <span className={`p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400 bg-blue-500/10 border-blue-500/20' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Answer Panel */}
                  {isOpen && (
                    <div
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]"
                    >
                      <p itemProp="text">
                        {faq.answer}
                      </p>

                      {faq.highlight && (
                        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/[0.08] border border-blue-500/15 text-xs text-blue-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <MessageCircleQuestion className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm">По вашему запросу ничего не найдено.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Сбросить фильтры поиска
              </button>
            </div>
          )}
        </div>

        {/* Bottom Support Banner */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Не нашли ответ на свой вопрос?</div>
              <div className="text-xs text-slate-400">Служба поддержки и арбитраж работают в режиме 24/7.</div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenTopup && (
              <button
                onClick={onOpenTopup}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-blue-400" />
                <span>Пополнить баланс</span>
              </button>
            )}
            {onOpenSell && (
              <button
                onClick={onOpenSell}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Стать продавцом</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
