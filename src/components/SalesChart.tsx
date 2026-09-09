import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';

export interface DaySalesStat {
  date: string;       // e.g. "03.09" or "3 мар"
  dayName: string;    // e.g. "Ср", "Чт"
  deals: number;      // e.g. 3
  revenue: number;    // e.g. 3400 (₽)
}

interface SalesChartProps {
  data: DaySalesStat[];
  title?: string;
  subtitle?: string;
  currencySymbol?: string;
  className?: string;
  highlightPriority?: string;
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  title = 'Динамика продаж (7 дней)',
  subtitle = 'Статистика выполненных сделок и полученных средств',
  currencySymbol = '₽',
  className = '',
  highlightPriority
}) => {
  const [activeMetric, setActiveMetric] = useState<'both' | 'revenue' | 'deals'>('both');

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalDeals = data.reduce((acc, curr) => acc + curr.deals, 0);
  const averageDeal = totalDeals > 0 ? Math.round(totalRevenue / totalDeals) : 0;
  const bestDay = [...data].sort((a, b) => b.revenue - a.revenue)[0];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#131720]/95 border border-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-2xl text-xs font-sans">
          <div className="text-slate-400 font-medium mb-1.5 flex items-center justify-between gap-3 border-b border-white/10 pb-1">
            <span>{label}</span>
            <span className="text-[10px] text-blue-400 font-mono">7 дней</span>
          </div>
          {payload.map((entry: any, index: number) => {
            const isRevenue = entry.dataKey === 'revenue';
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{isRevenue ? 'Заработано' : 'Сделок'}</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {isRevenue
                    ? `${entry.value.toLocaleString('ru-RU')} ${currencySymbol}`
                    : `${entry.value} шт.`}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-[#131720] border border-white/[0.08] ${className}`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>{title}</span>
            </h3>
            {highlightPriority && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                {highlightPriority}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* View Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-[#0b0e14] border border-white/[0.06] text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMetric === 'both'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Все
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('revenue')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMetric === 'revenue'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Выручка
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('deals')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMetric === 'deals'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Сделки
          </button>
        </div>
      </div>

      {/* 4 Mini Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
        <div className="p-3 rounded-xl bg-[#0b0e14]/60 border border-white/[0.06]">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-blue-400" />
            <span>Выручка (7д)</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono mt-1">
            {totalRevenue.toLocaleString('ru-RU')} {currencySymbol}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e14]/60 border border-white/[0.06]">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-emerald-400" />
            <span>Выполнено</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">
            {totalDeals} сделок
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e14]/60 border border-white/[0.06]">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-amber-400" />
            <span>Средний чек</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono mt-1">
            {averageDeal.toLocaleString('ru-RU')} {currencySymbol}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e14]/60 border border-white/[0.06]">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <span>Пик продаж</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-200 truncate mt-1">
            {bestDay?.date || '—'} ({bestDay?.deals || 0} сд.)
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#ffffff15' }}
            />

            {/* Left Y-Axis for Revenue */}
            {(activeMetric === 'both' || activeMetric === 'revenue') && (
              <YAxis
                yAxisId="revenue"
                stroke="#3b82f6"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${Math.round(val / 1000)}k` : `${val}`)}
              />
            )}

            {/* Right Y-Axis for Deals */}
            {(activeMetric === 'both' || activeMetric === 'deals') && (
              <YAxis
                yAxisId="deals"
                orientation="right"
                stroke="#10b981"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tickFormatter={(val) => `${val}`}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              formatter={(value) => (
                <span className="text-slate-300 mr-2">
                  {value === 'revenue' ? 'Заработок (₽)' : 'Количество сделок'}
                </span>
              )}
            />

            {(activeMetric === 'both' || activeMetric === 'revenue') && (
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 5, stroke: '#60a5fa', strokeWidth: 2 }}
              />
            )}

            {(activeMetric === 'both' || activeMetric === 'deals') && (
              <Line
                yAxisId="deals"
                type="monotone"
                dataKey="deals"
                name="deals"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#10b981', stroke: '#0b0e14', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#34d399', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
