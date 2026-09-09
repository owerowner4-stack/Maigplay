/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DaySalesStat } from '../components/SalesChart';

export type PriorityCountry = 'KZ' | 'RU' | 'US';

export interface ModeratorAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  assignedRegion: 'ALL' | PriorityCountry;
  createdAt: string;
  isActive: boolean;
  resolvedTickets: number;
}

export interface ModerationQueueItem {
  id: string;
  title: string;
  game: string;
  sellerName: string;
  sellerEmail: string;
  buyerName?: string;
  country: PriorityCountry;
  countryName: string;
  price: number;
  type: 'fraud_attempt' | 'rule_violation' | 'escrow_dispute' | 'offsite_scam' | 'fake_product' | 'product_verification' | 'review_report';
  status: 'pending' | 'approved' | 'rejected' | 'frozen' | 'resolved_clean' | 'fraud_blocked' | 'warned';
  createdAt: string;
  reason?: string;
  violationSeverity?: 'critical' | 'high' | 'medium';
  suspectedAction?: string;
  hcbTransactionId?: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  country: PriorityCountry;
  countryName: string;
  balance: number;
  salesCount: number;
  totalVolume: number;
  verified: boolean;
  banned: boolean;
  role: 'user' | 'seller' | 'vip_seller';
  registeredAt: string;
}

export interface EscrowHCBConfig {
  escrowApiKey: string;
  escrowApiEndpoint: string;
  escrowWebhookSecret: string;
  hcbMerchantId: string;
  hcbPassword: string;
  hcbTerminalId: string;
  escrowFeePercent: number;
  autoReleaseHours: number;
  isEscrowActive: boolean;
  isHcbActive: boolean;
  hcbReserveKZT: number;
  escrowReserveRUB: number;
}

const STORAGE_KEYS = {
  MODERATORS: 'magicplay_admin_moderators',
  QUEUE: 'magicplay_moderation_queue',
  USERS: 'magicplay_platform_users',
  CONFIG: 'magicplay_escrow_hcb_config',
  ADMIN_AUTH: 'magicplay_admin_auth_session',
  MOD_AUTH: 'magicplay_mod_auth_session',
};

// Initial default moderators issued by Admin
const DEFAULT_MODERATORS: ModeratorAccount[] = [
  {
    id: 'mod-kz-1',
    name: 'Алишер (Алматы Lead)',
    email: 'mod.almaty@magicplay.io',
    password: '',
    assignedRegion: 'KZ',
    createdAt: '2026-03-01',
    isActive: true,
    resolvedTickets: 142
  },
  {
    id: 'mod-ru-1',
    name: 'Дмитрий (Москва Escrow)',
    email: 'mod.moscow@magicplay.io',
    password: '',
    assignedRegion: 'RU',
    createdAt: '2026-03-02',
    isActive: true,
    resolvedTickets: 89
  },
  {
    id: 'mod-global-1',
    name: 'Alex (Global/US Arbitrage)',
    email: 'mod.global@magicplay.io',
    password: '',
    assignedRegion: 'US',
    createdAt: '2026-03-03',
    isActive: true,
    resolvedTickets: 34
  }
];

