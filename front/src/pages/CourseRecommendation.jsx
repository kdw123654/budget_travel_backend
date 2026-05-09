import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Map, Polyline, CustomOverlayMap } from "react-kakao-maps-sdk";


const CAT_CONFIG = {
  Stay: { label: '숙소', tagColor: '#FFE78A', barColor: '#FFE78A', textColor: '#854D0E' },
  Food: { label: '식사', tagColor: '#42548e', barColor: '#42548e', textColor: '#FFFFFF' },
  Activity: { label: '활동', tagColor: '#A8E4C1', barColor: '#A8E4C1', textColor: '#064E3B' }
};

export default function CourseRecommendation({ userData, onBack, onConfirm }) {
  const API_BASE_URL = "https://budget-travel-backend-fkum.onrender.com";

  const [localBudgets, setLocalBudgets] = useState(userData?.cat_budgets || { Stay: 0, Food: 0, Activity: 0 });
  const [currentCourses, setCurrentCourses] = useState(userData?.recommendations || []);
  const [isLoading, setIsLoading] = useState(false);

  const currentTotal = useMemo(() => {
    return Object.values(localBudgets).reduce((acc, cur) => acc + cur, 0);
  }, [localBudgets]);

  // --- 지도를 위한 좌표 데이터 계산 ---
  const linePath = useMemo(() => {
    return currentCourses.map(c => ({ lat: c.lat, lng: c.lng }));
  }, [currentCourses]);

  const handleSliderChange = (cat, value) => {
    setLocalBudgets(prev => ({ ...prev, [cat]: value }));
  };

  const handleReset = () => {
    setLocalBudgets(userData.cat_budgets);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const payload = {
        location: userData.location,
        total_budget: Number(currentTotal),
        current_budgets: {
          Stay: Number(localBudgets.Stay),
          Food: Number(localBudgets.Food),
          Activity: Number(localBudgets.Activity)
        },
        changed_cat: "Stay",
        new_value: Number(localBudgets.Stay)
      };

      const response = await axios.post(`${API_BASE_URL}/rebalance`, payload);
      if (response.data && response.data.recommendations) {
        setCurrentCourses(response.data.recommendations);
      }
    } catch (error) {
      console.error("검색 실패:", error);
      alert("코스를 다시 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col font-sans text-[#03001A]">
      {/*  로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#4066E2] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-black text-[#4066E2] mb-2 animate-pulse">AI 분석 중...</h2>
            <div className="w-64 h-1.5 bg-gray-200 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-[#4066E2] animate-[loading_3s_ease-in-out]"></div>
            </div>
          </div>
        </div>
      )}

      {/* --- 네비게이션바 --- */}
<nav className="flex justify-between items-center px-10 py-6 border-b border-[#E5E7EB] shrink-0">
        <div className="text-[20px] font-black text-[#4066E2]">얼마면돼?</div>
        <div className="flex gap-8 text-[14px] font-medium text-gray-500">
          <span>home</span><span>Archive</span><span>trend</span>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* [왼쪽] 예산 사이드바 */}
        <aside className="w-[300px] bg-[#85A1FF] rounded-tr-[40px] p-8 flex flex-col text-white shadow-xl z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[20px] font-bold">예산</h2>
            <button onClick={onBack} className="text-xl font-light hover:scale-110 transition-transform">✕</button>
          </div>

          <div className="space-y-7 mb-8">
            {['Stay', 'Food', 'Activity'].map((cat) => (
              <div key={cat}>
                <div className="flex justify-between text-[14px] mb-2 font-semibold">
                  <span>{CAT_CONFIG[cat].label}</span>
                  <span>{localBudgets[cat].toLocaleString()}원</span>
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

          <div className="mb-10">
            <div className="flex justify-between font-bold text-[17px] mb-3">
              <span>총 예산</span>
              <span>{currentTotal.toLocaleString()}원</span>
            </div>
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

          <div className="flex flex-col gap-3">
            <button onClick={handleReset} className="w-full py-3 bg-white/20 border border-white/50 text-white rounded-[12px] font-bold text-[14px] hover:bg-white/30 transition-colors">초기화</button>
            <button onClick={handleSearch} className="w-full py-4 bg-white text-[#4066E2] rounded-[12px] font-black text-[16px] shadow-lg active:scale-95 transition-all hover:bg-gray-50">검색</button>
          </div>
        </aside>

        {/* [중앙] 추천 코스 리스트 (60%) */}
        <main className="w-[calc(100%-300px-40%)] p-10 overflow-y-auto bg-white border-r border-gray-100">
          <h1 className="text-[32px] font-black mb-10 tracking-tight">추천 코스</h1>
          <div className="space-y-4 mb-12">
            {currentCourses.map((course, idx) => {
              const ui = CAT_CONFIG[course.cat] || { label: course.cat, tagColor: '#E5E7EB' };
              const searchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(course.name)}`;
              return (
                <div key={idx} onClick={() => window.open(searchUrl, '_blank')} className="bg-[#EEF2FF] rounded-[22px] p-6 flex justify-between items-center shadow-sm hover:shadow-md hover:bg-[#E0E7FF] transition-all cursor-pointer group"
                        title="클릭하면 상세 정보를 확인합니다">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-white text-[#03001A] rounded-full flex items-center justify-center font-bold text-[16px] shadow-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-[#03001A] mb-1">{course.name}</h3>
                      <span className="text-[12px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">🔗</span>
                      <p className="text-gray-500 text-[13px] mb-3">{ui.label} · {course.addr}</p>
                      <span className="px-4 py-1 rounded-full text-[11px] font-bold shadow-sm" style={{ backgroundColor: ui.tagColor, color: ui.textColor }}>
                        {ui.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-[20px] font-black text-[#03001A]">{course.price?.toLocaleString()}원</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button onClick={() => onConfirm(localBudgets, currentCourses)} className="w-full py-5 bg-gradient-to-r from-[#85A1FF] to-[#4066E2] text-white rounded-[16px] font-black text-[18px] shadow-xl hover:opacity-90 transition-all">이 코스로 확정 →</button>
            <button onClick={onBack} className="w-full py-5 bg-white border border-[#85A1FF] text-[#4066E2] rounded-[16px] font-bold text-[18px]">← 뒤로</button>
          </div>
        </main>

        {/* [오른쪽] 실시간 지도 (40%) */}
        <section style={{ 
            position: 'relative', 
            width: '40%',       
            height: '110vh', 
            minHeight: '500px' 
        }}>
          <Map 
            center={linePath[0] || { lat: 37.5446, lng: 127.0560 }} 
            style={{ width: "80%", height: "100%" }} 
            level={4}
          >
            {/* 1. 경로 선 (Polyline) */}
            <Polyline
              path={[linePath]}
              strokeWeight={5}
              strokeColor={"#4066E2"}
              strokeOpacity={0.7}
              strokeStyle={"solid"}
            />

{currentCourses.map((course, index) => {
  // CAT_CONFIG에서 해당 카테고리의 색상 정보 가져오기
  const ui = CAT_CONFIG[course.cat] || { tagColor: '#4066E2', textColor: '#FFFFFF' };
  const searchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(course.name)}`;
  return (
    <CustomOverlayMap 
      key={index} 
      position={{ lat: course.lat, lng: course.lng }}
      yAnchor={1} 
    >
      {/* 마커 디자인 시작 */}
      <div className="flex flex-col items-center">
        {/* 숫자와 이름이 들어간 유색 말풍선 */}
        <div 
          className="px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center justify-center gap-1.5 transition-transform hover:scale-110"
          style={{ backgroundColor: ui.tagColor, color: ui.textColor }}
        >
          <span className="text-[12px] font-extrabold">{index + 1}</span>
          <span className="text-[11px] font-bold whitespace-nowrap">{course.name}</span>
        </div>
        
        {/* 말풍선 꼬리 (삼각형) */}
        <div 
          className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[1px]"
          style={{ borderTopColor: ui.tagColor }}
        ></div>
      </div>
    </CustomOverlayMap>
  );
})}
          </Map>
          
          {/* 지도 위 안내 배지 */}
          <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-[#85A1FF]">
            <span className="text-[12px] font-bold text-[#4066E2]">📍 AI 최적 루트 추천</span>
          </div>
        </section>
      </div>
    </div>
  );
}