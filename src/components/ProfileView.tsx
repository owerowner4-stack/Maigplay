import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { WithdrawModal } from './WithdrawModal';
import { SalesChart } from './SalesChart';
import { getSeller7DaySales } from '../data/adminStore';
import { 
  User, 
  Wallet, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Package, 
  Eye, 
  LogOut,
  CheckCircle2,
  ArrowDownRight,
  Shield,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ProfileViewProps {
  products: Product[];
  onOpenTopup: () => void;
  onOpenSell: () => void;
  onOpenTZ: () => void;
  onDeleteProduct: (productId: string) => Promise<void> | void;
  onUpdateProductPrice?: (productId: string, newPrice: number) => Promise<void> | void;
  onUpdateProductStock?: (productId: string, newStock: number) => Promise<void> | void;
  onOpenProduct?: (product: Product) => void;
  onOpenAdminPanel?: () => void;
  onOpenModeratorPanel?: () => void;
  completedOrdersCount: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  products,
  onOpenTopup,
  onOpenSell,
  onDeleteProduct,
  onUpdateProductPrice,
  onUpdateProductStock,
  onOpenProduct,
  onOpenAdminPanel,
  onOpenModeratorPanel,
  completedOrdersCount
}) => {
  const { user, loginWithGoogle, logout, withdrawBalance } = useAuth();
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockValue, setEditingStockValue] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch {
      // Cancellation handled gracefully
    } finally {
      setIsLoggingIn(false);
    }
  };

  const userProducts = products.filter((p) => {
    if (!user) {
      return p.seller.id === 'me';
    }
    return (
      p.seller.id === user.uid ||
      p.seller.id === 'me' ||
      p.seller.name === user.displayName
    );
  });

  const handleDelete = async (productId: string) => {
    try {
      setDeletingId(productId);
      await onDeleteProduct(productId);
      setDeleteConfirmId(null);
      setActionNotice('Товар удален из каталога');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEditPrice = (product: Product) => {
    setEditingProductId(product.id);
    setEditingPriceValue(product.price.toString());
  };

  const handleSavePrice = async (productId: string) => {
    const val = parseFloat(editingPriceValue);
    if (!isNaN(val) && val > 0 && onUpdateProductPrice) {
      await onUpdateProductPrice(productId, val);
      setActionNotice('Цена обновлена');
      setTimeout(() => setActionNotice(null), 3000);
    }
    setEditingProductId(null);
  };

  const handleStartEditStock = (product: Product) => {
    setEditingStockId(product.id);
    setEditingStockValue(String(product.inStock || 1));
  };

  const handleSaveStock = async (productId: string) => {
    const val = parseInt(editingStockValue, 10);
    if (!isNaN(val) && val >= 1 && onUpdateProductStock) {
      await onUpdateProductStock(productId, val);
      setActionNotice('Количество штук обновлено');
      setTimeout(() => setActionNotice(null), 3000);
    }
    setEditingStockId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Action Notification */}
      {actionNotice && (
        <div className="fixed top-20 right-4 z-50 px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-medium shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* User Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#131720] p-5 sm:p-6 mb-5">
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">
                    {user.displayName}
                  </h2>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20">
                    Google
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Войдите в аккаунт</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Авторизуйтесь через Google, чтобы управлять товарами и балансом.
            </p>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
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
              <span>{isLoggingIn ? 'Подключение...' : 'Войти через Google'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Balance & Quick Actions (2 Clean Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        
        {/* Balance */}
        <div className="p-4 rounded-xl bg-[#131720] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Баланс кошелька</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {(user ? user.balance : 0).toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTopup}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Пополнить
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Вывести</span>
            </button>
          </div>
        </div>

        {/* Sell action */}
        <div className="p-4 rounded-xl bg-[#131720] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Продажа товаров</div>
            <div className="text-sm font-semibold text-white mt-0.5">
              {userProducts.length} активных лотов
            </div>
          </div>

          <button
            onClick={onOpenSell}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Новый товар</span>
          </button>
        </div>

      </div>

      {/* Seller Sales Dynamics (7 Days) with Recharts */}
      <div className="mb-6">
        <SalesChart
          data={getSeller7DaySales(
            completedOrdersCount > 0 ? completedOrdersCount : (user ? 14 : 3),
            user ? user.balance : 8400
          )}
          title="Динамика продаж продавца (7 дней)"
          subtitle="Количество выполненных сделок и заработанные средства за последние 7 дней"
        />
      </div>

      {/* Management Panels Access (Admin & Moderation) */}
      <div className="p-4 rounded-xl bg-[#131720] border border-white/[0.08] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Панели управления сервисом</span>
              {user?.email === 'random11234500@gmail.com' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                  Владелец
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Админ-панель (random11234500@gmail.com, Escrow &amp; ХЦБ, приоритеты KZ &gt; RU &gt; US) и отдельная панель модерации
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAdminPanel && (
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Админ-панель</span>
            </button>
          )}

          {onOpenModeratorPanel && (
            <button
              type="button"
              onClick={onOpenModeratorPanel}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Модерация</span>
            </button>
          )}
        </div>
      </div>

      {/* Products list */}
      <div className="rounded-xl bg-[#131720] border border-white/[0.08] p-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Мои товары на продаже
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ({userProducts.length})
            </span>
          </div>

          <button
            onClick={onOpenSell}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить</span>
          </button>
        </div>

        {userProducts.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {userProducts.map((prod) => {
              const isEditingPrice = editingProductId === prod.id;
              const isDeleting = deletingId === prod.id;
              const isConfirmingDelete = deleteConfirmId === prod.id;

              return (
                <div 
                  key={prod.id} 
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.gameIcon}
                      alt={prod.gameName}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-400">
                          {prod.gameName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {prod.category}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-white truncate mt-0.5">
                        {prod.title}
                      </div>

                      {/* Stock / Pieces badge & editor */}
                      <div className="mt-1.5 flex items-center gap-2">
                        {editingStockId === prod.id ? (
                          <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-lg border border-blue-500/50">
                            <span className="text-[10px] text-slate-400 pl-1">В наличии:</span>
                            <input
                              type="number"
                              min="1"
                              value={editingStockValue}
                              onChange={(e) => setEditingStockValue(e.target.value)}
                              className="w-14 bg-transparent text-xs font-bold text-white font-mono px-1 focus:outline-none"
                              autoFocus
                            />
                            <span className="text-[10px] text-slate-400">шт.</span>
                            <button
                              onClick={() => handleSaveStock(prod.id)}
                              className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                              title="Сохранить количество"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[11px]">
                              В наличии: <strong className="text-white font-bold">{prod.inStock || 1}</strong> шт.
                            </span>
                            <button
                              onClick={() => handleStartEditStock(prod)}
                              className="p-1 text-slate-400 hover:text-blue-300 transition-colors cursor-pointer"
                              title="Изменить количество штук в наличии"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    
                    {/* Price edit */}
                    {isEditingPrice ? (
                      <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-lg border border-blue-500/50">
                        <input
                          type="number"
                          value={editingPriceValue}
                          onChange={(e) => setEditingPriceValue(e.target.value)}
                          className="w-16 bg-transparent text-xs font-bold text-white font-mono px-1 focus:outline-none"
                          autoFocus
                        />
                        <span className="text-xs text-slate-400">₽</span>
                        <button
                          onClick={() => handleSavePrice(prod.id)}
                          className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white font-mono">
                          {prod.price.toLocaleString('ru-RU')} ₽
                        </span>
                        <button
                          onClick={() => handleStartEditPrice(prod)}
                          className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                          title="Изменить цену"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Preview button */}
                    {onOpenProduct && (
                      <button
                        onClick={() => onOpenProduct(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                        title="Посмотреть лот"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete button */}
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-red-950/60 border border-red-500/40 p-1 rounded-lg">
                        <span className="text-[11px] text-red-300 px-1">Удалить?</span>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          disabled={isDeleting}
                          className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-medium cursor-pointer"
                        >
                          {isDeleting ? '...' : 'Да'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white text-xs cursor-pointer"
                        >
                          Нет
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(prod.id)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                        title="Удалить товар"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400 mb-3">
              У вас пока нет активных товаров на продаже.
            </p>
            <button
              onClick={onOpenSell}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Выставить первый товар
            </button>
          </div>
        )}

      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          currentBalance={user ? user.balance : 0}
          onClose={() => setShowWithdrawModal(false)}
          onWithdraw={async (amount) => {
            return await withdrawBalance(amount);
          }}
        />
      )}

    </div>
  );
};
