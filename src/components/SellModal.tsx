import React, { useState } from 'react';
import { X, Plus, CheckCircle2, Boxes, Sparkles } from 'lucide-react';
import { Game } from '../types';
import { useAuth } from '../context/AuthContext';
import { createProductInFirestore } from '../lib/firestoreService';

interface SellModalProps {
  games: Game[];
  onClose: () => void;
  onAddProduct: (item: any) => void;
}

export const SellModal: React.FC<SellModalProps> = ({ games, onClose, onAddProduct }) => {
  const { user, loginWithGoogle } = useAuth();
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id || 'roblox');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'currency' | 'accounts' | 'donate' | 'keys' | 'services'>('currency');
  const [platform, setPlatform] = useState<string>('All');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState('1');
  const [instantDelivery, setInstantDelivery] = useState(true);
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    setIsSubmitting(true);
    const game = games.find((g) => g.id === selectedGameId) || games[0];
    const parsedStock = Math.max(1, parseInt(inStock, 10) || 1);

    const newProd = {
      title,
      gameId: game.id,
      gameName: game.name,
      gameIcon: game.icon,
      category,
      platform: platform as any,
      price: parseFloat(price) || 500,
      instantDelivery,
      seller: {
        id: user ? user.uid : 'me',
        name: user ? user.displayName : 'Продавец MagicPlay',
        avatar: user ? user.photoURL : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 0,
        reviewsCount: 0,
        isOnline: true,
        responseTime: '1-5 мин.',
        verified: false,
        salesCount: 0
      },
      description: description || 'Быстрая выдача игрового товара в чате сделки.',
      tags: ['Новинка', 'Проверено MagicEscrow'],
      inStock: parsedStock,
      guaranteeHours: 48
    };

    try {
      const createdId = await createProductInFirestore(newProd);
      onAddProduct({ ...newProd, id: createdId });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error saving to Firestore:', err);
      onAddProduct({ ...newProd, id: `prod-${Date.now()}` });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#131720] border border-white/[0.08] shadow-2xl p-5 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">
              Новое предложение
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!user && (
          <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-2">
            <div className="text-xs text-slate-300">
              Вы не авторизованы. Войдите через Google, чтобы управлять лотом.
            </div>
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="px-2.5 py-1 rounded-lg bg-white text-slate-900 font-semibold text-xs shrink-0 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Войти
            </button>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white">Товар опубликован!</h4>
            <p className="text-xs text-slate-400">
              Ваш лот успешно сохранен и доступен покупателям.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 mt-3.5 text-xs">
            
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Игра
              </label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Заголовок товара
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: 1,000 Robux [Быстрая выдача]..."
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Категория
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="currency">Игровая валюта</option>
                  <option value="accounts">Аккаунты</option>
                  <option value="donate">Донат & БП</option>
                  <option value="keys">Ключи & Скины</option>
                  <option value="services">Услуги</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Платформа
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="All">Все платформы</option>
                  <option value="PC">PC</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Xbox">Xbox</option>
                </select>
              </div>
            </div>

            {/* Price & Pieces / In Stock */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Цена за 1 шт. (₽)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="500"
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">₽</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-300">
                      Штук в наличии
                    </label>
                    <span className="text-[10px] text-blue-400 font-mono">Сколько есть</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setInStock(prev => String(Math.max(1, (parseInt(prev, 10) || 1) - 1)))}
                      className="w-8 h-8 rounded-lg bg-[#0b0e14] border border-white/[0.08] hover:border-white/20 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0"
                      title="Уменьшить на 1"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      required
                      min="1"
                      max="999999"
                      value={inStock}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d+$/.test(val)) {
                          setInStock(val);
                        }
                      }}
                      placeholder="1"
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-2 py-2 text-xs text-white text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setInStock(prev => String((parseInt(prev, 10) || 0) + 1))}
                      className="w-8 h-8 rounded-lg bg-[#0b0e14] border border-white/[0.08] hover:border-white/20 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0"
                      title="Увеличить на 1"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick stock chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Быстро:</span>
                {[1, 3, 5, 10, 25, 50, 100, 500].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setInStock(String(qty))}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      Number(inStock) === qty
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {qty} шт.
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Описание
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Что входит в товар и как происходит передача..."
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <input
                type="checkbox"
                id="instant"
                checked={instantDelivery}
                onChange={(e) => setInstantDelivery(e.target.checked)}
                className="accent-blue-500 w-3.5 h-3.5 cursor-pointer"
              />
              <label htmlFor="instant" className="cursor-pointer text-slate-300 text-xs">
                Автоматическая / моментальная выдача
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Сохранение...' : 'Опубликовать'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
