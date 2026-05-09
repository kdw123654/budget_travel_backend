// src/pages/RecommendationPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import ItineraryCard from '../components/ItineraryCard';

const RecommendationPage = ({ data }) => {
  // data: 백엔드에서 받은 전체 JSON 응답
  const [activeTab, setActiveTab] = useState('Stay');

  const categories = ['Stay', 'Food', 'Activity'];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24">
      <Header title={`${data.location} 여행 일정`} budget={data.total_budget} />

      <main className="p-5">
        {/* 카테고리 탭 */}
        <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === cat 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 리스트 출력 */}
        <div className="space-y-3">
          {data.recommendations
            .filter(item => item.cat === activeTab)
            .map((item, idx) => (
              <ItineraryCard key={idx} {...item} />
            ))
          }
          {data.recommendations.filter(item => item.cat === activeTab).length === 0 && (
            <p className="text-center py-10 text-slate-400 text-sm italic font-medium">
              이 예산으로는 갈 수 있는 {activeTab}가 없어요.. 🥲
            </p>
          )}
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent max-w-md mx-auto">
        <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
          최종 일정 확정하기 🧾
        </button>
      </div>
    </div>
  );
};

export default RecommendationPage;