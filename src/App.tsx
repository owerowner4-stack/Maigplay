/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GAMES, PRODUCTS } from './data/mockData';
import { Product, Game } from './types';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { GamesGrid } from './components/GamesGrid';
import { CategoryView } from './components/CategoryView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { DealChatModal } from './components/DealChatModal';
import { TechnicalSpecModal } from './components/TechnicalSpecModal';
import { SellModal } from './components/SellModal';
import { TopupModal } from './components/TopupModal';
import { ProfileView } from './components/ProfileView';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ModeratorPanelModal } from './components/ModeratorPanelModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MagicLoader } from './components/MagicLoader';
import { Sparkles, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { notifyOrderAccepted } from './lib/toastNotifications';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  initProductsCollection, 
  subscribeToProducts, 
  createOrderInFirestore,
  subscribeToUserOrders,
  deleteProductFromFirestore,
  updateProductInFirestore,
  OrderDoc 
} from './lib/firestoreService';
import { addModeratorReview } from './data/adminStore';

function MainAppContent() {
  const { user, topupBalance } = useAuth();
  const [games] = useState<Game[]>(GAMES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  // Modals & Views
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [activeDealProduct, setActiveDealProduct] = useState<Product | null>(null);
  const [activeDealOrderId, setActiveDealOrderId] = useState<string | undefined>(undefined);
  const [showTZModal, setShowTZModal] = useState<boolean>(false);
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const [showTopupModal, setShowTopupModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showModeratorModal, setShowModeratorModal] = useState<boolean>(false);
  
  // Mobile Navigation
  const [mobileTab, setMobileTab] = useState<string>('home');
  const [completedOrdersCount, setCompletedOrdersCount] = useState<number>(0);
  const [realOrders, setRealOrders] = useState<OrderDoc[]>([]);

  // Initial Loader state (short flash for magic aesthetic)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Firestore collections & Subscribe to products
  useEffect(() => {
    initProductsCollection();

    const unsubscribeProducts = subscribeToProducts((loadedProducts) => {
      if (loadedProducts && loadedProducts.length > 0) {
        setProducts(loadedProducts);
      }
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => {
      unsubscribeProducts();
      clearTimeout(timer);
    };
  }, []);

  // Listen to user's real orders
  useEffect(() => {
    if (user?.uid) {
      const unsub = subscribeToUserOrders(user.uid, (orders) => {
        setRealOrders(orders);
        setCompletedOrdersCount(orders.length);
      });
      return () => unsub();
    } else {
      setRealOrders([]);
      setCompletedOrdersCount(0);
    }
  }, [user?.uid]);

  const userBalance = user ? user.balance : 0;

  const handleStartDeal = async (product: Product) => {
    if (!user) {
      toast.error('Войдите в аккаунт, чтобы открыть чат сделки.');
      return;
    }

    let orderId: string;
    try {
      orderId = await createOrderInFirestore({
        product,
        buyerId: user.uid,
        buyerName: user.displayName,
        buyerAvatar: user.photoURL
      });
    } catch (err) {
      console.error('Error creating chat order:', err);
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка Firestore';
      toast.error(`Заказ не создан: ${message}`);
      return;
    }

    addModeratorReview({
      id: `CHAT-${orderId}`,
      title: `Новый чат по товару: ${product.title}`,
      game: product.gameName,
      sellerName: product.seller.name,
      sellerEmail: '',
      buyerName: user.displayName,
      country: 'KZ',
      countryName: 'Не указано',
      price: product.price,
      type: 'product_verification',
      status: 'pending',
      createdAt: new Date().toISOString(),
      reason: 'Оплата отключена. Модератору необходимо проследить за чатом. Площадка не гарантирует результат сделки.'
    });

    notifyOrderAccepted({
      orderId,
      productTitle: product.title,
      sellerName: product.seller.name
    });
    setActiveDealOrderId(orderId);
    setActiveDealProduct(product);
  };

  const handleCompleteDeal = (orderId: string) => {
    setCompletedOrdersCount((prev) => prev + 1);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleTopup = (amount: number) => {
    topupBalance(amount);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductFromFirestore(productId);
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    try {
      await updateProductInFirestore(productId, { price: newPrice });
    } catch (err) {
      console.error('Error updating product price in Firestore:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  const handleUpdateProductStock = async (productId: string, newStock: number) => {
    try {
      await updateProductInFirestore(productId, { inStock: newStock });
    } catch (err) {
      console.error('Error updating product stock in Firestore:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: newStock } : p))
    );
  };

  if (isLoading) {
    return <MagicLoader />;
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 flex flex-col selection:bg-blue-600 selection:text-white relative">
      
      {/* Top Header */}
      <Header
        games={games}
        balance={userBalance}
        onSelectGame={setSelectedGameId}
        onOpenTZ={() => setShowTZModal(true)}
        onOpenSellModal={() => setShowSellModal(true)}
        onOpenTopupModal={() => setShowTopupModal(true)}
        onOpenProfile={() => setMobileTab('profile')}
        onOpenAdminPanel={() => setShowAdminModal(true)}
        onOpenModeratorPanel={() => setShowModeratorModal(true)}
        activeGameId={selectedGameId}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 sm:pb-8">
        
        {/* Profile Tab */}
        {mobileTab === 'profile' ? (
          <ProfileView
            products={products}
            onOpenTopup={() => setShowTopupModal(true)}
            onOpenSell={() => setShowSellModal(true)}
            onOpenTZ={() => setShowTZModal(true)}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateProductStock={handleUpdateProductStock}
            onOpenProduct={(product) => setSelectedProductForDetail(product)}
            onOpenAdminPanel={() => setShowAdminModal(true)}
            onOpenModeratorPanel={() => setShowModeratorModal(true)}
            completedOrdersCount={completedOrdersCount}
          />
        ) : mobileTab === 'orders' ? (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              Мои заказы и сделки ({realOrders.length > 0 ? realOrders.length : completedOrdersCount})
            </h2>
            <div className="space-y-2.5">
              {realOrders.length > 0 ? (
                realOrders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-xl bg-[#131720] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-400">
                          {ord.status === 'completed' ? 'Сделка выполнена ✓' : 'В процессе передачи ⚡'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{ord.id}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-0.5">{ord.productTitle}</div>
                      <div className="text-xs text-slate-400">
                        Продавец: {ord.sellerName} • {ord.price} ₽
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const p = products.find(i => i.id === ord.productId) || {
                          id: ord.productId,
                          title: ord.productTitle,
                          gameId: ord.gameId,
                          gameName: ord.gameName,
                          gameIcon: ord.gameIcon,
                          category: 'currency' as const,
                          platform: 'All' as const,
                          price: ord.price,
                          instantDelivery: true,
                          seller: {
                            id: ord.sellerId,
                            name: ord.sellerName,
                            avatar: ord.sellerAvatar,
                            rating: 5.0,
                            reviewsCount: 14,
                            isOnline: true,
                            responseTime: '1 мин.',
                            verified: true,
                            salesCount: 30
                          },
                          description: 'Заказ из базы данных',
                          tags: ['Escrow'],
                          inStock: 1,
                          guaranteeHours: 48
                        };
                        setActiveDealOrderId(ord.id);
                        setActiveDealProduct(p);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Открыть чат
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 px-4 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 space-y-2.5">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-white text-sm">У вас пока нет заказов</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Все ваши покупки и активные Escrow-сделки с продавцами будут отображаться здесь.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMobileTab('home')}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Перейти к покупкам</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Hero Slider with Animated Ticker & Offers */}
            {!selectedGameId && (
              <HeroSlider
                onExploreGame={(gameId) => setSelectedGameId(gameId)}
                onOpenTZ={() => setShowTZModal(true)}
              />
            )}

            {/* Grid of Popular Games */}
            {!selectedGameId && (
              <GamesGrid
                games={games}
                selectedGameId={selectedGameId}
                onSelectGame={setSelectedGameId}
              />
            )}

            {/* Catalog & Filtered Products View */}
            <CategoryView
              products={products}
              games={games}
              selectedGameId={selectedGameId}
              onSelectGame={setSelectedGameId}
              onOpenProduct={(product) => setSelectedProductForDetail(product)}
              onQuickBuy={(product) => handleStartDeal(product)}
            />

            {/* Frequently Asked Questions (FAQ) with Frosted Glass styling & SEO */}
            <FaqSection
              onOpenTopup={() => setShowTopupModal(true)}
              onOpenSell={() => setShowSellModal(true)}
            />
          </>
        )}

      </main>

      {/* Mobile-first Bottom Navigation Dock */}
      <MobileBottomNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        onOpenTZ={() => setShowTZModal(true)}
        onSelectGame={setSelectedGameId}
        ordersCount={completedOrdersCount}
      />

      {/* Footer */}
      <Footer
        onOpenTZ={() => setShowTZModal(true)}
        onSelectGame={setSelectedGameId}
      />

      {/* Product Details Modal */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onStartDeal={handleStartDeal}
          userBalance={userBalance}
          onOpenTopup={() => setShowTopupModal(true)}
        />
      )}

      {/* Deal & Chat Messenger Modal */}
      {activeDealProduct && (
        <DealChatModal
          product={activeDealProduct}
          orderId={activeDealOrderId}
          onClose={() => {
            setActiveDealProduct(null);
            setActiveDealOrderId(undefined);
          }}
          onCompleteDeal={handleCompleteDeal}
        />
      )}

      {/* Technical Specification & Code Viewer Modal */}
      {showTZModal && (
        <TechnicalSpecModal
          onClose={() => setShowTZModal(false)}
        />
      )}

      {/* Sell Item Modal */}
      {showSellModal && (
        <SellModal
          games={games}
          onClose={() => setShowSellModal(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      {/* Topup Balance Modal */}
      {showTopupModal && (
        <TopupModal
          currentBalance={userBalance}
          onClose={() => setShowTopupModal(false)}
          onTopup={handleTopup}
        />
      )}

      {/* Admin Panel Modal (Root Admin random11234500@gmail.com, Recharts Dynamics, KZ > RU > US priority, Escrow & HCB, Moderator accounts) */}
      {showAdminModal && (
        <AdminPanelModal
          onClose={() => setShowAdminModal(false)}
          currentUserEmail={user?.email}
          onOpenModeratorPanel={() => setShowModeratorModal(true)}
        />
      )}

      {/* Moderator Panel Modal (Dedicated moderation queue, strict KZ > RU > US priority order, actions) */}
      {showModeratorModal && (
        <ModeratorPanelModal
          onClose={() => setShowModeratorModal(false)}
          onOpenAdminPanel={() => setShowAdminModal(true)}
        />
      )}

      {/* Sonner Toasts Provider */}
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          className: '!bg-transparent !border-0 !p-0 !shadow-none'
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
