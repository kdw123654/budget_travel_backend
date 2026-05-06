import json

def load_dataset():
    try:
        with open('dataset.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

def calculate_initial_budgets(total_budget, priority):
    """최초 분석 시 비율 배분"""
    ratios = {"Stay": 0.4, "Food": 0.4, "Activity": 0.2}
    if priority == "숙소": ratios = {"Stay": 0.6, "Food": 0.25, "Activity": 0.15}
    elif priority == "식당": ratios = {"Stay": 0.25, "Food": 0.6, "Activity": 0.15}
    return {cat: int(total_budget * ratio) for cat, ratio in ratios.items()}

def rebalance_budgets(changed_cat, new_value, total_budget, current_budgets):
    """한 항목을 바꾸면 나머지를 비율대로 조절"""
    new_budgets = current_budgets.copy()
    new_budgets[changed_cat] = new_value
    remaining_total = total_budget - new_value
    other_cats = [cat for cat in current_budgets.keys() if cat != changed_cat]
    other_sum = sum(current_budgets[cat] for cat in other_cats)

    if other_sum >0:
        for cat in other_cats:
            ratio=current_budgets[cat] / other_sum
            new_budgets[cat] = int(remaining_total * ratio)
        else:
            for cat in other_cats:
                new_budgets[cat] = int(remaining_total / len(other_cats))
    return new_budgets


def filter_recommendations(location_data, category_budgets):
    if not location_data:
        return []
    sorted_data = sorted(
        location_data,
        key=lambda x: abs(x.get('price', 0) - category_budgets.get(x['cat'], 0))    
    )

    itinearay = []
    spent_dict = {cat: 0 for cat in category_budgets.keys()}
    selected_names=set()

    for item in sorted_data:
        cat=item.get('cat')
        price=item.get('price', 0)
        limit=category_budgets.get(cat, 0)

        if (spent_dict[cat] + price <= limit) and (item.get('name') not in selected_names):
            itinearay.append(item)
            spent_dict[cat] += price
            selected_names.add(item.get('name'))

    return itinearay

def get_optimal_recommendations(location_data, category_budgets,top_n=1):
    if not location_data:
        return []
    sorted_data= sorted(
        location_data,
        key=lambda x: abs(x.get('price', 0) - category_budgets.get(x['cat'], 0))    
    )

    itinearay = []
    counts = {cat: 0 for cat in category_budgets.keys()}

    for item in sorted_data:
        cat = item.get('cat')
        price = int(item.get('price', 0))
        limit = category_budgets.get(cat, 0)

        if (spent_dict[cat] + price) <= limit: 
            itinerary.append(item)
            spent_dict[cat] += price
    return itinearay