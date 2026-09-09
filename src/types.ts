export type ProductCategory = 'all' | 'accounts' | 'currency' | 'keys' | 'donate' | 'services';

export type PlatformType = 'all' | 'All' | 'PC' | 'iOS' | 'Android' | 'PlayStation' | 'Xbox';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  responseTime: string;
  verified: boolean;
  salesCount: number;
}

export interface Product {
  id: string;
  title: string;
  gameId: string;
  gameName: string;
  gameIcon: string;
  category: ProductCategory;
  platform: PlatformType;
  price: number;
  oldPrice?: number;
  currencySymbol?: string;
  instantDelivery: boolean;
  seller: Seller;
  description: string;
  fullDescription?: string;
  tags: string[];
  inStock: number;
  guaranteeHours: number;
  bannerImage?: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  icon: string;
  cover: string;
  genre: string;
  activeLots: number;
  popular: boolean;
  minPrice: number;
  tags: string[];
}

export interface LiveOrderEvent {
  id: string;
  gameName: string;
  gameIcon: string;
  itemTitle: string;
  price: number;
  timeAgo: string;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  text: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface Review {
  id: string;
  sellerId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  text: string;
  itemTitle?: string;
  price?: number;
  dealVerified: boolean;
  likesCount?: number;
  sellerReply?: {
    text: string;
    date: string;
  };
}

export type ViewMode = 'marketplace' | 'game-detail' | 'product-modal' | 'chat-deal' | 'specification-tz';
