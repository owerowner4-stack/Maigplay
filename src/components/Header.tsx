import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Wallet, 
  LogOut, 
  ChevronDown,
  Package,
  X,
  Gamepad2,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { Game } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  games: Game[];
  balance: number;
  onSelectGame: (gameId: string | null) => void;
  onOpenTZ: () => void;
  onOpenSellModal: () => void;
  onOpenTopupModal: () => void;
  onOpenProfile?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenModeratorPanel?: () => void;
  activeGameId: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  games,
  balance,
  onSelectGame,
  onOpenSellModal,
  onOpenTopupModal,
  onOpenProfile,
  onOpenAdminPanel,
  onOpenModeratorPanel
}) => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const filteredSuggestions = searchQuery.trim() === ''
    ? games.slice(0, 5)
    : games.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const res = await loginWithGoogle();
      if (res) {
        setShowProfileMenu(false);
      }
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request' &&
        !err?.message?.includes('popup-closed-by-user')
      ) {
        console.error('Login error:', err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0b0e14]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Clean Minimalist Logo */}
        <div 
          onClick={() => onSelectGame(null)}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">
                Magic<span className="text-blue-400">Play</span>
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-slate-400 -mt-0.5">
              Игровой маркетплейс
            </span>
          </div>
        </div>

        {/* Calm & Eye-friendly Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <div className={`flex items-center w-full rounded-xl bg-[#131720] border transition-colors ${
            isSearchFocused 
              ? 'border-blue-500/50 ring-1 ring-blue-500/20' 
              : 'border-white/[0.08] hover:border-white/[0.15]'
          }`}>
            <Search className="w-4 h-4 ml-3 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Поиск игр, валюты, аккаунтов..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 mr-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-[#131720] border border-white/[0.08] rounded-xl shadow-xl z-50">
              <div className="px-2.5 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {searchQuery ? 'Игры по запросу' : 'Популярные разделы'}
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredSuggestions.map((game) => (
                  <button
                    key={game.id}
                    onMouseDown={() => {
                      onSelectGame(game.id);
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={game.icon} 
                        alt={game.name} 
                        className="w-6 h-6 rounded-md object-cover border border-white/10" 
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-200">
                        {game.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      от {game.minPrice} ₽
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Only 3 Essential Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* 1. Баланс */}
          <button 
            onClick={onOpenTopupModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131720] border border-white/[0.08] hover:border-white/[0.18] transition-colors cursor-pointer text-left"
            title="Пополнить баланс"
          >
            <Wallet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200 font-mono">
              {balance.toLocaleString('ru-RU')} ₽
            </span>
            <span className="hidden sm:inline-flex items-center justify-center w-4 h-4 rounded bg-blue-600/20 text-blue-300 text-[11px] font-bold">
              +
            </span>
          </button>

          {/* 2. Кнопка "Продать" */}
          <button
            onClick={onOpenSellModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Продать</span>
          </button>

          {/* Quick Access: Admin & Moderation Suites */}
          <div className="hidden sm:flex items-center gap-1">
            {onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
                title="Панель администратора (random11234500@gmail.com)"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Админ</span>
              </button>
            )}

            {onOpenModeratorPanel && (
              <button
                onClick={onOpenModeratorPanel}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
                title="Панель модерации (Очередь: KZ > RU > US)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Модерация</span>
              </button>
            )}
          </div>

          {/* 3. Пользователь / Вход */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-lg object-cover border border-white/10"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Minimal Profile Dropdown */}
              {showProfileMenu && (
                <div 
                  className="absolute right-0 mt-2 w-60 bg-[#131720] border border-white/[0.08] rounded-xl shadow-xl p-2.5 z-50"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-2 py-1.5 border-b border-white/[0.06]">
                    <div className="text-xs font-bold text-white truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {user.email}
                    </div>
                  </div>

                  <div className="py-1.5 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/[0.05] transition-colors text-left"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-400" />
                      <span>Мои товары & Профиль</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenTopupModal();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/[0.05] transition-colors"
                    >
                      <span>Баланс</span>
                      <span className="font-semibold text-blue-400 font-mono">{balance.toLocaleString('ru-RU')} ₽</span>
                    </button>

                    {onOpenAdminPanel && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenAdminPanel();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-300 hover:bg-blue-600/10 transition-colors text-left"
                      >
                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                        <span>Админ-панель</span>
                      </button>
                    )}

                    {onOpenModeratorPanel && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenModeratorPanel();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:bg-emerald-600/10 transition-colors text-left"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Панель модерации</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1.5 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Выйти</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoggingIn ? '...' : 'Войти'}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
