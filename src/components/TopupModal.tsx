import React, { useState } from 'react';
import { X, Wallet, CheckCircle2, CreditCard, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopupModalProps {
  currentBalance: number;
  onClose: () => void;
  onTopup: (amount: number) => void;
}

export const TopupModal: React.FC<TopupModalProps> = ({ currentBalance, onClose, onTopup }) => {
  const { user, topupBalance } = useAuth();
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState<'sbp' | 'card'>('sbp');
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const presets = ['300', '500', '1000', '2500', '5000'];

  const handlePay = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('Требуется авторизация.');
      }
      await topupBalance(val);
      onTopup(val);
      setIsDone(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      console.error('Topup error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#131720] border border-white/[0.08] shadow-2xl p-5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">
              Пополнение баланса
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white">Баланс пополнен!</h4>
            <p className="text-xs text-slate-400 font-mono">
              +{amount} ₽ зачислено на ваш счет
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4 text-xs">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-slate-400">Текущий баланс:</span>
              <span className="text-base font-bold text-white font-mono">
                {currentBalance.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {/* Amount Presets */}
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">
                Сумма (₽)
              </label>
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`py-1.5 rounded-lg font-mono font-semibold text-xs transition-colors cursor-pointer ${
                      amount === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0b0e14] text-slate-300 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Другая сумма..."
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">
                Способ оплаты
              </label>
              <div className="space-y-1.5">
                <div 
                  onClick={() => setMethod('sbp')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    method === 'sbp' ? 'bg-blue-600/10 border-blue-500/50' : 'bg-[#0b0e14] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-white">СБП (Система быстрых платежей)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">0%</span>
                </div>

                <div 
                  onClick={() => setMethod('card')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    method === 'card' ? 'bg-blue-600/10 border-blue-500/50' : 'bg-[#0b0e14] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-white">Банковская карта (МИР / РФ)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Без комиссии</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handlePay}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Зачисление...' : `Пополнить на ${amount || 0} ₽`}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
