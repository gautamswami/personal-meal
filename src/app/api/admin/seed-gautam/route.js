import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Gautam's actual meal history as customEntries (what he really ate)
const actualMealEntries = {
  '2026-02-09': ['3:35 PM – Shadi ka khana', '8:35 PM – 🍶'],
  '2026-02-10': ['3:35 PM – Shadi ka khana * 2'],
  '2026-02-11': ['3:34 PM – Aalo parathe, puri aalo, coffe'],
  '2026-02-12': ['11:00 AM – Bread, coffee', '3:34 PM – Pizza pocket, maggie'],
  // 2026-02-13: nothing logged
  '2026-02-14': ['5:48 AM – 🍶, pizza, white sauce pasta, sandwich'],
  '2026-02-15': [
    '3:00 AM – 🍶',
    '2:54 PM – Pizza, galric, cold coffe, bread',
    '2:55 PM – Lassi',
    '7:09 PM – Muskmelon',
  ],
  '2026-02-16': ['3:00 AM – Roll rolls king', '10:15 PM – Shadi ka kahana, maggie'],
  '2026-02-17': ['10:16 PM – Rajma, roti, laddo, sev', '10:16 PM – Chole, tandoori roti'],
  '2026-02-18': ['6:58 PM – Poha, chai', '12:13 AM – Icecream'],
};

