import { Game, Product, LiveOrderEvent } from '../types';

import robloxIcon from '../assets/images/roblox_icon_1788789683162.jpg';
import robloxCover from '../assets/images/roblox_cover_1788789911084.jpg';
import brawlStarsIcon from '../assets/images/brawl_stars_icon_1788789657082.jpg';
import brawlStarsCover from '../assets/images/brawl_stars_cover_1788789938161.jpg';
import genshinIcon from '../assets/images/genshin_icon_1788789712221.jpg';
import genshinCover from '../assets/images/genshin_cover_1788789985562.jpg';
import cs2Icon from '../assets/images/cs2_icon_1788789745465.jpg';
import cs2Cover from '../assets/images/cs2_cover_1788789959228.jpg';
import dota2Icon from '../assets/images/dota2_icon_1788789772369.jpg';
import minecraftIcon from '../assets/images/minecraft_icon_1788789791854.jpg';
import steamIcon from '../assets/images/steam_icon_1788789812352.jpg';
import gta5Icon from '../assets/images/gta5_icon_1788789836048.jpg';
import valorantIcon from '../assets/images/valorant_icon_1788789859469.jpg';
import honkaiIcon from '../assets/images/honkai_icon_1788789881458.jpg';

export const GAMES: Game[] = [
  {
    id: 'roblox',
    name: 'Roblox',
    slug: 'roblox',
    icon: robloxIcon,
    cover: robloxCover,
    genre: 'Песочница / Метаверс',
    activeLots: 14230,
    popular: true,
    minPrice: 49,
    tags: ['Робуксы', 'Blox Fruits', 'Adopt Me', 'Аккаунты']
  },
  {
    id: 'brawlstars',
    name: 'Brawl Stars',
    slug: 'brawl-stars',
    icon: brawlStarsIcon,
    cover: brawlStarsCover,
    genre: 'Экшен / MOBA',
    activeLots: 9840,
    popular: true,
    minPrice: 79,
    tags: ['Гемы', 'Brawl Pass', 'Кубки', 'Аккаунты']
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    slug: 'genshin-impact',
    icon: genshinIcon,
    cover: genshinCover,
    genre: 'RPG / Открытый мир',
    activeLots: 12150,
    popular: true,
    minPrice: 120,
    tags: ['Примогемы', 'Луна', '5★ Персонажи', 'Аккаунты']
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    slug: 'cs2',
    icon: cs2Icon,
    cover: cs2Cover,
    genre: 'Шутер / Тактика',
    activeLots: 18450,
    popular: true,
    minPrice: 190,
    tags: ['Ножи', 'Скины', 'Прайм', 'Ключи']
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    slug: 'dota-2',
    icon: dota2Icon,
    cover: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&auto=format&fit=crop&q=80',
    genre: 'MOBA',
    activeLots: 8720,
    popular: true,
    minPrice: 99,
    tags: ['Арканы', 'Буст MMR', 'Вещи', 'Battle Pass']
  },
  {
    id: 'valorant',
    name: 'Valorant',
    slug: 'valorant',
    icon: valorantIcon,
    cover: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&auto=format&fit=crop&q=80',
    genre: 'Тактический шутер',
    activeLots: 6410,
    popular: true,
    minPrice: 140,
    tags: ['VP Поинты', 'Ножи', 'Аккаунты', 'Батлпасс']
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    slug: 'minecraft',
    icon: minecraftIcon,
    cover: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80',
    genre: 'Песочница / Выживание',
    activeLots: 5120,
    popular: false,
    minPrice: 150,
    tags: ['Лицензия', 'Ключи', 'Плащи', 'Донат']
  },
  {
    id: 'honkai',
    name: 'Honkai: Star Rail',
    slug: 'honkai-star-rail',
    icon: honkaiIcon,
    cover: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    genre: 'Пошаговая RPG',
    activeLots: 4890,
    popular: false,
    minPrice: 199,
    tags: ['Нефрит', 'Пропуск', 'Ахерон', 'Аккаунты']
  },
  {
    id: 'gta5',
    name: 'GTA 5 RP / Majestic',
    slug: 'gta-5-rp',
    icon: gta5Icon,
    cover: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    genre: 'RolePlay',
    activeLots: 7340,
    popular: true,
    minPrice: 250,
    tags: ['Вирты', 'Majestic', 'Машины', 'Бизнесы']
  },
  {
    id: 'steam',
    name: 'Steam Пополнение',
    slug: 'steam',
    icon: steamIcon,
    cover: 'https://images.unsplash.com/photo-1612287271810-7aa9eb5c4a4a?w=600&auto=format&fit=crop&q=80',
    genre: 'Сервисы / Платформа',
    activeLots: 22100,
    popular: true,
    minPrice: 100,
    tags: ['Баланс', 'Ключи', 'Смена региона', 'Гифты']
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: '1,000 Robux [Моментальная выдача Gamepass] ⚡ Курс 1₽ = 1.6R$',
    gameId: 'roblox',
    gameName: 'Roblox',
    gameIcon: robloxIcon,
    category: 'currency',
    platform: 'All',
    price: 649,
    oldPrice: 850,
    instantDelivery: true,
    seller: {
      id: 'seller-1',
      name: 'MagicRobux_Store',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 4.98,
      reviewsCount: 3840,
      isOnline: true,
      responseTime: '1 мин.',
      verified: true,
      salesCount: 15420
    },
    description: 'Официальная покупка через трансфер геймпасса. Комиссия Roblox покрывается продавцом!',
    fullDescription: '⚡ Моментальная автоматическая отправка робуксов через Gamepass. После оплаты создайте геймпас на нужную сумму без комиссии для вас. Робаксы поступают на ваш баланс в холд через 5 дней по правилам платформы Roblox.',
    tags: ['Моментально', 'Без комиссии', 'Хит продаж'],
    inStock: 48,
    guaranteeHours: 48
  },
  {
    id: 'prod-2',
    title: 'Brawl Pass Plus [Сезон 32] + 100 Гемов напрямую на ваш Supercell ID',
    gameId: 'brawlstars',
    gameName: 'Brawl Stars',
    gameIcon: brawlStarsIcon,
    category: 'donate',
    platform: 'Android',
    price: 990,
    oldPrice: 1290,
    instantDelivery: true,
    seller: {
      id: 'seller-2',
      name: 'BrawlKing_Official',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      rating: 4.95,
      reviewsCount: 1950,
      isOnline: true,
      responseTime: '2 мин.',
      verified: true,
      salesCount: 6100
    },
    description: 'Официальный донат в Brawl Stars без захода на аккаунт или через код подтверждения Supercell.',
    fullDescription: 'Активация Brawl Pass Plus в течение 3-5 минут после предоставления тега или входа. 100% гарантия от блокировок, оплата с зарубежных карт без банов.',
    tags: ['Brawl Pass Plus', 'Официально', 'Безопасно'],
    inStock: 19,
    guaranteeHours: 24
  },
  {
    id: 'prod-3',
    title: 'Аккаунт Genshin AR 58 | Фурина C2 + Невиллет + Кадзуха + Сигны | 25k Примогемов',
    gameId: 'genshin',
    gameName: 'Genshin Impact',
    gameIcon: genshinIcon,
    category: 'accounts',
    platform: 'PC',
    price: 3490,
    oldPrice: 4200,
    instantDelivery: false,
    seller: {
      id: 'seller-3',
      name: 'TeyvatGems',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 890,
      isOnline: true,
      responseTime: '3 мин.',
      verified: true,
      salesCount: 2300
    },
    description: 'Личный аккаунт с первого владельца, полная перепривязка почты, без банов и читов.',
    fullDescription: 'Сервер: Европа. Все регионы закрыты на 100%, много ресурсов для прокачки. Перепривязка на вашу почту, данные выдаются сразу в окне сделки.',
    tags: ['Личный аккаунт', 'Европа', '5★ Топ пачки'],
    inStock: 1,
    guaranteeHours: 72
  },
  {
    id: 'prod-4',
    title: 'Нож-бабочка | Волны Фаза 2 (Factory New) 0.01 Float | CS2 Trade',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    gameIcon: cs2Icon,
    category: 'keys',
    platform: 'PC',
    price: 84500,
    oldPrice: 92000,
    instantDelivery: true,
    seller: {
      id: 'seller-4',
      name: 'CyberTrader_CS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 4.99,
      reviewsCount: 5410,
      isOnline: true,
      responseTime: '1 мин.',
      verified: true,
      salesCount: 18900
    },
    description: 'Моментальная отправка трейд-ссылкой в Steam. Трейдбан отсутствует.',
    fullDescription: 'Чистый скин из личного инвентаря, готов к передаче в Steam Trade Offer. Вставьте ссылку на обмен в чате после оплаты.',
    tags: ['FN 0.01', 'Редкий паттерн', 'Мгновенный трейд'],
    inStock: 1,
    guaranteeHours: 120
  },
  {
    id: 'prod-5',
    title: 'Благословение полой луны (30 дней) Genshin по UID [Официальный партнер]',
    gameId: 'genshin',
    gameName: 'Genshin Impact',
    gameIcon: genshinIcon,
    category: 'donate',
    platform: 'All',
    price: 399,
    oldPrice: 499,
    instantDelivery: true,
    seller: {
      id: 'seller-1',
      name: 'MagicRobux_Store',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 4.98,
      reviewsCount: 3840,
      isOnline: true,
      responseTime: '1 мин.',
      verified: true,
      salesCount: 15420
    },
    description: 'Вход в аккаунт НЕ требуется! Только ваш UID и сервер. Моментальное зачисление.',
    fullDescription: 'Пополнение через официальный API Hoyoverse / Codashop. Луна начисляется в игре через 30-90 секунд.',
    tags: ['По UID', 'Без входа', '100% легально'],
    inStock: 99,
    guaranteeHours: 24
  },
  {
    id: 'prod-6',
    title: 'Majestic RP: 5,000,000 $ Виртов на любом сервере (Atlanta / Boston / Detroit)',
    gameId: 'gta5',
    gameName: 'GTA 5 RP / Majestic',
    gameIcon: gta5Icon,
    category: 'currency',
    platform: 'PC',
    price: 1450,
    oldPrice: 1800,
    instantDelivery: false,
    seller: {
      id: 'seller-5',
      name: 'ViceCity_Bank',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 4.91,
      reviewsCount: 780,
      isOnline: false,
      responseTime: '15 мин.',
      verified: true,
      salesCount: 3100
    },
    description: 'Безопасная передача через маркетплейс или покупку автомобиля. Гарантия от детекта.',
    fullDescription: 'Безопасные вирты, заработанные на бизнесах и перепродажах без дюпа. Передача проверенными схемами.',
    tags: ['Любой сервер', 'Скидка от 5кк', 'Безопасно'],
    inStock: 12,
    guaranteeHours: 48
  },
  {
    id: 'prod-7',
    title: 'Valorant 2175 VP Points (Турция / СНГ код активации в клиенте)',
    gameId: 'valorant',
    gameName: 'Valorant',
    gameIcon: valorantIcon,
    category: 'keys',
    platform: 'PC',
    price: 1290,
    oldPrice: 1550,
    instantDelivery: true,
    seller: {
      id: 'seller-2',
      name: 'BrawlKing_Official',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      rating: 4.95,
      reviewsCount: 1950,
      isOnline: true,
      responseTime: '2 мин.',
      verified: true,
      salesCount: 6100
    },
    description: 'Цифровой пин-код приходит сразу после оплаты. Активируется в клиенте игры за 10 секунд.',
    fullDescription: 'Официальный Riot Prepaid Code. Подходит для аккаунтов региона TR / CIS.',
    tags: ['Пин-код', 'Авто-выдача', 'Выгодно'],
    inStock: 35,
    guaranteeHours: 24
  },
  {
    id: 'prod-8',
    title: 'Dota 2 Аркана на Phantom Assassin (Manifold Paradox) 3 стиль разлочен',
    gameId: 'dota2',
    gameName: 'Dota 2',
    gameIcon: dota2Icon,
    category: 'keys',
    platform: 'PC',
    price: 2650,
    oldPrice: 3100,
    instantDelivery: true,
    seller: {
      id: 'seller-4',
      name: 'CyberTrader_CS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 4.99,
      reviewsCount: 5410,
      isOnline: true,
      responseTime: '1 мин.',
      verified: true,
      salesCount: 18900
    },
    description: 'Полный 3 стиль (100+ побед в контрактах). Трейд сразу на ваш Steam аккаунт.',
    fullDescription: 'Предмет без трейд-бана. Передается моментально через предложение обмена в Steam.',
    tags: ['3 Стиль', 'Без холда', 'Топ качество'],
    inStock: 2,
    guaranteeHours: 48
  }
];

export const INITIAL_LIVE_ORDERS: LiveOrderEvent[] = [
  {
    id: 'ev-1',
    gameName: 'Roblox',
    gameIcon: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80',
    itemTitle: '1,000 Robux Gamepass',
    price: 649,
    timeAgo: 'только что'
  },
  {
    id: 'ev-2',
    gameName: 'Brawl Stars',
    gameIcon: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    itemTitle: 'Brawl Pass Plus',
    price: 990,
    timeAgo: '12 сек. назад'
  },
  {
    id: 'ev-3',
    gameName: 'Genshin Impact',
    gameIcon: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
    itemTitle: 'Полая луна (UID)',
    price: 399,
    timeAgo: '35 сек. назад'
  },
  {
    id: 'ev-4',
    gameName: 'Counter-Strike 2',
    gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
    itemTitle: 'AK-47 | Азимов (FT)',
    price: 6400,
    timeAgo: '1 мин. назад'
  }
];
