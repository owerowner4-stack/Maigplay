import React, { useState } from 'react';
import { Seller, Review } from '../types';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  Plus, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getReviewsForSeller, getSellerStats, addSellerReview } from '../data/reviewsStore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  seller: Seller;
  productTitle?: string;
  productPrice?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  seller,
  productTitle,
  productPrice
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(() => getReviewsForSeller(seller.id));
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5star' | '4star' | 'with-text'>('all');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const stats = getSellerStats(seller, reviews);

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    if (selectedFilter === '5star') return Math.round(rev.rating) === 5;
    if (selectedFilter === '4star') return Math.round(rev.rating) <= 4;
    if (selectedFilter === 'with-text') return rev.text.trim().length > 0;
    return true;
  });

  const handleLikeReview = (reviewId: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error('Пожалуйста, напишите отзыв о сделке');
      return;
    }

    const created = addSellerReview({
      sellerId: seller.id,
      authorName: user?.displayName || 'Покупатель MagicPlay',
      authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      rating: newRating,
      text: reviewText.trim(),
      itemTitle: productTitle || 'Покупка на MagicPlay',
      price: productPrice,
      dealVerified: true
    });

    setReviews([created, ...reviews]);
    setReviewText('');
    setIsWritingReview(false);
    toast.success('Отзыв опубликован!', {
      description: `Ваш отзыв и оценка ${newRating}★ добавлены в реальный рейтинг продавца.`
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Rating Summary Header */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Left: Big Score or New Seller Badge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          {stats.totalReviews > 0 ? (
            <>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
                <span>{stats.averageRating.toFixed(1)}</span>
                <span className="text-xs sm:text-sm font-normal text-slate-500">/ 5.0</span>
              </div>

              <div className="flex items-center gap-1 my-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${
                      s <= Math.round(stats.averageRating)
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-slate-700 text-slate-700'
                    }`} 
                  />
                ))}
              </div>

              <div className="text-xs text-slate-400">
                Основано на <span className="font-semibold text-white">{stats.totalReviews.toLocaleString('ru-RU')}</span> реальных отзывах
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{stats.successRate}% довольных покупателей</span>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Новый продавец
              </span>
              <div className="text-2xl font-bold text-white font-mono mt-2">0 отзывов</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Начинает с чистого листа
              </div>
              <div className="text-[11px] text-blue-400 font-medium mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Защита сделок 100%</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Rating Distribution Histogram */}
        <div className="md:col-span-5 space-y-1.5 px-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.breakdown[star as keyof typeof stats.breakdown] || 0;
            const total = Math.max(1, stats.totalReviews);
            const percentage = Math.min(100, Math.round((count / total) * 100));

            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 w-9 text-slate-400 shrink-0 font-mono">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-500 w-8 text-right font-mono">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Key Seller Trust Highlights */}
        <div className="md:col-span-3 flex flex-col justify-between h-full p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white font-mono">{stats.salesCount.toLocaleString('ru-RU')}</div>
              <div className="text-[10px] text-slate-400">успешных сделок</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{seller.responseTime}</div>
              <div className="text-[10px] text-slate-400">средний ответ</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Написать отзыв</span>
          </button>
        </div>

      </div>

      {/* 2. Write Review Form Accordion */}
      {isWritingReview && (
        <form 
          onSubmit={handleAddReviewSubmit}
          className="p-4 rounded-xl bg-[#10141d] border border-blue-500/30 shadow-lg space-y-3 transition-all animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Оставить отзыв о продавце {seller.name}</span>
            <span className="text-[10px] text-slate-400">Сделка защищена Escrow</span>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ваша оценка:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star 
                    className={`w-5 h-5 ${
                      star <= (hoverRating || newRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-700 text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-mono font-semibold text-amber-400">
              {hoverRating || newRating} из 5
            </span>
          </div>

          {/* Review Text */}
          <textarea
            rows={3}
            placeholder="Опишите ваши впечатления от сделки: насколько быстро продавец передал товар, все ли соответствовало описанию..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full bg-[#0b0e14] border border-white/[0.08] focus:border-blue-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Опубликовать отзыв</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* 3. Filter Buttons */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white/[0.03] text-slate-400 hover:text-white'
            }`}
          >
            Все ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('5star')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              selectedFilter === '5star'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white/[0.03] text-slate-400 hover:text-white'
            }`}
          >
            <span>5</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('4star')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              selectedFilter === '4star'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white/[0.03] text-slate-400 hover:text-white'
            }`}
          >
            <span>4 и ниже</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('with-text')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'with-text'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white/[0.03] text-slate-400 hover:text-white'
            }`}
          >
            С подробным отзывом
          </button>
        </div>

        <span className="text-[11px] text-slate-500 shrink-0">
          Показано: {filteredReviews.length}
        </span>
      </div>

      {/* 4. Reviews List */}
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="font-semibold text-white text-sm">У этого продавца пока нет отзывов</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Продавец недавно зарегистрировался на платформе. Все сделки на MagicPlay на 100% защищены Escrow-гарантом — продавец получит средства только после того, как вы подтвердите успешное получение товара.
            </p>
            <button
              type="button"
              onClick={() => setIsWritingReview(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Оставить первый отзыв</span>
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Нет отзывов по выбранному фильтру
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.03] border border-white/[0.04] transition-colors space-y-2"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                    alt={rev.authorName}
                    className="w-7 h-7 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{rev.authorName}</span>
                      {rev.dealVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Сделка подтверждена
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span>{rev.date}</span>
                      {rev.itemTitle && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                            {rev.itemTitle}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 shrink-0 bg-white/[0.03] px-2 py-0.5 rounded-lg border border-white/[0.04]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3 h-3 ${
                        s <= rev.rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-slate-700 text-slate-700'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-300 leading-relaxed pl-9">
                {rev.text}
              </p>

              {/* Seller Official Reply */}
              {rev.sellerReply && (
                <div className="ml-9 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-blue-300 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Ответ продавца {seller.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{rev.sellerReply.date}</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    {rev.sellerReply.text}
                  </p>
                </div>
              )}

              {/* Like / Helpful button */}
              <div className="flex justify-end pl-9 pt-1">
                <button
                  type="button"
                  onClick={() => handleLikeReview(rev.id)}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    likedReviews[rev.id]
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Полезно</span>
                  <span className="font-mono text-[10px]">
                    ({(rev.likesCount || 0) + (likedReviews[rev.id] ? 1 : 0)})
                  </span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