// Initial default Moderation Queue: Anti-fraud, anti-scam & rule violation tracking (KZ -> RU -> US)
const DEFAULT_QUEUE: ModerationQueueItem[] = [
  {
    id: 'FRAUD-KZ-901',
    title: 'Подозрение на увод сделки в Telegram / Нарушение правил №4',
    game: 'Brawl Stars',
    sellerName: 'Dimash_BS',
    sellerEmail: 'dimash.kz@mail.kz',
    buyerName: 'Ернар_Алматы',
    country: 'KZ',
    countryName: 'Казахстан (Приоритет №1)',
    price: 4900,
    type: 'offsite_scam',
    status: 'frozen',
    createdAt: '3 мин. назад',
    reason: 'Автофильтр заблокировал сообщение с предложением оплаты на личный Kaspi Gold в обход Escrow',
    violationSeverity: 'critical',
    suspectedAction: 'Попытка увода клиента в сторонний мессенджер',
    hcbTransactionId: 'HCB-KZ-99182'
  },
  {
    id: 'FRAUD-KZ-902',
    title: 'Жалоба покупателя: Невалидный код пополнения Робуксов',
    game: 'Roblox',
    sellerName: 'Нурсултан_Robux',
    sellerEmail: 'nursultan.kz@gmail.com',
    buyerName: 'Тимур_Астана',
    country: 'KZ',
    countryName: 'Казахстан (Приоритет №1)',
    price: 1850,
    type: 'fraud_attempt',
    status: 'pending',
    createdAt: '9 мин. назад',
    reason: 'Покупатель указал: "Код уже был активирован 3 часа назад". Средства заморожены в Escrow.',
    violationSeverity: 'high',
    suspectedAction: 'Предоставление использованного ключа',
    hcbTransactionId: 'HCB-KZ-99214'
  },
  {
    id: 'FRAUD-RU-401',
    title: 'Попытка восстановления проданного Steam аккаунта через саппорт',
    game: 'Steam',
    sellerName: 'CyberSeller_RU',
    sellerEmail: 'ivan.seller@mail.ru',
    buyerName: 'Алексей_Спб',
    country: 'RU',
    countryName: 'Россия (Приоритет №2)',
    price: 2490,
    type: 'fraud_attempt',
    status: 'pending',
    createdAt: '18 мин. назад',
    reason: 'Сработал антифрод-маяк: IP смены почты совпадает с первоначальным IP продавца',
    violationSeverity: 'critical',
    suspectedAction: 'Попытка реролла / кражи проданного аккаунта',
    hcbTransactionId: 'ESC-RU-77102'
  },
  {
    id: 'FRAUD-RU-402',
    title: 'Нарушение правил оформления: Накрутка фиктивных отзывов',
    game: 'Genshin Impact',
    sellerName: 'Teyvat_Shop',
    sellerEmail: 'teyvat.ru@yandex.ru',
    buyerName: 'Системный сканер',
    country: 'RU',
    countryName: 'Россия (Приоритет №2)',
    price: 6490,
    type: 'rule_violation',
    status: 'pending',
    createdAt: '35 мин. назад',
    reason: 'Выявлена сеть из 4 связанных аккаунтов для взаимной накрутки рейтинга надежности',
    violationSeverity: 'medium',
    suspectedAction: 'Фальсификация репутации в каталоге',
    hcbTransactionId: 'ESC-RU-77045'
  },
  {
    id: 'FRAUD-US-101',
    title: 'Dispute: Chargeback risk & suspicious VPN proxy location',
    game: 'Valorant',
    sellerName: 'ValorShop_USA',
    sellerEmail: 'valorshop.us@gmail.com',
    buyerName: 'Mike_Gamer',
    country: 'US',
    countryName: 'США / Global (Приоритет №3)',
    price: 3400,
    type: 'escrow_dispute',
    status: 'pending',
    createdAt: '52 мин. назад',
    reason: 'Выявлен вход через прокси Tor/VPN с последующей жалобой в банк. Escrow холдирует выплату.',
    violationSeverity: 'high',
    suspectedAction: 'Потенциальный фрод с чарджбэком',
    hcbTransactionId: 'ESC-US-44019'
  }
];

