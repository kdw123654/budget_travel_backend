from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
from parser import parse_user_intent
from logic import load_dataset, calculate_initial_budgets, rebalance_budgets, filter_recommendations,get_smart_recommendations

app = FastAPI()
DATASET = load_dataset()

# --- [데이터 모델 정의] ---
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
    return {"message": "얼마면돼? API 서버가 작동 중입니다."}

# 1. 문장에서 추출
@app.post("/analyze")
async def analyze_intent(request: AnalyzeRequest):
    parsed = parse_user_intent(request.user_input)
    
    # 초기 예산 배분 계산
    init_budgets = calculate_initial_budgets(parsed['budget'], parsed['priority'])
    
    # 해당 지역의 추천 장소 리스트도 함께 반환
    location = parsed['location']
    recommendations = DATASET.get(location, [])
    smart_plan = get_smart_recommendations(recommendations, init_budgets)
    return {
        "location": location,
        "total_budget": parsed['budget'],
        "priority": parsed['priority'],
        "cat_budgets": init_budgets,
        "recommendations": smart_plan
    }

# 2. 예산 재배분: 슬라이더를 옮길 때마다 호출되어 새로운 예산을 계산
@app.post("/rebalance")
async def get_rebalanced_budgets(request: RebalanceRequest):
    # 1. 예산 재계산
    new_budgets = rebalance_budgets(
    request.changed_cat,    # 1. 바뀐 카테고리 이름
    request.new_value,      # 2. 바뀐 금액
    request.total_budget,   # 3. 전체 총액
    request.current_budgets # 4. 바뀌기 전의 예산 딕셔너리
)
    
    # 2. (선택사항) 바뀐 예산에 맞는 새로운 추천 리스트도 같이 보내기
    # 이를 위해 RebalanceRequest에 location 정보도 추가로 받으면 좋습니다.
    location_data = DATASET.get(request.location, []) # 요청에 location 추가 시
    filling_plan = get_smart_recommendations(location_data, new_budgets)
    return {
        "cat_budgets": new_budgets,
        "recommendations": filling_plan # 이제 슬라이더 옮길 때마다 장소 리스트가 바뀜!
    }
# 3. 데이터 조회: 특정 지역의 데이터만 따로 요청할 때
@app.get("/recommendations/{location}")
async def get_places(location: str):
    if location not in DATASET:
        raise HTTPException(status_code=404, detail="해당 지역의 데이터가 없습니다.")
    return {"recommendations": DATASET[location]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)