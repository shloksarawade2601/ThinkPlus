from flask import Flask, jsonify
from flask_cors import CORS
import random
import math
import json

app = Flask(__name__)
CORS(app)  # Allow requests from your website

# Seed for randomness
random.seed()

# --- CONFIGURATION ---
all_topics = [
    "Percentages", "Ratios", "Simple Interest", "Compound Interest",
    "Sets", "Profit & Loss", "Number Systems"
]
total_q = 30
alloc = {"Easy": 6, "Medium": 9, "Hard": 9, "Expert": 6}

# --- UTILITY HELPERS ---
def pct_to_str(x):
    return str(round(x, 2)) + "%"

def ratio_simplify(a, b):
    g = math.gcd(a, b)
    return str(a // g) + ":" + str(b // g)

def choose_distinct(nums, k):
    return random.sample(list(nums), k)

# --- QUESTION GENERATORS ---
def gen_percentages(diff):
    qs = []
    if diff == "Easy":
        p = random.randint(5, 40)
        val = random.randint(100, 500)
        question = f"What is {p}% of {val}?"
        ans = round(val * p / 100.0, 2)
        opts = [ans, ans * 2, ans / 2, ans + 10]
        random.shuffle(opts)
        options = [str(o) for o in opts]
        expl = "p% of X is (p/100) * X."
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    elif diff == "Medium":
        x, y = random.randint(10, 30), random.randint(10, 30)
        base = random.randint(100, 300)
        final = round(base * (1 + x / 100.0) * (1 - y / 100.0), 2)
        question = f"A price is increased by {x}% and then decreased by {y}%. The final price is ${final}. What was the original price (nearest integer)?"
        ans = int(round(base, 0))
        opts = [ans, int(round(final, 0)), int(round(final * (1 - x/100)*(1+y/100), 0)), ans + random.randint(5, 20)]
        random.shuffle(opts)
        options = [str(o) for o in list(dict.fromkeys(opts))[:4]]
        expl = "Original = Final / ((1 + x/100) * (1 - y/100))."
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    elif diff == "Hard":
        f1 = random.randint(25, 45)
        f2 = random.randint(25, 45)
        both = random.randint(10, 20)
        total_students = random.randint(800, 2500)
        passed_pct = 100 - (f1 + f2 - both)
        ans = int(total_students * passed_pct / 100.0)
        question = f"In an exam, {f1}% of students failed in Math and {f2}% failed in Science. If {both}% failed in both subjects, what is the number of students who passed in both subjects if {total_students} students appeared?"
        opts = [ans, total_students - int(total_students*f1/100), total_students-ans, int(total_students*(100-f1-f2)/100)]
        random.shuffle(opts)
        expl = f"Total failed % = Fail_1 + Fail_2 - Both_Fail = {f1}+{f2}-{both} = {f1+f2-both}%. Pass % = 100 - Total_failed %. Number passed = Total_students * Pass %."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    else:  # Expert
        total_vol = random.choice([40, 50, 60, 80])
        removed = random.choice([4, 5, 8, 10])
        n_ops = 3
        question = f"A {total_vol}L cask full of pure wine has {removed}L drawn from it and is replaced with water. This process is repeated two more times (total {n_ops} operations). What is the final quantity of wine in the cask (2 d.p.)?"
        ans = round(total_vol * (1 - removed / total_vol) ** n_ops, 2)
        opts = [ans, round(total_vol - (removed*n_ops), 2), round(total_vol * (1 - (removed*n_ops)/total_vol),2), round(ans*0.8, 2)]
        random.shuffle(opts)
        expl = "The formula for remaining quantity after n operations is: Final = Initial * (1 - Amount_Removed / Total_Volume)^n."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    return qs

def gen_ratios(diff):
    qs = []
    if diff == "Easy":
        a = random.randint(2, 9)
        b = random.randint(2, 9)
        total = random.randint(40, 180)
        question = f"A and B split ${total} in the ratio {a}:{b}. What does A receive?"
        A = int(round(total * a / float(a + b), 0))
        opts = [A, int(round(total * b / float(a + b), 0)), total-A+b, total-b]
        random.shuffle(opts)
        options = [str(x) for x in opts]
        expl = "Share = total * part / sum of parts."
        qs.append({"question": question, "options": options, "answer": str(A), "explanation": expl})
    elif diff == "Medium":
        a, b, c, d = [random.randint(2, 7) for _ in range(4)]
        question = f"If A:B = {a}:{b} and B:C = {c}:{d}, find A:C."
        num = a * c
        den = b * d
        ans = ratio_simplify(num, den)
        opts = [ans, ratio_simplify(a,d), ratio_simplify(b,c), ratio_simplify(a*d, b*c)]
        random.shuffle(opts)
        expl = f"To find A:C, multiply the ratios: (A/B) * (B/C) = A/C."
        qs.append({"question": question, "options": list(dict.fromkeys(opts))[:4], "answer": ans, "explanation": expl})
    elif diff == "Hard":
        val_sub = random.randint(5,12)
        question = f"Two numbers are in the ratio 5:7. If {val_sub} is subtracted from each, the new ratio becomes 2:3. Find the largest original number."
        ans = 7 * val_sub
        opts = [ans, 5 * val_sub, ans - val_sub, 5*val_sub-val_sub]
        random.shuffle(opts)
        expl = "Let numbers be 5x and 7x. Then (5x-k)/(7x-k)=2/3. Solve for x, then find 7x."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    else:  # Expert
        savings = random.randint(1200, 2000)
        x = savings / 2.0
        income_A = int(5 * x)
        question = f"The incomes of A and B are in the ratio 5:4 and their expenditures are in the ratio 3:2. If each saves ${savings}, what is the income of A?"
        ans = income_A
        opts = [ans, int(4*x), int(3*(2*x - savings/2.0)), savings]
        random.shuffle(opts)
        expl = "Let incomes be 5x, 4x and expenditures be 3y, 2y. Solve simultaneous equations."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    return qs

def gen_si(diff):
    qs = []
    if diff in ["Easy"]:
        p = random.randint(500, 5000)
        r = random.randint(4, 12)
        t = random.randint(1, 5)
        si = int(round(p * r * t / 100.0, 0))
        question = f"Find simple interest on ${p} at {r}% p.a. for {t} years."
        options = [str(si), str(si + random.randint(50, 200)), str(max(0, si - random.randint(50, 200))), str(int(round(p * (1 + r / 100.0) ** t - p, 0)))]
        random.shuffle(options)
        expl = "SI = P*r*t/100."
        qs.append({"question": question, "options": options, "answer": str(si), "explanation": expl})
    elif diff == "Medium":
        A = random.randint(2000, 10000)
        r = random.randint(5, 12)
        t = random.randint(2, 6)
        P = int(round(A / (1 + r * t / 100.0), 0))
        question = f"The amount after {t} years at SI is ${A} at rate {r}%. Find the principal (nearest integer)."
        options = [str(P), str(P + random.randint(60, 220)), str(max(0, P - random.randint(60, 220))), str(int(round(A - (A * r * t / 100.0), 0)))]
        random.shuffle(options)
        expl = "A = P(1+rt/100)."
        qs.append({"question": question, "options": options, "answer": str(P), "explanation": expl})
    else:  # Hard/Expert
        P = random.randint(1500, 6000)
        t1 = random.randint(2, 5)
        t2 = t1 + random.randint(1, 4)
        diff_amt = random.randint(200, 800)
        r = round(100.0 * diff_amt / (P * (t2 - t1)), 2)
        question = f"On principal ${P}, the difference between SI for {t2} years and {t1} years is ${diff_amt}. Find the rate p.a. (2 d.p.)."
        candidates = [r, round(r + random.uniform(0.5, 3.0), 2), max(0.0, round(r - random.uniform(0.5, 3.0), 2)), round(r * 1.5, 2)]
        random.shuffle(candidates)
        options = [pct_to_str(x) for x in candidates]
        correct = pct_to_str(r)
        expl = "Difference in SI = P*r*(t2-t1)/100."
        qs.append({"question": question, "options": options, "answer": correct, "explanation": expl})
    return qs

def gen_ci(diff):
    qs = []
    if diff == "Easy":
        P = random.randint(800, 6000)
        r = random.randint(4, 12)
        t = 2
        A = int(round(P * (1 + r / 100.0) ** t, 0))
        question = f"Find the amount on ${P} at {r}% CI p.a. for {t} years."
        options = [str(A), str(int(round(P + P * r * t / 100.0, 0))), str(A - 100), str(A + 100)]
        random.shuffle(options)
        expl = "A = P(1+r/100)^t."
        qs.append({"question": question, "options": options, "answer": str(A), "explanation": expl})
    elif diff == "Medium":
        P = random.randint(1000, 10000)
        r = random.randint(5, 15)
        t = 2
        diff_ci_si = round(P * (r / 100.0) ** 2, 2)
        question = f"Find the difference between CI and SI on ${P} for {t} years at {r}% p.a."
        ans = diff_ci_si
        opts = [ans, 0, round(P*r/100, 2), round(ans*2, 2)]
        random.shuffle(opts)
        expl = "For 2 years, Diff = P * (r/100)^2."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    elif diff == "Hard":
        P = random.randint(5000, 15000)
        r = 10
        diff_3yr = round(P * (r/100)**2 * (3 + r/100), 2)
        question = f"On a sum of ${P}, what is the difference between Compound and Simple interest for 3 years at {r}% p.a.?"
        ans = diff_3yr
        opts = [ans, round(P*(r/100)**2, 2), round(3*P*r/100, 2), round(P*((1+r/100)**3 -1) - 3*P*r/100, 2) + 1]
        random.shuffle(opts)
        expl = "For 3 years, the difference between CI and SI is given by P*(r/100)²*(3+r/100)."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    else:  # Expert
        t_double = random.randint(5, 12)
        multiple = random.choice([4, 8, 16])
        ans = int(t_double * math.log(multiple, 2))
        question = f"A sum of money doubles itself in {t_double} years at compound interest. In how many years will it become {multiple} times itself?"
        opts = [ans, t_double*multiple, int(t_double*math.log2(multiple))+1, t_double * (multiple//2)]
        random.shuffle(opts)
        expl = f"If a sum doubles in T years, it becomes {multiple}x in {int(math.log2(multiple))} * {t_double} years."
        qs.append({"question": question, "options": [str(o) for o in list(dict.fromkeys(opts))[:4]], "answer": str(ans), "explanation": expl})
    return qs

def gen_sets(diff):
    qs = []
    if diff in ["Easy"]:
        set_a = set(choose_distinct(range(1, 15), random.randint(3, 5)))
        set_b = set(choose_distinct(range(1, 15), random.randint(3, 5)))
        op_choice = random.choice(['union', 'intersection', 'difference'])
        if op_choice == 'union':
            question = f"Given A = {set_a} and B = {set_b}, find A U B."
            ans = set_a.union(set_b)
            expl = "Union (U) contains all unique elements from both sets."
        elif op_choice == 'intersection':
            question = f"Given A = {set_a} and B = {set_b}, find A ∩ B."
            ans = set_a.intersection(set_b)
            expl = "Intersection (∩) contains only elements common to both sets."
        else:
            question = f"Given A = {set_a} and B = {set_b}, find A - B."
            ans = set_a.difference(set_b)
            expl = "Difference (A - B) contains elements that are in A but not in B."
        opts = {frozenset(ans), frozenset(set_a.symmetric_difference(set_b)), frozenset(set_b.difference(set_a)), frozenset()}
        while len(opts) < 4:
            opts.add(frozenset(ans.union({random.randint(16, 30)})))
        options = [str(set(s)) for s in opts]
        random.shuffle(options)
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    elif diff == "Medium":
        total = random.randint(80, 200)
        a_likes = random.randint(30, int(total*0.8))
        b_likes = random.randint(30, int(total*0.8))
        both_likes = random.randint(10, min(a_likes, b_likes) - 5)
        union_val = a_likes + b_likes - both_likes
        neither = total - union_val
        question = f"In a group of {total} people, {a_likes} like coffee and {b_likes} like tea. If {both_likes} like both, how many like neither?"
        ans = neither
        opts = [ans, total - a_likes, total - b_likes, union_val]
        opts = list(dict.fromkeys(opts))
        while len(opts) < 4:
            opts.append(ans + random.randint(3, 15))
        random.shuffle(opts)
        options = [str(o) for o in opts]
        expl = "Those who like neither = Total - (Number who like at least one)."
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    else:  # Hard/Expert
        n_a, n_b, n_c = [random.randint(20, 40) for _ in range(3)]
        n_ab, n_bc, n_ac = [random.randint(5, 12) for _ in range(3)]
        n_abc = random.randint(2, 5)
        total_union = n_a + n_b + n_c - (n_ab + n_bc + n_ac) + n_abc
        question = f"In a survey, {n_a} people like product A, {n_b} like B, and {n_c} like C. If {n_ab} like A and B, {n_bc} like B and C, {n_ac} like A and C, and {n_abc} like all three, how many people like at least one product?"
        ans = total_union
        opts = [ans, n_a + n_b + n_c, total_union - n_abc, total_union + n_abc]
        opts = list(dict.fromkeys(opts))
        while len(opts) < 4:
            opts.append(ans + random.randint(5, 20))
        random.shuffle(opts)
        options = [str(o) for o in opts]
        expl = "By Inclusion-Exclusion: |A U B U C| = |A|+|B|+|C| - (|A∩B|+|A∩C|+|B∩C|) + |A∩B∩C|."
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    return qs

def gen_profit_loss(diff):
    qs = []
    if diff == "Easy":
        cp = random.randint(50, 500)
        sp = cp + random.randint(10, 100)
        profit_pct = round(100.0 * (sp - cp) / cp, 2)
        question = f"An item bought for ${cp} is sold for ${sp}. Find the profit percent (2 d.p.)."
        ans = profit_pct
        opts = [ans, round(100 * (sp-cp)/sp, 2), ans+5, ans-5]
        random.shuffle(opts)
        options = [pct_to_str(o) for o in opts]
        expl = "Profit % = 100 * (SP - CP) / CP."
        qs.append({"question": question, "options": options, "answer": pct_to_str(ans), "explanation": expl})
    elif diff == "Medium":
        sp = random.randint(100, 800)
        profit_pct = random.randint(10, 40)
        cp = int(round(sp / (1 + profit_pct / 100.0), 0))
        question = f"By selling an article for ${sp}, a gain of {profit_pct}% is made. Find the cost price (nearest integer)."
        ans = cp
        opts = [ans, int(round(sp * (1 - profit_pct / 100.0), 0)), sp, sp-cp]
        random.shuffle(opts)
        options = [str(o) for o in opts]
        expl = "CP = SP / (1 + Profit%/100)."
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    elif diff == "Hard":
        true_wt = 1000
        false_wt = random.choice([800, 850, 900, 950])
        error = true_wt - false_wt
        gain_pct = round(100 * error / false_wt, 2)
        question = f"A shopkeeper professes to sell his goods at cost price, but uses a weight of {false_wt}g instead of a 1 kg weight. Find his real gain percentage (2 d.p.)."
        ans = gain_pct
        opts = [ans, round(100*error/true_wt, 2), 100-gain_pct, (1000-false_wt)/10]
        random.shuffle(opts)
        expl = f"Gain % = (Error / (True Value - Error)) * 100."
        qs.append({"question": question, "options": [pct_to_str(o) for o in opts], "answer": pct_to_str(ans), "explanation": expl})
    else:  # Expert
        markup_pct = random.choice([20, 30, 40, 50])
        discount_pct = random.choice([10, 15, 20])
        net_change = (1 + markup_pct/100.0) * (1 - discount_pct/100.0) - 1
        ans = round(net_change * 100, 2)
        question = f"A trader marks his goods {markup_pct}% above the cost price and then offers a discount of {discount_pct}%. What is his net profit or loss percentage?"
        opts = [ans, markup_pct - discount_pct, markup_pct, discount_pct]
        random.shuffle(opts)
        expl = "Net % = (a + b + ab/100)."
        qs.append({"question": question, "options": [pct_to_str(o) for o in opts], "answer": pct_to_str(ans), "explanation": expl})
    return qs

def gen_number_systems(diff):
    qs = []
    if diff == "Easy":
        a = random.randint(10, 50)
        b = random.randint(10, 50)
        ans = math.gcd(a,b)
        question = f"Find the HCF (Highest Common Factor) of {a} and {b}."
        opts = [ans, (a*b)//ans, a, b]
        random.shuffle(opts)
        expl = "HCF is the largest positive integer that divides both numbers."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    elif diff == "Medium":
        base = random.randint(2, 9)
        power = random.randint(20, 80)
        question = f"What is the unit digit of {base}^{power}?"
        rem = power % 4 if power % 4 != 0 else 4
        ans = (base ** rem) % 10
        opts = list(range(10))
        random.shuffle(opts)
        options = [str(o) for o in opts[:4]]
        if str(ans) not in options: options[0] = str(ans)
        expl = f"The unit digits of powers of {base} repeat in a cycle."
        qs.append({"question": question, "options": options, "answer": str(ans), "explanation": expl})
    elif diff == "Hard":
        n = random.choice([50, 75, 100, 120, 150])
        question = f"How many trailing zeros are there in the expansion of {n}! ?"
        count = 0
        i = 5
        while (n // i >= 1):
            count += n // i
            i *= 5
        ans = count
        opts = [ans, n//5, n//10, 0]
        random.shuffle(opts)
        expl = "Trailing zeros formed by pairs of 2s and 5s. Count factors of 5."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    else:  # Expert
        d1, d2, d3 = 3, 5, 7
        r1, r2, r3 = d1-1, d2-1, d3-1
        lcm = d1*d2*d3
        ans = lcm - 1
        question = f"Find the smallest positive integer that when divided by {d1}, {d2}, and {d3} leaves remainders of {r1}, {r2}, and {r3} respectively."
        opts = [ans, lcm+1, ans-1, lcm]
        random.shuffle(opts)
        expl = f"The number is LCM({d1},{d2},{d3}) - 1."
        qs.append({"question": question, "options": [str(o) for o in opts], "answer": str(ans), "explanation": expl})
    return qs

# Map topics to generator functions
gen_map = {
    "Percentages": gen_percentages,
    "Ratios": gen_ratios,
    "Simple Interest": gen_si,
    "Compound Interest": gen_ci,
    "Sets": gen_sets,
    "Profit & Loss": gen_profit_loss,
    "Number Systems": gen_number_systems
}

@app.route('/generate-questions', methods=['GET'])
def generate_questions():
    """Generate 30 random exam questions"""
    import numpy as np
    
    question_specs = []
    for diff, count in alloc.items():
        assigned_topics = np.random.choice(all_topics, count, replace=True)
        for topic in assigned_topics:
            question_specs.append({"topic": topic, "difficulty": diff})
    
    all_questions = []
    for idx, spec in enumerate(question_specs):
        topic = spec["topic"]
        diff = spec["difficulty"]
        
        q_data = gen_map[topic](diff)[0]
        q_data['id'] = idx + 1
        q_data['topic'] = topic
        q_data['difficulty'] = diff
        all_questions.append(q_data)
    
    random.shuffle(all_questions)
    
    # Re-number after shuffle
    for idx, q in enumerate(all_questions):
        q['id'] = idx + 1
    
    return jsonify({
        "success": True,
        "total_questions": len(all_questions),
        "questions": all_questions
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Exam Generator API is running!",
        "endpoint": "/generate-questions"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)