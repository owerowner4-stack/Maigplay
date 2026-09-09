import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Key,
  Check,
  Ban,
  Clock,
  ExternalLink,
  DollarSign,
  Gamepad2,
  LogOut,
  Zap,
  Filter,
  Eye,
  FileWarning
} from 'lucide-react';
import {
  loadStoredModerators,
  loadStoredQueue,
  saveStoredQueue,
  getActiveModeratorSession,
  setModeratorSession,
  ModeratorAccount,
  ModerationQueueItem,
  PriorityCountry
} from '../data/adminStore';

interface ModeratorPanelModalProps {
  onClose: () => void;
  onOpenAdminPanel?: () => void;
}

export const ModeratorPanelModal: React.FC<ModeratorPanelModalProps> = ({
  onClose,
  onOpenAdminPanel
}) => {
  const [activeModerator, setActiveModerator] = useState<ModeratorAccount | null>(() => getActiveModeratorSession());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Queue state
  const [queue, setQueue] = useState<ModerationQueueItem[]>(() => loadStoredQueue());
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<'ALL' | PriorityCountry>('ALL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const moderatorsList = loadStoredModerators();

  // Login handler
  const handleModeratorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    const matchedMod = moderatorsList.find(
      (m) => m.email.toLowerCase() === cleanEmail && m.password === cleanPass
    );

    if (!matchedMod) {
      setAuthError('Неверный логин или пароль модератора. Убедитесь, что администратор выдал вам доступ в админ-панели.');
      return;
    }

    if (!matchedMod.isActive) {
      setAuthError('Ваш аккаунт модератора временно приостановлен администратором.');
      return;
    }

    setActiveModerator(matchedMod);
    setModeratorSession(matchedMod);
    setAuthError(null);
  };

  const handleModeratorLogout = () => {
    setModeratorSession(null);
    setActiveModerator(null);
    setEmailInput('');
    setPasswordInput('');
  };

  // Moderation anti-fraud action
  const handleAction = (ticketId: string, action: 'resolved_clean' | 'fraud_blocked' | 'warned' | 'frozen') => {
    const updated = queue.map((t) =>
      t.id === ticketId ? { ...t, status: action } : t
    );
    setQueue(updated);
    saveStoredQueue(updated);

    const ticket = queue.find((t) => t.id === ticketId);
    const actionText =
      action === 'resolved_clean' ? 'проверен: нарушений и признаков обмана нет, Escrow разблокирован' :
      action === 'fraud_blocked' ? 'заблокирован за попытку обмана! Инициирован 100% возврат покупателю через Escrow/ХЦБ' :
      action === 'warned' ? 'вынесено официальное предупреждение за нарушение правил площадки' :
      'заморожен для детальной антифрод-экспертизы';

    setSuccessToast(`Инцидент #${ticketId} (${ticket?.sellerName || ''}): ${actionText}`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Sort queue strictly by priority: KZ (1) -> RU (2) -> US (3)
  const priorityOrder: Record<PriorityCountry, number> = {
    KZ: 1,
    RU: 2,
    US: 3
  };

  const sortedQueue = [...queue].sort((a, b) => {
    // First by status (pending first)
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;

    // Then strictly by Country Priority (KZ > RU > US)
    return priorityOrder[a.country] - priorityOrder[b.country];
  });

  const filteredQueue = sortedQueue.filter((item) => {
    if (selectedRegionFilter === 'ALL') return true;
    return item.country === selectedRegionFilter;
  });

  const pendingCount = queue.filter((i) => i.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] bg-[#131722] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Центр антифрода и контроля честности</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  ANTI-SCAM & ESCROW SHIELD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Мониторинг безопасности: защита от обмана, пресечение нарушений правил и арбитраж Escrow. Приоритет: 🇰🇿 KZ → 🇷🇺 RU → 🇺🇸 US
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In as Moderator */}
        {!activeModerator ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full my-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Вход для модератора</h3>
            <p className="text-xs text-slate-400 mb-6">
              Введите логин и пароль, выданные главным администратором в Админ-панели.
            </p>

            <form onSubmit={handleModeratorLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Рабочая почта модератора
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="mod.almaty@magicplay.io"
                    className="w-full bg-[#0b0e14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Пароль модератора
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0b0e14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sample credentials helper */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
                <div className="text-[11px] text-slate-400 mb-1">Тестовый доступ модератора:</div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">mod.almaty@magicplay.io</span>
                  <button
                    type="button"
                    onClick={() => setEmailInput('')}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    Заполнить (KZ #1)
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer mt-2"
              >
                Войти в кабинет модерации
              </button>
            </form>
          </div>
        ) : (
          /* Logged-in Moderator Interface */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {/* Moderator Status Bar */}
            <div className="p-4 rounded-xl bg-[#131720] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
                  {activeModerator.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">{activeModerator.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      Онлайн
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{activeModerator.email}</span>
                    <span>•</span>
                    <span className="text-blue-300 font-mono">
                      Назначен: {activeModerator.assignedRegion === 'KZ' ? '🇰🇿 Казахстан (№1)' :
                                activeModerator.assignedRegion === 'RU' ? '🇷🇺 Россия (№2)' :
                                activeModerator.assignedRegion === 'US' ? '🇺🇸 США (№3)' : 'Все регионы'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="px-3 py-1.5 rounded-lg bg-[#0b0e14] border border-white/[0.06] text-xs">
                  <span className="text-slate-400">На проверке: </span>
                  <strong className="text-amber-400 font-mono">{pendingCount}</strong>
                </div>

                <button
                  type="button"
                  onClick={handleModeratorLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Выйти</span>
                </button>
              </div>
            </div>

            {/* Notification Toast */}
            {successToast && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Region Priority Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Очередь по приоритету стран:</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSelectedRegionFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedRegionFilter === 'ALL'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  Все ({queue.length})
                </button>
                <button
                  onClick={() => setSelectedRegionFilter('KZ')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedRegionFilter === 'KZ'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇰🇿 Казахстан</span>
                  <span className="text-[10px] px-1 rounded bg-amber-400/20 text-amber-300">№1</span>
                </button>
                <button
                  onClick={() => setSelectedRegionFilter('RU')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedRegionFilter === 'RU'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇷🇺 Россия</span>
                  <span className="text-[10px] px-1 rounded bg-white/20 text-slate-300">№2</span>
                </button>
                <button
                  onClick={() => setSelectedRegionFilter('US')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedRegionFilter === 'US'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇺🇸 США</span>
                  <span className="text-[10px] px-1 rounded bg-white/20 text-slate-300">№3</span>
                </button>
              </div>
            </div>

            {/* Queue Items */}
            <div className="space-y-3">
              {filteredQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.status === 'pending' || item.status === 'frozen'
                      ? item.violationSeverity === 'critical'
                        ? 'bg-[#181014] border-red-500/50 shadow-sm'
                        : item.country === 'KZ'
                        ? 'bg-[#131720] border-emerald-500/40 shadow-sm'
                        : 'bg-[#131720] border-amber-500/30'
                      : 'bg-[#0e1118] border-white/[0.04] opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          item.country === 'KZ'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.country === 'RU'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-white/10 text-slate-300'
                        }`}>
                          {item.countryName}
                        </span>

                        <span className="text-xs font-mono text-slate-400">#{item.id}</span>

                        <span className="text-[11px] text-slate-500">{item.createdAt}</span>

                        {/* Incident Type Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                          item.type === 'fraud_attempt' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          item.type === 'offsite_scam' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          item.type === 'rule_violation' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          <FileWarning className="w-3 h-3" />
                          <span>
                            {item.type === 'fraud_attempt' ? 'Попытка обмана' :
                             item.type === 'offsite_scam' ? 'Увод сделки / Скам' :
                             item.type === 'rule_violation' ? 'Нарушение правил' :
                             'Escrow спор'}
                          </span>
                        </span>

                        {/* Severity */}
                        {item.violationSeverity && (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            item.violationSeverity === 'critical' ? 'bg-red-600 text-white' :
                            item.violationSeverity === 'high' ? 'bg-orange-600 text-white' :
                            'bg-amber-600/60 text-amber-100'
                          }`}>
                            {item.violationSeverity === 'critical' ? 'Угроза: Критическая' :
                             item.violationSeverity === 'high' ? 'Угроза: Высокая' : 'Угроза: Средняя'}
                          </span>
                        )}

                        {item.hcbTransactionId && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono">
                            Escrow ID: {item.hcbTransactionId}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                      </h4>

                      <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                        <span>Игра: <strong className="text-slate-200">{item.game}</strong></span>
                        <span>•</span>
                        <span>Продавец: <strong className="text-slate-200">{item.sellerName}</strong> ({item.sellerEmail})</span>
                        {item.buyerName && (
                          <>
                            <span>•</span>
                            <span>Покупатель: <strong className="text-emerald-300">{item.buyerName}</strong></span>
                          </>
                        )}
                        <span>•</span>
                        <span>Сумма в Escrow: <strong className="text-white font-mono">{item.price.toLocaleString('ru-RU')} ₽</strong></span>
                      </div>

                      {item.suspectedAction && (
                        <div className="text-xs font-mono text-red-300 bg-red-950/40 p-2 rounded-lg border border-red-500/30 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>Обнаружено нарушение: <strong>{item.suspectedAction}</strong></span>
                        </div>
                      )}

                      {item.reason && (
                        <div className="text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                          <strong>Данные антифрод-мониторинга:</strong> {item.reason}
                        </div>
                      )}
                    </div>

                    {/* Anti-Fraud Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 self-stretch sm:self-center mt-2 sm:mt-0">
                      {item.status === 'pending' || item.status === 'frozen' ? (
                        <>
                          <button
                            onClick={() => handleAction(item.id, 'resolved_clean')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="Нарушений и обмана не выявлено, Escrow шлюз подтверждает чистоту сделки"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Нарушений нет</span>
                          </button>

                          <button
                            onClick={() => handleAction(item.id, 'warned')}
                            className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="Вынести официальное предупреждение за нарушение правил"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Предупредить</span>
                          </button>

                          <button
                            onClick={() => handleAction(item.id, 'fraud_blocked')}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-red-600/20"
                            title="Зафиксирован обман: заморозка продавца и 100% возврат покупателю из Escrow"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Блок за обман + Возврат</span>
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${
                          item.status === 'resolved_clean' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          item.status === 'fraud_blocked' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          item.status === 'warned' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-white/10 text-slate-300'
                        }`}>
                          {item.status === 'resolved_clean' ? '🛡️ Чистая сделка (Escrow выплачен)' :
                           item.status === 'fraud_blocked' ? '⛔ Заблокирован за обман (Средства возвращены)' :
                           item.status === 'warned' ? '⚠️ Предупреждение вынесено' : '⏳ В обработке'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
