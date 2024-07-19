"use strict";
const inputBox = document.querySelector("#input-box");
const addBtn = document.querySelector("#add-btn");
const listContainer = document.querySelector("#list-container");
const renderError = document.querySelector("#error");
window === null || window === void 0 ? void 0 : window.addEventListener("load", () => {
    const nameInput = document.querySelector("#name");
    const username = localStorage.getItem("username") || "";
    nameInput.value = username;
    nameInput.addEventListener("change", (e) => {
        localStorage.setItem("username", e.target.value);
    });
});
