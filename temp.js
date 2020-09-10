// ***MENU PLAN PAGE***

let daysDude = {
  day1: {
    main: "day1Main",
    side1: "day1Side1",
    side2: "day1Side2",
    other: "day1Other",
  },
  day2: { main: "", side1: "", side2: "", other: "" },
  day3: { main: "", side1: "", side2: "", other: "" },
  day4: { main: "", side1: "", side2: "", other: "" },
  day5: { main: "", side1: "", side2: "", other: "" },
  day6: { main: "", side1: "", side2: "", other: "" },
  day7: { main: "", side1: "", side2: "", other: "" },
};

let jsonDaysDude = JSON.stringify(daysDude);
localStorage.setItem("temp", jsonDaysDude);

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

// declare constants and variables for storing data
const LOCAL_STORAGE_KEY_DAY1 = "day1.plan";
const LOCAL_STORAGE_KEY_DAY2 = "day2.plan";
const LOCAL_STORAGE_KEY_DAY3 = "day3.plan";
const LOCAL_STORAGE_KEY_DAY4 = "day4.plan";
const LOCAL_STORAGE_KEY_DAY5 = "day5.plan";
const LOCAL_STORAGE_KEY_DAY6 = "day6.plan";
const LOCAL_STORAGE_KEY_DAY7 = "day7.plan";

let planDay0 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY1)) || [];

let planDay1 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY2)) || [
  "",
  "",
  "",
  "",
];

let planDay2 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY3)) || [
  "",
  "",
  "",
  "",
];

let planDay3 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY4)) || [
  "",
  "",
  "",
  "",
];

let planDay4 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY5)) || [
  "",
  "",
  "",
  "",
];

let planDay5 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY6)) || [
  "",
  "",
  "",
  "",
];

let planDay7 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DAY7)) || [
  "",
  "",
  "",
  "",
];

// const saturday0 = document.querySelector("#mi1-1");
// const saturday1 = document.querySelector("#mi1-2");
// const saturday2 = document.querySelector("#mi1-3");
// const saturday3 = document.querySelector("#mi1-4");

// saturday0.value = saturdayPlan[0];
// saturday1.value = saturdayPlan[1];
// saturday2.value = saturdayPlan[2];
// saturday3.value = saturdayPlan[3];

function populateDays() {
  let currentPlanDay;
  let inputID;

  for (i = 0; i < 7; i++) {
    currentPlanDay = "planDay" + i;
    console.log(currentPlanDay);
    for (j = 0; j < currentPlanDay.length; j++) {
      console.log(currentPlanDay.length);
      inputID = [i] + [j];

      //inputID.dataset.id.value = currentPlanDay[j];
    }
  }
}

// function populateDays() {
//   for (i = 0; i < saturdayPlan.length; i++) {
//     let planDay = "saturday" + i;
//     planDay.value = saturdayPlan[i];
//   }
// }

function saturdaySave(e) {
  saturdayPlan[e.target.dataset.id] = e.target.value;
  localStorage.setItem(LOCAL_STORAGE_KEY_DAY1, JSON.stringify(saturdayPlan));
}

// function save(e) {
//   localStorage.setItem(LOCAL_STORAGE_KEY_DAY1, JSON.stringify(saturdayPlan));
//   console.log("saved: " + e.target.id);
//   console.log(e.target.dataset.id);
// }

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

// ADD ALL EVENT HANDLERS FOR DRAG AND DROP TO ALL MENU ITEMS

// Calls function upon loading all content
window.addEventListener("DOMContentLoaded", addEListen);
window.addEventListener("DOMContentLoaded", populateDays);
// Function adds all event listeners; gets called at end of every drop action
function addEListen() {
  addDrag();
  addDropZone();
  addLocalStorageSave();
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

function addLocalStorageSave() {
  const menuItems = document.querySelectorAll(".menuItems");

  menuItems.forEach(function (e) {
    e.addEventListener("blur", saturdaySave);
  });
}

// function saveInput(e) {
//   console.log(e.contentEditable);
//   e.target.contentEditable = true;
//   //e.target.textContent = "";
//   e.target.focus();

//   let input = e.target;
//   input.onblur = inputBlur;
//   function inputBlur() {
//     save();
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
