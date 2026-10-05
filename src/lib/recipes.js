/**
 * Recipe records are saved-food records with a small, additive recipeMeta
 * payload. Logged food entries should be created with createRecipePortionEntry
 * so future edits to a recipe never change nutrition already logged.
 */
export const RECIPE_SCHEMA_VERSION = 1;

const NUTRIENTS = ["calories", "protein", "carbs", "fat"];

export function finiteNumber(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function positiveNumber(value) {
  const number = finiteNumber(value);
  return number != null && number > 0 ? number : null;
}

export function recipeFoodSnapshot(food = {}) {
  return {
    name: String(food.name || "").trim(),
    servingNote: String(food.servingNote || "1 serving").trim() || "1 serving",
    calories: nonNegative(food.calories),
    protein: nonNegative(food.protein),
    carbs: nonNegative(food.carbs),
    fat: nonNegative(food.fat),
  };
}

function nonNegative(value) {
  const number = finiteNumber(value);
  return number != null && number >= 0 ? number : 0;
}

function snapshotFromIngredient(ingredient = {}) {
  return recipeFoodSnapshot(ingredient.snapshot || ingredient.food || ingredient);
}

/** Calculate batch and portion nutrition without mutating food or ingredient input. */
export function calculateRecipeNutrition({ ingredients, yieldPortions, cookedBatchGrams, cookedWeightGrams } = {}) {
  const errors = [];
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  if (safeIngredients.length === 0) errors.push("Add at least one ingredient.");

  const normalizedIngredients = safeIngredients.map((ingredient, index) => {
    const snapshot = snapshotFromIngredient(ingredient);
    const quantity = positiveNumber(ingredient.quantity);
    if (!snapshot.name) errors.push(`Ingredient ${index + 1} needs a name.`);
    if (quantity == null) errors.push(`Ingredient ${index + 1} needs a quantity greater than 0.`);
    return {
      ingredientId: ingredient.ingredientId || ingredient.id || `ingredient-${index + 1}`,
      sourceId: ingredient.sourceId ?? ingredient.foodId ?? ingredient.food?.id ?? null,
      quantity,
      snapshot,
    };
  });

  const portions = positiveNumber(yieldPortions);
  if (portions == null) errors.push("Batch yield needs a number of portions greater than 0.");

  const cookedWeightInput = cookedWeightGrams ?? cookedBatchGrams;
  const hasCookedWeight = cookedWeightInput !== "" && cookedWeightInput != null;
  const cookedWeight = hasCookedWeight ? positiveNumber(cookedWeightInput) : null;
  if (hasCookedWeight && cookedWeight == null) errors.push("Cooked batch weight must be greater than 0 grams.");

  const totals = normalizedIngredients.reduce((total, ingredient) => {
    if (ingredient.quantity == null) return total;
    NUTRIENTS.forEach((key) => { total[key] += ingredient.snapshot[key] * ingredient.quantity; });
    return total;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const perPortion = Object.fromEntries(NUTRIENTS.map((key) => [key, portions ? totals[key] / portions : 0]));

  return {
    valid: errors.length === 0,
    errors,
    ingredients: normalizedIngredients,
    yieldPortions: portions,
    cookedBatchGrams: cookedWeight,
    gramsPerPortion: portions && cookedWeight ? cookedWeight / portions : null,
    totals,
    perPortion,
  };
}

function rounded(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function roundRecipeNutrition(nutrition) {
  return {
    calories: Math.round(nutrition.calories || 0),
    protein: rounded(nutrition.protein || 0, 1),
    carbs: rounded(nutrition.carbs || 0, 1),
    fat: rounded(nutrition.fat || 0, 1),
  };
}

/**
 * Builds a saved-food-compatible recipe record. Invalid input yields recipe:
 * null and validation details instead of a partially valid saved food.
 */
export function createRecipeFood({ name, ingredients, yieldPortions, cookedBatchGrams, cookedWeightGrams, id, previousRecipe } = {}) {
  const calculation = calculateRecipeNutrition({ ingredients, yieldPortions, cookedBatchGrams, cookedWeightGrams });
  const recipeName = String(name || "").trim();
  const errors = recipeName ? [...calculation.errors] : ["Recipe name is required.", ...calculation.errors];
  if (errors.length) return { recipe: null, calculation: { ...calculation, valid: false, errors }, errors };

  const gramsPerPortion = calculation.gramsPerPortion;
  const servingNote = gramsPerPortion
    ? `1 portion (~${rounded(gramsPerPortion, 0)} g cooked)`
    : "1 portion";
  const recipeMeta = {
    schemaVersion: RECIPE_SCHEMA_VERSION,
    ingredients: calculation.ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId,
      sourceId: ingredient.sourceId,
      quantity: ingredient.quantity,
      snapshot: { ...ingredient.snapshot },
    })),
    yieldPortions: calculation.yieldPortions,
    cookedWeightGrams: calculation.cookedBatchGrams,
  };
  const recipe = {
    ...(previousRecipe || {}),
    ...(id ? { id } : {}),
    name: recipeName,
    ...roundRecipeNutrition(calculation.perPortion),
    servingNote,
    isRecipe: true,
    recipeMeta,
  };
  return { recipe, calculation, errors: [] };
}

/** Detect old recipes, which can still be logged but cannot be rebuilt accurately. */
export function isLegacyRecipe(recipe) {
  return Boolean(recipe?.isRecipe) && !Array.isArray(recipe?.recipeMeta?.ingredients);
}

/** Create an independent logged-entry snapshot for one or more recipe portions. */
export function createRecipePortionEntry(recipe, portions = 1) {
  const amount = positiveNumber(portions);
  if (amount == null) return null;
  const perPortion = recipeFoodSnapshot(recipe);
  const nutrition = Object.fromEntries(NUTRIENTS.map((key) => [key, perPortion[key] * amount]));
  return {
    name: perPortion.name,
    ...roundRecipeNutrition(nutrition),
    baseCalories: perPortion.calories,
    baseProtein: perPortion.protein,
    baseCarbs: perPortion.carbs,
    baseFat: perPortion.fat,
    servingNote: perPortion.servingNote,
    servings: amount,
    isRecipe: true,
    recipeId: recipe?.id || null,
    recipeSchemaVersion: recipe?.recipeMeta?.schemaVersion || null,
    // This is intentionally a value snapshot, not a reference to recipeMeta.
    recipeNameAtLog: perPortion.name,
    source: "recipe",
  };
}
