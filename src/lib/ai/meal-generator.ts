import { DietPreference, Goal } from "./nutrition-calculator";

interface Meal {
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    name: string;
    cal: number;
    protein: number;
    fats: number;
    carbs: number;
    image: string;
    description: string;
}

const MEAL_DATABASE: Record<DietPreference, Meal[]> = {
    'veg': [
        { type: 'Breakfast', name: 'Paneer Bhurji with Multigrain Roti', cal: 350, protein: 22, fats: 15, carbs: 30, image: '🍳', description: 'Scrambled cottage cheese with turmeric and veggies.' },
        { type: 'Breakfast', name: 'Greek Yogurt with Mixed Berries & Walnuts', cal: 300, protein: 18, fats: 10, carbs: 35, image: '🥣', description: 'High protein yogurt bowl with antioxidants.' },
        { type: 'Lunch', name: 'Dal Tadka with Brown Rice & Broccoli', cal: 500, protein: 20, fats: 12, carbs: 75, image: '🍲', description: 'Yellow lentil temper with fiber-rich rice.' },
        { type: 'Lunch', name: 'Chickpea & Quinoa Mediterranean Bowl', cal: 550, protein: 22, fats: 18, carbs: 70, image: '🥗', description: 'Roasted chickpeas, olives, and feta over quinoa.' },
        { type: 'Dinner', name: 'Soya Chunk Curry with Sautéed Spinach', cal: 400, protein: 35, fats: 8, carbs: 25, image: '🍛', description: 'High protein soya chunks in a light tomato gravy.' },
        { type: 'Dinner', name: 'Tofu Stir-fry with Bell Peppers & Bok Choy', cal: 380, protein: 25, fats: 15, carbs: 20, image: '🥢', description: 'Crispy tofu with vibrant vegetables.' },
    ],
    'non-veg': [
        { type: 'Breakfast', name: 'Omelette with Spinach & Smoked Salmon', cal: 400, protein: 30, fats: 20, carbs: 5, image: '🍳', description: 'Omega-3 rich breakfast with leafy greens.' },
        { type: 'Breakfast', name: 'Egg White Scramble with Whole Wheat Toast', cal: 320, protein: 25, fats: 8, carbs: 35, image: '🍞', description: 'Lean protein start to the day.' },
        { type: 'Lunch', name: 'Grilled Chicken Breast with Sweet Potato', cal: 550, protein: 45, fats: 10, carbs: 65, image: '🍗', description: 'Classic bodybuilding meal with complex carbs.' },
        { type: 'Lunch', name: 'Baked Fish with Asparagus & Quinoa', cal: 480, protein: 38, fats: 12, carbs: 50, image: '🐟', description: 'Light yet filling high-protein lunch.' },
        { type: 'Dinner', name: 'Lean Beef Stir-fry with Broccoli', cal: 500, protein: 40, fats: 18, carbs: 30, image: '🥩', description: 'Iron-rich dinner with cruciferous veggies.' },
        { type: 'Dinner', name: 'Turkey Meatballs with Zucchini Noodles', cal: 420, protein: 35, fats: 15, carbs: 20, image: '🍝', description: 'Low-carb high-protein alternative to pasta.' },
    ]
};

export function getRecommendedMeals(preference: DietPreference, goal: Goal, targetCals: number): Meal[] {
    const pool = MEAL_DATABASE[preference];
    
    // Simple selection logic: pick one of each type
    const breakfast = pool.filter(m => m.type === 'Breakfast')[Math.floor(Math.random() * 2)];
    const lunch = pool.filter(m => m.type === 'Lunch')[Math.floor(Math.random() * 2)];
    const dinner = pool.filter(m => m.type === 'Dinner')[Math.floor(Math.random() * 2)];

    return [breakfast, lunch, dinner];
}
