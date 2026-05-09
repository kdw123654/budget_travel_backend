from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import json
import os

# 사용자 정의 모듈 임포트
from parser import parse_user_intent
from logic import load_dataset, calculate_initial_budgets, rebalance_budgets, get_smart_recommendations

app = FastAPI()
DATASET = load_dataset()

# CORS 설정: 프론트엔드 포트 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 시연을 위해 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    user_input: str

class RebalanceRequest(BaseModel):
    location: str
    changed_cat: str
    new_value: int
    total_budget: int
    current_budgets: Dict[str, int]

@app.get("/")
def read_root():
    return {"message": "얼마면돼? API 서버 작동 중"}

# 1. 문장 분석 및 추천
@app.post("/analyze")
async def analyze_intent(request: AnalyzeRequest):
    parsed = parse_user_intent(request.user_input)
    location = parsed['location']
    
    # 초기 예산 배분
    init_budgets = calculate_initial_budgets(parsed['budget'], parsed['priority'])
    
    # 데이터 구조에 맞춰 courses 리스트 추출
    location_data = DATASET.get(location, {})
    courses_list = location_data.get("courses", []) if isinstance(location_data, dict) else []
    
    # 추천 로직 실행
    smart_plan = get_smart_recommendations(courses_list, init_budgets)
    
    return {
        "location": location,
        "total_budget": parsed['budget'],
        "cat_budgets": init_budgets,
        "recommendations": smart_plan
    }

# 2. 예산 재배분 (슬라이더 조절 시)
@app.post("/rebalance")
async def get_rebalanced_budgets(request: RebalanceRequest):
    new_budgets = rebalance_budgets(
        request.changed_cat,
        request.new_value,
        request.total_budget,
        request.current_budgets
    )
    
    location_data = DATASET.get(request.location, {})
    courses_list = location_data.get("courses", []) if isinstance(location_data, dict) else []
    filling_plan = get_smart_recommendations(courses_list, new_budgets)
    
    return {
        "cat_budgets": new_budgets,
        "recommendations": filling_plan 
    }