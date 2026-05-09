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

  // 분석 버튼 클릭 시 호출
  const handleAnalyze = async (inputText, budget) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        user_input: `${inputText} ${budget}만원`
      });

      setUserData(response.data);
      setStep(3); // 원래 4단계였던 추천 페이지로 바로 이동 (중간 단계 삭제)
    } catch (error) {
      console.error("분석 실패:", error);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="App">
            {loading && <div className="loading-overlay">분석 중...</div>}
            {step === 1 && <Home onNext={nextStep} />}
            {step === 2 && <Setup onNext={handleAnalyze} onBack={prevStep} />}
      
            {/* Step 3: 코스 추천 페이지 */}
            {step === 3 && (
              <CourseRecommendation 
                userData={userData} 
                onBack={() => setStep(2)} 
                // 다음 페이지(영수증)로 넘어갈 때 최종 데이터를 App.jsx에 저장하며 이동
                onConfirm={(budgets, courses) => {
                  setFinalData({ budgets, courses });
                  setStep(4);
                }}
              />
            )}

            {/* Step 4: 영수증 페이지 (새로 추가됨) */}
            {step === 4 && (
              <CourseReceipt 
                userData={userData}
                finalBudgets={finalData.budgets}
                finalCourses={finalData.courses}
                onRestart={() => {
                  setUserData(null); // 데이터 초기화
                  setStep(1); // 홈으로 돌아가기
                }}
                onShare={() => alert("링크가 클립보드에 복사되었습니다!")}
              />
            )}
          </div>
        );
    }

export default App;