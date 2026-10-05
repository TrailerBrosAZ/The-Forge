import { useEffect, useMemo, useState } from "react";
import {
  calculateRecipeNutrition,
  createRecipeFood,
  isLegacyRecipe,
  positiveNumber,
} from "../lib/recipes.js";
import "./RecipeEditor.css";

const ENTRY_MODES = ["manual", "barcode", "label"];

function draftFromRecipe(recipe) {
  const legacy = isLegacyRecipe(recipe);
  return {
    name: recipe?.name || "",
    yieldPortions: recipe?.recipeMeta?.yieldPortions ?? 1,
    cookedBatchGrams: recipe?.recipeMeta?.cookedWeightGrams ?? recipe?.recipeMeta?.cookedBatchGrams ?? "",
    ingredients: legacy ? [] : (recipe?.recipeMeta?.ingredients || []).map((ingredient, index) => ({
      ingredientId: ingredient.ingredientId || `ingredient-${index + 1}`,
      sourceId: ingredient.sourceId ?? null,
      quantity: ingredient.quantity ?? 1,
      snapshot: { ...(ingredient.snapshot || {}) },
    })),
  };
}

function ingredientKey() {
  return `recipe-ingredient-${Math.random().toString(36).slice(2, 10)}`;
}

function macroLine(nutrition) {
  return `${Math.round(nutrition.calories)} cal · P${Math.round(nutrition.protein)} · C${Math.round(nutrition.carbs)} · F${Math.round(nutrition.fat)}`;
}

/**
 * A reusable recipe editor. renderIngredientEntry(mode, onSelect) lets the
 * host place its existing manual, barcode, and label flows inside this editor.
 */
