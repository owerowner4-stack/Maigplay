import React, { useState } from 'react';
import { X, ArrowDownRight, Smartphone, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawModalProps {
  currentBalance: number;
  onClose: () => void;
  onWithdraw: (amount: number, method: string, destination: string) => Promise<boolean> | boolean;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  currentBalance,
  onClose,
  onWithdraw
}) => {
  const [method, setMethod] = useState<'sbp' | 'card'>('sbp');
  const [amount, setAmount] = useState<string>(currentBalance > 0 ? Math.min(currentBalance, 1000).toString() : '500');
  const [destination, setDestination] = useState<string>('');
  const [bank, setBank] = useState<string>('Т-Банк (Тинькофф)');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const numericAmount = parseFloat(amount) || 0;
  const isBalanceSufficient = numericAmount > 0 && numericAmount <= currentBalance;
  const isValidDestination = destination.trim().length >= (method === 'sbp' ? 10 : 16);

  const handleQuickAmount = (val: number) => {
    setAmount(Math.min(val, currentBalance).toString());
  };

  const handleAllAmount = () => {
    setAmount(currentBalance.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanceSufficient || !isValidDestination || isProcessing) return;

    setIsProcessing(true);
    try {
      const success = await onWithdraw(
        numericAmount, 
        method === 'sbp' ? `СБП (${bank})` : 'Банковская карта',
        destination
      );

      if (success) {
        setIsSuccess(true);
        toast.success('Заявка на вывод создана', {
          description: `${numericAmount.toLocaleString('ru-RU')} ₽ отправлено на ${method === 'sbp' ? 'СБП' : 'карту'}. Средства поступят в течение нескольких минут.`
        });
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        toast.error('Ошибка вывода', {
          description: 'Недостаточно средств на балансе или ошибка транзакции.'
        });
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      toast.error('Произошла ошибка при обработке вывода');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#131720] border border-white/[0.08] shadow-2xl p-5 sm:p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Вывод средств</h3>
              <p className="text-xs text-slate-400">
                Доступно: <span className="font-semibold text-emerald-400 font-mono">{currentBalance.toLocaleString('ru-RU')} ₽</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Выплата отправлена</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {numericAmount.toLocaleString('ru-RU')} ₽ успешно списаны с баланса и переведены на {destination}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Method selection */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Способ выплаты</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('sbp');
                    setDestination('');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    method === 'sbp'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className={`w-4 h-4 ${method === 'sbp' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-semibold">СБП (0%)</div>
                    <div className="text-[10px] text-slate-400">Моментально</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('card');
                    setDestination('');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    method === 'card'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 ${method === 'card' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-semibold">Карта РФ</div>
                    <div className="text-[10px] text-slate-400">МИР, Visa, MC</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Destination inputs */}
            {method === 'sbp' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Банк получателя</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Т-Банк (Тинькофф)">Т-Банк (Тинькофф)</option>
                    <option value="Сбербанк">Сбербанк</option>
                    <option value="Альфа-Банк">Альфа-Банк</option>
                    <option value="ВТБ">ВТБ</option>
                    <option value="Райффайзенбанк">Райффайзенбанк</option>
                    <option value="Озон Банк">Озон Банк</option>
                    <option value="Яндекс Пэй">Яндекс Пэй</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Номер телефона получателя</label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Номер банковской карты</label>
                <input
                  type="text"
                  placeholder="2200 0000 0000 0000"
                  maxLength={19}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-white/[0.08] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>
            )}

            {/* Amount input */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="text-slate-400">Сумма вывода (₽)</label>
                <button
                  type="button"
                  onClick={handleAllAmount}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Вся сумма ({currentBalance} ₽)
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max={currentBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-white/[0.08] focus:border-emerald-500 rounded-xl pl-3 pr-10 py-2.5 text-sm font-bold text-white focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  ₽
                </span>
              </div>

              {/* Quick amount chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
                {[500, 1000, 2500, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    disabled={currentBalance < val}
                    onClick={() => handleQuickAmount(val)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none text-[11px] text-slate-300 transition-colors cursor-pointer"
                  >
                    {val} ₽
                  </button>
                ))}
              </div>

              {!isBalanceSufficient && numericAmount > currentBalance && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Сумма превышает ваш доступный баланс ({currentBalance} ₽)</span>
                </div>
              )}
            </div>

            {/* Calculation summary */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Комиссия за вывод:</span>
                <span className="text-emerald-400 font-medium">0% (бесплатно)</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-white/[0.04]">
                <span>Будет переведено:</span>
                <span className="text-white font-mono">{numericAmount > 0 ? numericAmount.toLocaleString('ru-RU') : 0} ₽</span>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                Средства получены от проверенных сделок Escrow и переводятся напрямую через Систему быстрых платежей ЦБ РФ.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isBalanceSufficient || !isValidDestination || isProcessing}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Обработка выплаты...</span>
              ) : (
                <span>Вывести {numericAmount > 0 ? `${numericAmount.toLocaleString('ru-RU')} ₽` : ''}</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
