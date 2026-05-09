import React, { useState } from 'react';

export default function Setup({ onNext, onBack }) {
  const [inputText, setInputText] = useState("");

  // 추천 태그 클릭 시 입력창에 추가하는 기능 (선택 사항)
  const addTag = (tag) => {
    if (!inputText.includes(tag)) {
      setInputText(inputText + " " + tag);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-20">
      <h1 className="text-[48px] font-black mb-4">어떤 여행을 원하세요?</h1>
      <p className="text-gray-500 mb-12">자유롭게 입력하면 지역·금액·우선순위를 자동으로 파악합니다.</p>

      {/* 입력창 */}
      <div className="w-[800px] mb-8">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="예: 성수동에서 20만원으로 맛집 투어하고 싶어"
          className="w-full h-[200px] bg-[#F1F4FF] rounded-[30px] p-8 text-xl outline-none resize-none"
        />
      </div>

      {/* 추천 태그 (예산 선택 버튼 대신 배치하면 좋습니다) */}
      <div className="flex gap-3 mb-20">
        {["#성수동", "#데이트", "#맛집", "#20만원", "#숙소중요"].map(tag => (
          <button 
            key={tag}
            onClick={() => addTag(tag)}
            className="px-6 py-2 bg-[#85A1FF] text-white rounded-full font-bold hover:bg-[#6c8ae6]"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 분석하기 버튼 (이제 inputText만 넘깁니다) */}
      <button
        onClick={() => onNext(inputText)}
        className="w-[500px] py-5 bg-[#85A1FF] text-white rounded-[20px] text-2xl font-black shadow-lg hover:bg-[#6c8ae6] transition-all"
      >
        분석하기 →
      </button>
    </div>
  );
}