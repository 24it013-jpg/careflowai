export interface FoodItem {
    name: string;
    calories: number; // per 100g or per unit
    protein: number;
    carbs: number;
    fats: number;
    unit: 'g' | 'unit';
}

export const FOOD_DATABASE: Record<string, FoodItem> = {
    'roti': { name: 'Roti', calories: 70, protein: 2, carbs: 15, fats: 0.5, unit: 'unit' },
    'chapati': { name: 'Chapati', calories: 70, protein: 2, carbs: 15, fats: 0.5, unit: 'unit' },
    'rice': { name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: 'g' },
    'paneer': { name: 'Paneer', calories: 265, protein: 18, carbs: 1.2, fats: 20, unit: 'g' },
    'dal': { name: 'Dal', calories: 116, protein: 7, carbs: 20, fats: 0.4, unit: 'g' },
    'chicken': { name: 'Chicken', calories: 165, protein: 31, carbs: 0, fats: 3.6, unit: 'g' },
    'egg': { name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fats: 5, unit: 'unit' },
    'buttermilk': { name: 'Buttermilk', calories: 45, protein: 3, carbs: 5, fats: 1, unit: 'unit' },
    'curd': { name: 'Curd', calories: 98, protein: 3.4, carbs: 4.7, fats: 4.3, unit: 'g' },
    'sabji': { name: 'Mixed Sabji', calories: 85, protein: 2, carbs: 12, fats: 4, unit: 'g' },
};

export interface AnalysisResult {
    text: string;
    analysis: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    itemsFound: string[];
}

export function parseAndAnalyzeFood(input: string): AnalysisResult {
    const lowerInput = input.toLowerCase();
    const result = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    };
    const itemsFound: string[] = [];
    const details: string[] = [];

    // Simple regex to find numbers and food items
    // e.g., "2 roti", "100g rice"
    Object.keys(FOOD_DATABASE).forEach(key => {
        const food = FOOD_DATABASE[key];
        const regex = new RegExp(`(\\d+)\\s*(?:g|grams|unit|units|cup|cups)?\\s*${key}`, 'i');
        const match = lowerInput.match(regex);

        if (match) {
            const quantity = parseInt(match[1]);
            let itemCals = 0;
            let itemProt = 0;
            let itemCarb = 0;
            let itemFat = 0;

            if (food.unit === 'unit') {
                itemCals = food.calories * quantity;
                itemProt = food.protein * quantity;
                itemCarb = food.carbs * quantity;
                itemFat = food.fats * quantity;
                details.push(`${quantity} ${food.name} (${Math.round(itemCals)} kcal)`);
            } else {
                // assume 'g' (per 100g)
                const factor = quantity / 100;
                itemCals = food.calories * factor;
                itemProt = food.protein * factor;
                itemCarb = food.carbs * factor;
                itemFat = food.fats * factor;
                details.push(`${quantity}g ${food.name} (${Math.round(itemCals)} kcal)`);
            }

            result.calories += itemCals;
            result.protein += itemProt;
            result.carbs += itemCarb;
            result.fats += itemFat;
            itemsFound.push(food.name);
        }
    });

    if (itemsFound.length === 0) {
        return {
            text: "I couldn't identify specific quantities. Could you please specify like '2 roti' or '100g rice'?",
            analysis: { calories: 0, protein: 0, carbs: 0, fats: 0 },
            itemsFound: []
        };
    }

    const summaryText = `I've analyzed your meal: ${details.join(', ')}. Total calories are approximately ${Math.round(result.calories)} kcal.`;

    return {
        text: summaryText,
        analysis: {
            calories: Math.round(result.calories),
            protein: Math.round(result.protein),
            carbs: Math.round(result.carbs),
            fats: Math.round(result.fats)
        },
        itemsFound
    };
}
