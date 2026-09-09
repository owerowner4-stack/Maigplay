export interface TZSection {
  id: string;
  title: string;
  badge: string;
  content: string;
}

export const TECHNICAL_SPECIFICATION = {
  title: 'Техническое Задание (ТЗ): Игровая торговая площадка MagicPlay',
  subtitle: 'Архитектурный стандарт, спецификация UI/UX, безопасных сделок Escrow и интерактивных компонентов',
  version: '1.0.0-PROD',
  date: '2026',
  
  htmlSnippet: `<!-- HTML структура карточки товара MagicPlay -->
<article class="magic-card" data-product-id="prod-101" tabindex="0">
  <!-- Внутренний контейнер с эффектом матового стекла (Glassmorphism) -->
  <div class="magic-card-inner">
    
    <!-- Бейджи и статусы -->
    <div class="card-badges">
      <span class="badge-instant">
        <svg class="icon-bolt" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Моментально
      </span>
      <span class="badge-platform">PC / Mobile</span>
    </div>

    <!-- Обложка / Превью игры -->
    <div class="card-media">
      <img 
        src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80" 
        alt="Roblox Robux" 
        class="card-img"
        loading="lazy"
      />
      <div class="media-overlay-glow"></div>
    </div>

    <!-- Информационная часть -->
    <div class="card-content">
      <div class="game-tag">
        <span class="game-dot"></span>
        Roblox • Валюта
      </div>

      <h3 class="product-title" title="1,000 Robux Gamepass">
        1,000 Robux [Моментальная выдача Gamepass] ⚡ 1₽ = 1.6R$
      </h3>

      <p class="product-desc">
        Официальная отправка через трансфер геймпасса. Комиссия покрыта продавцом.
      </p>

      <!-- Блок продавца -->
      <div class="seller-strip">
        <div class="seller-avatar-wrap">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&q=80" alt="MagicStore" class="seller-avatar" />
          <span class="status-indicator online" title="Продавец Онлайн"></span>
        </div>
        <div class="seller-info">
          <div class="seller-name-row">
            <span class="seller-name">MagicRobux_Store</span>
            <svg class="icon-verified" viewBox="0 0 24 24" fill="currentColor" title="Проверенный продавец">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div class="seller-rating-row">
            <span class="rating-val">★ 4.98</span>
            <span class="orders-count">(3,840 отзывов)</span>
          </div>
        </div>
      </div>

      <!-- Футер карточки: Цена и CTA кнопка -->
      <div class="card-footer">
        <div class="price-wrap">
          <span class="current-price">649 ₽</span>
          <span class="old-price">850 ₽</span>
        </div>
        
        <button class="btn-magic-buy" type="button">
          <span class="btn-glow-aura"></span>
          <span class="btn-text">Купить</span>
          <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</article>`,

  cssSnippet: `/* =========================================================
   MagicPlay Component Styling: Glowing Glassmorphism Product Card
   ========================================================= */

:root {
  --bg-cosmic: #0a0718;
  --card-bg-from: rgba(23, 16, 48, 0.75);
  --card-bg-to: rgba(14, 9, 31, 0.85);
  --neon-purple: #a855f7;
  --neon-violet-glow: rgba(168, 85, 247, 0.45);
  --neon-cyan: #06b6d4;
  --neon-cyan-glow: rgba(6, 182, 212, 0.35);
  --ultramarine: #6366f1;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --radius-card: 16px;
  --radius-btn: 12px;
}

/* Базовый контейнер карточки */
.magic-card {
  position: relative;
  border-radius: var(--radius-card);
  padding: 1px; /* Для градиентной псевдо-рамки */
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
  cursor: pointer;
  overflow: hidden;
}

/* Эффект ховера карточки: увеличение 1.03x + свечение по контуру */
.magic-card:hover {
  transform: scale(1.03) translateY(-4px);
  box-shadow: 
    0 16px 36px -10px var(--neon-violet-glow),
    0 0 24px 2px var(--neon-cyan-glow);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(6, 182, 212, 0.5) 100%);
}

/* Внутренний контейнер со стеклом */
.magic-card-inner {
  background: linear-gradient(145deg, var(--card-bg-from), var(--card-bg-to));
  border-radius: calc(var(--radius-card) - 1px);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Бейджи */
.card-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
}
.badge-instant {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(6, 182, 212, 0.2);
  border: 1px solid rgba(6, 182, 212, 0.5);
  color: #67e8f9;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
}
.badge-platform {
  background: rgba(15, 10, 32, 0.7);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #cbd5e1;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 9999px;
}

/* Медиа обложка */
.card-media {
  position: relative;
  height: 140px;
  width: 100%;
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.magic-card:hover .card-img {
  transform: scale(1.08);
}
.media-overlay-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(14, 9, 31, 0.95) 0%, rgba(14, 9, 31, 0.1) 60%);
}

/* Контентная область */
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.game-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--neon-cyan);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.game-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--neon-cyan);
  box-shadow: 0 0 8px var(--neon-cyan);
}
.product-title {
  color: var(--text-main);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
.product-desc {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Полоса продавца */
.seller-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(30, 20, 60, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(168, 85, 247, 0.15);
}
.seller-avatar-wrap {
  position: relative;
}
.seller-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.status-indicator.online {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #0a0718;
  box-shadow: 0 0 6px #10b981;
}
.seller-name {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
}
.rating-val {
  color: #facc15;
  font-size: 11px;
  font-weight: 700;
}
.orders-count {
  color: #94a3b8;
  font-size: 11px;
}

/* Нижняя панель и CTA кнопка */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(168, 85, 247, 0.12);
}
.current-price {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
}
.old-price {
  font-size: 12px;
  color: #64748b;
  text-decoration: line-through;
  margin-left: 6px;
}

/* Кнопка с градиентом "жидкого золота / магической энергии" */
.btn-magic-buy {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: var(--radius-btn);
  border: none;
  background: linear-gradient(115deg, #a855f7 0%, #6366f1 50%, #06b6d4 100%);
  background-size: 200% 200%;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(168, 85, 247, 0.35);
}

.btn-magic-buy:hover {
  background-position: 100% 0%;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 35px rgba(168, 85, 247, 0.4);
  transform: translateY(-1px);
}

.btn-magic-buy:active {
  transform: scale(0.97);
}`,

  jsSnippet: `// =========================================================
// MagicPlay JavaScript UX Scenarios
// 1. Плавное появление элементов при скролле (Scroll Reveal)
// 2. Живой счетчик выполненных заказов (Animated Counter)
// 3. Плавающие уведомления о новых заказах (Toast Notifications)
// =========================================================

// --- 1. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ (IntersectionObserver) ---
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-reveal');
  
  const observerOptions = {
    root: null, // viewport
    threshold: 0.15, // срабатывание при 15% видимости
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Каскадная задержка для карточек в сетке (Stagger effect)
        const delay = (index % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => revealObserver.observe(el));
}

// --- 2. ЖИВОЙ СЧЕТЧИК ЗАКАЗОВ С ПЛАВНОЙ ИНТЕРПОЛЯЦИЕЙ ---
function animateCounter(elementId, targetValue, durationMs = 2000) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let startTime = null;
  const startValue = 0;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / durationMs, 1);
    
    // Функция плавности (Ease-out cubic)
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);

    // Форматирование числа с разделителями тысяч
    el.textContent = new Intl.NumberFormat('ru-RU').format(currentValue);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = new Intl.NumberFormat('ru-RU').format(targetValue) + '+';
    }
  }

  window.requestAnimationFrame(step);
}

// --- 3. ВСПЛЫВАЮЩИЕ ПЛАШКИ "НОВЫЙ ЗАКАЗ НА САЙТЕ" ---
function initLiveOrderToasts() {
  const recentOrders = [
    { game: 'Roblox', item: '1,000 Robux', price: '649 ₽' },
    { game: 'Brawl Stars', item: 'Brawl Pass Plus', price: '990 ₽' },
    { game: 'Genshin Impact', item: 'Полая луна (UID)', price: '399 ₽' },
    { game: 'CS2', item: 'AK-47 | Азимов (FT)', price: '6,400 ₽' },
    { game: 'Steam', item: 'Пополнение 1,000 ₽', price: '1,080 ₽' }
  ];

  const toastContainer = document.getElementById('magic-toast-container');
  if (!toastContainer) return;

  function spawnRandomToast() {
    const order = recentOrders[Math.floor(Math.random() * recentOrders.length)];
    
    const toast = document.createElement('div');
    toast.className = 'magic-order-toast';
    toast.innerHTML = \`
      <div class="toast-glow-ring"></div>
      <div class="toast-icon">✨</div>
      <div class="toast-body">
        <span class="toast-title">Новый заказ на MagicPlay!</span>
        <span class="toast-desc"><strong>\${order.game}</strong>: \${order.item} за <strong>\${order.price}</strong></span>
      </div>
    \`;

    toastContainer.appendChild(toast);

    // Анимация входа
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    // Авто-удаление через 4 секунды
    setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Запуск с интервалом от 6 до 12 секунд
  setInterval(spawnRandomToast, 8000);
}

// Автозапуск при готовности DOM
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  animateCounter('live-orders-counter', 142850, 2200);
  initLiveOrderToasts();
});`
};
