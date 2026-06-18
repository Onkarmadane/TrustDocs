import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-white mb-2">{payload[0].payload.name}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-[10px] text-slate-300">
                <span className="font-semibold text-white">{entry.value}</span> {entry.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ReportChart = ({ data = [] }) => {
  return (
    <Card className="p-4 md:p-8 h-[400px] bg-white border-slate-100 shadow-sm relative overflow-hidden">
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      <div className="h-[300px] w-full relative z-10 mt-4">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            No report history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDraft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
              <Area
                type="monotone"
                dataKey="created"
                name="Created Reports"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCreated)"
              />
              <Area
                type="monotone"
                dataKey="draft"
                name="Draft Reports"
                stroke="#94a3b8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDraft)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default ReportChart;
