// dom elements
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const headerCategoryFilter = document.getElementById(
  "category-filter"
) as HTMLSelectElement;
const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;

const nameInput = document.getElementById("name") as HTMLInputElement;
const formCategory = document.getElementById("category") as HTMLSelectElement;
const timeInput = document.getElementById("time") as HTMLInputElement;

const ingredientsList = document.getElementById(
  "ingredients-list"
) as HTMLDivElement;
const ingredientName = document.getElementById("ing-name") as HTMLInputElement;
const ingredientAmount = document.getElementById(
  "ing-amount"
) as HTMLInputElement;
const ingredientUnit = document.getElementById("ing-unit") as HTMLInputElement;
const addIngredientBtn = document.getElementById(
  "add-ingredient"
) as HTMLButtonElement;

const stepsList = document.getElementById("steps-list") as HTMLOListElement;
const stepText = document.getElementById("step-text") as HTMLInputElement;
const addStepBtn = document.getElementById("add-step") as HTMLButtonElement;

const imageUrl = document.getElementById("image-url") as HTMLInputElement;
const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;

const recipesList = document.getElementById("recipes-list") as HTMLDivElement;

const previewCard = document.getElementById("preview-card") as HTMLDivElement;
const previewContent = document.getElementById(
  "preview-content"
) as HTMLDivElement;

// interfaces
interface Ingredients {
  id: string;
  IngName: string;
  amount: string;
  unit: string;
}

interface Steps {
  id: string;
  description: string;
}

interface Recipe {
  id: string;
  name: string;
  category: string;
  time: string;
  ingredients: Ingredients[];
  steps: Steps[];
  image?: string | null;
}

let ingredients: Ingredients[] = [];
let steps: Steps[] = [];
let recipe: Recipe[] = JSON.parse(localStorage.getItem("recipes") || "[]");

// recipes list
function recipeList() {
  recipesList.innerHTML = "";
  const card = document.createElement("div");
  card.className = "recipe-card";
  const getItems = JSON.parse(localStorage.getItem("recipes") || "[]");
  recipe.forEach((r) => {
    const meta = document.createElement("div");
    meta.className = "recipe-meta";
    const title = document.createElement("h4");
    title.textContent = r.name;
    const sub = document.createElement("div");
    sub.innerHTML = `<small>${r.category} • ${r.time} min</small>`;
    const deleteRes = document.createElement("button");
    deleteRes.setAttribute("onclick", `delRes('${r.id}')`);
    deleteRes.textContent = "delete";

    const seePreview = document.createElement("button");
    seePreview.setAttribute(
      "onclick",
      `preview(${JSON.stringify(r.name)}, ${JSON.stringify(
        r.category
      )}, ${JSON.stringify(r.time)}, ${JSON.stringify(
        r.ingredients
      )}, ${JSON.stringify(r.steps)}, ${JSON.stringify(r.image)})`
    );

    seePreview.textContent = "preview";
    meta.appendChild(title);
    meta.appendChild(sub);
    meta.appendChild(deleteRes);
    meta.appendChild(seePreview);
    recipesList.appendChild(meta);
  });
}


// delete Recipe
function delRes(id: string) {
  recipe = recipe.filter((r) => r.id !== id);
  localStorage.setItem("recipes", JSON.stringify(recipe));
  recipeList();
}


