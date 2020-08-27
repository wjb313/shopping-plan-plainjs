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

const menuItemHeaders = ["Day", "Main Dish", "Side Dish", "Side Dish", "Other"];

// declare variables and constants for manipluating the DOM
const menuGrid = document.querySelector("#menuGrid");
const reorderBtn = document.querySelector("#reorderBtn");
const modal = document.querySelector("#myModal");
const closeSpan = document.querySelector(".close");
const modalContent = document.querySelector(".modal-content");
const selectDay = document.querySelectorAll(".clickableDays");

//generate headers for menu grid
for (let i = 0; i < menuItemHeaders.length; i++) {
  const headerItem = document.createElement("div");

  headerItem.textContent = menuItemHeaders[i];
  headerItem.className = "headers";
  headerItem.id = "header" + [i + 1];
  menuGrid.appendChild(headerItem);
}

// generate containers for menu items
for (let i = 0; i < 28; i++) {
  const menuItem = document.createElement("div");

  menuItem.setAttribute("contentEditable", false);
  menuItem.setAttribute("draggable", true);
  menuItem.className = "menuItems";
  menuItem.id = "mi" + [i + 1];
  menuGrid.appendChild(menuItem);
}

// define function to loop through days and populate on dinner menu plan
for (let i = 0; i < days.length; i++) {
  const daysBox = document.createElement("div");

  daysBox.textContent = days[i];
  daysBox.className = "days";
  daysBox.id = "day" + (i + 1);
  menuGrid.appendChild(daysBox);
}

// define function to set new starting day of the week
reorderBtn.addEventListener("click", function () {
  modal.style.display = "block";
});

selectDay.forEach(function (e) {
  e.addEventListener("click", function (e) {
    days1 = days.slice(days.indexOf(e.target.textContent));
    days2 = days.slice(0, days.indexOf(e.target.textContent));
    days1.push(...days2);
    modal.style.display = "none";

    for (let i = 0; i < days1.length; i++) {
      let currentDay = "day" + (i + 1);
      let currentDayDOM = document.querySelector("#" + currentDay);

      currentDayDOM.textContent = days1[i];
    }
  });
});

// Handle event = close Modal Box Selection Tool without choosing a new starting day
closeSpan.addEventListener("click", function () {
  modal.style.display = "none";
});

// ADD DRAG AND DROP FUNCTIONALITY FOR MENU ITEMS

let dragIndex = 0;
let clone = "";

function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.dropEffect = "move";
}

function dragover_handler(e) {
  let dataFrom = e.dataTransfer.getData("text/plain");
  let dataTo = e.target.id;

  if (dataFrom !== dataTo) {
    e.preventDefault();
  }
}

function drop_handler(e) {
  e.preventDefault();

  clone = e.target.cloneNode(true);
  let data = e.dataTransfer.getData("text/plain");
  let nodelist = menuGrid.childNodes;
  for (let i = 0; i < nodelist.length; i++) {
    if (nodelist[i].id == data) {
      dragIndex = i;
    }
  }
  menuGrid.replaceChild(document.getElementById(data), e.target);
  menuGrid.insertBefore(clone, menuGrid.childNodes[dragIndex]);
  addEListen();
}

// ADD ALL EVENT HANDLERS FOR DRAG AND DROP TO ALL MENU ITEMS

// Calls function upon loading all content
window.addEventListener("DOMContentLoaded", addEListen);

// Function adds all event listeners; gets called at end of every drop action
function addEListen() {
  const miDrag = document.querySelectorAll(".menuItems");

  miDrag.forEach(function (e) {
    e.addEventListener("dragstart", dragstart_handler);
    e.addEventListener("dragover", dragover_handler);
    e.addEventListener("drop", drop_handler);
    e.addEventListener("dblclick", dcEdit);
  });
}

// ADD EDIT FUNCTIONALITY FOR MENU ITEMS

// Change div to contentEditable on double-click
function dcEdit(e) {
  console.log(e.contentEditable);
  e.target.contentEditable = true;
  e.target.textContent = "";
  e.target.focus();

  let input = e.target;
  input.onblur = inputBlur;
  function inputBlur() {
    e.target.contentEditable = false;
  }
}

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
