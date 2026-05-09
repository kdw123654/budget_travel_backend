import React from 'react';

// 인기 키워드 데이터
const keywords = ["성수동 데이트", "20만원 한정", "가성비 맛집", "서울 핫플레이스", "50000원 이하", "혼자 여행"];

// 하단 기능 소개 데이터 (이미지 경로 포함)
const featureItems = [
  { 
    title: "입력 한 줄로 여행 계획 시작", 
    desc: "복잡한 설정 없이 지역과 예산을 한 줄로 입력하면 분석을 시작합니다.",
    img: "/images/feature1.svg" 
  },
  { 
    title: "여행 스타일을 먼저 정하세요", 
    desc: "숙소, 식사, 체험 중 무엇에 더 집중할지 결정하면 예산이 자동 배분됩니다.",
    img: "/images/feature2.svg" 
  },
  { 
    title: "예산 바꾸면 자동으로 다시 계산", 
    desc: "한 항목의 예산을 조정하면 전체 균형을 유지하며 다른 항목이 재계산됩니다.", 
    img: "/images/feature3.svg" 
  },
  { 
    title: "완벽 최적 코스 추천", 
    desc: "예산 범위 안에서 갈 수 있는 최적의 장소들을 AI가 선별해 코스로 제안합니다.",
    img: "/images/feature4.svg" // 이미지가 없다면 경로를 지우거나 비워두세요
  },
  { 
    title: "국내 지역 자동 보정", 
    desc: "성수, 제주 등 지역별 물가 데이터를 반영하여 현실적인 계획을 도와줍니다.",
    img: "/images/feature5.svg" 
  },
  { 
    title: "결과를 한 장으로 정리", 
    desc: "확정된 코스는 영수증 형태의 예쁜 이미지로 만들어 공유할 수 있습니다.",
    img: "/images/feature6.svg" 
  },
];

export default function Home({ onNext }) {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* --- 1. 상단 네비게이션 --- */}
      <nav className="flex justify-between items-center px-16 py-6 border-b border-[#DBDBDB]">
        <div className="text-2xl font-black text-[#4066E2] tracking-tighter cursor-pointer">
          얼마면돼?
        </div>
        <div className="flex gap-16 text-[15px] font-normal text-[#03001A]">
          <span className="cursor-pointer font-bold border-b-2 border-[#03001A] pb-1">Home</span>
          <span className="cursor-pointer text-[#ABACB7] hover:text-[#03001A] transition-colors">History</span>
          <span className="cursor-pointer text-[#ABACB7] hover:text-[#03001A] transition-colors">Trend</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[15px] font-normal text-[#03001A]">my page</span>
          <div className="w-10 h-10 bg-gray-200 rounded-full border border-gray-100 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="avatar" />
          </div>
        </div>
      </nav>

      {/* --- 2. 히어로 섹션 --- */}
      <main className="flex flex-col items-center py-24 text-center">
        <h1 className="text-[64px] font-[800] leading-[1.2] text-[#03001A] mb-4">
          오늘 <span className="text-[#4066E2]"></span>,<br />얼마면 돼?
        </h1>
        <p className="text-[22px] font-[700] text-[#03001A] mb-12">
          예산 한 푼도 허투루 쓰지 않는 여행 코스 가이드
        </p>

        {/* 인기 키워드 태그들 */}
        <div className="flex items-center gap-5 mb-16">
          <span className="text-[22px] font-[700] text-[#03001A]">인기 키워드</span>
          <div className="flex gap-3">
            {keywords.map((word, i) => (
              <div 
                key={i} 
                className="px-5 py-3 bg-[#E5EBFD] rounded-[13px] text-[16px] font-normal text-[#03001A] cursor-pointer hover:bg-[#D0DAFF] transition-colors"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* 시작 버튼: 인라인 스타일로 그라데이션 강제 적용 */}
        <button 
          onClick={onNext}
          className="w-full max-w-[921px] py-6 text-[30px] font-bold rounded-[13px] text-[#03001A] shadow-[0px_5px_4px_rgba(0,0,0,0.25)] transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(180deg, #B4C2FF 0%, #597FFF 100%)',
            border: 'none'
          }}
        >
          예산 설계 시작하기
        </button>
      </main>

      {/* --- 3. 하단 기능 소개 섹션 (블루 배경) --- */}
      <section className="bg-[#85A1FF] rounded-t-[100px] pt-24 pb-32 px-20">
        <h2 className="text-center text-[30px] font-[700] text-[#03001A] mb-20">
          여행의 완성은 빈틈없는 예산 설계로부터
        </h2>

        <div className="grid grid-cols-3 gap-x-12 gap-y-20 max-w-[1440px] mx-auto">
          {featureItems.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              {/* 
                  이미지 박스: 
                  2번(idx 1)과 3번(idx 2) 카드는 p-24를 주어 이미지를 더 작게 만듭니다.
                  나머지는 p-10을 적용합니다. 
              */}
              <div 
                className={`feature-img-box aspect-[1.4] mb-6 shadow-sm overflow-hidden bg-[#F4F4F4] flex items-center justify-center rounded-[13px] 
                  ${(idx === 1 || idx === 2) ? 'p-24' : 'p-10'}`}
              >
                {item.img ? (
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div className="w-1/4 h-1/4 bg-gray-300 rounded-lg opacity-50"></div>
                )}
              </div>

              {/* 텍스트 설명 */}
              <h3 className="text-[22px] font-[700] text-[#03001A] mb-3">
                {item.title}
              </h3>
              <p className="text-[16px] font-[400] text-[#03001A] leading-[1.4] opacity-90">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}