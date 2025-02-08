// Constants for local storage keys
const LOCAL_STORAGE_SHOPPINGLIST_KEY = "shopping.list";
const LOCAL_STORAGE_CURRENTPAGE_KEY = "current.page";
const LOCAL_STORAGE_CURRENTDOTW_KEY = "current.dotw";
const LOCAL_STORAGE_DMP_KEY = "dinnermenu.plan";

// DOM elements (cached for performance)
const dmpLink = document.querySelectorAll("[data-js-nav-to-dinner]");
const sliLink = document.querySelectorAll("[data-js-nav-to-shopping-list]");
const dmpHeader = document.querySelector("[data-js-dmp-header]");
const dmpDisplay = document.querySelector("[data-js-dmp-display]");
const sliDisplay = document.querySelector("[data-js-sli-display]");

// ... (Other DOM element selectors)

// Days of the week (loaded from localStorage or default)
let days = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENTDOTW_KEY)) || [
  "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
];

// Dinner menu plan content (loaded from localStorage or default)
let dmpContent = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DMP_KEY)) || {
  day1: {}, day2: {}, day3: {}, day4: {}, day5: {}, day6: {}, day7: {},
};
// Initialize empty objects within dmpContent if they don't exist
for (const day in dmpContent) {
    if (typeof dmpContent[day] !== 'object' || dmpContent[day] === null) {
        dmpContent[day] = {};
    }
}


// Shopping list (loaded from localStorage or default)
let list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SHOPPINGLIST_KEY)) || [];

// Current page state (loaded from localStorage or default)
let page = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENTPAGE_KEY));
dmpDisplay.style.display = page ? page[0] : "flex";
sliDisplay.style.display = page ? page[1] : "none";

// Event Listeners for Page Navigation
dmpLink.forEach(link => link.addEventListener("click", () => navToPage("dmp")));
sliLink.forEach(link => link.addEventListener("click", () => navToPage("sli")));

function navToPage(pageType) {
  dmpDisplay.style.display = pageType === "dmp" ? "flex" : "none";
  sliDisplay.style.display = pageType === "sli" ? "flex" : "none";
  saveCurrentPage();
}

function saveCurrentPage() {
  const page = [dmpDisplay.style.display, sliDisplay.style.display];
  localStorage.setItem(LOCAL_STORAGE_CURRENTPAGE_KEY, JSON.stringify(page));
}



// --- Days of the Week Population ---
const dotwElements = document.querySelectorAll("[data-js-dotw]");

function populateDaysOfWeek() {
  dotwElements.forEach((element, index) => {
    const day = days[index];
    element.textContent = day.charAt(0);
    const tooltip = document.createElement("span");
    tooltip.textContent = day;
    tooltip.className = "tooltiptext";
    element.appendChild(tooltip);
  });
}



// --- Menu Content Loading ---
function loadMenuContent() {
  const menuItems = document.querySelectorAll(".allMenuItems");

  menuItems.forEach(item => {
    const dataKey = Object.keys(item.dataset)[0]; // Get the data attribute name (e.g., jsMain, jsSide1)
    const day = item.dataset[dataKey];
    const contentType = dataKey.replace("js", "").toLowerCase(); // Extract content type (e.g., main, side1)
    item.textContent = dmpContent[day]?.[contentType] || ""; // Use optional chaining and default to empty string
  });

  updateAddEditButtons();
}

function updateAddEditButtons() {
  const mainDishButtons = document.querySelectorAll("[data-js-edit-menu]");
  const mainDishItems = document.querySelectorAll(".mainDish");

  mainDishItems.forEach((item, index) => {
    mainDishButtons[index].textContent = item.textContent ? "Edit" : "Add";
  });
}

// ... (Modal handling functions - openEditModal, submitMenuEdit, etc.)  -  These can be significantly simplified.  See below for improvements.

// --- Reorder Days of the Week ---
// ... (reorderBtn, selectDay, reorderClose event listeners)

// --- Clear Menu Items ---
// ... (clearBtn, clearYes, clearNo event listeners)

// --- Drag and Drop ---
// ... (dragstart_handler, dragover_handler, drop_handler, addDrag, addDropZone)

// --- Shopping List Rendering ---
// ... (renderShoppingList, renderListCount, clearElement)

// --- Add/Edit Shopping List Item ---
// ... (addItemBtn, addItemModal, addItemForm event listeners)

// --- Manage Shopping List Items ---
// ... (editSli, listBody event listener for checkbox changes)

// --- Clear Shopping List Items ---
// ... (completedItemsBtn, clearCompletedYes, clearCompletedNo, allItemsBtn, clearAllYes, clearAllNo event listeners)

// --- No Items to Clear Modal ---
// ... (noItemsToClearModal, noItemsModalClose event listener)

// --- DOMContentLoaded Event Listener ---
document.addEventListener("DOMContentLoaded", () => {
  populateDaysOfWeek();
  loadMenuContent();
  addDrag();
  addDropZone();
  renderShoppingList();
});


// --- Simplified Modal Handling (Example for DMP Edit) ---
const dmpModal = document.querySelector("[data-js-dmp-modal]");
const editMenuButtons = document.querySelectorAll("[data-js-edit-menu]");
const submitMenuEdit = document.querySelector("[data-js-new-item-submit]");
const dmpModalClose = document.querySelector("[data-js-dmp-modal-close]");
const inputFields = document.querySelectorAll(".modalFormInput");
const dmpModalHeader = document.querySelector("[data-js-dmp-modal-header]");

editMenuButtons.forEach(button => button.addEventListener("click", openEditModal));
dmpModalClose.addEventListener("click", () => dmpModal.style.display = "none");

function openEditModal(e) {
  const currentEditDay = e.target.dataset.jsEditMenu;
  const currentEditDayNumber = parseInt(currentEditDay.slice(-1)); // More concise way to get the number
  const currentDayDisplay = days[currentEditDayNumber - 1];

  dmpModal.style.display = "block";
  dmpModalHeader.textContent = `${currentDayDisplay} Menu Items`;

  inputFields.forEach(input => {
    const inputType = input.dataset.jsInputOne || input.dataset.jsInputTwo || /* ... other input types */ input.dataset.jsInputFive;
    input.value = dmpContent[currentEditDay]?.[inputType.replace("Input", "").toLowerCase()] || ""; // Optional chaining and cleaner property access
  });

  inputFields[0].focus(); // Focus on the first input field
}

submitMenuEdit.addEventListener("click", (e) => {
  e.preventDefault();
  const currentEditDay = /* ... get currentEditDay from somewhere (e.g., a hidden input in the modal) */; // Make sure this is available!
  dmpModal.style.display = "none";

  inputFields.forEach(input => {
    const inputType = input.dataset.jsInputOne || /* ... other input types */;
    dmpContent[currentEditDay][inputType.replace("Input", "").toLowerCase()] = input.value;
  });

  localStorage.setItem(LOCAL_STORAGE_DMP_KEY, JSON.stringify(dmpContent));
  loadMenuContent();
});

// ... (Similar simplification for the Notes Modal and other modals)