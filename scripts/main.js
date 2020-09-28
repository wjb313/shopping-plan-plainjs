// *** GLOBAL ***
// variables/constants for manipulating the DOM
let currentEditDay;
let currentEditDayNumber;
let currentDayDisplay;

// ***PAGE NAVIGATION***
const dinnerLink = document.querySelector("[data-nav-to-dinner]");
const listLink = document.querySelector("[data-nav-to-shopping-list]");
const dmpHeader = document.querySelector("[data-js-dmpHeader]");
const dinnerDisplay = document.querySelector("#dinnerWrapper");
const listDisplay = document.querySelector("#listWrapper");

dinnerLink.addEventListener("click", function () {
  dinnerDisplay.style.display = "grid";
  dmpHeader.style.display = "flex";
  listDisplay.style.display = "none";
  saveCurrentPage();
});

listLink.addEventListener("click", function () {
  dinnerDisplay.style.display = "none";
  dmpHeader.style.display = "none";
  listDisplay.style.display = "flex";
  saveCurrentPage();
});

// ***MENU PLAN PAGE***

// define days of the week
let days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// declare empty object for dinner menu plan (dmp) content JSON file
let dmpContent = {
  day1: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
  day2: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
  day3: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
  day4: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
  day5: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
  day6: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
  day7: {
    main: "",
    side1: "",
    side2: "",
    other: "",
    notes: "",
  },
};

// *** SETUP DATA PERSISTENCE VIA LOCAL STORAGE ***
// declare constants and variables for local storage
const LOCAL_STORAGE_SHOPPINGLIST_KEY = "shopping.list";
const LOCAL_STORAGE_CURRENTPAGE_KEY = "current.page";
const LOCAL_STORAGE_CURRENTDOTW_KEY = "current.dotw";
const LOCAL_STORAGE_DMP_KEY = "dinnermenu.plan";

// save menu to/restore menu from local storage
if (localStorage.getItem(LOCAL_STORAGE_DMP_KEY) !== null) {
  dmpContent = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DMP_KEY));
}

// persist user's current page via local storage
let page;

if (localStorage.getItem(LOCAL_STORAGE_CURRENTPAGE_KEY) !== null) {
  page = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENTPAGE_KEY));
  dinnerDisplay.style.display = page[0];
  listDisplay.style.display = page[1];
} else {
  dinnerDisplay.style.display = "grid";
  listDisplay.style.display = "none";
}

function saveCurrentPage() {
  page = [dinnerDisplay.style.display, listDisplay.style.display];
  localStorage.setItem(LOCAL_STORAGE_CURRENTPAGE_KEY, JSON.stringify(page));
}

// persist user's days of the week (dotw) configuration via local storage
if (localStorage.getItem(LOCAL_STORAGE_CURRENTDOTW_KEY) !== null) {
  days = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENTDOTW_KEY));
} else {
}

function saveCurrentDOTW() {
  localStorage.setItem(LOCAL_STORAGE_CURRENTDOTW_KEY, JSON.stringify(days));
}

// *** POPULATE DAYS OF THE WEEK
const dotw1 = document.querySelector("[data-js-day1-dotw]");
const dotw2 = document.querySelector("[data-js-day2-dotw]");
const dotw3 = document.querySelector("[data-js-day3-dotw]");
const dotw4 = document.querySelector("[data-js-day4-dotw]");
const dotw5 = document.querySelector("[data-js-day5-dotw]");
const dotw6 = document.querySelector("[data-js-day6-dotw]");
const dotw7 = document.querySelector("[data-js-day7-dotw]");

const dotwClassSelect = document.querySelectorAll("[data-js-dotw]");

function dotwPopulate() {
  for (i = 0; i < days.length; i++) {
    const dotwSpanCreate = document.createElement("span");
    let currentDayDOM = document.querySelector(
      '[data-js-dotw="day' + [i + 1] + '"]'
    );
    currentDayDOM.textContent = days[i].charAt(0);
    dotwSpanCreate.textContent = days[i];
    dotwSpanCreate.className = "tooltiptext";
    currentDayDOM.appendChild(dotwSpanCreate);
  }
}

