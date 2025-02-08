// ***FULLY MODERNIZED MAIN.JS***

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD1Ex4V2kW9NVtUr7kg4zid4x4rZRhGqJ4",
    authDomain: "shopplan-56d92.firebaseapp.com",
    projectId: "shopplan-56d92",
    messagingSenderId: "872127731325",
    appId: "1:872127731325:web:d3216b68097ce8890c4314"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to test Firestore connection
async function testFirestore() {
    try {
        const docRef = await db.collection("testCollection").add({
            message: "Hello, Firestore!"
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Run Firestore test
testFirestore();

document.addEventListener("DOMContentLoaded", () => {
    // Section Mapping
    const sectionMap = {
        "data-nav-to-dinner": "#dinnerWrapper",
        "data-nav-to-lunch": "#lunchWrapper",
        "data-nav-to-breakfast": "#breakfastWrapper",
        "data-nav-to-shopping-list": "#listWrapper"
    };

    const hideAllSections = () => {
        Object.values(sectionMap).forEach(selector => {
            document.querySelector(selector).classList.add("hidden");
        });
    };

    const showSection = (sectionId) => {
        hideAllSections();
        document.querySelector(sectionId).classList.remove("hidden");
        saveCurrentPage(sectionId);
    };

    document.body.addEventListener("click", (event) => {
        const target = event.target.closest("[data-nav-to-dinner], [data-nav-to-lunch], [data-nav-to-breakfast], [data-nav-to-shopping-list]");
        if (target) {
            const sectionId = sectionMap[target.getAttribute("data-nav-to")];
            if (sectionId) showSection(sectionId);
        }
    });

    // Local Storage Handling
    const LOCAL_STORAGE_CURRENTPAGE_KEY = "current.page";
    const LOCAL_STORAGE_DINNERMENU_KEY = "dinner.menu";
    const LOCAL_STORAGE_SHOPPINGLIST_KEY = "shopping.list";

    const saveCurrentPage = (page) => {
        localStorage.setItem(LOCAL_STORAGE_CURRENTPAGE_KEY, page);
    };

    const loadCurrentPage = () => {
        const savedPage = localStorage.getItem(LOCAL_STORAGE_CURRENTPAGE_KEY);
        if (savedPage && document.querySelector(savedPage)) {
            showSection(savedPage);
        }
    };

    loadCurrentPage();

    // Load saved menu data
    let menuItemsContent = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DINNERMENU_KEY)) || {};

    document.querySelectorAll(".menuItems").forEach(input => {
        input.value = menuItemsContent[input.id] || "";
        input.addEventListener("input", (e) => {
            menuItemsContent[e.target.id] = e.target.value;
            localStorage.setItem(LOCAL_STORAGE_DINNERMENU_KEY, JSON.stringify(menuItemsContent));
        });
    });

    // Shopping List Functionality
    const listBody = document.querySelector("[data-list-body]");
    let shoppingList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SHOPPINGLIST_KEY)) || [];

    const renderShoppingList = () => {
        listBody.innerHTML = "";
        shoppingList.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.addEventListener("dblclick", () => {
                shoppingList.splice(index, 1);
                localStorage.setItem(LOCAL_STORAGE_SHOPPINGLIST_KEY, JSON.stringify(shoppingList));
                renderShoppingList();
            });
            listBody.appendChild(li);
        });
    };

    renderShoppingList();

    document.querySelector("[data-btn-add-item]").addEventListener("click", () => {
        const newItem = document.querySelector("[data-list-item-input]").value.trim();
        if (newItem) {
            shoppingList.push(newItem);
            localStorage.setItem(LOCAL_STORAGE_SHOPPINGLIST_KEY, JSON.stringify(shoppingList));
            renderShoppingList();
        }
    });

    // Drag & Drop
    document.querySelectorAll(".draggable").forEach(item => {
        item.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text", event.target.id);
        });
    });

    document.querySelectorAll(".dropzone").forEach(zone => {
        zone.addEventListener("dragover", (event) => event.preventDefault());
        zone.addEventListener("drop", (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data);
            if (draggedElement) {
                event.target.appendChild(draggedElement);
            }
        });
    });
});
