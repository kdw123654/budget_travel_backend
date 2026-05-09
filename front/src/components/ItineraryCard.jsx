// src/components/ItineraryCard.jsx
import React from 'react';

const categoryIcons = {
  Stay: "🏨",
  Food: "🍝",
  Activity: "🎨"
};

const ItineraryCard = ({ name, addr, price, cat }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
      {/* 아이콘 영역 */}
      <div className="flex items-center justify-center w-14 h-14 bg-slate-50 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
        {categoryIcons[cat] || "📍"}
      </div>

      {/* 정보 영역 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            cat === 'Stay' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {cat.toUpperCase()}
          </span>
          <h3 className="font-bold text-slate-800 truncate">{name}</h3>
        </div>
        <p className="text-xs text-slate-400 truncate">{addr}</p>
      </div>

      {/* 가격 영역 */}
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-300">PRICE</p>
        <p className="text-md font-black text-indigo-900">
          {price.toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default ItineraryCard;