// *** LOAD DINNER MENU PLAN CONTENT INTO PAGE
// define function to load content into page, assign to proper fields
// ami = 'all menu items'
function loadMenuContent() {
  let amiList = document.querySelectorAll(".allMenuItems");

  amiList.forEach((item) => {
    if (item.dataset.jsMain) {
      let currentDay = item.dataset.jsMain;
      item.textContent = dmpContent[currentDay]["main"];
    } else if (item.dataset.jsSide1) {
      let currentDay = item.dataset.jsSide1;
      item.textContent = dmpContent[currentDay]["side1"];
    } else if (item.dataset.jsSide2) {
      let currentDay = item.dataset.jsSide2;
      item.textContent = dmpContent[currentDay]["side2"];
    } else if (item.dataset.jsOther) {
      let currentDay = item.dataset.jsOther;
      item.textContent = dmpContent[currentDay]["other"];
    } else {
      let currentDay = item.dataset.jsNotesSpan;
      item.textContent = dmpContent[currentDay]["notes"];
    }
  });
}

// *** EDIT MENU ITEMS AND MENU ITEM NOTES

// *** EDIT DINNER MENU PLAN ENTRIES ***
// variables/constants for DOM manipulation
const dmpModal = document.querySelector("[data-js-dmp-modal]");
const editMenu = document.querySelectorAll("[data-js-edit-menu]");
const submitMenuEdit = document.querySelector("[data-js-new-item-submit]");
const dmpModalClose = document.querySelector("[data-js-dmp-modal-close]");
const inputFields = document.querySelectorAll(".dmpModalInput");
const dmpModalHeader = document.querySelector("[data-js-dmp-modal-header]");

// handle event --> button click to call open dmp edit modal function
editMenu.forEach(function (e) {
  e.addEventListener("click", openEditModal);
});

// define function to open modal and populate existing data where applicable
function openEditModal(e) {
  e.preventDefault();

  dmpModal.style.display = "block";

  currentEditDay = e.target.dataset.jsEditMenu;
  currentEditDayNumber = parseInt(
    currentEditDay.charAt(currentEditDay.length - 1)
  );
  currentDayDisplay = days[currentEditDayNumber - 1];

  dmpModalHeader.textContent = `${currentDayDisplay} Menu Items`;

  inputFields.forEach((item) => {
    if (item.dataset.jsInputOne) {
      item.value = dmpContent[currentEditDay]["main"];
    } else if (item.dataset.jsInputTwo) {
      item.value = dmpContent[currentEditDay]["side1"];
    } else if (item.dataset.jsInputThree) {
      item.value = dmpContent[currentEditDay]["side2"];
    } else if (item.dataset.jsInputFour) {
      item.value = dmpContent[currentEditDay]["other"];
    } else {
      item.value = dmpContent[currentEditDay]["notes"];
    }
  });

  let dmpModalMain = document.querySelector("[data-js-input-one]");
  dmpModalMain.focus();
  dmpModalMain.setSelectionRange(0, 100);
}

// handle event --> submit new dmp entries and save to local storage
submitMenuEdit.addEventListener("click", (e) => {
  e.preventDefault();

  dmpModal.style.display = "none";

  inputFields.forEach((item) => {
    if (item.dataset.jsInputOne) {
      dmpContent[currentEditDay]["main"] = item.value;
    } else if (item.dataset.jsInputTwo) {
      dmpContent[currentEditDay]["side1"] = item.value;
    } else if (item.dataset.jsInputThree) {
      dmpContent[currentEditDay]["side2"] = item.value;
    } else if (item.dataset.jsInputFour) {
      dmpContent[currentEditDay]["other"] = item.value;
    } else {
      dmpContent[currentEditDay]["notes"] = item.value;
    }
  });

  localStorage.setItem(LOCAL_STORAGE_DMP_KEY, JSON.stringify(dmpContent));
  loadMenuContent();
});