// Initial Platform Users with prioritized regions
const DEFAULT_USERS: PlatformUser[] = [
  {
    id: 'usr-admin',
    name: 'Главный Администратор',
    email: 'random11234500@gmail.com',
    country: 'KZ',
    countryName: 'Казахстан (Приоритет №1)',
    balance: 150000,
    salesCount: 156,
    totalVolume: 420000,
    verified: true,
    banned: false,
    role: 'vip_seller',
    registeredAt: '2026-01-10'
  },
  {
    id: 'usr-kz-1',
    name: 'Айдос Султанов',
    email: 'aidos.kz@gmail.com',
    country: 'KZ',
    countryName: 'Казахстан (Приоритет №1)',
    balance: 24500,
    salesCount: 84,
    totalVolume: 168000,
    verified: true,
    banned: false,
    role: 'seller',
    registeredAt: '2026-02-01'
  },
  {
    id: 'usr-kz-2',
    name: 'Данияр Токаев',
    email: 'daniyar.almaty@mail.ru',
    country: 'KZ',
    countryName: 'Казахстан (Приоритет №1)',
    balance: 8900,
    salesCount: 31,
    totalVolume: 74000,
    verified: true,
    banned: false,
    role: 'seller',
    registeredAt: '2026-02-14'
  },
  {
    id: 'usr-ru-1',
    name: 'Артем Смирнов',
    email: 'artem.gaming@yandex.ru',
    country: 'RU',
    countryName: 'Россия (Приоритет №2)',
    balance: 12400,
    salesCount: 42,
    totalVolume: 98000,
    verified: true,
    banned: false,
    role: 'seller',
    registeredAt: '2026-02-18'
  },
  {
    id: 'usr-ru-2',
    name: 'Максим Романов',
    email: 'max.steam@mail.ru',
    country: 'RU',
    countryName: 'Россия (Приоритет №2)',
    balance: 4200,
    salesCount: 19,
    totalVolume: 38000,
    verified: false,
    banned: false,
    role: 'user',
    registeredAt: '2026-02-25'
  },
  {
    id: 'usr-us-1',
    name: 'John Miller',
    email: 'jmiller.gaming@gmail.com',
    country: 'US',
    countryName: 'США / Global (Приоритет №3)',
    balance: 45000,
    salesCount: 28,
    totalVolume: 112000,
    verified: true,
    banned: false,
    role: 'seller',
    registeredAt: '2026-02-28'
  }
];

// Provider configuration is intentionally empty; secrets belong on the server.
const DEFAULT_ESCROW_HCB_CONFIG: EscrowHCBConfig = {
  escrowApiKey: '',
  escrowApiEndpoint: '',
  escrowWebhookSecret: '',
  hcbMerchantId: '',
  hcbPassword: '',
  hcbTerminalId: '',
  escrowFeePercent: 3.0,
  autoReleaseHours: 24,
  isEscrowActive: false,
  isHcbActive: false,
  hcbReserveKZT: 0,
  escrowReserveRUB: 0
};

// 7-day platform analytics data with breakdown by priority countries
export const getPlatform7DaySales = (countryFilter?: 'ALL' | PriorityCountry): DaySalesStat[] => {
  const baseDays = [
    { date: '03.03', dayName: 'Ср' },
    { date: '04.03', dayName: 'Чт' },
    { date: '05.03', dayName: 'Пт' },
    { date: '06.03', dayName: 'Сб' },
    { date: '07.03', dayName: 'Вс' },
    { date: '08.03', dayName: 'Пн' },
    { date: '09.03', dayName: 'Сегодня' }
  ];

  if (countryFilter === 'KZ') {
    // 🇰🇿 Казахстан (Казахстанцы - Топ приоритет, основной объём)
    const kzData = [
      { deals: 14, revenue: 26400 },
      { deals: 18, revenue: 34200 },
      { deals: 24, revenue: 48900 },
      { deals: 32, revenue: 64500 },
      { deals: 38, revenue: 76000 },
      { deals: 29, revenue: 58200 },
      { deals: 35, revenue: 69400 }
    ];
    return baseDays.map((d, i) => ({ ...d, ...kzData[i] }));
  }

  if (countryFilter === 'RU') {
    // 🇷🇺 Россия (Второй приоритет)
    const ruData = [
      { deals: 9, revenue: 16800 },
      { deals: 11, revenue: 21500 },
      { deals: 15, revenue: 29000 },
      { deals: 19, revenue: 38400 },
      { deals: 22, revenue: 44100 },
      { deals: 16, revenue: 31000 },
      { deals: 20, revenue: 39500 }
    ];
    return baseDays.map((d, i) => ({ ...d, ...ruData[i] }));
  }

  if (countryFilter === 'US') {
    // 🇺🇸 США / Global (Третий приоритет)
    const usData = [
      { deals: 3, revenue: 8500 },
      { deals: 4, revenue: 11200 },
      { deals: 5, revenue: 14800 },
      { deals: 7, revenue: 21000 },
      { deals: 8, revenue: 24500 },
      { deals: 6, revenue: 18000 },
      { deals: 7, revenue: 20500 }
    ];
    return baseDays.map((d, i) => ({ ...d, ...usData[i] }));
  }

  // ALL regions combined (KZ + RU + US)
  const allData = [
    { deals: 26, revenue: 51700 },
    { deals: 33, revenue: 66900 },
    { deals: 44, revenue: 92700 },
    { deals: 58, revenue: 123900 },
    { deals: 68, revenue: 144600 },
    { deals: 51, revenue: 107200 },
    { deals: 62, revenue: 129400 }
  ];
  return baseDays.map((d, i) => ({ ...d, ...allData[i] }));
};

