import assert from "node:assert/strict";
import {
  calculateRecipeNutrition,
  createRecipeFood,
  createRecipePortionEntry,
  isLegacyRecipe,
} from "../src/lib/recipes.js";

const chicken = { id: "chicken", name: "Chicken", servingNote: "100 g", calories: 165, protein: 31, carbs: 0, fat: 3.6 };
const rice = { id: "rice", name: "Rice", servingNote: "1 cup", calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4 };
const ingredients = [{ ingredientId: "a", sourceId: chicken.id, quantity: 2, snapshot: chicken }, { ingredientId: "b", sourceId: rice.id, quantity: 3, snapshot: rice }];

const nutrition = calculateRecipeNutrition({ ingredients, yieldPortions: 4, cookedBatchGrams: 1200 });
assert.equal(nutrition.valid, true);
assert.equal(nutrition.totals.calories, 945);
assert.equal(nutrition.perPortion.calories, 236.25);
assert.equal(nutrition.gramsPerPortion, 300);

for (const invalidQuantity of [0, -1, "", "not a number", Number.NaN]) {
  const result = calculateRecipeNutrition({ ingredients: [{ ...ingredients[0], quantity: invalidQuantity }], yieldPortions: 1 });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /quantity/i);
}
for (const invalidYield of [0, -2, "", "nope", Number.NaN]) {
  const result = calculateRecipeNutrition({ ingredients: [ingredients[0]], yieldPortions: invalidYield });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /yield/i);
}
assert.equal(calculateRecipeNutrition({ ingredients: [], yieldPortions: 1 }).valid, false);
assert.equal(calculateRecipeNutrition({ ingredients: [ingredients[0]], yieldPortions: 1, cookedBatchGrams: -5 }).valid, false);

const created = createRecipeFood({ name: "Chicken rice", ingredients, yieldPortions: 4, cookedBatchGrams: 1200, id: "recipe-1" });
assert.equal(created.errors.length, 0);
assert.equal(created.recipe.id, "recipe-1");
assert.equal(created.recipe.isRecipe, true);
assert.equal(created.recipe.calories, 236);
assert.equal(created.recipe.recipeMeta.ingredients[0].snapshot.calories, 165);
assert.match(created.recipe.servingNote, /300 g cooked/);

// Editing the source food or later recipe leaves both saved recipe snapshots and logs unchanged.
chicken.calories = 999;
assert.equal(created.recipe.recipeMeta.ingredients[0].snapshot.calories, 165);
const logged = createRecipePortionEntry(created.recipe, 2);
const originalLoggedCalories = logged.calories;
created.recipe.calories = 1;
created.recipe.recipeMeta.ingredients[0].snapshot.calories = 1;
assert.equal(logged.calories, originalLoggedCalories);
assert.equal(logged.baseCalories, 236);
assert.equal(isLegacyRecipe({ isRecipe: true, calories: 200 }), true);
assert.equal(isLegacyRecipe(created.recipe), false);

console.log("Recipe calculation tests passed.");