// handle event --> close modal without entering new information
dmpModalClose.addEventListener("click", (e) => {
  e.preventDefault();
  dmpModal.style.display = "none";
});

// *** EDIT DINNER MENU PLAN NOTES ENTRIES ***
// variables/constants for DOM manipulation
const editNotes = document.querySelectorAll("[data-js-edit-notes]");
const notesContainer = document.querySelector("[data-js-notes-container]");
const submitNotesEdit = document.querySelector("[data-js-notes-submit]");
const dmpNotesModal = document.querySelector("[data-js-notes-modal]");
const dmpNotesModalClose = document.querySelector(
  "[data-js-notes-modal-close]"
);
const dmpNotesModalInput = document.querySelector("[data-js-input-notes]");
const dmpNotesModalHeader = document.querySelector(
  "[data-js-dmp-notes-modal-header]"
);

// handle event --> button click to open dmp notes edit modal
editNotes.forEach(function (e) {
  e.addEventListener("click", openNotesEditModal);
});

// define function to open notes modal and populate existing data where applicable
function openNotesEditModal(e) {
  e.preventDefault();

  dmpNotesModal.style.display = "block";

  currentEditDay = e.target.dataset.jsEditNotes;
  currentEditDayNumber = parseInt(
    currentEditDay.charAt(currentEditDay.length - 1)
  );
  currentDayDisplay = days[currentEditDayNumber - 1];

  dmpNotesModalHeader.textContent = `${currentDayDisplay} Notes`;
  dmpNotesModalInput.value = dmpContent[currentEditDay]["notes"];
}

// handle event --> submit new dmp entries and save to local storage
submitNotesEdit.addEventListener("click", (e) => {
  e.preventDefault();

  dmpNotesModal.style.display = "none";

  let notes = currentEditDay + "Notes";

  dmpContent[currentEditDay]["notes"] = dmpNotesModalInput.value;

  notes.textContent = dmpContent[currentEditDay]["notes"];

  localStorage.setItem(LOCAL_STORAGE_DMP_KEY, JSON.stringify(dmpContent));
  loadMenuContent();
});

// handle event --> close modal without entering new information
dmpNotesModalClose.addEventListener("click", (e) => {
  e.preventDefault();
  dmpNotesModal.style.display = "none";
});

// *** REORDER DAYS OF THE WEEK
// variables/constants for DOM manipulation
const reorderBtn = document.querySelector("[data-btn-reorder]");
const selectDay = document.querySelectorAll(".clickableDays");
const reorderClose = document.querySelector("[data-reorder-close]");
const reorderModal = document.querySelector("[data-js-reorder-modal]");

// handle event --> button click to open modal
reorderBtn.addEventListener("click", function () {
  reorderModal.style.display = "block";
});

// handle event --> select new first day of the week, close modal, repopulate days column accordingly, and save the new configuration to local storage
selectDay.forEach(function (e) {
  e.addEventListener("click", function (e) {
    days1 = days.slice(days.indexOf(e.target.textContent));
    days2 = days.slice(0, days.indexOf(e.target.textContent));
    days1.push(...days2);
    days = days1;
    reorderModal.style.display = "none";

    dotwPopulate();
    saveCurrentDOTW();
  });
});

// handle event --> close modal without choosing a new first day
reorderClose.addEventListener("click", function () {
  reorderModal.style.display = "none";
});

// *** CLEAR ALL MENU ITEMS
// variables/constants for DOM manipulation
const clearBtn = document.querySelector("[data-btn-clear]");
const clearClose = document.querySelector("[data-clear-close]");
const clearYes = document.querySelector("[data-clear-yes]");
const clearNo = document.querySelector("[data-clear-no]");
const clearModal = document.querySelector("[data-js-clear-modal]");

