import React from 'react';
import { Product } from '../types';
import { Star, Zap, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isUserOwnProduct } from '../lib/userGuard';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProduct,
  onQuickBuy
}) => {
  const { user } = useAuth();
  const isOwn = isUserOwnProduct(product, user);
  const isNewSeller = !product.seller.reviewsCount || product.seller.reviewsCount === 0 || product.seller.rating === 0;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwn) {
      toast.error('Защита от самовыкупа!', {
        description: 'Вы не можете купить свой собственный товар. Это противоречит правилам площадки.'
      });
      return;
    }
    onQuickBuy(product);
  };

  return (
    <article
      onClick={() => onOpenProduct(product)}
      className={`group bg-[#131720] hover:bg-[#161c27] rounded-xl border transition-colors cursor-pointer flex flex-col justify-between p-4 ${
        isOwn ? 'border-purple-500/30 ring-1 ring-purple-500/20' : 'border-white/[0.06] hover:border-white/[0.15]'
      }`}
    >
      <div>
        {/* Top: Game name & Delivery tag */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-blue-400 truncate">
            {product.gameName}
          </span>
          <div className="flex items-center gap-1.5">
            {isOwn && (
              <span className="inline-flex items-center gap-1 text-[10px] text-purple-300 font-medium px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30">
                <User className="w-2.5 h-2.5" />
                <span>Ваш лот</span>
              </span>
            )}
            {product.instantDelivery && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <Zap className="w-3 h-3" />
                <span>Авто</span>
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              {product.inStock || 1} шт.
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-1 mt-1.5">
          {product.description}
        </p>
      </div>

      {/* Footer Area: Seller & Price */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2.5">
        
        {/* Seller snippet & reputation */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[130px] sm:max-w-[150px]">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-5 h-5 rounded-full object-cover border border-white/10 shrink-0"
            />
            <span className="truncate text-slate-300 font-medium text-[11px] sm:text-xs">{product.seller.name}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px]">
            {!isNewSeller ? (
              <>
                <div className="flex items-center text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                  <span className="font-semibold">{product.seller.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[10px]">
                  {product.seller.salesCount >= 1000 
                    ? `${(product.seller.salesCount / 1000).toFixed(1)}k сделок` 
                    : `${product.seller.salesCount} сдел.`}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Новый
                </span>
                <span className="text-slate-500">0 сдел.</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Buy Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
            {product.oldPrice && (
              <div className="text-[10px] text-slate-500 line-through font-mono">
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleBuyClick}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isOwn
                ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            title={isOwn ? 'Защита от самовыкупа: вы продавец этого лота' : 'Купить товар'}
          >
            {isOwn ? 'Ваш лот' : 'Купить'}
          </button>
        </div>

      </div>
    </article>
  );
};
