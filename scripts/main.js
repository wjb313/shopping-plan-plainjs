// ***MENU PLAN PAGE***
// declare global variables and constants
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

// declare variables and constants for manipluating the DOM
const menuGrid = document.querySelector("#menuGrid");
const reorderBtn = document.querySelector("#reorderBtn");
const modal = document.querySelector("#myModal");
const reorderClose = document.querySelector("#reorderClose");
const clearClose = document.querySelector("#clearClose");
const modalContent = document.querySelector(".modal-content");
const selectDay = document.querySelectorAll(".clickableDays");
const clearYes = document.querySelector("#clearYes");
const clearNo = document.querySelector("#clearNo");

let inputs = document.getElementsByTagName("input");

// generate headers for menu grid
for (let i = 0; i < menuItemHeaders.length; i++) {
  const headerItem = document.createElement("div");

  headerItem.textContent = menuItemHeaders[i];
  headerItem.className = "headers";
  headerItem.id = "header" + [i + 1];
  menuGrid.appendChild(headerItem);
}

// define function to loop through days and populate on dinner menu plan
for (let i = 0; i < days.length; i++) {
  const daysBox = document.createElement("div");

  daysBox.textContent = days[i];
  daysBox.className = "days";
  daysBox.id = "day" + (i + 1);
  menuGrid.appendChild(daysBox);
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

// ADD DRAG AND DROP FUNCTIONALITY FOR MENU ITEMS
const subGrid = document.querySelector("#subGrid");
const menuItems = document.querySelector(".menuItems");

let dragIndex = 0;
let clone = "";
let dataFrom;
let dataTo;

function dragstart_handler(e) {
  console.log(e.target.id);
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.dropEffect = "move";
}

function dragover_handler(e) {
  dataFrom = e.dataTransfer.getData("text/plain");
  dataTo = e.target.id;

  if (dataFrom !== dataTo) {
    e.preventDefault();
  }
}

function drop_handler(e) {
  e.preventDefault();

  let targetClass = e.target.className;
  console.log(targetClass);
  let modifiedTarget;

  clone = e.target.cloneNode(true);

  dataFrom = e.dataTransfer.getData("text/plain");
  console.log(dataFrom);
  console.log(dataTo);

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

// ADD ALL EVENT HANDLERS FOR DRAG AND DROP TO ALL MENU ITEMS

// Calls function upon loading all content
window.addEventListener("DOMContentLoaded", addEListen);

// Function adds all event listeners; gets called at end of every drop action
function addEListen() {
  addDrag();
  addDropZone();
  // addEdit();
}

function addDrag() {
  const dsgDrag = document.querySelectorAll(".daySubGrid");

  dsgDrag.forEach(function (e) {
    e.addEventListener("dragstart", dragstart_handler);
  });
}

function addDropZone() {
  const dsgDrag = document.querySelectorAll(".daySubGrid");

  dsgDrag.forEach(function (e) {
    e.addEventListener("dragover", dragover_handler);
    e.addEventListener("drop", drop_handler);
  });
}
// ADD EDIT FUNCTIONALITY FOR MENU ITEMS ***UPDATED: THIS FUNCTIONALITY NO LONGER REQUIRED AS ALL MENU ITEMS ARE NOW INPUTS AND DO NOT REQUIRE DOUBLE-CLICK

// Change div to contentEditable on double-click

// function addEdit() {
//   const miEdit = document.querySelectorAll(".menuItems");

//   miEdit.forEach(function (e) {
//     e.addEventListener("dblclick", dcEdit);
//   });
// }

// function dcEdit(e) {
//   console.log(e.contentEditable);
//   e.target.contentEditable = true;
//   //e.target.textContent = "";
//   e.target.focus();

//   let input = e.target;
//   input.onblur = inputBlur;
//   function inputBlur() {
//     e.target.contentEditable = false;
//   }
// }

// ***DEFINE EVENT HANDLERS FOR PAGE NAVIGATION***
const dinnerLink = document.querySelector("#goToDinnerMenu");
const lunchLink = document.querySelector("#goToLunchMenu");
const breakfastLink = document.querySelector("#goToBreakfastMenu");
const listLink = document.querySelector("#goToShoppingList");

const dinnerDisplay = document.querySelector("#dinnerWrapper");
const lunchDisplay = document.querySelector("#lunchWrapper");
const breakfastDisplay = document.querySelector("#breakfastWrapper");
const listDisplay = document.querySelector("#listWrapper");

dinnerLink.addEventListener("click", function () {
  dinnerDisplay.style.display = "grid";
  listDisplay.style.display = "none";
});

listLink.addEventListener("click", function () {
  dinnerDisplay.style.display = "none";
  listDisplay.style.display = "grid";
});

// ***SHOPPING LIST PAGE***

// ADD NEW LINE TO SHOPPING LIST

const newLine = document.querySelector("#addItemBtn");

const listContainer = document.querySelector("#shoppingList");

const typeOptions = [
  "",
  "Veggies",
  "Fruits",
  "Refrigerated",
  "Dairy",
  "Snacks",
  "Dry Goods",
  "Frozen",
  "Bread",
  "Meats",
];

const unitsOptions = ["", "lbs", "oz", "c", "cans", "bags", "boxes"];

// Create each individual field within a new line
newLine.addEventListener("click", function () {
  const newItem = document.createElement("input");
  const newQuantity = document.createElement("input");
  const newUnits = document.createElement("select");
  const newType = document.createElement("select");

  listContainer.appendChild(newItem);
  listContainer.appendChild(newQuantity);
  listContainer.appendChild(newUnits);
  listContainer.appendChild(newType);

  // Set input type for shopping list item
  newItem.type = "text";

  // Set input type for shopping list quantity
  newQuantity.type = "number";

  // Set input type for shopping list units
  newUnits.type = "select";

  // Set input type for shopping list type
  newType.type = "select";

  // Add options for units selection drop down
  for (i = 0; i < unitsOptions.length; i++) {
    let uoList = new Option(unitsOptions[i], i);
    newUnits.options.add(uoList);
  }

  // Add options for type selection drop down
  for (i = 0; i < typeOptions.length; i++) {
    let toList = new Option(typeOptions[i], i);
    newType.options.add(toList);
  }
});