// handle event --> button click to open modal
clearBtn.addEventListener("click", function () {
  clearModal.style.display = "block";
});

// define functions to execute modal options
// exit without clearing items
exitClearModal = function () {
  clearModal.style.display = "none";
};

// clear all items, save to local storage, reload menu content and exit
clearAll = function () {
  for (let i = 1; i < 8; i++) {
    currentEditDay = "day" + i;
    dmpContent[currentEditDay]["main"] = "";
    dmpContent[currentEditDay]["side1"] = "";
    dmpContent[currentEditDay]["side2"] = "";
    dmpContent[currentEditDay]["other"] = "";
    dmpContent[currentEditDay]["notes"] = "";
  }

  localStorage.setItem(LOCAL_STORAGE_DMP_KEY, JSON.stringify(dmpContent));

  exitClearModal();
  loadMenuContent();
};

// handle event --> call function to clear all menu items
clearYes.addEventListener("click", clearAll);

// handle event --> call function to exit without clearing all menu items
clearNo.addEventListener("click", exitClearModal);
clearClose.addEventListener("click", exitClearModal);

// *** DRAG AND DROP FUNCTIONALITY FOR DMP CONTENT ***
// define dragstart handler and assign to all draggable elements
function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.jsDraggable);
}

function addDrag() {
  const dmpContentsDrag = document.querySelectorAll("[data-js-draggable]");

  dmpContentsDrag.forEach(function (e) {
    e.addEventListener("dragstart", dragstart_handler);
  });
}

//define dragover and drop zone handlers and assign to all droppable elements
function dragover_handler(e) {
  dataFrom = e.dataTransfer.getData("text/plain");
  dataTo = e.currentTarget.dataset.jsDroppable;

  if (dataFrom !== dataTo) {
    e.preventDefault();
  }
}

function drop_handler(e) {
  e.preventDefault();

  let dmpContentFrom = dmpContent[dataFrom];
  let dmpContentTo = dmpContent[dataTo];

  dmpContent[dataTo] = dmpContentFrom;
  dmpContent[dataFrom] = dmpContentTo;

  loadMenuContent();

  localStorage.setItem(LOCAL_STORAGE_DMP_KEY, JSON.stringify(dmpContent));
}

function addDropZone() {
  const dmpContentsDrop = document.querySelectorAll("[data-js-droppable]");

  dmpContentsDrop.forEach(function (e) {
    e.addEventListener("dragover", dragover_handler);
    e.addEventListener("drop", drop_handler);
  });
}

// **** ALL CODE ABOVE HAS BEEN CLEANED UP AS OF 9/24 ****

// *** SHOPPING LIST PAGE ***

// declare constants and variables for shopping list page
const addItemBtn = document.querySelector("[data-btn-add-item]");
const listCount = document.querySelector("[data-list-count");
const listBody = document.querySelector("[data-list-body]");
const listItem = document.querySelector("[data-list-item]");
const listItemInput = document.querySelector("[data-list-item-input");
const listItemLabel = document.querySelector("[data-list-item-label");
const listItemSpan = document.querySelector("[data-list-item-span");
const newSLItemForm = document.querySelector("[data-new-list-form]");
const shoppingListItemModal = document.querySelector(
  "[data-shopping-list-item-modal]"
);
const shoppingListItemClose = document.querySelector(
  "[data-shopping-list-item-close]"
);

const completedItems = document.querySelector("[data-btn-clear-complete]");
const allItems = document.querySelector("[data-btn-clear-all]");

const nliName = document.querySelector("#itemName");
const nliType = document.querySelector("#itemType");
const nliQty = document.querySelector("#itemQuantity");
const nliUnits = document.querySelector("#itemUnits");

const listItemTemplate = document.querySelector("#listItemTemplate");

let list = [];