export default function RecipeEditor({
  myFoods = [],
  initialRecipe,
  onSave,
  onLog,
  onCancel,
  renderIngredientEntry,
}) {
  const [draft, setDraft] = useState(() => draftFromRecipe(initialRecipe));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [entryMode, setEntryMode] = useState(null);
  const [savedRecipe, setSavedRecipe] = useState(initialRecipe || null);
  const [recordId, setRecordId] = useState(() => initialRecipe?.id || null);
  const [isDirty, setIsDirty] = useState(false);
  const [rebuildingLegacy, setRebuildingLegacy] = useState(false);
  const [message, setMessage] = useState("");
  const [logMode, setLogMode] = useState("portions");
  const [logAmount, setLogAmount] = useState(1);
  const legacyRecipe = isLegacyRecipe(initialRecipe) && !rebuildingLegacy;

  useEffect(() => {
    setDraft(draftFromRecipe(initialRecipe));
    setSavedRecipe(initialRecipe || null);
    setRecordId(initialRecipe?.id || null);
    setIsDirty(false);
    setRebuildingLegacy(false);
    setPickerOpen(false);
    setEntryMode(null);
    setMessage("");
    setLogMode("portions");
    setLogAmount(1);
  }, [initialRecipe]);

  const calculation = useMemo(() => calculateRecipeNutrition(draft), [draft]);
  const canSave = Boolean(draft.name.trim()) && calculation.valid && !legacyRecipe;

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setIsDirty(true);
  }

  function addIngredient(food) {
    if (!food) return;
    setDraft((current) => ({
      ...current,
      ingredients: [...current.ingredients, {
        ingredientId: ingredientKey(),
        sourceId: food.id || null,
        quantity: 1,
        snapshot: {
          name: food.name || "Untitled ingredient",
          servingNote: food.servingNote || "1 serving",
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        },
      }],
    }));
    setPickerOpen(false);
    setEntryMode(null);
    setIsDirty(true);
  }

  function removeIngredient(ingredientId) {
    setDraft((current) => ({ ...current, ingredients: current.ingredients.filter((item) => item.ingredientId !== ingredientId) }));
    setIsDirty(true);
  }

  function setQuantity(ingredientId, quantity) {
    setDraft((current) => ({
      ...current,
      ingredients: current.ingredients.map((item) => item.ingredientId === ingredientId ? { ...item, quantity } : item),
    }));
    setIsDirty(true);
  }

  async function saveRecipe() {
    const result = createRecipeFood({
      ...draft,
      id: recordId || `recipe-${Math.random().toString(36).slice(2, 10)}`,
      previousRecipe: savedRecipe || initialRecipe,
    });
    if (!result.recipe) {
      setMessage(result.errors[0]);
      return;
    }
    const stored = await onSave?.(result.recipe);
    const saved = stored || result.recipe;
    setSavedRecipe(saved);
    setRecordId(saved.id || result.recipe.id);
    setIsDirty(false);
    setMessage("Recipe saved. Log a portion when you are ready.");
  }

  async function logPortion() {
    const recipe = savedRecipe || initialRecipe;
    if (!recipe) return;
    if (isDirty) { setMessage("Save changes before logging a portion."); return; }
    const cookedWeight = recipe.recipeMeta?.cookedWeightGrams ?? recipe.recipeMeta?.cookedBatchGrams;
    const gramsPerPortion = cookedWeight && recipe.recipeMeta?.yieldPortions
      ? cookedWeight / recipe.recipeMeta.yieldPortions
      : calculation.gramsPerPortion;
    const entered = positiveNumber(logAmount);
    const portions = logMode === "grams" && gramsPerPortion ? entered / gramsPerPortion : entered;
    if (!positiveNumber(portions)) { setMessage("Enter an amount greater than 0."); return; }
    await onLog?.(recipe, portions);
    setMessage(`${Number(portions.toFixed(2))} portion${portions === 1 ? "" : "s"} added to the log.`);
  }

  if (legacyRecipe) {
    return (
      <section className="recipe-editor forge-surface" aria-label="Legacy recipe">
        <h2 className="recipe-editor__title">{initialRecipe.name || "Saved recipe"}</h2>
        <p className="recipe-editor__hint">Ingredient details are unavailable for this older recipe. You can still log its saved portion below. Rebuild it as a new recipe before replacing it.</p>
        <div className="recipe-editor__preview"><strong>{macroLine(initialRecipe)}</strong><span>{initialRecipe.servingNote || "1 portion"}</span></div>
        <div className="recipe-editor__actions">
          {onLog && <button className="recipe-editor__primary" type="button" onClick={logPortion}>Log 1 portion</button>}
          <button className="recipe-editor__secondary" type="button" onClick={() => {
            setDraft({ name: initialRecipe.name || "", yieldPortions: 1, cookedBatchGrams: "", ingredients: [] });
            setSavedRecipe(initialRecipe);
            setRecordId(initialRecipe.id || null);
            setRebuildingLegacy(true);
            setIsDirty(true);
            setMessage("");
          }}>Rebuild recipe</button>
        </div>
        {onCancel && <button className="recipe-editor__text-button" type="button" onClick={onCancel}>Back</button>}
        {message && <p className="recipe-editor__status" role="status">{message}</p>}
      </section>
    );
  }

  return (
    <section className="recipe-editor forge-surface" aria-label="Recipe editor">
      <div className="recipe-editor__header">
        <div><p className="recipe-editor__eyebrow">{initialRecipe ? "Edit saved recipe" : "New recipe"}</p><h2 className="recipe-editor__title">Build a batch</h2></div>
        {onCancel && <button className="recipe-editor__text-button" type="button" onClick={onCancel}>Cancel</button>}
      </div>

      <label className="recipe-editor__field">
        <span>Recipe name</span>
        <input aria-label="Recipe name" value={draft.name} placeholder="e.g. Protein oats" onChange={(event) => updateDraft("name", event.target.value)} />
      </label>
      <div className="recipe-editor__ingredient-heading"><h3>Ingredients</h3><span>Each quantity uses the saved food’s base serving.</span></div>
      {draft.ingredients.length === 0 && <p className="recipe-editor__empty">Add a saved food or enter one now.</p>}
      <div className="recipe-editor__ingredients">
        {draft.ingredients.map((ingredient, index) => (
          <div className="recipe-editor__ingredient" key={ingredient.ingredientId}>
            <div className="recipe-editor__ingredient-copy"><strong>{ingredient.snapshot.name || `Ingredient ${index + 1}`}</strong><span>{ingredient.snapshot.servingNote || "1 serving"} · {macroLine(ingredient.snapshot)}</span></div>
            <label className="recipe-editor__quantity"><span>Qty</span><input aria-label={`Quantity for ${ingredient.snapshot.name || `ingredient ${index + 1}`}`} type="number" min="0.01" step="0.25" inputMode="decimal" value={ingredient.quantity} onChange={(event) => setQuantity(ingredient.ingredientId, event.target.value)} /></label>
            <button className="recipe-editor__remove" type="button" aria-label={`Remove ${ingredient.snapshot.name || `ingredient ${index + 1}`}`} onClick={() => removeIngredient(ingredient.ingredientId)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="recipe-editor__add-row">
        <button className="recipe-editor__secondary" type="button" onClick={() => { setPickerOpen((open) => !open); setEntryMode(null); }}>Add saved food</button>
        {ENTRY_MODES.map((mode) => <button key={mode} className="recipe-editor__secondary" type="button" onClick={() => { setEntryMode(entryMode === mode ? null : mode); setPickerOpen(false); }}>{mode === "manual" ? "Manual" : mode === "barcode" ? "Barcode" : "Scan label"}</button>)}
      </div>
      {pickerOpen && <div className="recipe-editor__picker" aria-label="Saved foods">
        {myFoods.length === 0 ? <p className="recipe-editor__empty">No saved foods yet.</p> : myFoods.map((food) => <button key={food.id || `${food.name}-${food.servingNote}`} type="button" onClick={() => addIngredient(food)}><strong>{food.name}</strong><span>{food.servingNote || "1 serving"} · {macroLine(food)}</span></button>)}
      </div>}
      {entryMode && <div className="recipe-editor__entry">{typeof renderIngredientEntry === "function" ? renderIngredientEntry(entryMode, addIngredient) : <p className="recipe-editor__empty">This entry method is not available here.</p>}</div>}

      <div className="recipe-editor__yield-grid">
        <label className="recipe-editor__field">
          <span>Batch yield (portions)</span>
          <input aria-label="Batch yield in portions" type="number" min="0.1" step="0.5" inputMode="decimal" value={draft.yieldPortions} onChange={(event) => updateDraft("yieldPortions", event.target.value)} />
        </label>
        <label className="recipe-editor__field">
          <span>Cooked batch weight (g) <em>optional</em></span>
          <input aria-label="Cooked batch weight in grams" type="number" min="1" step="1" inputMode="decimal" placeholder="e.g. 800" value={draft.cookedBatchGrams} onChange={(event) => updateDraft("cookedBatchGrams", event.target.value)} />
        </label>
      </div>

      <div className="recipe-editor__preview" aria-live="polite">
        <div><span>Whole batch</span><strong>{macroLine(calculation.totals)}</strong></div>
        <div><span>Per portion</span><strong>{macroLine(calculation.perPortion)}</strong>{calculation.gramsPerPortion && <small>~{Math.round(calculation.gramsPerPortion)} g cooked</small>}</div>
      </div>
      {!calculation.valid && draft.ingredients.length > 0 && <p className="recipe-editor__error" role="alert">{calculation.errors[0]}</p>}
      {isDirty && savedRecipe && <p className="recipe-editor__hint">Save changes before logging a portion.</p>}
      {message && <p className="recipe-editor__status" role="status">{message}</p>}
      {(savedRecipe || initialRecipe) && (
        <div className="recipe-editor__log-controls">
          <label className="recipe-editor__field"><span>{logMode === "grams" ? "Cooked grams to log" : "Portions to log"}</span><input aria-label={logMode === "grams" ? "Cooked grams to log" : "Portions to log"} type="number" min="0.01" step={logMode === "grams" ? "1" : "0.25"} inputMode="decimal" value={logAmount} onChange={(event) => setLogAmount(event.target.value)} /></label>
          {(savedRecipe?.recipeMeta?.cookedWeightGrams || initialRecipe?.recipeMeta?.cookedWeightGrams || initialRecipe?.recipeMeta?.cookedBatchGrams || calculation.cookedBatchGrams) && <button className="recipe-editor__text-button" type="button" onClick={() => { setLogMode((mode) => mode === "grams" ? "portions" : "grams"); setLogAmount(1); }}>Use {logMode === "grams" ? "portions" : "grams"}</button>}
        </div>
      )}
      <div className="recipe-editor__actions">
        <button className="recipe-editor__primary" type="button" disabled={!canSave} onClick={saveRecipe}>Save recipe</button>
        <button className="recipe-editor__secondary" type="button" disabled={isDirty || !savedRecipe} onClick={logPortion}>Log {logMode === "grams" ? "amount" : "portions"}</button>
      </div>
    </section>
  );
}
