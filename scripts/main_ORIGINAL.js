// ***DEFINE EVENT HANDLERS FOR PAGE NAVIGATION***
const dinnerLink = document.querySelector("[data-nav-to-dinner]");
const lunchLink = document.querySelector("[data-nav-to-lunch]");
const breakfastLink = document.querySelector("[data-nav-to-breakfast]");
const listLink = document.querySelector("[data-nav-to-shopping-list]");

const dinnerDisplay = document.querySelector("#dinnerWrapper");
const lunchDisplay = document.querySelector("#lunchWrapper");
const breakfastDisplay = document.querySelector("#breakfastWrapper");
const listDisplay = document.querySelector("#listWrapper");

dinnerLink.addEventListener("click", function () {
  dinnerDisplay.style.display = "grid";
  listDisplay.style.display = "none";
  saveCurrentPage();
});

listLink.addEventListener("click", function () {
  dinnerDisplay.style.display = "none";
  listDisplay.style.display = "flex";
  saveCurrentPage();
});

// save current page to local storage
const LOCAL_STORAGE_CURRENTPAGE_KEY = "current.page";

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
// ***MENU PLAN PAGE***

// define arrays and objects
const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const menuItemHeaders = ["Day", "Main", "Side", "Side", "Other", ""];

let menuItemsContent = {
  day1: { main: "", side1: "", side2: "", other: "" },
  day2: { main: "", side1: "", side2: "", other: "" },
  day3: { main: "", side1: "", side2: "", other: "" },
  day4: { main: "", side1: "", side2: "", other: "" },
  day5: { main: "", side1: "", side2: "", other: "" },
  day6: { main: "", side1: "", side2: "", other: "" },
  day7: { main: "", side1: "", side2: "", other: "" },
};

// declare variables and constants for general DOM manipulation
const menuGrid = document.querySelector("[data-dinner-menu-grid");
const reorderBtn = document.querySelector("[data-btn-reorder]");
const selectDay = document.querySelectorAll(".clickableDays");
const reorderClose = document.querySelector("[data-reorder-close]");
const clearBtn = document.querySelector("[data-btn-clear]");
const clearClose = document.querySelector("[data-clear-close]");
const clearYes = document.querySelector("[data-clear-yes]");
const clearNo = document.querySelector("[data-clear-no]");
const shoppingListItemModal = document.querySelector(
  "[data-shopping-list-item-modal]"
);
const shoppingListItemClose = document.querySelector(
  "[data-shopping-list-item-close]"
);

let inputs = document.getElementsByTagName("input");

// *** SETUP DATA PERSISTENCE VIA LOCAL STORAGE ***
// declare constants and variables for local storage
const LOCAL_STORAGE_DINNERMENU_KEY = "dinner.menu";
const LOCAL_STORAGE_SHOPPINGLIST_KEY = "shopping.list";

// call to localStorage to load saved data
if (localStorage.getItem(LOCAL_STORAGE_DINNERMENU_KEY) !== null) {
  menuItemsContent = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_DINNERMENU_KEY)
  );
}

// *** LAYOUT MENU GRID - HEADERS AND DAYS OF THE WEEK ***
// generate headers for menu grid
for (let i = 0; i < menuItemHeaders.length; i++) {
  const headerItem = document.createElement("div");

  if (i === menuItemHeaders.length - 1) {
    headerItem.textContent = menuItemHeaders[i];
    headerItem.className = "Headers";
    headerItem.id = "lastHeader";
    menuGrid.appendChild(headerItem);
  } else {
    headerItem.textContent = menuItemHeaders[i];
    headerItem.className = "headers";
    headerItem.id = "header" + [i + 1];
    menuGrid.appendChild(headerItem);
  }
}

// define function to loop through days and populate on dinner menu plan
for (let i = 0; i < days.length; i++) {
  const daysBox = document.createElement("div");

  daysBox.textContent = days[i];
  daysBox.className = "days";
  daysBox.id = "day" + (i + 1);
  menuGrid.appendChild(daysBox);
}

