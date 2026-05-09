import re

def parse_user_intent(user_input):
    # 1. 지역 추출
    target_regions = ["성수", "홍대", "강남", "이태원", "익선동", "한남동", "잠실"]
    location = "" 
    for region in target_regions:
        if region in user_input:
            if not region.endswith('동'):
                location = region+'동'
            else:
                location =region
            break

    # 2. 예산 추출
    numbers = re.findall(r'\d+', user_input.replace(',', ''))
    if numbers:
        budget = int(max(numbers, key=len)) 
        if budget < 1000: budget *= 10000
    else:
        budget = 100000 
    budget = max(10000, budget)

    # 3. 우선순위 추출
    priority = "식당"
    keywords = {"숙소": ["숙소", "잠", "호텔","모텔"], "액티비티": ["놀거리", "체험", "팝업","즐길거리"]}
    for key, words in keywords.items():
        if any(word in user_input for word in words):
            priority = key
            break

    return {"location": location, "budget": budget, "priority": priority}