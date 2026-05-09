// src/components/Header.jsx
import React from 'react';

const Header = ({ title, budget }) => {
  return (
    <header className="flex items-center justify-between p-5 bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{title}</h1>
        <h2 className="text-xl font-extrabold text-slate-900">오늘 뭐 해?</h2>
      </div>

      <div className="flex items-center gap-3">
        {budget && (
          <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-[10px] text-indigo-400 font-bold leading-none mb-1">TOTAL BUDGET</p>
            <p className="text-sm font-black text-indigo-900 leading-none">
              {budget.toLocaleString()}원
            </p>
          </div>
        )}
        <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="user" />
        </div>
      </div>
    </header>
  );
};

export default Header;