// Full suggested meal plan: Feb 5 – Apr 30 2026
const baseMealData = [
  // ── Feb 5–14: fruit phase ─────────────────────────────────────────────────
  { date: '2026-02-05', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' },     lunch: { time: '2:00 PM', food: 'Banana (2)' },     dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-06', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Apple (2)' },       dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-07', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' },  lunch: { time: '2:00 PM', food: 'Orange (3–4)' },    dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-08', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' },     lunch: { time: '2:00 PM', food: 'Banana (2)' },     dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-09', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Apple (2)' },       dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-10', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' },  lunch: { time: '2:00 PM', food: 'Orange (3–4)' },    dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-11', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' },     lunch: { time: '2:00 PM', food: 'Banana (2)' },     dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-12', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Apple (2)' },       dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-13', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' },  lunch: { time: '2:00 PM', food: 'Orange (3–4)' },    dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-14', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' },     lunch: { time: '2:00 PM', food: 'Banana (2)' },     dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  // ── Feb 15 – Mar 15: healthy rotation ────────────────────────────────────
  { date: '2026-02-15', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },          dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-16', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-17', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-18', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-19', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-20', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },                   dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-21', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-02-22', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },          dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-23', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-24', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-25', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-26', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-27', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },                   dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-28', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-01', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },          dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-02', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-03', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-04', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-05', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-06', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },                   dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-07', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-08', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },          dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-09', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-10', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-11', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },                  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-12', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },                  dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-13', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                 lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },                   dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-14', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },      dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-15', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },       lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },          dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  // ── Mar 16–20: fruit transition ───────────────────────────────────────────
  { date: '2026-03-16', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' },     lunch: { time: '2:00 PM', food: 'Apple (2)' },       dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-03-17', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Banana (2)' },      dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-03-18', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' },  lunch: { time: '2:00 PM', food: 'Orange (3–4)' },    dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-03-19', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' },     lunch: { time: '2:00 PM', food: 'Apple (2)' },       dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-03-20', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Banana (2)' },      dinner: { time: '8:00 PM', food: 'Papaya' } } },
  // ── Phase 1 – Fat Loss Plan ───────────────────────────────────────────────
  // Week 1: 21–27 Mar
  { date: '2026-03-21', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + cucumber + tomato' }, lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti + salad' },    dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-22', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                   lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer stir fry + vegetables' } } },
  { date: '2026-03-23', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-24', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-25', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + vegetables' },       lunch: { time: '2:00 PM', food: 'Paneer bhurji + salad + 1 roti' },    dinner: { time: '8:00 PM', food: 'Sprouts salad' } } },
  { date: '2026-03-26', meals: { breakfast: { time: '10:30 AM', food: 'Oats + vegetables' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + stir fried vegetables' } } },
  { date: '2026-03-27', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts + cucumber + tomato' },      lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup + salad' } } },
  // Week 2: 28 Mar – 3 Apr
  { date: '2026-03-28', meals: { breakfast: { time: '10:30 AM', food: '2 eggs + vegetables' },              lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + vegetables' } } },
  { date: '2026-03-29', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Sprouts salad' } } },
  { date: '2026-03-30', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-31', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                   lunch: { time: '2:00 PM', food: 'Paneer bhurji + salad + 1 roti' },    dinner: { time: '8:00 PM', food: 'Eggs + salad' } } },
  { date: '2026-04-01', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + vegetables' },       lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-04-02', meals: { breakfast: { time: '10:30 AM', food: 'Oats + vegetables' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + vegetables' } } },
  { date: '2026-04-03', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Eggs + salad' } } },
  // Week 3: 4–10 Apr
  { date: '2026-04-04', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-04-05', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + vegetables' },       lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer stir fry' } } },
  { date: '2026-04-06', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Eggs + salad' } } },
  { date: '2026-04-07', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-04-08', meals: { breakfast: { time: '10:30 AM', food: 'Oats + vegetables' },                lunch: { time: '2:00 PM', food: 'Paneer bhurji + 1 roti' },             dinner: { time: '8:00 PM', food: 'Sprouts salad' } } },
  { date: '2026-04-09', meals: { breakfast: { time: '10:30 AM', food: '2 eggs + vegetables' },              lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + vegetables' } } },
  { date: '2026-04-10', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  // Weeks 4–6: 11–30 Apr — same 7-day rotation as Week 1
  { date: '2026-04-11', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + cucumber + tomato' }, lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti + salad' },  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-04-12', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                   lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer stir fry + vegetables' } } },
  { date: '2026-04-13', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-04-14', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-04-15', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + vegetables' },       lunch: { time: '2:00 PM', food: 'Paneer bhurji + salad + 1 roti' },   dinner: { time: '8:00 PM', food: 'Sprouts salad' } } },
  { date: '2026-04-16', meals: { breakfast: { time: '10:30 AM', food: 'Oats + vegetables' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + stir fried vegetables' } } },
  { date: '2026-04-17', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts + cucumber + tomato' },      lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup + salad' } } },
  { date: '2026-04-18', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + cucumber + tomato' }, lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti + salad' },  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-04-19', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                   lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer stir fry + vegetables' } } },
  { date: '2026-04-20', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-04-21', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-04-22', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + vegetables' },       lunch: { time: '2:00 PM', food: 'Paneer bhurji + salad + 1 roti' },   dinner: { time: '8:00 PM', food: 'Sprouts salad' } } },
  { date: '2026-04-23', meals: { breakfast: { time: '10:30 AM', food: 'Oats + vegetables' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + stir fried vegetables' } } },
  { date: '2026-04-24', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts + cucumber + tomato' },      lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup + salad' } } },
  { date: '2026-04-25', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + cucumber + tomato' }, lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti + salad' },  dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-04-26', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' },                   lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer stir fry + vegetables' } } },
  { date: '2026-04-27', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' },                    lunch: { time: '2:00 PM', food: 'Chole + salad + 1 roti' },             dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-04-28', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' },                   lunch: { time: '2:00 PM', food: 'Dal + sabji + 1 roti' },               dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-04-29', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + vegetables' },       lunch: { time: '2:00 PM', food: 'Paneer bhurji + salad + 1 roti' },   dinner: { time: '8:00 PM', food: 'Sprouts salad' } } },
  { date: '2026-04-30', meals: { breakfast: { time: '10:30 AM', food: 'Oats + vegetables' },                lunch: { time: '2:00 PM', food: 'Rajma + salad + 1 roti' },             dinner: { time: '8:00 PM', food: 'Paneer + stir fried vegetables' } } },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'seed-gautam-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'MONGODB_URI not set' }, { status: 500 });
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('mealplan');

    const usersCollection = db.collection('users');
    const gautam = await usersCollection.findOne({ username: 'gautam' });

    if (!gautam) {
      return NextResponse.json(
        { error: "User 'gautam' not found. Please sign up in the app first." },
        { status: 404 }
      );
    }

    // JWT serialises ObjectId → string, so the meals collection uses string userId
    const userIdStr = gautam._id.toString();
    const mealsCollection = db.collection('meals');

    // Load existing DB data so we can MERGE rather than overwrite
    const existing = await mealsCollection.findOne({ userId: userIdStr });
    const existingMap = {};
    for (const day of (existing?.meals || [])) {
      existingMap[day.date] = day;
    }

    // Smart merge: for every date in baseMealData —
    //   • keep any customEntries the user already has in DB
    //   • add new dates that don't exist yet
    const merged = baseMealData.map(dayData => {
      const dbDay = existingMap[dayData.date];
      return {
        ...dayData,
        // Prefer DB customEntries (user may have added entries since last seed).
        // Fall back to hardcoded actualMealEntries, then empty array.
        customEntries: dbDay?.customEntries ?? actualMealEntries[dayData.date] ?? [],
      };
    });

    await mealsCollection.updateOne(
      { userId: userIdStr },
      {
        $set: { meals: merged, updatedAt: new Date() },
        $setOnInsert: { userId: userIdStr, username: 'gautam', createdAt: new Date() },
      },
      { upsert: true }
    );

    const newDates = baseMealData
      .filter(d => !existingMap[d.date])
      .map(d => d.date);

    return NextResponse.json({
      success: true,
      message: `Meal plan extended to ${baseMealData[baseMealData.length - 1].date}. ${newDates.length} new days added, existing customEntries preserved.`,
      totalDays: merged.length,
      newDaysAdded: newDates.length,
      newDates,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
