// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// DOM Elements
const elements = {
	inputBox: $("#input-box"),
	addBtn: $("#add-btn"),
	listContainer: $("#list-container"),
	renderError: $("#error"),
	nameInput: $("#name"),
	toggleThemeBtn: $("#toggle-theme"),
	toggleThemeIcon: $("#toggle-theme-icon"),
	yearRangeElement: $("#year-range"),
};

// State management
const state = {
	todos: [],
	username: "",
	theme: "light",
};

// Local Storage Keys
const STORAGE_KEYS = {
	TODOS: "listman_todos",
	USERNAME: "listman_username",
	THEME: "listman_theme",
};

// Event Listeners
window.addEventListener("load", initializeApp);
elements.addBtn.addEventListener("click", addTask);
elements.inputBox.addEventListener("keypress", handleEnterKey);
elements.listContainer.addEventListener("click", handleListClick);
elements.nameInput.addEventListener("change", updateUsername);
elements.toggleThemeBtn.addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", updateYearRange);

// Initialize the application
function initializeApp() {
	loadStateFromStorage();
	renderTodos();
	applyTheme();
	elements.nameInput.value = state.username;
}

// Load state from local storage
function loadStateFromStorage() {
	state.todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS)) || [];
	state.username = localStorage.getItem(STORAGE_KEYS.USERNAME) || "";
	state.theme = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
}

// Save state to local storage
function saveStateToStorage() {
	localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
	localStorage.setItem(STORAGE_KEYS.USERNAME, state.username);
	localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
}

// Render todos
function renderTodos() {
	elements.listContainer.innerHTML = state.todos
		.map(
			(todo, index) => `
      <li class="list-item ${
				todo.completed ? "checked" : ""
			}" data-id="${index}">
        <span class="todo-text ${
					todo.completed ? "completed" : ""
				}" data-action="edit">${todo.text}</span>
        <input type="text" class="todo-edit-input hidden" value="${
					todo.text
				}" data-action="edit-input">
        <div class="todo-actions">
          <button class="edit-btn ui icon button circular">
            <i class="edit icon"></i>
          </button>
          <button class="delete-btn ui icon button circular">
            <i class="x icon"></i>
          </button>
        </div>
      </li>
    `
		)
		.join("");
}

// Add a new task
function addTask() {
	const todoText = elements.inputBox.value.trim();
	if (todoText === "") {
		showError("Error. You have to write something!");
		return;
	}
	state.todos.push({ text: todoText, completed: false, createdAt: new Date() });
	elements.inputBox.value = "";
	saveStateToStorage();
	renderTodos();
}

// Handle Enter key press
function handleEnterKey(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		addTask();
	}
}

// Handle clicks on the list container
function handleListClick(e) {
	const target = e.target;
	const listItem = target.closest(".list-item");
	if (!listItem) return;

	const todoId = parseInt(listItem.dataset.id);

	if (target.closest(".delete-btn")) {
		removeTodo(todoId);
	} else if (target.closest(".edit-btn")) {
		toggleEdit(todoId);
	} else {
		toggleTodoComplete(todoId);
	}
}

// Remove a todo
function removeTodo(id) {
	state.todos.splice(id, 1);
	saveStateToStorage();
	renderTodos();
}

// Toggle todo complete status
function toggleTodoComplete(id) {
	state.todos[id].completed = !state.todos[id].completed;
	saveStateToStorage();
	renderTodos();
}

// Update username
function updateUsername(e) {
	state.username = e.target.value;
	saveStateToStorage();
}

// Toggle theme
function toggleTheme() {
	state.theme = state.theme === "light" ? "dark" : "light";
	applyTheme();
	saveStateToStorage();
}

// Apply theme
function applyTheme() {
	document.body.classList.toggle("dark-mode", state.theme === "dark");
	elements.toggleThemeIcon.classList.replace(
		state.theme === "dark" ? "moon" : "sun",
		state.theme === "dark" ? "sun" : "moon"
	);
}

// Show error message
function showError(message) {
	elements.renderError.textContent = message;
	elements.renderError.classList.remove("hidden");
	setTimeout(() => {
		elements.renderError.classList.add("hidden");
		elements.renderError.textContent = "";
	}, 2000);
}

// Update year range in footer
function updateYearRange() {
	const currentYear = new Date().getFullYear();
	const createdYear = 2023;
	elements.yearRangeElement.textContent =
		createdYear === currentYear
			? `${createdYear}`
			: `${createdYear} - ${currentYear}`;
}

// Toggle edit mode
function toggleEdit(id) {
	const listItem = elements.listContainer.querySelector(`[data-id="${id}"]`);
	const todoText = listItem.querySelector(".todo-text");
	const editInput = listItem.querySelector(".todo-edit-input");

	todoText.classList.toggle("hidden");
	editInput.classList.toggle("hidden");

	if (!editInput.classList.contains("hidden")) {
		editInput.focus();
		editInput.addEventListener("blur", () =>
			saveEdit(id, editInput.value.trim())
		);
		editInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				saveEdit(id, editInput.value.trim());
			}
		});
	}
}

// Save the edited todo
function saveEdit(id, newText) {
	if (newText === "") {
		showError("Error. You cannot leave the todo empty!");
		return;
	}

	state.todos[id].text = newText;
	saveStateToStorage();
	renderTodos();
}
