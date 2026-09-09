import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lock,
  Wallet,
  Boxes
} from 'lucide-react';
import { ReviewsSection } from './ReviewsSection';
import { getSellerStats } from '../data/reviewsStore';
import { useAuth } from '../context/AuthContext';
import { isUserOwnProduct, checkAffordability } from '../lib/userGuard';
import { toast } from 'sonner';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onStartDeal: (product: Product) => void;
  userBalance: number;
  onOpenTopup?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onStartDeal,
  userBalance,
  onOpenTopup
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'desc' | 'instructions' | 'reviews' | 'guarantee'>('desc');

  if (!product) return null;

  const sellerStats = getSellerStats(product.seller);
  const isOwn = isUserOwnProduct(product, user);
  const afford = checkAffordability(product.price, userBalance);

  const handleBuyButtonClick = () => {
    if (isOwn) {
      toast.error('Защита от самовыкупа!', {
        description: 'Вы не можете купить свой собственный товар. Это противоречит правилам площадки.'
      });
      return;
    }

    if (afford.isZeroBalance) {
      toast.error('У вас нет денег!', {
        description: `На вашем балансе 0 ₽. Стоимость товара: ${product.price.toLocaleString('ru-RU')} ₽. Пожалуйста, пополните баланс для совершения покупки.`,
        action: onOpenTopup ? {
          label: 'Пополнить баланс',
          onClick: onOpenTopup
        } : undefined,
        duration: 6000
      });
      if (onOpenTopup) {
        onOpenTopup();
      }
      return;
    }

    if (!afford.canAfford) {
      toast.error('Недостаточно средств на балансе!', {
        description: `Стоимость товара ${product.price.toLocaleString('ru-RU')} ₽, а на вашем балансе ${userBalance.toLocaleString('ru-RU')} ₽. Не хватает ${afford.shortage.toLocaleString('ru-RU')} ₽.`,
        action: onOpenTopup ? {
          label: 'Пополнить',
          onClick: onOpenTopup
        } : undefined,
        duration: 6000
      });
      if (onOpenTopup) {
        onOpenTopup();
      }
      return;
    }

    onStartDeal(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#131720] border border-white/[0.08] shadow-2xl p-5 sm:p-6 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-blue-400 mb-1.5">
          <span>{product.gameName}</span>
          <span>•</span>
          <span className="text-slate-400 capitalize">{product.category}</span>
          <span>•</span>
          <span className="text-slate-400">{product.platform === 'All' ? 'Все платформы' : product.platform}</span>
        </div>

        {/* Large Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug pr-8">
          {product.title}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          {isOwn && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <Lock className="w-3 h-3" />
              Ваше объявление (Продавец — вы)
            </span>
          )}
          {product.instantDelivery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Zap className="w-3 h-3" />
              Моментальная выдача
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            Гарантия {product.guaranteeHours}ч
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium ${
            product.inStock > 0 
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' 
              : 'bg-red-500/10 text-red-300 border border-red-500/20'
          }`}>
            <Boxes className="w-3 h-3" />
            <span>{product.inStock > 0 ? `В наличии: ${product.inStock} шт.` : 'Товар закончился'}</span>
          </span>
        </div>

        {/* Seller Bar & Reputation Overview */}
        <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-11 h-11 rounded-full object-cover border border-white/10"
              />
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#131720] ${
                  product.seller.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                }`} 
                title={product.seller.isOnline ? 'Продавец сейчас онлайн' : 'Продавец не в сети'}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {product.seller.name}
                </span>
                {product.seller.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span>Проверен</span>
                  </span>
                )}
                {isOwn && (
                  <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 font-medium">
                    Вы
                  </span>
                )}
              </div>
              
              {/* Rating & Deals Metrics */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-1">
                {sellerStats.totalReviews > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center text-amber-400 font-mono hover:underline cursor-pointer"
                      title="Посмотреть подробные отзывы"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span className="font-bold">{sellerStats.averageRating.toFixed(2)}</span>
                      <span className="text-slate-400 ml-1">({sellerStats.totalReviews.toLocaleString('ru-RU')})</span>
                    </button>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{sellerStats.salesCount.toLocaleString('ru-RU')} успешных сделок</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{sellerStats.successRate}% рейтинг</span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-1.5 text-emerald-400 hover:underline cursor-pointer font-medium text-xs"
                  >
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                      Новый продавец
                    </span>
                    <span className="text-slate-400">0 отзывов</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">0 сделок</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400 pl-2 border-l border-white/[0.06] sm:border-0">
            <div className="flex items-center justify-end gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Ответ: ~{product.seller.responseTime}</span>
            </div>
            <div className={product.seller.isOnline ? 'text-emerald-400 font-medium mt-0.5' : 'text-slate-500 mt-0.5'}>
              {product.seller.isOnline ? '● Онлайн в чате' : '○ Офлайн'}
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-4 mt-5 border-b border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === 'desc'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Описание
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === 'instructions'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Инструкция
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Отзывы и рейтинг</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px]">
              {sellerStats.totalReviews.toLocaleString('ru-RU')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('guarantee')}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === 'guarantee'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Гарантия
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-3 text-xs text-slate-300 leading-relaxed min-h-[120px]">
          {activeTab === 'desc' && (
            <p className="whitespace-pre-line">{product.description}</p>
          )}

          {activeTab === 'instructions' && (
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Нажмите кнопку «Купить», чтобы открыть защищенный чат сделки.</li>
              <li>Сумма заморозится на вашем балансе под защитой Escrow-гаранта.</li>
              <li>Продавец передаст данные или зачислит валюту прямо в диалоге.</li>
              <li>Проверьте товар и подтвердите успешное получение.</li>
            </ol>
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection 
              seller={product.seller}
              productTitle={product.title}
              productPrice={product.price}
            />
          )}

          {activeTab === 'guarantee' && (
            <div className="space-y-1.5">
              <p className="font-semibold text-white">Безопасность через Escrow:</p>
              <p>Деньги поступают продавцу только после вашего подтверждения. В случае спора администрация возвращает средства на баланс.</p>
              <p className="text-blue-400 text-xs font-medium">Срок гарантии: {product.guaranteeHours} часов.</p>
            </div>
          )}
        </div>

        {/* Warning / Alerts Block for Self Purchase or Insufficient Funds */}
        {isOwn && (
          <div className="mt-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-200">
            <Lock className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="font-bold text-purple-100">Защита от самовыкупа включена</div>
              <p className="text-[11px] text-purple-300 mt-0.5">
                Вы являетесь продавцом этого объявления. Покупка собственных товаров запрещена правилами площадки MagicPlay.
              </p>
            </div>
          </div>
        )}

        {!isOwn && afford.isZeroBalance && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 text-xs text-red-200">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="font-bold text-red-100">У вас нет денег!</div>
                <p className="text-[11px] text-red-300 mt-0.5">
                  На вашем балансе 0 ₽. Для покупки этого лота требуется {product.price.toLocaleString('ru-RU')} ₽.
                </p>
              </div>
            </div>
            {onOpenTopup && (
              <button
                type="button"
                onClick={onOpenTopup}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Пополнить</span>
              </button>
            )}
          </div>
        )}

        {!isOwn && !afford.isZeroBalance && !afford.canAfford && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-amber-100">Недостаточно средств на балансе</div>
                <p className="text-[11px] text-amber-300 mt-0.5">
                  На балансе {userBalance.toLocaleString('ru-RU')} ₽. Не хватает {afford.shortage.toLocaleString('ru-RU')} ₽.
                </p>
              </div>
            </div>
            {onOpenTopup && (
              <button
                type="button"
                onClick={onOpenTopup}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Пополнить</span>
              </button>
            )}
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Стоимость:</span>
              <span className="text-[11px] text-slate-400">
                (Баланс: <span className="font-mono text-white font-semibold">{userBalance.toLocaleString('ru-RU')} ₽</span>)
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 transition-colors cursor-pointer"
            >
              Отмена
            </button>

            {isOwn ? (
              <button
                type="button"
                disabled
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-purple-900/30 border border-purple-500/40 text-purple-300 opacity-80 flex items-center gap-1.5 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ваш лот (самовыкуп запрещен)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBuyButtonClick}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Купить за {product.price.toLocaleString('ru-RU')} ₽</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