if (localStorage.getItem(LOCAL_STORAGE_SHOPPINGLIST_KEY) !== null) {
  list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SHOPPINGLIST_KEY));
}

// Handle Event - Add Item Button Click
addItemBtn.addEventListener("click", function () {
  shoppingListItemModal.style.display = "block";
  nliName.focus();
});

// handle event -->
shoppingListItemClose.addEventListener("click", function () {
  shoppingListItemModal.style.display = "none";
});

// Handle Event - Submit New Item Information

newSLItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (nliName.value == null || nliName.value === "") return;

  let newObject = {
    id: Date.now().toString(),
    name: nliName.value,
    type: nliType.value,
    quantity: nliQty.value,
    units: nliUnits.value,
    complete: false,
  };
  list.push(newObject);
  nliName.value = "";
  nliType.value = "";
  nliQty.value = "1";
  nliUnits.value = "";

  shoppingListItemModal.style.display = "none";

  localStorage.setItem(LOCAL_STORAGE_SHOPPINGLIST_KEY, JSON.stringify(list));

  renderShoppingList();
});

// *** RENDER SHOPPING LIST AND LIST ITEM COUNT CONTENTS
// shopping list items
function renderShoppingList() {
  // clear all existing elements from list
  clearElement(listBody);
  // iterate through list array
  list.forEach((item) => {
    // create new list item for each array object
    const listItemElement = document.importNode(listItemTemplate.content, true);
    const checkbox = listItemElement.querySelector("input");
    checkbox.id = item.id;
    checkbox.checked = item.complete;
    const label = listItemElement.querySelector("label");
    label.htmlFor = item.id;
    // conditionals to define how to render items depending on data entered
    if (item.units !== "") {
      if (item.quantity > 1) {
        if (item.units === "box") {
          label.append(
            item.name + ", " + item.quantity + " " + item.units + "es"
          );
          listBody.appendChild(listItemElement);
        } else {
          label.append(
            item.name + ", " + item.quantity + " " + item.units + "s"
          );
          listBody.appendChild(listItemElement);
        }
      } else {
        label.append(item.name);
        listBody.appendChild(listItemElement);
      }
    } else {
      if (item.quantity > 1) {
        label.append(item.name + ", " + item.quantity);
        listBody.appendChild(listItemElement);
      } else {
        label.append(item.name);
        listBody.appendChild(listItemElement);
      }
    }
  });
}

// count of remaining list items
function renderListCount() {
  const incompleteListCount = list.filter((list) => list.complete === false);
  const taskString = incompleteListCount.length === 1 ? "item" : "items";
  listCount.textContent = `${incompleteListCount.length} ${taskString} remaining`;
}

// Event Handler - change array object 'complete' property when item is clicked
// then save the new array entry information to local storage
listBody.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    let selectedListItem = list.find((list) => list.id === e.target.id);
    selectedListItem.complete = e.target.checked;
  }
  localStorage.setItem(LOCAL_STORAGE_SHOPPINGLIST_KEY, JSON.stringify(list));
  renderListCount();
});

// Event Handler - clear completed items button
completedItems.addEventListener("click", clearCompletedItems);
// Event Handler - clear all items button
allItems.addEventListener("click", clearAllItems);

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function clearCompletedItems() {
  list = list.filter((list) => list.complete === false);

  localStorage.setItem(LOCAL_STORAGE_SHOPPINGLIST_KEY, JSON.stringify(list));
  renderShoppingList();
  renderListCount();
}

function clearAllItems() {
  list = [];
  localStorage.setItem(LOCAL_STORAGE_SHOPPINGLIST_KEY, JSON.stringify(list));
  renderShoppingList();
  renderListCount();
}

renderShoppingList();
renderListCount();

// populate days of the week and menu content, add event listeners for drag and drop functionality upon first loading page

document.addEventListener("DOMContentLoaded", (e) => {
  dotwPopulate();
  loadMenuContent();
  addDrag();
  addDropZone();
});
