import React from 'react';
import PendingImg from '../assets/icons/Pending.webp';
import DeliveredImg from '../assets/icons/Delivered.webp';
import CancelledImg from '../assets/icons/Cancelled.webp';
import { TrendingUp, TrendingDown } from 'lucide-react';

const iconsMap = {
  Pending: PendingImg,
  Delivered: DeliveredImg,
  Cancelled: CancelledImg,
  cash: PendingImg,
  confirmed: PendingImg
};

const StatCard = ({ title, value, change, state, bgClass = "bg-white/95" }) => {
  const isPositive = change?.startsWith('+');
  const IconImage = iconsMap[state];

  return (
    <div className={`${bgClass} rounded-[24px] shadow-lg p-6 hover:shadow-xl transition-all border border-[#1B4332]/10 flex flex-col items-center justify-center text-center`}>
      {IconImage && (
        <div className="w-[50px] h-[50px] mb-3 flex items-center justify-center">
          <img loading="lazy" decoding="async" src={IconImage} alt={state} className="w-full h-full object-contain" />
        </div>
      )}
      <span className="text-[28px] font-black text-[#1B4332] leading-none mb-1">{value}</span>
      <p className="text-[13px] font-bold text-[#1A1A1A]/70 uppercase tracking-wide">{title}</p>
      {change && (
        <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
