const MACRO_KEYS = ["calories", "protein", "carbs", "fat"];

function finiteNumber(value) {
  const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function rounded(value) {
  return Math.round(value * 10) / 10;
}

function firstNumberAfter(text, labels) {
  for (const label of labels) {
    const match = text.match(new RegExp(`${label}[^\\d]{0,28}(\\d+(?:[.,]\\d+)?)`, "i"));
    const value = finiteNumber(match?.[1]);
    if (value != null) return value;
  }
  return null;
}

export function parseNutritionLabelText(rawText) {
  const text = String(rawText || "")
    .replace(/\r/g, "\n")
    .replace(/[|]/g, "I")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
  const oneLine = text.replace(/\n/g, " ");
  const servingLine = text.split("\n").find((line) => /serving size/i.test(line)) || "";
  const servingMatch = servingLine.match(/serving size\s*:?\s*(.+?)(?=\s+(?:amount|calories|servings per)|$)/i);
  const servingNote = servingMatch?.[1]?.trim() || "1 serving";
  const result = {
    name: "",
    servingNote,
    calories: firstNumberAfter(oneLine, ["calories"]),
    fat: firstNumberAfter(oneLine, ["total\\s+fat"]),
    carbs: firstNumberAfter(oneLine, ["total\\s+carbohydrate", "total\\s+carb", "carbohydrate"]),
    protein: firstNumberAfter(oneLine, ["protein"]),
    source: "nutrition-label",
    sourceText: text,
    warnings: [],
  };

  MACRO_KEYS.forEach((key) => {
    if (result[key] == null) result.warnings.push(`Could not confidently read ${key}.`);
    else result[key] = rounded(result[key]);
  });
  const gramAmount = finiteNumber(servingNote.match(/(\d+(?:[.,]\d+)?)\s*g\b/i)?.[1]);
  if (gramAmount != null && gramAmount > 500) {
    result.warnings.push("The serving-size weight looks unusually large. Check the label.");
  }
  const macroCalories = (result.protein || 0) * 4 + (result.carbs || 0) * 4 + (result.fat || 0) * 9;
  if (result.calories > 0 && macroCalories > 0) {
    const difference = Math.abs(macroCalories - result.calories);
    if (difference > Math.max(45, result.calories * 0.35)) {
      result.warnings.push("Calories and macros do not cross-check closely. Review the photo and values.");
    }
  }
  return result;
}

export function normalizeBarcode(value) {
  const code = String(value || "").replace(/\D/g, "");
  return code.length >= 8 && code.length <= 14 ? code : "";
}

function nutriment(product, key) {
  return finiteNumber(product?.nutriments?.[key]);
}

export function foodFromOpenFoodFacts(product, code = "") {
  if (!product || typeof product !== "object") return null;
  const servingQuantity = finiteNumber(product.serving_quantity);
  const scale = servingQuantity != null ? servingQuantity / 100 : 1;
  const value = (key) => {
    const perServing = nutriment(product, `${key}_serving`);
    if (perServing != null) return perServing;
    const per100g = nutriment(product, `${key}_100g`);
    return per100g != null ? per100g * scale : null;
  };
  const calories = value("energy-kcal");
  const protein = value("proteins");
  const carbs = value("carbohydrates");
  const fat = value("fat");
  if ([calories, protein, carbs, fat].every((item) => item == null)) return null;
  const productName = String(product.product_name || "").trim();
  const brand = String(product.brands || "").split(",")[0].trim();
  const displayName = brand && productName.toLowerCase().includes(brand.toLowerCase())
    ? productName
    : [brand, productName].filter(Boolean).join(" ");
  return {
    name: displayName || `Barcode ${code || product.code || ""}`.trim(),
    calories: rounded(calories || 0),
    protein: rounded(protein || 0),
    carbs: rounded(carbs || 0),
    fat: rounded(fat || 0),
    servingNote: String(product.serving_size || "").trim() || (servingQuantity ? `${servingQuantity} g` : "per 100 g"),
    source: "open-food-facts",
    barcode: code || String(product.code || ""),
    warnings: [
      ...(productName ? [] : ["Product name was missing."]),
      ...(servingQuantity || nutriment(product, "energy-kcal_serving") != null ? [] : ["No serving size was available; values are per 100 g."]),
    ],
  };
}

export async function lookupOpenFoodFactsBarcode(value, fetchImpl = fetch) {
  const code = normalizeBarcode(value);
  if (!code) throw new Error("Enter an 8–14 digit barcode.");
  const fields = "code,product_name,brands,serving_size,serving_quantity,nutriments";
  const response = await fetchImpl(`https://world.openfoodfacts.org/api/v3/product/${code}.json?fields=${encodeURIComponent(fields)}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error("That barcode was not found.");
    throw new Error("The food lookup service is unavailable. You can still enter the label manually.");
  }
  const payload = await response.json();
  const food = foodFromOpenFoodFacts(payload.product, code);
  if (!food) throw new Error("The product was found, but usable nutrition values were missing.");
  return food;
}