// Seller's specific 7-day sales
export const getSeller7DaySales = (sellerSalesCount: number = 0, currentBalance: number = 0): DaySalesStat[] => {
  const baseDays = [
    { date: '03.03', dayName: 'Ср' },
    { date: '04.03', dayName: 'Чт' },
    { date: '05.03', dayName: 'Пт' },
    { date: '06.03', dayName: 'Сб' },
    { date: '07.03', dayName: 'Вс' },
    { date: '08.03', dayName: 'Пн' },
    { date: '09.03', dayName: 'Сегодня' }
  ];

  if (sellerSalesCount <= 0 && currentBalance <= 0) {
    return baseDays.map(d => ({ ...d, deals: 0, revenue: 0 }));
  }

  // Realistic distribution for active seller
  const factor = Math.max(1, Math.min(sellerSalesCount, 50));
  const avgTicket = currentBalance > 0 ? Math.round(currentBalance / Math.max(1, sellerSalesCount)) : 650;

  const weights = [0.08, 0.12, 0.15, 0.22, 0.25, 0.18, 0.20];
  return baseDays.map((d, idx) => {
    const deals = Math.max(0, Math.round(weights[idx] * factor * 0.3));
    const revenue = deals * avgTicket;
    return {
      ...d,
      deals,
      revenue
    };
  });
};

// LocalStorage helpers
export const loadStoredModerators = (): ModeratorAccount[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MODERATORS);
    return data ? JSON.parse(data) : DEFAULT_MODERATORS;
  } catch {
    return DEFAULT_MODERATORS;
  }
};

export const saveStoredModerators = (mods: ModeratorAccount[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MODERATORS, JSON.stringify(mods));
  } catch (err) {
    console.error('Error saving moderators:', err);
  }
};

export const loadStoredQueue = (): ModerationQueueItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUEUE);
    return data ? JSON.parse(data) : DEFAULT_QUEUE;
  } catch {
    return DEFAULT_QUEUE;
  }
};

export const saveStoredQueue = (queue: ModerationQueueItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error('Error saving queue:', err);
  }
};

export const loadStoredUsers = (): PlatformUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

export const saveStoredUsers = (users: PlatformUser[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users:', err);
  }
};

export const loadEscrowHCBConfig = (): EscrowHCBConfig => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    const parsed = data ? JSON.parse(data) as Partial<EscrowHCBConfig> : {};
    return {
      ...DEFAULT_ESCROW_HCB_CONFIG,
      ...parsed,
      escrowApiKey: '',
      escrowWebhookSecret: '',
      hcbPassword: ''
    };
  } catch {
    return DEFAULT_ESCROW_HCB_CONFIG;
  }
};

export const saveEscrowHCBConfig = (cfg: EscrowHCBConfig) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({
      ...cfg,
      escrowApiKey: '',
      escrowWebhookSecret: '',
      hcbPassword: ''
    }));
  } catch (err) {
    console.error('Error saving config:', err);
  }
};

// Admin Authentication State
export const checkIsAdminSession = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
};

export const setAdminSession = (active: boolean) => {
  try {
    if (active) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  } catch (err) {
    console.error('Error setting admin session:', err);
  }
};

// Moderator Authentication State
export const getActiveModeratorSession = (): ModeratorAccount | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MOD_AUTH);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setModeratorSession = (mod: ModeratorAccount | null) => {
  try {
    if (mod) {
      localStorage.setItem(STORAGE_KEYS.MOD_AUTH, JSON.stringify(mod));
    } else {
      localStorage.removeItem(STORAGE_KEYS.MOD_AUTH);
    }
  } catch (err) {
    console.error('Error setting moderator session:', err);
  }
};
