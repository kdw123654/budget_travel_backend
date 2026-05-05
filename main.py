import streamlit as st
import requests
import os
import folium
from streamlit_folium import st_folium
from dotenv import load_dotenv

load_dotenv()
NAVER_ID = os.getenv("NAVER_CLIENT_ID")
NAVER_SECRET = os.getenv("NAVER_CLIENT_SECRET")

# --- [시연용 백업 데이터: API 실패 대비] ---
BACKUP_PLACES = {
    "성수동": [
        {"cat": "Stay", "name": "호텔 포코 성수", "addr": "서울 성동구 성수이로 96", "lat": 37.542, "lng": 127.054},
        {"cat": "Food", "name": "성수족발", "addr": "서울 성동구 아차산로7길 7", "lat": 37.548, "lng": 127.050},
        {"cat": "Activity", "name": "서울숲", "addr": "서울 성동구 뚝섬로 273", "lat": 37.544, "lng": 127.044}
    ]
}

st.set_page_config(page_title="얼마면돼? - 가성비 여행 추천", layout="wide")
st.title("💰 얼마면돼? (Budget Planner)")

# --- [사이드바] ---
with st.sidebar:
    st.header("⚙️ 여행 설정")
    location = st.text_input("📍 어디로 가시나요?", value="성수동")
    total_budget = st.slider("💵 총 예산 (원)", 10000, 1000000, 200000, step=10000)
    priority = st.selectbox("🎯 가장 중요한 것", ["식당", "숙소", "액티비티"])

def fetch_recommendations(loc, budget, prio):
    results = []
    ratios = {"Stay": 0.4, "Food": 0.4, "Activity": 0.2}
    if prio == "Stay": ratios = {"Stay": 0.6, "Food": 0.25, "Activity": 0.15}
    elif prio == "Food": ratios = {"Stay": 0.25, "Food": 0.6, "Activity": 0.15}

    # 1. 네이버 API 시도
    api_success = False
    for cat in ["Stay", "Food", "Activity"]:
        allocated = int(budget * ratios[cat])
        url = "https://openapi.naver.com/v1/search/local.json"
        headers = {"X-Naver-Client-Id": NAVER_ID, "X-Naver-Client-Secret": NAVER_SECRET}
        params = {"query": f"{loc} {cat}", "display": 1}
        
        try:
            res = requests.get(url, headers=headers, params=params)
            if res.status_code == 200 and res.json().get('items'):
                item = res.json()['items'][0]
                results.append({
                    "name": item['title'].replace("<b>", "").replace("</b>", ""),
                    "addr": item['address'],
                    "cat": cat,
                    "budget": allocated,
                    "lat": 37.546, "lng": 127.050 # API는 좌표를 주지 않으므로 기본값 설정
                })
                api_success = True
        except:
            pass
            
    # 2. API 실패 시 혹은 결과 없을 시 백업 데이터 사용
    if not api_success and loc in BACKUP_PLACES:
        st.warning(f"⚠️ API 연결 원활하지 않음: '{loc}' 시연용 데이터를 표시합니다.")
        for item in BACKUP_PLACES[loc]:
            item['budget'] = int(budget * ratios[item['cat']])
            results.append(item)
            
    return results

# --- [화면 구성] ---
recos = fetch_recommendations(location, total_budget, priority)

col1, col2 = st.columns([1, 1.2])

with col1:
    st.write(f"### 📋 추천 코스")
    if not recos:
        st.error("장소를 찾을 수 없습니다. '지역'을 입력해보세요!")
    for r in recos:
        with st.expander(f"[{r['cat']}] {r['name']}"):
            st.write(f"📍 주소: {r['addr']}")
            st.write(f"💰 권장 지출액: {r['budget']:,}원")

with col2:
    st.write("### 🗺️ 추천 경로 지도")
    center = [recos[0]['lat'], recos[0]['lng']] if recos else [37.5665, 126.9780]
    m = folium.Map(location=center, zoom_start=14)
    
    for r in recos:
        folium.Marker(
            [r['lat'], r['lng']],
            popup=r['name'],
            tooltip=f"{r['cat']}: {r['name']}",
            icon=folium.Icon(color="red" if r['cat'] == priority else "blue")
        ).add_to(m)
    
    st_folium(m, width=600, height=450)