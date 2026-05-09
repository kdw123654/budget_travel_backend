import React, { useState } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import Setup from './pages/Setup';
import CourseRecommendation from './pages/CourseRecommendation';
import CourseReceipt from './pages/CourseReceipt';

const API_BASE_URL = "https://budget-travel-backend-fkum.onrender.com";

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [finalData, setFinalData] = useState({ budgets: null, courses: null });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // --- [수정] 분석 버튼 클릭 시 AI 분석 로딩 추가 ---
  const handleAnalyze = async (inputText, budget) => {
    setLoading(true); // 로딩 화면 시작
    try {
      // 1. 최소 3초간의 '의도적 지연' 생성
      const delay = new Promise(resolve => setTimeout(resolve, 3000));
      
      // 2. 실제 백엔드 데이터 요청
      const request = axios.post(`${API_BASE_URL}/analyze`, {
        user_input: `${inputText} ${budget}만원`
      });

      // 3. 두 작업이 모두 끝날 때까지 기다림 (최소 3초 보장)
      const [_, response] = await Promise.all([delay, request]);

      setUserData(response.data);
      setStep(3); // 추천 페이지로 이동
    } catch (error) {
      console.error("분석 실패:", error);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="App relative min-h-screen">
      
      {/* 🚀 전역 AI 분석 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            {/* 로딩 스피너 */}
            <div className="w-20 h-20 border-4 border-[#4066E2] border-t-transparent rounded-full animate-spin mb-8"></div>
            
            {/* 감성적인 문구 */}
            <h2 className="text-3xl font-black text-[#03001A] mb-4 animate-pulse text-center">
              사용자 취향을 분석하여<br/>최적의 코스를 설계하고 있습니다...
            </h2>
            <p className="text-gray-500 text-lg font-medium text-center">
              조금만 기다려주세요. <br/>
              <span className="text-[#4066E2]">빅데이터 기반 가성비 코스</span>를 찾는 중입니다.
            </p>

            {/* 진행 바 장식 */}
            <div className="w-80 h-2 bg-gray-100 rounded-full mt-12 overflow-hidden">
              <div className="h-full bg-[#4066E2] animate-[loading_3s_ease-in-out]"></div>
            </div>
          </div>
        </div>
      )}

      {/* --- 페이지 라우팅 --- */}
      {step === 1 && <Home onNext={nextStep} />}
      
      {step === 2 && <Setup onNext={handleAnalyze} onBack={prevStep} />}

      {/* Step 3: 코스 추천 페이지 */}
      {step === 3 && (
        <CourseRecommendation 
          userData={userData} 
          onBack={() => setStep(2)} 
          onConfirm={(budgets, courses) => {
            setFinalData({ budgets, courses });
            setStep(4);
          }}
        />
      )}

      {/* Step 4: 영수증 페이지 */}
      {step === 4 && (
        <CourseReceipt 
          userData={userData}
          finalBudgets={finalData.budgets}
          finalCourses={finalData.courses}
          onRestart={() => {
            setUserData(null);
            setStep(1);
          }}
          onShare={() => alert("링크가 클립보드에 복사되었습니다!")}
        />
      )}
    </div>
  );
}

export default App;