// declare variables to populate menu items from localStorage
let day1Main = document.querySelector("#mi1-1");
let day1Side1 = document.querySelector("#mi1-2");
let day1Side2 = document.querySelector("#mi1-3");
let day1Other = document.querySelector("#mi1-4");

let day2Main = document.querySelector("#mi2-1");
let day2Side1 = document.querySelector("#mi2-2");
let day2Side2 = document.querySelector("#mi2-3");
let day2Other = document.querySelector("#mi2-4");

let day3Main = document.querySelector("#mi3-1");
let day3Side1 = document.querySelector("#mi3-2");
let day3Side2 = document.querySelector("#mi3-3");
let day3Other = document.querySelector("#mi3-4");

let day4Main = document.querySelector("#mi4-1");
let day4Side1 = document.querySelector("#mi4-2");
let day4Side2 = document.querySelector("#mi4-3");
let day4Other = document.querySelector("#mi4-4");

let day5Main = document.querySelector("#mi5-1");
let day5Side1 = document.querySelector("#mi5-2");
let day5Side2 = document.querySelector("#mi5-3");
let day5Other = document.querySelector("#mi5-4");

let day6Main = document.querySelector("#mi6-1");
let day6Side1 = document.querySelector("#mi6-2");
let day6Side2 = document.querySelector("#mi6-3");
let day6Other = document.querySelector("#mi6-4");

let day7Main = document.querySelector("#mi7-1");
let day7Side1 = document.querySelector("#mi7-2");
let day7Side2 = document.querySelector("#mi7-3");
let day7Other = document.querySelector("#mi7-4");

// populate menu item containers with data from local storage
day1Main.value = menuItemsContent.day1.main;
day1Side1.value = menuItemsContent.day1.side1;
day1Side2.value = menuItemsContent.day1.side2;
day1Other.value = menuItemsContent.day1.other;

day2Main.value = menuItemsContent.day2.main;
day2Side1.value = menuItemsContent.day2.side1;
day2Side2.value = menuItemsContent.day2.side2;
day2Other.value = menuItemsContent.day2.other;

day3Main.value = menuItemsContent.day3.main;
day3Side1.value = menuItemsContent.day3.side1;
day3Side2.value = menuItemsContent.day3.side2;
day3Other.value = menuItemsContent.day3.other;

day4Main.value = menuItemsContent.day4.main;
day4Side1.value = menuItemsContent.day4.side1;
day4Side2.value = menuItemsContent.day4.side2;
day4Other.value = menuItemsContent.day4.other;

day5Main.value = menuItemsContent.day5.main;
day5Side1.value = menuItemsContent.day5.side1;
day5Side2.value = menuItemsContent.day5.side2;
day5Other.value = menuItemsContent.day5.other;

day6Main.value = menuItemsContent.day6.main;
day6Side1.value = menuItemsContent.day6.side1;
day6Side2.value = menuItemsContent.day6.side2;
day6Other.value = menuItemsContent.day6.other;

day7Main.value = menuItemsContent.day7.main;
day7Side1.value = menuItemsContent.day7.side1;
day7Side2.value = menuItemsContent.day7.side2;
day7Other.value = menuItemsContent.day7.other;

// save menuItemsContent to localStorage
function save(e) {
  let planDay = e.target.dataset.planday;
  let menuItemName = e.target.dataset.id;

  menuItemsContent[planDay][menuItemName] = e.target.value;

  localStorage.setItem(
    LOCAL_STORAGE_DINNERMENU_KEY,
    JSON.stringify(menuItemsContent)
  );
}

// EVENT HANDLER - REORDER BUTTON

// define event listener for reorder button; open modal box

reorderBtn.addEventListener("click", function () {
  reorderModal.style.display = "block";
});

// add event listener to each day in the modal box
// set selected day as first day of week and repopulate days column
selectDay.forEach(function (e) {
  e.addEventListener("click", function (e) {
    days1 = days.slice(days.indexOf(e.target.textContent));
    days2 = days.slice(0, days.indexOf(e.target.textContent));
    days1.push(...days2);
    reorderModal.style.display = "none";

    for (let i = 0; i < days1.length; i++) {
      let currentDay = "day" + (i + 1);
      let currentDayDOM = document.querySelector("#" + currentDay);

      currentDayDOM.textContent = days1[i];
    }
  });
});

