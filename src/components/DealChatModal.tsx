import React, { useState, useEffect, useRef } from 'react';
import { Product, ChatMessage } from '../types';
import { 
  X, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Star
} from 'lucide-react';
import { 
  subscribeToOrderMessages, 
  sendOrderMessage, 
  updateOrderStatus 
} from '../lib/firestoreService';
import { useAuth } from '../context/AuthContext';
import { notifyMessageReceived } from '../lib/toastNotifications';
import { addSellerReview } from '../data/reviewsStore';
import { toast } from 'sonner';

interface DealChatModalProps {
  product: Product;
  orderId?: string;
  onClose: () => void;
  onCompleteDeal: (orderId: string) => void;
}

export const DealChatModal: React.FC<DealChatModalProps> = ({
  product,
  orderId: initialOrderId,
  onClose,
  onCompleteDeal
}) => {
  const { user } = useAuth();
  const [orderId] = useState<string>(
    initialOrderId || `MP-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [dealStatus, setDealStatus] = useState<'paid' | 'transferring' | 'checking' | 'completed'>('paid');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialListenerRef = useRef(true);
  const lastNotifiedMsgIdRef = useRef<string | null>(null);

  const platformCommissionRate = 0.10; // 10% комиссия сервиса
  const platformFee = Math.round(product.price * platformCommissionRate);
  const sellerPayout = product.price - platformFee;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Real-time Firestore messages listener
  useEffect(() => {
    const unsubscribe = subscribeToOrderMessages(orderId, (firestoreMsgs) => {
      if (firestoreMsgs && firestoreMsgs.length > 0) {
        if (!isInitialListenerRef.current) {
          const lastMsg = firestoreMsgs[firestoreMsgs.length - 1];
          if (lastMsg && lastMsg.sender === 'seller' && lastMsg.id !== lastNotifiedMsgIdRef.current) {
            lastNotifiedMsgIdRef.current = lastMsg.id;
            notifyMessageReceived({
              senderName: product.seller.name,
              text: lastMsg.text
            });
          }
        }
        isInitialListenerRef.current = false;
        setMessages(firestoreMsgs);
      } else {
        setMessages([
          {
            id: 'sys-init',
            sender: 'system',
            text: `Заказ #${orderId} на сумму ${product.price} ₽ оплачен. Средства заморожены на счете гаранта Escrow.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystemNotice: true
          },
          {
            id: 'seller-init',
            sender: 'seller',
            text: `Здравствуйте! Спасибо за заказ "${product.title}". Отправьте, пожалуйста, данные для передачи (UID / никнейм). Я готов к выдаче!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystemNotice: false
          }
        ]);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId, product]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSellerTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    if (dealStatus === 'paid') {
      setDealStatus('transferring');
      updateOrderStatus(orderId, 'transferring').catch(console.error);
    }

    try {
      await sendOrderMessage(orderId, {
        sender: 'buyer',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'buyer',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, newMsg]);
    }

    setDealStatus('transferring');
  };

  const handleConfirmReceipt = async () => {
    try {
      await updateOrderStatus(orderId, 'completed');
      setDealStatus('completed');
    } catch (err) {
      console.error('Error completing deal:', err);
    }

    toast.error('Выплата выполняется escrow-сервером после проверки.', {
      description: 'Клиент не может самостоятельно завершить сделку или начислить баланс.'
    });
  };

  const handleOpenDispute = async () => {
    setIsDisputeOpen(true);
    try {
      await sendOrderMessage(orderId, {
        sender: 'system',
        text: 'Внимание: Покупатель открыл спор. Арбитраж площадки подключился к диалогу. Продавец и покупатель могут предоставить скриншоты.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystemNotice: true
      });
    } catch (err) {
      console.error('Error opening dispute:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-3xl h-[88vh] max-h-[720px] rounded-2xl bg-[#131720] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.06] bg-[#131720] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-9 h-9 rounded-full object-cover border border-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">
                  {product.seller.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  #{orderId}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                {product.title} • <span className="font-semibold text-white font-mono">{product.price} ₽</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="px-4 py-2 bg-[#0d1017] border-b border-white/[0.06] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <span>✓</span>
            <span>1. Оплачено</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-1 font-medium ${dealStatus !== 'paid' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <span>{dealStatus !== 'paid' ? '✓' : '2.'}</span>
            <span>2. Передача</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-1 font-medium ${dealStatus === 'checking' || dealStatus === 'completed' ? 'text-blue-400' : 'text-slate-400'}`}>
            <span>{dealStatus === 'completed' ? '✓' : '3.'}</span>
            <span>3. Проверка</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-1 font-medium ${dealStatus === 'completed' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span>{dealStatus === 'completed' ? '✓' : '4.'}</span>
            <span>4. Завершено</span>
          </div>
        </div>

        {/* Escrow Financial Details & Commission Breakdown */}
        <div className="px-4 py-2 bg-[#10141d] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] sm:text-xs">
            <span className="text-slate-400">Гарант Escrow:</span>
            <span className="font-mono text-white font-semibold">{product.price.toLocaleString('ru-RU')} ₽</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Комиссия (10%):</span>
            <span className="font-mono text-amber-400">−{platformFee} ₽</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">К выплате продавцу:</span>
            <span className="font-mono text-emerald-400 font-semibold">+{sellerPayout.toLocaleString('ru-RU')} ₽</span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
            dealStatus === 'completed'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
          }`}>
            {dealStatus === 'completed' ? 'Выплачено продавцу' : 'Заморожено на депозите'}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#0b0e14]">
          {messages.map((msg) => {
            if (msg.isSystemNotice) {
              return (
                <div key={msg.id} className="flex justify-center my-1.5">
                  <div className="max-w-md text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300">
                    <div className="flex items-center justify-center gap-1.5 font-medium text-blue-400 mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Системное сообщение</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] text-slate-500 mt-0.5 block">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            const isBuyer = msg.sender === 'buyer';

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isBuyer ? 'justify-end' : 'justify-start'}`}
              >
                {!isBuyer && (
                  <img 
                    src={product.seller.avatar} 
                    alt={product.seller.name} 
                    className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0 mb-1" 
                  />
                )}

                <div className={`max-w-xs sm:max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                  isBuyer 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#181d27] border border-white/[0.06] text-slate-200'
                }`}>
                  <p>{msg.text}</p>
                  <div className={`text-[10px] mt-1 text-right ${isBuyer ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isBuyer && user && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0 mb-1"
                  />
                )}
              </div>
            );
          })}

          {isSellerTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-8">
              <span>{product.seller.name} печатает ответ...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Bar Above Input */}
        <div className="px-4 py-2 bg-[#131720] border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setInputText('Данные отправил, проверьте пожалуйста.')}
              className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Отправил данные
            </button>
            <button
              type="button"
              onClick={() => setInputText('Все пришло, спасибо!')}
              className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Все получил
            </button>
            {!isDisputeOpen && (
              <button
                type="button"
                onClick={handleOpenDispute}
                className="px-2 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-[11px] text-red-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Спор</span>
              </button>
            )}
          </div>

          {dealStatus !== 'completed' ? (
            <button
              type="button"
              onClick={handleConfirmReceipt}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Подтвердить получение</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Сделка завершена</span>
            </span>
          )}
        </div>

        {/* Completed Deal Rating Prompt */}
        {dealStatus === 'completed' && !hasSubmittedReview && (
          <div className="p-3 bg-[#101520] border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Оцените продавца:</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRatingScore(s)}
                    className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        s <= ratingScore 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-slate-700 text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Короткий отзыв (необязательно)..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="bg-[#0b0e14] border border-white/[0.08] focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none flex-1 sm:w-56"
              />
              <button
                type="button"
                onClick={() => {
                  addSellerReview({
                    sellerId: product.seller.id,
                    authorName: user?.displayName || 'Покупатель MagicPlay',
                    authorAvatar: user?.photoURL || undefined,
                    rating: ratingScore,
                    text: ratingComment.trim() || 'Товар проверен, сделка завершена без задержек. Отличный продавец!',
                    itemTitle: product.title,
                    price: product.price,
                    dealVerified: true
                  });
                  setHasSubmittedReview(true);
                  toast.success('Спасибо за отзыв!', {
                    description: `Ваша оценка (${ratingScore}★) добавлена к рейтингу продавца.`
                  });
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
              >
                Отправить
              </button>
            </div>
          </div>
        )}

        {dealStatus === 'completed' && hasSubmittedReview && (
          <div className="px-3 py-2 bg-emerald-500/10 border-t border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
            <span>✓ Спасибо за ваш отзыв! Рейтинг продавца обновлен.</span>
          </div>
        )}

        {/* Message Input Box */}
        <div className="p-3 bg-[#131720] border-t border-white/[0.06]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишите продавцу (логин, ссылка, вопрос)..."
              className="flex-1 bg-[#0b0e14] border border-white/[0.08] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
