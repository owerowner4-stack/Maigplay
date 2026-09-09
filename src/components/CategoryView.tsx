import React, { useState, useMemo } from 'react';
import { Product, Game, ProductCategory, PlatformType } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Filter, 
  ArrowUpDown, 
  Zap, 
  UserCheck, 
  Search, 
  SlidersHorizontal,
  X,
  ShieldCheck
} from 'lucide-react';

interface CategoryViewProps {
  products: Product[];
  games: Game[];
  selectedGameId: string | null;
  onSelectGame: (gameId: string | null) => void;
  onOpenProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  products,
  games,
  selectedGameId,
  onSelectGame,
  onOpenProduct,
  onQuickBuy
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [onlyInstant, setOnlyInstant] = useState(false);
  const [onlyOnlineSellers, setOnlyOnlineSellers] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeGame = games.find((g) => g.id === selectedGameId);

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: 'Все товары' },
    { key: 'currency', label: 'Валюта' },
    { key: 'accounts', label: 'Аккаунты' },
    { key: 'donate', label: 'Донат & БП' },
    { key: 'keys', label: 'Ключи & Скины' },
    { key: 'services', label: 'Услуги' },
  ];

  const platforms: { key: PlatformType; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'PC', label: 'PC' },
    { key: 'iOS', label: 'iOS' },
    { key: 'Android', label: 'Android' },
    { key: 'PlayStation', label: 'PS' },
    { key: 'Xbox', label: 'Xbox' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (selectedGameId && item.gameId !== selectedGameId) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedPlatform !== 'all' && item.platform !== 'All' && item.platform !== selectedPlatform) return false;
      if (onlyInstant && !item.instantDelivery) return false;
      if (onlyOnlineSellers && !item.seller.isOnline) return false;
      if (searchFilter.trim() !== '') {
        const query = searchFilter.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchSeller = item.seller.name.toLowerCase().includes(query);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchSeller && !matchTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.seller.rating - a.seller.rating;
      return b.seller.salesCount - a.seller.salesCount;
    });
  }, [products, selectedGameId, selectedCategory, selectedPlatform, onlyInstant, onlyOnlineSellers, searchFilter, sortBy]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
      
      {/* Active Game Header if selected */}
      {activeGame && (
        <div className="rounded-xl p-4 mb-4 border border-white/[0.08] bg-[#131720] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={activeGame.icon} 
              alt={activeGame.name} 
              className="w-12 h-12 rounded-xl object-cover border border-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  {activeGame.name}
                </h1>
                <span className="text-xs text-slate-400">
                  ({activeGame.genre})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {filteredProducts.length} лотов доступно
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectGame(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Все игры</span>
          </button>
        </div>
      )}

      {/* Clean Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#131720] hover:bg-[#181d28] text-slate-300 border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Sidebar (Desktop) + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#131720] border border-white/[0.08] text-xs font-medium text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Фильтры и сортировка</span>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`lg:col-span-3 space-y-3 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 rounded-xl bg-[#131720] border border-white/[0.06] space-y-4">
            
            {/* Header & Reset */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <span>Фильтры</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                  setOnlyInstant(false);
                  setOnlyOnlineSellers(false);
                  setSearchFilter('');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Сбросить
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Поиск в категории
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Название, скин, тег..."
                  className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] cursor-pointer transition-colors">
                <span className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Моментальная выдача
                </span>
                <input
                  type="checkbox"
                  checked={onlyInstant}
                  onChange={(e) => setOnlyInstant(e.target.checked)}
                  className="accent-blue-500 w-3.5 h-3.5 cursor-pointer rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] cursor-pointer transition-colors">
                <span className="flex items-center gap-1.5 text-xs text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Продавец онлайн
                </span>
                <input
                  type="checkbox"
                  checked={onlyOnlineSellers}
                  onChange={(e) => setOnlyOnlineSellers(e.target.checked)}
                  className="accent-blue-500 w-3.5 h-3.5 cursor-pointer rounded"
                />
              </label>
            </div>

            {/* Platform filter */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Платформа
              </label>
              <div className="grid grid-cols-3 gap-1">
                {platforms.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPlatform(p.key)}
                    className={`py-1 px-1.5 rounded text-xs font-medium transition-colors cursor-pointer text-center ${
                      selectedPlatform === p.key
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-[#0b0e14] text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting select */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Сортировка
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Сначала дешевле</option>
                  <option value="price-desc">Сначала дороже</option>
                  <option value="rating">По рейтингу продавца</option>
                </select>
                <ArrowUpDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Escrow Guarantee Infobox */}
            <div className="p-3 rounded-lg bg-blue-500/[0.06] border border-blue-500/20 text-xs space-y-1">
              <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Гарантия MagicEscrow
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Деньги резервируются до тех пор, пока вы не проверите полученный товар.
              </p>
            </div>

          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-[#131720] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Товары не найдены</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Попробуйте сбросить фильтры или выбрать другую игру.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                  setOnlyInstant(false);
                  setOnlyOnlineSellers(false);
                  setSearchFilter('');
                  onSelectGame(null);
                }}
                className="mt-3.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenProduct={onOpenProduct}
                  onQuickBuy={onQuickBuy}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