// Handle event = close Modal Box Selection Tool without choosing a new starting day
reorderClose.addEventListener("click", function () {
  reorderModal.style.display = "none";
});

// EVENT HANDLER - CLEAR BUTTON

// define event listener for clear button; open modal box
exitClearModal = function () {
  clearModal.style.display = "none";
};

clearAll = function () {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "text") {
      inputs[i].value = "";
    }
    exitClearModal();
  }
};

clearBtn.addEventListener("click", function () {
  clearModal.style.display = "block";
});

clearYes.addEventListener("click", clearAll);

clearNo.addEventListener("click", exitClearModal);

// Handle event = close Modal Box Selection Tool without choosing a new starting day
clearClose.addEventListener("click", exitClearModal);

// Handle event = close Modal Box without adding a new shopping list item
shoppingListItemClose.addEventListener("click", function () {
  shoppingListItemModal.style.display = "none";
});

// *** DRAG AND DROP FUNCTIONALITY ***
// define drag and drop functionality for menu items grid
const subGrid = document.querySelector("[data-dinner-menu-subgrid]");

let dragIndex = 0;
let clone = "";
let dataFrom;
let dataTo;
let targetClass;

function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.dropEffect = "move";
}

function dragover_handler(e) {
  dataFrom = e.dataTransfer.getData("text/plain");
  dataTo = e.target.id;

  console.log("dataFrom: " + dataFrom);
  console.log(typeof dataTo);
  console.log(dataTo.includes("dsg"));

  if (dataTo.includes("dsg") && dataFrom !== dataTo) {
    e.preventDefault();
  }
}

function drop_handler(e) {
  e.preventDefault();

  targetClass = e.target.className;

  let modifiedTarget;

  clone = e.target.cloneNode(true);

  dataFrom = e.dataTransfer.getData("text/plain");

  let nodelist = subGrid.childNodes;
  for (let i = 0; i < nodelist.length; i++) {
    if (nodelist[i].id == dataFrom) {
      dragIndex = i;
    }
  }

  if (targetClass === "menuItems") {
    modifiedTarget = e.target.parentNode;
    clone = modifiedTarget.cloneNode(true);
    subGrid.replaceChild(document.getElementById(dataFrom), modifiedTarget);
    subGrid.insertBefore(clone, subGrid.childNodes[dragIndex]);
    addEListen();
  } else {
    clone = e.target.cloneNode(true);
    console.log("ran the else");
    subGrid.replaceChild(document.getElementById(dataFrom), e.target);
    subGrid.insertBefore(clone, subGrid.childNodes[dragIndex]);
    addEListen();
  }
}

// ADD ALL DRAG AND DROP EVENT LISTENERS TO ALL MENU ITEMS

// Calls function upon loading all content
window.addEventListener("DOMContentLoaded", addEListen);
//window.addEventListener("DOMContentLoaded", populateDays);
// Function adds all event listeners; gets called at end of every drop action
function addEListen() {
  addDrag();
  addDropZone();
  addLocalStorageSave();
}

// adds dragstart handler to
function addDrag() {
  const dsgDrag = document.querySelectorAll("[data-dsg-drag-units]");

  dsgDrag.forEach(function (e) {
    e.addEventListener("dragstart", dragstart_handler);
  });
}

function addDropZone() {
  const dsgDrag = document.querySelectorAll("[data-dsg-drag-units]");

  dsgDrag.forEach(function (e) {
    e.addEventListener("dragover", dragover_handler);
    e.addEventListener("drop", drop_handler);
  });
}

function addLocalStorageSave() {
  const menuItems = document.querySelectorAll(".menuItems");

  menuItems.forEach(function (e) {
    e.addEventListener("blur", save);
  });
}

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
  console.log(list);
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
