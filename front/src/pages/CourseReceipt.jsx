import React from 'react';

export default function CourseReceipt({ userData, finalBudgets, finalCourses, onRestart, onShare }) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;

  // 1. 실제 코스 금액의 총합 계산 (TOTAL에 표시될 금액)
  const actualTotal = finalCourses.reduce((sum, course) => sum + (course.price || 0), 0);
  
  // 2. 절약 금액 계산 (예산 - 실제 총합)
  const savedAmount = userData.total_budget - actualTotal;

  // 카테고리 색상 설정
  const catConfig = {
    Stay: { label: '숙소', barColor: '#FDE047' },
    Food: { label: '식사', barColor: '#60A5FA' },
    Activity: { label: '활동', barColor: '#6EE7B7' }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#03001A]">
      <nav className="flex justify-between items-center px-10 py-6 border-b border-[#E5E7EB] bg-white">
        <div className="text-[24px] font-black text-[#4066E2]">얼마면돼?</div>
        <div className="flex gap-8 text-[15px] font-medium text-gray-500">
          <span className="cursor-pointer hover:text-black">home</span>
          <span className="cursor-pointer hover:text-black">Archive</span>
          <span className="cursor-pointer hover:text-black">trend</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium">my page</span>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[320px] bg-[#85A1FF] rounded-tr-[50px] p-8 flex flex-col text-white shadow-xl z-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[22px] font-bold">예산</h2>
            <button onClick={onRestart} className="text-2xl font-light hover:scale-110 transition-transform">✕</button>
          </div>

          <div className="space-y-8">
            {['Stay', 'Food', 'Activity'].map((cat) => (
              <div key={cat}>
                <div className="flex justify-between text-[15px] mb-2 font-medium">
                  <span>{catConfig[cat].label}</span>
                  <span>{finalBudgets[cat]?.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max={userData.total_budget} value={finalBudgets[cat]} readOnly
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none pointer-events-none accent-white"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 mb-4">
            <div className="flex justify-between font-bold text-[18px] mb-2">
              <span>총 예산</span>
              <span>{userData.total_budget.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between font-bold text-[16px] text-white/80">
              <span>잔액</span>
              {/* 잔액이 플러스면 +, 마이너스면 그대로 표시 */}
              <span>{savedAmount >= 0 ? `+${savedAmount.toLocaleString()}` : savedAmount.toLocaleString()}원</span>
            </div>
          </div>

          <div className="w-full h-3 bg-white/20 rounded-full flex overflow-hidden">
            <div style={{ width: `${(finalBudgets.Stay / userData.total_budget) * 100}%`, backgroundColor: catConfig.Stay.barColor }} />
            <div style={{ width: `${(finalBudgets.Food / userData.total_budget) * 100}%`, backgroundColor: catConfig.Food.barColor }} />
            <div style={{ width: `${(finalBudgets.Activity / userData.total_budget) * 100}%`, backgroundColor: catConfig.Activity.barColor }} />
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center p-10 overflow-y-auto bg-white">
          <div className="w-[450px] bg-[#EEF2FF] p-10 flex flex-col relative shadow-[10px_10px_0px_0px_rgba(209,213,219,1)]">
            <div className="text-center mb-6">
              <h1 className="text-[40px] font-black text-[#2A3A8A] tracking-tight mb-2">얼마면 돼?</h1>
              <p className="text-[#6B7280] text-[14px]">{formattedDate}</p>
              <p className="text-[#6B7280] text-[14px]">{userData.location} 코스</p>
            </div>

            <hr className="border-t-2 border-dashed border-[#A7B8E6] my-6" />

            <div className="space-y-4">
              {finalCourses.map((course, idx) => (
                <div key={idx} className="flex justify-between text-[15px] font-bold text-[#03001A]">
                  <span className="truncate pr-4">{course.name}</span>
                  <span className="shrink-0">{course.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr className="border-t-2 border-dashed border-[#A7B8E6] my-6" />

            {/* 🚨 [수정된 TOTAL] 실제 코스 금액 합계 표시 */}
            <div className="flex justify-between items-center text-[22px] font-black mb-2">
              <span>TOTAL</span>
              <span className="text-[#4066E2]">{actualTotal.toLocaleString()}원</span>
            </div>

            {/* 🚨 [수정된 절약 금액] 예산 대비 차액 표시 */}
            <div className={`flex justify-between items-center text-[16px] font-bold ${savedAmount >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              <span>{savedAmount >= 0 ? '절약 금액' : '예산 초과'}</span>
              <span>{savedAmount >= 0 ? `+${savedAmount.toLocaleString()}` : savedAmount.toLocaleString()}원</span>
            </div>

            <div className="mt-10 text-center text-[#9CA3AF] text-[12px] font-mono tracking-widest leading-relaxed">
              ***************************<br/>
              THANK YOU FOR USING 얼마면돼?<br/>
              ***************************
            </div>
          </div>

          <div className="w-[450px] mt-12 flex flex-col gap-4">
            <button 
              onClick={() => alert("코스가 확정되었습니다!")}
              className="w-full py-5 bg-gradient-to-r from-[#85A1FF] to-[#4066E2] text-white rounded-[16px] font-black text-[18px] shadow-lg hover:opacity-90"
            >
              이 코스로 확정 →
            </button>
            <div className="flex gap-4">
              <button onClick={onShare} className="flex-1 py-4 bg-white border border-[#DBDBDB] text-[#03001A] rounded-[16px] font-bold text-[16px] hover:bg-gray-50">공유하기</button>
              <button onClick={onRestart} className="flex-1 py-4 bg-white border border-[#DBDBDB] text-[#03001A] rounded-[16px] font-bold text-[16px] hover:bg-gray-50">새 코스</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}