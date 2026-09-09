import { Review, Seller } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    sellerId: 'seller-1',
    authorName: 'Danila_ProGamer',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Сегодня, 18:42',
    text: 'Брал 2,000 робуксов через Gamepass. Продавец моментально прислал подробную инструкцию, выкупил мой геймпас меньше чем за 2 минуты! Курс топовый, комиссия Roblox уже учтена.',
    itemTitle: '1,000 Robux [Моментальная выдача Gamepass]',
    price: 649,
    dealVerified: true,
    likesCount: 12,
    sellerReply: {
      text: 'Спасибо за заказ! Обращайтесь снова, всегда на связи 24/7 ⚡',
      date: 'Сегодня, 18:45'
    }
  },
  {
    id: 'rev-2',
    sellerId: 'seller-1',
    authorName: 'Valkyrie_Queen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Вчера, 22:15',
    text: 'Сделка прошла через Escrow-гаранта за 3 минуты. Очень вежливый продавец, всё объяснил. Уже проверила в Roblox студии, робуксы в статусе ожидания на балансе!',
    itemTitle: '500 Robux [Быстрый трансфер]',
    price: 349,
    dealVerified: true,
    likesCount: 5
  },
  {
    id: 'rev-3',
    sellerId: 'seller-1',
    authorName: 'Sanya_Kvant',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 дня назад',
    text: 'Лучший магазин по Роблоксу на платформе. До этого брал на фанпее, там ждал полчаса, тут всё мгновенно. 10/10.',
    itemTitle: '2,000 Robux [Хит продаж]',
    price: 1280,
    dealVerified: true,
    likesCount: 8
  },
  {
    id: 'rev-4',
    sellerId: 'seller-1',
    authorName: 'Maxim_Play',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    rating: 4,
    date: '3 дня назад',
    text: 'Всё честно и быстро, но пришлось подождать продавца около 4 минут, так как была очередь. В остальном сервис на высоте.',
    itemTitle: '1,000 Robux',
    price: 649,
    dealVerified: true,
    likesCount: 2,
    sellerReply: {
      text: 'Приносим извинения за задержку! В вечернее время много заказов, уже расширили команду операторов.',
      date: '3 дня назад'
    }
  },
  {
    id: 'rev-5',
    sellerId: 'seller-2',
    authorName: 'Leon_Stars',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Вчера, 16:30',
    text: 'Купил Brawl Pass Plus. Зашел по коду через Supercell ID, активировал за 1 минуту без входа в почту. Все скины и гемы на базе!',
    itemTitle: 'Brawl Pass Plus [Сезон 32] + 100 Гемов',
    price: 990,
    dealVerified: true,
    likesCount: 9,
    sellerReply: {
      text: 'Приятной игры и удачи в катках! Спасибо за доверие.',
      date: 'Вчера, 16:32'
    }
  },
  {
    id: 'rev-6',
    sellerId: 'seller-2',
    authorName: 'BrawlChampion',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    rating: 5,
    date: '4 дня назад',
    text: 'Всё супер, беру уже третий раз. Продавец надежный, сделка полностью защищена гарантией.',
    itemTitle: '170 Гемов Brawl Stars',
    price: 520,
    dealVerified: true,
    likesCount: 4
  },
  {
    id: 'rev-7',
    sellerId: 'seller-3',
    authorName: 'Mondstadt_Traveler',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Сегодня, 12:10',
    text: 'Донат в Геншин через UID пришел за 40 секунд! Благословение полой луны активировалось сразу в игре.',
    itemTitle: 'Благословение полой луны [30 дней] через UID',
    price: 399,
    dealVerified: true,
    likesCount: 14
  }
];

const STORAGE_KEY = 'magicplay_seller_reviews';

function loadStoredReviews(): Review[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed: Review[] = JSON.parse(data);
      // Clean up any old bot reviews from storage
      const cleaned = parsed.filter((r) => !r.id.startsWith('fallback-'));
      return cleaned;
    }
  } catch (e) {
    console.error('Failed to load reviews from localStorage', e);
  }
  return INITIAL_REVIEWS;
}

function saveStoredReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews to localStorage', e);
  }
}

// In-memory reviews list initialized from storage
let reviewsCache: Review[] = loadStoredReviews();

/**
 * Get all real reviews for a seller (strictly no bots)
 */
export function getReviewsForSeller(sellerId: string): Review[] {
  return reviewsCache.filter((r) => r.sellerId === sellerId);
}

export interface SellerStatsResult {
  averageRating: number;
  totalReviews: number;
  salesCount: number;
  successRate: number;
  breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  isNewSeller: boolean;
}

/**
 * Calculate detailed statistics for a seller without bots
 */
export function getSellerStats(seller: Seller, currentReviews?: Review[]): SellerStatsResult {
  const reviews = currentReviews || getReviewsForSeller(seller.id);
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (reviews.length > 0) {
    let sum = 0;
    let positiveCount = 0;

    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      breakdown[star] = (breakdown[star] || 0) + 1;
      sum += r.rating;
      if (r.rating >= 4) {
        positiveCount++;
      }
    });

    const averageRating = Number((sum / reviews.length).toFixed(2));
    const totalReviews = reviews.length;
    const salesCount = Math.max(seller.salesCount || 0, reviews.length);
    const successRate = Number(((positiveCount / reviews.length) * 100).toFixed(1));

    return {
      averageRating,
      totalReviews,
      salesCount,
      successRate,
      breakdown,
      isNewSeller: false
    };
  }

  // If no reviews exist for this seller
  const isNewSeller = !seller.reviewsCount || seller.reviewsCount === 0;

  if (isNewSeller) {
    return {
      averageRating: 0,
      totalReviews: 0,
      salesCount: seller.salesCount || 0,
      successRate: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      isNewSeller: true
    };
  }

  // Demo catalog seller with initial reputation
  return {
    averageRating: seller.rating || 5.0,
    totalReviews: seller.reviewsCount,
    salesCount: seller.salesCount || 0,
    successRate: 100,
    breakdown: {
      5: seller.reviewsCount,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    isNewSeller: false
  };
}

/**
 * Add a new review for a seller
 */
export function addSellerReview(newReviewData: Omit<Review, 'id' | 'date'>): Review {
  const newReview: Review = {
    ...newReviewData,
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: 'Только что',
    likesCount: 0
  };

  reviewsCache = [newReview, ...reviewsCache];
  saveStoredReviews(reviewsCache);
  return newReview;
}
