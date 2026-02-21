import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

// Base suggested meal plan (Feb 5 – Mar 15 2026)
const baseMealData = [
  { date: '2026-02-05', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' }, lunch: { time: '2:00 PM', food: 'Banana (2)' }, dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-06', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Apple (2)' }, dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-07', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' }, lunch: { time: '2:00 PM', food: 'Orange (3–4)' }, dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-08', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' }, lunch: { time: '2:00 PM', food: 'Banana (2)' }, dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-09', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Apple (2)' }, dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-10', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' }, lunch: { time: '2:00 PM', food: 'Orange (3–4)' }, dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-11', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' }, lunch: { time: '2:00 PM', food: 'Banana (2)' }, dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-12', meals: { breakfast: { time: '10:30 AM', food: 'Watermelon' }, lunch: { time: '2:00 PM', food: 'Apple (2)' }, dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-13', meals: { breakfast: { time: '10:30 AM', food: 'Muskmelon' }, lunch: { time: '2:00 PM', food: 'Orange (3–4)' }, dinner: { time: '8:00 PM', food: 'Papaya' } } },
  { date: '2026-02-14', meals: { breakfast: { time: '10:30 AM', food: 'Papaya' }, lunch: { time: '2:00 PM', food: 'Banana (2)' }, dinner: { time: '8:00 PM', food: 'Watermelon' } } },
  { date: '2026-02-15', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-16', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-17', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-18', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' }, lunch: { time: '2:00 PM', food: 'Chole + salad + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-19', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-20', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-21', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-02-22', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-23', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-24', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-25', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' }, lunch: { time: '2:00 PM', food: 'Chole + salad + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-02-26', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-02-27', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-02-28', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-01', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-02', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-03', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-04', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' }, lunch: { time: '2:00 PM', food: 'Chole + salad + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-05', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-06', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-07', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-08', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-09', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-10', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-11', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable poha' }, lunch: { time: '2:00 PM', food: 'Chole + salad + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
  { date: '2026-03-12', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' }, dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' } } },
  { date: '2026-03-13', meals: { breakfast: { time: '10:30 AM', food: 'Sprouts salad' }, lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' }, dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' } } },
  { date: '2026-03-14', meals: { breakfast: { time: '10:30 AM', food: 'Vegetable oats' }, lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' }, dinner: { time: '8:00 PM', food: 'Vegetable soup' } } },
  { date: '2026-03-15', meals: { breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' }, lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' }, dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' } } },
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

    // Find user 'gautam'
    const usersCollection = db.collection('users');
    const gautam = await usersCollection.findOne({ username: 'gautam' });

    if (!gautam) {
      return NextResponse.json(
        { error: "User 'gautam' not found. Please create the account first by signing up in the app." },
        { status: 404 }
      );
    }

    // Build full meals array: base meal plan + actual customEntries merged in
    const mealsWithActual = baseMealData.map(dayData => ({
      ...dayData,
      customEntries: actualMealEntries[dayData.date] || [],
    }));

    // The meals/processedMeals collections key userId as a string (JWT serialises
    // ObjectId → string), so we must match on the string form, not the ObjectId.
    const userIdStr = gautam._id.toString();

    const mealsCollection = db.collection('meals');
    await mealsCollection.updateOne(
      { userId: userIdStr },
      {
        $set: {
          meals: mealsWithActual,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: userIdStr,
          username: 'gautam',
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Also clear any stale processedMeals so analytics reflects fresh actual data
    const processedCollection = db.collection('processedMeals');
    await processedCollection.deleteOne({ userId: userIdStr });

    const datesWithActualMeals = Object.keys(actualMealEntries);
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${mealsWithActual.length} days of meal data for gautam. Actual meals added for: ${datesWithActualMeals.join(', ')}`,
      totalDays: mealsWithActual.length,
      daysWithActualMeals: datesWithActualMeals.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
