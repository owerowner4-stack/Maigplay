import React from 'react';
import { toast } from 'sonner';
import { ShieldCheck, MessageSquare, Wallet, CheckCircle2, Sparkles } from 'lucide-react';

interface FundsDeductedParams {
  amount: number;
  productTitle: string;
}

interface OrderAcceptedParams {
  orderId: string;
  productTitle: string;
  sellerName?: string;
}

interface MessageReceivedParams {
  senderName: string;
  text: string;
}

/**
 * Toast notification for 'Средства списаны'
 */
export function notifyFundsDeducted({ amount, productTitle }: FundsDeductedParams) {
  toast.custom((t) => (
    <div className="w-full max-w-sm rounded-2xl bg-[#131720]/95 backdrop-blur-xl border border-blue-500/30 p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-start gap-3 text-white transition-all">
      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
        <Wallet className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs sm:text-sm text-white">
            Средства списаны
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
            Escrow
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-snug truncate">
          −{amount.toLocaleString('ru-RU')} ₽ за «{productTitle}»
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Деньги заморожены до вашего подтверждения</span>
        </p>
      </div>
    </div>
  ), {
    duration: 4500
  });
}

/**
 * Toast notification for 'Заказ принят'
 */
export function notifyOrderAccepted({ orderId, productTitle, sellerName }: OrderAcceptedParams) {
  toast.custom((t) => (
    <div className="w-full max-w-sm rounded-2xl bg-[#131720]/95 backdrop-blur-xl border border-emerald-500/30 p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-start gap-3 text-white transition-all">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs sm:text-sm text-white">
            Заказ принят
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
            #{orderId}
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-snug truncate">
          {productTitle}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>{sellerName ? `Продавец ${sellerName} на связи` : 'Продавец готов к передаче в чате'}</span>
        </p>
      </div>
    </div>
  ), {
    duration: 4500
  });
}

/**
 * Toast notification for 'Сообщение получено'
 */
export function notifyMessageReceived({ senderName, text }: MessageReceivedParams) {
  toast.custom((t) => (
    <div className="w-full max-w-sm rounded-2xl bg-[#131720]/95 backdrop-blur-xl border border-purple-500/30 p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-start gap-3 text-white transition-all">
      <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
        <MessageSquare className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs sm:text-sm text-white">
            Сообщение получено
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
            {senderName}
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-snug line-clamp-2">
          «{text}»
        </p>
      </div>
    </div>
  ), {
    duration: 4000
  });
}
