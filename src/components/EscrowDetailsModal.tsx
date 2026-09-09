import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface EscrowPartyDetails {
  accountNumber: string;
  fullName: string;
  iin: string;
  phoneNumber: string;
  signDate: string;
}

interface EscrowDetailsModalProps {
  productTitle: string;
  onSubmit: (details: {
    buyer: EscrowPartyDetails;
    seller: EscrowPartyDetails;
    city: string;
    dueDate: string;
  }) => void;
  onClose: () => void;
}

const emptyParty: EscrowPartyDetails = {
  accountNumber: '',
  fullName: '',
  iin: '',
  phoneNumber: '',
  signDate: new Date().toISOString().slice(0, 10)
};

export const EscrowDetailsModal: React.FC<EscrowDetailsModalProps> = ({
  productTitle,
  onSubmit,
  onClose
}) => {
  const [buyer, setBuyer] = useState<EscrowPartyDetails>(emptyParty);
  const [seller, setSeller] = useState<EscrowPartyDetails>(emptyParty);
  const [city, setCity] = useState('');
  const [dueDate, setDueDate] = useState('');

  const updateParty = (
    party: 'buyer' | 'seller',
    field: keyof EscrowPartyDetails,
    value: string
  ) => {
    const setter = party === 'buyer' ? setBuyer : setSeller;
    setter((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ buyer, seller, city, dueDate });
  };

  const partyFields: Array<{ key: keyof EscrowPartyDetails; label: string; type?: string }> = [
    { key: 'fullName', label: 'ФИО' },
    { key: 'iin', label: 'ИИН' },
    { key: 'accountNumber', label: 'Банковский счёт' },
    { key: 'phoneNumber', label: 'Телефон', type: 'tel' },
    { key: 'signDate', label: 'Дата подписи', type: 'date' }
  ];

  const renderParty = (
    title: string,
    party: 'buyer' | 'seller',
    values: EscrowPartyDetails
  ) => (
    <fieldset className="rounded-xl border border-white/[0.08] p-4">
      <legend className="px-2 text-sm font-semibold text-white">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {partyFields.map(({ key, label, type = 'text' }) => (
          <label key={key} className="text-xs text-slate-300">
            {label}
            <input
              required
              type={type}
              value={values[key]}
              onChange={(event) => updateParty(party, key, event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="relative w-full max-w-3xl space-y-4 rounded-2xl border border-white/[0.08] bg-[#131720] p-5 text-white shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <div className="pr-8">
          <h2 className="text-lg font-semibold">Реквизиты для escrow</h2>
          <p className="mt-1 text-xs text-slate-400">
            Данные нужны BCC для оформления сделки «{productTitle}». Они отправляются только на защищённый backend.
          </p>
        </div>
        {renderParty('Покупатель', 'buyer', buyer)}
        {renderParty('Продавец', 'seller', seller)}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-slate-300">
            Город
            <input required value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
          </label>
          <label className="text-xs text-slate-300">
            Срок сделки
            <input required type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
          </label>
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500">
          Продолжить оплату
        </button>
      </form>
    </div>
  );
};
