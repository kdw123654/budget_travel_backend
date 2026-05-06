import streamlit as st
import pandas as pd
from logic import load_dataset, calculate_initial_budgets, get_optimal_recommendations

# 1. 페이지 설정 및 데이터 로드
st.set_page_config(page_title="얼마면돼? 대시보드", layout="wide")
DATASET = load_dataset()
locations = list(DATASET.keys())

st.title("🎡 얼마면돼? 예산 기반 여행 코스 시각화")
st.write("---") # 구분선

# 2. 상단 컨트롤 영역 (Columns 사용)
# 가로로 4개의 칸을 나누어 입력창을 배치합니다.
top_col1, top_col2, top_col3, top_col4 = st.columns([5, 2, 2,1])

with top_col1:
    location = st.selectbox("📍 가고싶은 지역과 예산 입력해주셈", locations)

with top_col2:
    total_budget = st.number_input("💰 총 예산 (원)", min_value=10000, value=200000, step=10000)

with top_col3:
    priority = st.selectbox("🔝 우선순위", ["숙소", "식당", "액티비티"])

with top_col4:
    st.write(" ") # 레이아웃 정렬용 공백
    st.write(" ")
    run_button = st.button("코스 생성", use_container_width=True)

st.write("---") # 구분선

# 3. 로직 실행 및 결과 표시
if run_button:
    # logic.py의 함수들 호출
    init_budgets = calculate_initial_budgets(total_budget, priority)
    recommendations = DATASET.get(location, [])
    optimal_plan = get_optimal_recommendations(recommendations, init_budgets, top_n=1)

    # 상단 요약 지표 (Metrics)
    st.subheader(f"✨ {location} 최적 일정 요약")
    m_col1, m_col2, m_col3 = st.columns(3)
    m_col1.metric("🏠 숙소 예산", f"{init_budgets.get('Stay', 0):,}원")
    m_col2.metric("🍱 식당 예산", f"{init_budgets.get('Food', 0):,}원")
    m_col3.metric("🎢 액티비티 예산", f"{init_budgets.get('Activity', 0):,}원")

    if optimal_plan:
        # 데이터 처리
        df = pd.DataFrame(optimal_plan)
        df = df.rename(columns={'lng': 'lon'})

        # 화면 분할 (왼쪽: 상세 정보, 오른쪽: 지도)
        res_col1, res_col2 = st.columns([1, 1])

        with res_col1:
            st.write("### 📍 선정 장소 리스트")
            st.table(df[['cat', 'name', 'price', 'addr']])

        with res_col2:
            st.write("### 🗺️ 지도 확인")
            st.map(df[['lat', 'lon']])
    else:
        st.error("해당 예산 범위 내에서 추천할 수 있는 장소가 없습니다. 예산을 늘려보세요!")
else:
    st.info("상단의 조건을 설정하고 '코스 생성' 버튼을 눌러주세요.")