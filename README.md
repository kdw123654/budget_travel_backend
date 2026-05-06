## 얼마면돼? (웹이름)
"예산 한 푼도 허투루 쓰지 않는 똑똑한 여행 코스 가이드"

🚀 Step-by-Step 핵심 로직
이 프로젝트는 단순한 필터링을 넘어, 사용자의 의도를 분석하고 예산을 유동적으로 재분배하는 4단계 프로세스로 작동합니다.

#1️⃣ 자연어 의도 파악 (Intent Parsing)
사용자가 입력한 자유로운 형식의 프롬프트를 분석하여 핵심 데이터를 추출합니다.

Module: parser.py

Logic: 정규표현식(Regex)을 활용해 지역, 금액, 우선순위 키워드를 맵핑합니다.

Smart Feature: '성수' → '성수동' 자동 보정, "20" 입력 시 "200,000"으로 단위 자동 변환.

#2️⃣ 초기 예산 가중 분배 (Initial Allocation)
선택된 우선순위(숙소/식당/액티비티)에 따라 최적의 예산 비율을 설정합니다.

Module: logic.py (calculate_initial_budgets)

Logic: 유저가 강조한 카테고리에 높은 가중치를 부여하여 첫 번째 예산안을 생성합니다.

#3️⃣ 실시간 예산 재배분 (Dynamic Rebalancing)
특정 항목의 예산을 변경하면 전체 예산(Total Budget)을 유지하면서 다른 항목들을 자동으로 조정합니다.

Module: logic.py (rebalance_budgets)

Logic: Zero-sum 원칙에 따라 한쪽 예산이 줄어들면 나머지 카테고리가 기존 비율대로 남은 파이를 나누어 가집니다.

#4️⃣ 예산 충족형 N개 추천 (Budget-Filling Recommendation)
배정된 예산 내에서 사용자가 즐길 수 있는 최대한의 코스를 구성합니다.

Module: logic.py (get_filling_recommendations)

Logic: 장소를 하나만 추천하는 대신, 예산 잔액이 허용하는 한 여러 장소(N개)를 리스트에 담아 풍성한 여행 계획을 완성합니다.

🛠 Tech Stack
Backend: FastAPI

Language: Python 3.10+

Frontend/UX: Streamlit

Data: JSON-based Dataset
