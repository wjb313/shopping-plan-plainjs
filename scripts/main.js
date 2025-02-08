// *** FULLY MODERNIZED MAIN.JS ***

console.log("🔥 main.js is running!");

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, getDocs } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD1Ex4V2kW9NVtUr7kg4zid4x4rZRhGqJ4",
    authDomain: "shopplan-56d92.firebaseapp.com",
    projectId: "shopplan-56d92",
    messagingSenderId: "872127731325",
    appId: "1:872127731325:web:d3216b68097ce8890c4314"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// *** PAGE NAVIGATION ***
const sections = {
    dinnerPlan: document.querySelector("#dinnerWrapper"),
    shoppingList: document.querySelector("#listWrapper")
};

document.querySelectorAll("[data-nav-to-dinner]").forEach(el => el.addEventListener("click", () => switchPage("dinnerPlan")));
document.querySelectorAll("[data-nav-to-shopping-list]").forEach(el => el.addEventListener("click", () => switchPage("shoppingList")));

function switchPage(section) {
    Object.values(sections).forEach(s => s.classList.add("hidden"));
    sections[section].classList.remove("hidden");
    saveCurrentPage(section);
}

// *** FIRESTORE DATA MANAGEMENT ***
const FIRESTORE_DOC = "userData";

async function saveCurrentPage(page) {
    try {
        await setDoc(doc(db, FIRESTORE_DOC, "settings"), { currentPage: page }, { merge: true });
    } catch (e) {
        console.error("❌ Error saving page state: ", e);
    }
}

async function loadCurrentPage() {
    const docSnap = await getDoc(doc(db, FIRESTORE_DOC, "settings"));
    if (docSnap.exists()) {
        switchPage(docSnap.data().currentPage || "dinnerPlan");
    }
}

// *** SHOPPING LIST MANAGEMENT ***
const listBody = document.querySelector("[data-list-body]");
document.querySelector("[data-btn-add-item]").addEventListener("click", addShoppingItem);

async function addShoppingItem() {
    const input = document.querySelector("[data-list-item-input]");
    const newItem = input.value.trim();
    if (!newItem) return;

    try {
        await addDoc(collection(db, FIRESTORE_DOC, "shoppingList"), { name: newItem, createdAt: new Date() });
        input.value = "";
        renderShoppingList();
    } catch (e) {
        console.error("❌ Error adding shopping item: ", e);
    }
}

async function renderShoppingList() {
    listBody.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, FIRESTORE_DOC, "shoppingList"));
    querySnapshot.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = doc.data().name;
        li.addEventListener("dblclick", () => deleteShoppingItem(doc.id));
        listBody.appendChild(li);
    });
}

async function deleteShoppingItem(id) {
    try {
        await deleteDoc(doc(db, "userData", "shoppingList", id));
        renderShoppingList();
    } catch (e) {
        console.error("❌ Error deleting shopping item: ", e);
    }
}

// *** INITIALIZE APP ***
document.addEventListener("DOMContentLoaded", async () => {
    await loadCurrentPage();
    await renderShoppingList();
    console.log("✅ Firestore connected, page state and shopping list loaded.");
});