// preview
function preview(
  name: string,
  category: string,
  time: string,
  ingredients: Ingredients[],
  steps: Steps[],
  image: string
) {
  previewCard.style.display = "inline-block";
  previewContent.textContent = "";

  const img = document.createElement("img");
  if (image && image.trim() !== "") {
    img.src = image;
  } else {
    img.src =
      "https://png.pngtree.com/png-clipart/20220117/original/pngtree-ai-vector-food-illustration-png-image_7136349.png";
  }

  const preName = document.createElement("h4");
  preName.textContent = name;

  const preCategory = document.createElement("h6");
  preCategory.textContent = "Category : " + category;

  const preTime = document.createElement("p");
  preTime.textContent = "Time : " + time;

  const preIngredientsTitle = document.createElement("h5");
  preIngredientsTitle.textContent = "Ingredients:";

  const preIngredients = document.createElement("ul");

  if (ingredients.length > 0) {
    ingredients.forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = `${ing.amount} ${ing.unit} - ${ing.IngName}`;
      preIngredients.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "(No ingredients)";
    preIngredients.appendChild(li);
  }

  const preStepsTitle = document.createElement("h5");
  preStepsTitle.textContent = "Steps:";

  const preSteps = document.createElement("ol");

  if (steps.length > 0) {
    steps.forEach((st) => {
      const li = document.createElement("li");
      li.textContent = st.description;
      preSteps.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "(No steps)";
    preSteps.appendChild(li);
  }

  previewContent.appendChild(img);
  previewContent.appendChild(preName);
  previewContent.appendChild(preCategory);
  previewContent.appendChild(preTime);

  previewContent.appendChild(preIngredientsTitle);
  previewContent.appendChild(preIngredients);

  previewContent.appendChild(preStepsTitle);
  previewContent.appendChild(preSteps);
}


// add ingredients
function addIngredient(ingname: string, ingamount: string, ingunit: string) {
  const newIngredient: Ingredients = {
    id: crypto.randomUUID(),
    IngName: ingname,
    amount: ingamount,
    unit: ingunit,
  };
  ingredients.push(newIngredient);

  ingredientsList.innerHTML = "";
  ingredients.forEach((ing) => {
    const row = document.createElement("div");
    row.className = "form-row inline";
    row.innerHTML = `
        <div style="flex:1;">
        <strong>${ing.IngName}</strong>
        <div style="font-size:12px;color:#64748b">${ing.amount || ""} ${
      ing.unit || ""
    }</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="icon-btn" onclick="IngDel('${
          ing.id
        }')" data-action="del-ing" data-id="${ing.id}">🗑️</button>
      </div>
    `;
    ingredientsList.appendChild(row);
  });
}

// delete ingredients
function IngDel(id: string) {
  ingredientsList.innerHTML = "";
  ingredients = ingredients.filter((f) => f.id !== id);

  ingredients.forEach((ing) => {
    const row = document.createElement("div");
    row.className = "form-row inline";
    row.innerHTML = `
        <div style="flex:1;">
        <strong>${ing.IngName}</strong>
        <div style="font-size:12px;color:#64748b">${ing.amount || ""} ${
      ing.unit || ""
    }</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="icon-btn" onclick="IngDel('${
          ing.id
        }')" data-action="del-ing" data-id="${ing.id}">🗑️</button>
      </div>
    `;
    ingredientsList.appendChild(row);
  });
}

// add steps
function addStep(steptext: string) {
  const newstep: Steps = { id: crypto.randomUUID(), description: steptext };
  steps.push(newstep);

  stepsList.innerHTML = "";
  steps.forEach((step) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <span style="flex:1">${step.description}</span>
        <div style="display:flex;gap:6px">
          <button class="icon-btn" onclick="stepDel('${step.id}')" data-action="del-step" data-index="${step.id}">🗑️</button>
        </div>
      </div>
    `;
    stepsList.appendChild(li);
  });
}

// delete steps
function stepDel(id: string) {
  steps = steps.filter((s) => s.id !== id);
  stepsList.innerHTML = "";

  steps.forEach((step) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <span style="flex:1">${step.description}</span>
        <div style="display:flex;gap:6px">
          <button class="icon-btn" onclick="stepDel('${step.id}')" data-action="del-step" data-index="${step.id}">🗑️</button>
        </div>
      </div>
    `;
    stepsList.appendChild(li);
  });
}

// save form
function saveForm(
  name: string,
  category: string,
  time: string,
  image: string | null
) {
  const newForm: Recipe = {
    id: crypto.randomUUID(),
    name: name,
    category: category,
    time: time,
    ingredients: ingredients,
    steps: steps,
    image: image,
  };
  recipe.push(newForm);
  localStorage.setItem("recipes", JSON.stringify(recipe));

  ingredients = [];
  steps = [];
  nameInput.value = "";
  formCategory.value = "Breakfast";
  timeInput.value = "30";
  ingredientsList.innerHTML = "";
  ingredientName.value = "";
  ingredientAmount.value = "";
  ingredientUnit.value = "";
  stepsList.innerHTML = "";
  stepText.value = "";
  imageUrl.value = "";

  recipeList();
}

//events
addIngredientBtn.addEventListener("click", () => {
  const ingname = ingredientName.value;
  const ingamount = ingredientAmount.value;
  const ingunit = ingredientUnit.value;
  if (!ingname || !ingamount || !ingunit) {
    alert("fill the ingredient inputs");
  } else {
    addIngredient(ingname, ingamount, ingunit);
  }
});

addStepBtn.addEventListener("click", () => {
  const steptext = stepText.value;
  if (!steptext) {
    alert("fill the step input");
  } else {
    addStep(steptext);
  }
});

saveBtn.addEventListener("click", () => {
  const name = nameInput.value;
  const category = formCategory.value;
  const time = timeInput.value;
  const image = imageUrl.value;
  if (!name || !category || !time) {
    alert("fill the ingredient inputs");
  } else {
    saveForm(name, category, time, image);
  }
});

(window as any).IngDel = IngDel;
(window as any).stepDel = stepDel;
(window as any).delRes = delRes;
(window as any).preview = preview;

recipeList();