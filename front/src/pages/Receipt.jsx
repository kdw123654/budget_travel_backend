// src/pages/Receipt.jsx
import '../App.css'; // CSS 파일 임포트 필수!

export default function Receipt({ data }) {
  return (
    <div className="receipt-container m-5"> {/* 피그마의 Rectangle 33145 적용 */}
      <h1 className="gradient-text pretendard-bold text-4xl mb-4">
        얼마면 돼?
      </h1>
      
      <div className="dashed-line" /> {/* 피그마의 Vector 491 적용 */}
      
      {/* 장소 리스트들... */}
      
      <button className="btn-primary-gradient w-full py-4 mt-5">
        분석하기
      </button>
    </div>
  );
}