import React, { useState, useMemo } from 'react';
import axios from 'axios';

// 카테고리별 디자인 설정 (디자인과 동일한 색상)
const CAT_CONFIG = {
  Stay: { label: '숙소', tagColor: '#FFE78A', barColor: '#FFE78A', textColor: '#854D0E' },
  Food: { label: '식사', tagColor: '#4e5a88', barColor: '#4e5a88', textColor: '#FFFFFF' },
  Activity: { label: '활동', tagColor: '#A8E4C1', barColor: '#A8E4C1', textColor: '#064E3B' }
};

export default function CourseRecommendation({ userData, onBack, onConfirm }) {
  const API_BASE_URL = "http://localhost:8000";

  // 1. 상태 관리: 서버에서 받은 초기 예산을 기준으로 시작
  const [localBudgets, setLocalBudgets] = useState(userData?.cat_budgets || { Stay: 0, Food: 0, Activity: 0 });
  const [currentCourses, setCurrentCourses] = useState(userData?.recommendations || []);
  const [isLoading, setIsLoading] = useState(false);

  if (!userData) return <div className="p-20 text-center font-bold">데이터를 불러오는 중...</div>;

  // 2. 동적 총 예산 계산 (요청하신 대로 슬라이더 합계가 총 예산이 됨)
  const currentTotal = useMemo(() => {
    return Object.values(localBudgets).reduce((acc, cur) => acc + cur, 0);
  }, [localBudgets]);

  const handleSliderChange = (cat, value) => {
    setLocalBudgets(prev => ({ ...prev, [cat]: value }));
  };

  const handleReset = () => {
    setLocalBudgets(userData.cat_budgets);
  };

  // 3. 검색 핸들러 (사이드바 하단 버튼)
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/rebalance`, {
        location: userData.location,
        changed_cat: 'Stay', 
        new_value: localBudgets.Stay,
        total_budget: currentTotal,
        current_budgets: localBudgets
      });
      setCurrentCourses(response.data.recommendations || []);
    } catch (error) {
      console.error("재배분 실패:", error);
      alert("코스를 다시 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans text-[#03001A]">
      {/* --- 네비게이션바 --- */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-[#E5E7EB]">
        <div className="text-[20px] font-black text-[#4066E2]">얼마면돼?</div>
        <div className="flex gap-8 text-[14px] font-medium text-gray-500">
          <span className="cursor-pointer">home</span>
          <span className="cursor-pointer">Archive</span>
          <span className="cursor-pointer">trend</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-gray-600">my page</span>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* --- [왼쪽] 예산 사이드바 (디자인 image_91a9fa.png 반영) --- */}
        <aside className="w-[300px] bg-[#85A1FF] rounded-tr-[40px] p-8 flex flex-col text-white shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[20px] font-bold">예산</h2>
            <button onClick={onBack} className="text-xl font-light hover:rotate-90 transition-transform">✕</button>
          </div>

          {/* 슬라이더 영역 */}
          <div className="space-y-8 mb-10">
            {['Stay', 'Food', 'Activity'].map((cat) => (
              <div key={cat}>
                <div className="flex justify-between text-[14px] mb-2 font-semibold">
                  <span>{CAT_CONFIG[cat].label}</span>
                  <span>{localBudgets[cat].toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="500000" step="5000" 
                  value={localBudgets[cat]} 
                  onChange={(e) => handleSliderChange(cat, parseInt(e.target.value))}
                  className="w-full h-1 bg-white/40 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            ))}
          </div>

          {/* 총 예산 & 바 (디자인 포인트) */}
          <div className="mb-6">
            <div className="flex justify-between font-bold text-[17px] mb-1">
              <span>총 예산</span>
              <span>{currentTotal.toLocaleString()}원</span>
            </div>
            <div className="text-right text-[13px] opacity-80 mb-2">+원</div>
            {/* 비율 바 */}
            <div className="w-full h-2.5 bg-white/20 rounded-full flex overflow-hidden">
              {Object.keys(CAT_CONFIG).map(cat => (
                <div 
                  key={cat}
                  style={{ 
                    width: `${(localBudgets[cat] / (currentTotal || 1)) * 100}%`, 
                    backgroundColor: CAT_CONFIG[cat].barColor 
                  }} 
                />
              ))}
            </div>
          </div>

          {/* 초기화 버튼 */}
          <button 
            onClick={handleReset}
            className="w-full py-3 bg-white/90 text-[#4066E2] rounded-[12px] font-bold text-[14px] mb-auto shadow-sm"
          >
            초기화
          </button>

          {/* 검색 버튼 (사이드바 하단 위치 고정) */}
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full py-3.5 bg-white text-[#4066E2] rounded-[12px] font-black text-[16px] shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </aside>

        {/* --- [오른쪽] 추천 코스 메인 (이미지 리스트 반영) --- */}
        <main className="flex-1 p-12 overflow-y-auto bg-white">
          <h1 className="text-[32px] font-black mb-10">추천 코스</h1>

          <div className="space-y-4 mb-12 max-w-[850px]">
            {currentCourses.map((course, idx) => {
              const ui = CAT_CONFIG[course.cat] || { label: course.cat, tagColor: '#E5E7EB' };
              return (
                <div key={idx} className="bg-[#EEF2FF] rounded-[22px] p-6 flex justify-between items-center shadow-sm border border-transparent hover:border-[#85A1FF] transition-colors">
                  <div className="flex items-start gap-5">
                    {/* 카드 번호 */}
                    <div className="w-10 h-10 bg-white text-[#03001A] rounded-full flex items-center justify-center font-bold text-[16px] shadow-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-[#03001A] mb-1">{course.name}</h3>
                      <p className="text-gray-500 text-[13px] mb-3">{ui.label} · {course.addr || "성수동"}</p>
                      <span 
                        className="px-4 py-1 rounded-full text-[11px] font-bold shadow-sm" 
                        style={{ backgroundColor: ui.tagColor, color: ui.textColor || '#000' }}
                      >
                        {ui.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-[20px] font-black text-[#03001A]">
                    {course.price?.toLocaleString()}원
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- 하단 액션 버튼 (디자인과 동일) --- */}
          <div className="max-w-[850px] flex flex-col gap-3">
            <button 
              onClick={() => onConfirm(localBudgets, currentCourses)}
              className="w-full py-5 bg-gradient-to-r from-[#85A1FF] to-[#4066E2] text-white rounded-[16px] font-black text-[18px] shadow-lg hover:opacity-90 active:scale-[0.99] transition-all"
            >
              이 코스로 확정 →
            </button>
            <button 
              onClick={onBack}
              className="w-full py-5 bg-white border border-[#85A1FF] text-[#4066E2] rounded-[16px] font-bold text-[18px] hover:bg-[#F4F7FF] transition-all"
            >
              ← 뒤로
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}