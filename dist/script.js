"use strict";
const inputBox = document.querySelector("#input-box");
const addBtn = document.querySelector("#add-btn");
const listContainer = document.querySelector("#list-container");
const renderError = document.querySelector("#error");
window === null || window === void 0 ? void 0 : window.addEventListener("load", () => {
    const nameInput = document.querySelector("#name");
    const username = localStorage.getItem("username") || "";
    nameInput.value = username;
    nameInput === null || nameInput === void 0 ? void 0 : nameInput.addEventListener("change", (e) => {
        localStorage.setItem("username", e.target.value);
    });
});
const errorMsg = () => {
    renderError.textContent = "Error. You have to write something!";
    setTimeout(endTimeout, 2000);
};
function endTimeout() {
    renderError.textContent = "";
}
