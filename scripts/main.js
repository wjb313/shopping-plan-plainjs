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

const headerItems = ["Day", "Main Dish", "Side Dish", "Side Dish", "Other"];

// declare variables and constants for manipluating the DOM
const menuGrid = document.querySelector("#menuGrid");
const reorderBtn = document.querySelector("#reorderBtn");
const modal = document.querySelector("#myModal");
const closeSpan = document.querySelector(".close");
const modalContent = document.querySelector(".modal-content");
const selectDay = document.querySelectorAll(".clickableDays");

//generate headers
for (let i = 0; i < headerItems.length; i++) {
  const headerItem = document.createElement("div");

  headerItem.textContent = headerItems[i];
  headerItem.className = "headers";
  headerItem.id = "header" + [i + 1];
  menuGrid.appendChild(headerItem);
}

// generate containers for menu items
for (let i = 0; i < 28; i++) {
  const menuItem = document.createElement("div");

  menuItem.setAttribute("contentEditable", false);
  menuItem.setAttribute("draggable", true);
  // menuItem.setAttribute("ondragstart", "dragstart_handler(event)");
  // menuItem.setAttribute("ondragover", "dragover_handler(event)");
  // menuItem.setAttribute("ondrop", "drop_handler(event)");
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
const day1 = document.querySelector("#day1");
const day2 = document.querySelector("#day2");
const day3 = document.querySelector("#day3");
const day4 = document.querySelector("#day4");
const day5 = document.querySelector("#day5");
const day6 = document.querySelector("#day6");
const day7 = document.querySelector("#day7");
// for (let i = 0; i < days.length; i++) {
//   const daysSelect = document.createElement("span");

//   daysSelect.textContent = days[i];
//   daysSelect.className = "clickableDays";
//   // daysBox.id = "day" + (i + 1);
//   modalContent.appendChild(daysSelect);
// }

// define function to re-order days of the week
reorderBtn.addEventListener("click", function () {
  modal.style.display = "block";
});

selectDay.forEach(function (e) {
  e.addEventListener("click", function (e) {
    days1 = days.slice(days.indexOf(e.target.textContent));
    console.log("new array days1: " + days1);
    days2 = days.slice(0, days.indexOf(e.target.textContent));
    console.log("new array days2: " + days2);
    days1.push(...days2);
    console.log("days 2 appended to days 1: " + days1);
    modal.style.display = "none";
    //menuGrid.removeChild(menuGrid.lastChild);
    for (let i = 0; i < days1.length; i++) {
      //const daysBox = document.createElement("div");
      let currentDay = "day" + (i + 1);
      let currentDayDOM = document.querySelector("#" + currentDay);
      console.log(currentDay);
      currentDayDOM.textContent = days1[i];
      console.log(days1[i]);
      console.log(currentDayDOM.textContent);
      //console.log(currentDay.textContent);
      //daysBox.className = "days";
      //daysBox.id = "day" + (i + 1);
      //menuGrid.appendChild(daysBox);
    }
  });
});

// selectDay.addEventListener("click", function (e) {
//   console.log("You selected: " + e.target.textContent);
//   console.log(days);
//   console.log(days.indexOf("e.target.textContent"));
//   days1 = days.slice(days.indexOf("e.target.textContent"));
//   days2 = days.slice(0, days.indexOf("e.target.textContent"));
// });

closeSpan.addEventListener("click", function () {
  modal.style.display = "none";
});

//const reorder = function () {};

// Drag and drop functionality
let dragIndex = 0;
let clone = "";

function dragstart_handler(e) {
  //e.preventDefault();
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

//function exitEdit() {}

function addEListen() {
  const miDrag = document.querySelectorAll(".menuItems");

  miDrag.forEach(function (e) {
    e.addEventListener("dragstart", dragstart_handler);
    e.addEventListener("dragover", dragover_handler);
    e.addEventListener("drop", drop_handler);
    e.addEventListener("dblclick", dcEdit);
  });
}

//menuGrid.addEventListener("click");
window.addEventListener("DOMContentLoaded", addEListen);

// DRAG-N-DROP SCRIPT EXAMPLE FROM [https://medium.com/@ramya.bala221190/dragging-dropping-and-swapping-elements-with-javascript-11d9cdac2178]
// let dragindex = 0;
// let dropindex = 0;
// let clone = "";

// function drag(e) {
//   e.dataTransfer.setData("text/plain", e.target.innerText);
//   console.log(e.target.innerText);
//   e.dataTransfer.setData("text", e.target.id);
//   console.log(e.target.id);
// }

// function drop(e) {
//   e.preventDefault();
//   clone = e.target.cloneNode(true);
//   console.log(clone);
//   let data = e.dataTransfer.getData("text");
//   console.log(data);
//   let nodelist = document.getElementById("menuGrid").childNodes;
//   for (let i = 0; i < nodelist.length; i++) {
//     if (nodelist[i].id == data) {
//       dragindex = i;
//     }
//   }

//   document
//     .getElementById("menuGrid")
//     .replaceChild(document.getElementById(data), e.target);

//   document
//     .getElementById("menuGrid")
//     .insertBefore(
//       clone,
//       document.getElementById("menuGrid").childNodes[dragindex]
//     );
// }

// function allowDrop(e) {
//   e.preventDefault();
// }
