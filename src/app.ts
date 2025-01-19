// Utility functions
const $ = (selector: string): HTMLElement | null =>
	document.querySelector(selector);
const $$ = (selector: string): NodeListOf<HTMLElement> =>
	document.querySelectorAll(selector);

// Todo interface
interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: Date;
	priority: "low" | "medium" | "high";
}

// DOM Elements
const elements = {
	inputBox: $("#input-box") as HTMLInputElement,
	addBtn: $("#add-btn") as HTMLElement,
	listContainer: $("#list-container") as HTMLElement,
	renderError: $("#error") as HTMLElement,
	nameInput: $("#name") as HTMLInputElement,
	toggleThemeBtn: $("#toggle-theme") as HTMLElement,
	toggleThemeIcon: $("#toggle-theme-icon") as HTMLElement,
	yearRangeElement: $("#year-range") as HTMLElement,
	tasksCountElement: $("#tasks-count") as HTMLElement,
	clearCompletedBtn: $("#clear-completed") as HTMLElement,
	sortDropdown: $(".sort-dropdown") as HTMLElement,
	searchBox: $("#search-box") as HTMLInputElement,
	clearSelectedBtn: $("#clear-selected") as HTMLElement,
};

// State management
interface AppState {
	todos: Todo[];
	username: string;
	theme: "light" | "dark";
	filter: "all" | "active" | "completed";
	sort: "created" | "alphabetical" | "priority";
	searchQuery: string;
	selectedTodos: Set<string>;
}

const state: AppState = {
	todos: [],
	username: "",
	theme: "light",
	filter: "all",
	sort: "created",
	searchQuery: "",
	selectedTodos: new Set<string>(),
};

// Local Storage Keys
const STORAGE_KEYS = {
	TODOS: "listman_todos",
	USERNAME: "listman_username",
	THEME: "listman_theme",
};

// Undo/Redo Functionality
const historyStack: AppState[] = [];
let historyIndex = -1;

function saveToHistory(): void {
	if (historyIndex < historyStack.length - 1) {
		historyStack.splice(historyIndex + 1);
	}
	historyStack.push(JSON.parse(JSON.stringify(state)));
	historyIndex = historyStack.length - 1;
}

function undo(): void {
	if (historyIndex > 0) {
		historyIndex--;
		Object.assign(
			state,
			JSON.parse(JSON.stringify(historyStack[historyIndex]))
		);
		renderTodos();
	}
}

function redo(): void {
	if (historyIndex < historyStack.length - 1) {
		historyIndex++;
		Object.assign(
			state,
			JSON.parse(JSON.stringify(historyStack[historyIndex]))
		);
		renderTodos();
	}
}

// Event Listeners
window.addEventListener("load", initializeApp);
elements.addBtn.addEventListener("click", addTask);
elements.inputBox.addEventListener("keypress", handleEnterKey);
elements.listContainer.addEventListener("click", handleListClick);
elements.nameInput.addEventListener("change", updateUsername);
elements.toggleThemeBtn.addEventListener("click", toggleTheme);
elements.clearCompletedBtn?.addEventListener("click", clearCompletedTasks);
elements.searchBox?.addEventListener("input", handleSearch);
elements.clearSelectedBtn?.addEventListener("click", clearSelectedTodos);
document.addEventListener("DOMContentLoaded", () => {
	updateYearRange();
	initializeSortDropdown();
	applyTheme(); // Apply the theme when the DOM is loaded
});
document.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.ctrlKey || e.metaKey) {
		if (e.key === "z") {
			e.preventDefault();
			undo();
		} else if (e.key === "y") {
			e.preventDefault();
			redo();
		}
	}
});

// Initialize the application
function initializeApp(): void {
	loadStateFromStorage();
	renderTodos();
	applyTheme();
	updateTasksCount();
	elements.nameInput.value = state.username;
	saveToHistory(); // Initialize history
}

// Load state from local storage
function loadStateFromStorage(): void {
	const storedTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
	state.todos = storedTodos ? JSON.parse(storedTodos) : [];
	state.username = localStorage.getItem(STORAGE_KEYS.USERNAME) || "";
	state.theme = (localStorage.getItem(STORAGE_KEYS.THEME) || "light") as
		| "light"
		| "dark";
}

// Save state to local storage
function saveStateToStorage(): void {
	localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
	localStorage.setItem(STORAGE_KEYS.USERNAME, state.username);
	localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
}

// Render todos
function renderTodos(): void {
	if (elements.listContainer) {
		const filteredTodos = filterTodos(state.todos, state.filter).filter(
			(todo) =>
				todo.text.toLowerCase().includes(state.searchQuery.toLowerCase())
		);
		const sortedTodos = sortTodos(filteredTodos, state.sort);

		elements.listContainer.innerHTML = sortedTodos
			.map(
				(todo) => `
          <li class="list-item items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 ${
						todo.completed ? "opacity-60" : ""
					} ${
					state.selectedTodos.has(todo.id) ? "bg-blue-100 dark:bg-blue-800" : ""
				}" data-id="${todo.id}">
            <div class="flex items-center space-x-3 flex-grow">
              <input type="checkbox" class="todo-checkbox w-5 h-5" ${
								todo.completed ? "checked" : ""
							}>
              <span class="todo-text flex-grow break-words ${
								todo.completed ? "line-through" : ""
							}">${todo.text}</span>
            </div>
            <div class="flex items-center space-x-2">
              <select class="priority-select bg-transparent border-none dark:bg-gray-600 dark:text-white" data-action="priority">
                <option value="low" ${
									todo.priority === "low" ? "selected" : ""
								}>Low</option>
                <option value="medium" ${
									todo.priority === "medium" ? "selected" : ""
								}>Medium</option>
                <option value="high" ${
									todo.priority === "high" ? "selected" : ""
								}>High</option>
              </select>
              <button class="edit-btn ui icon button tiny dark:bg-gray-600 dark:text-white" data-action="edit">
                <i class="edit icon"></i>
              </button>
              <button class="delete-btn ui icon button tiny red dark:bg-red-800">
                <i class="trash icon"></i>
              </button>
            </div>
          </li>
        `
			)
			.join("");
	}
	updateTasksCount();
}

// Add a new task
function addTask(): void {
	const todoText = elements.inputBox.value.trim();
	if (todoText === "") {
		showError("Error: You have to write something!");
		return;
	}
	const newTodo: Todo = {
		id: Date.now().toString(),
		text: todoText,
		completed: false,
		createdAt: new Date(),
		priority: "medium",
	};
	state.todos.push(newTodo);
	elements.inputBox.value = "";
	saveStateToStorage();
	saveToHistory();
	renderTodos();
}

// Handle Enter key press
function handleEnterKey(event: KeyboardEvent): void {
	if (event.key === "Enter") {
		event.preventDefault();
		addTask();
	}
}

// Handle clicks on the list container
function handleListClick(e: MouseEvent): void {
	const target = e.target as HTMLElement;
	const listItem = target.closest(".list-item") as HTMLElement;
	if (!listItem) return;

	const todoId = listItem.dataset.id!;

	if (target.closest(".delete-btn")) {
		removeTodo(todoId);
	} else if (target.closest(".edit-btn")) {
		toggleEdit(todoId);
	} else if (target.classList.contains("todo-checkbox")) {
		toggleTodoComplete(todoId);
	} else if (target.classList.contains("priority-select")) {
		updateTodoPriority(
			todoId,
			(target as HTMLSelectElement).value as "low" | "medium" | "high"
		);
	} else if (target === listItem || target.classList.contains("todo-text")) {
		toggleTodoSelection(todoId);
	}
}

// Remove a todo
function removeTodo(id: string): void {
	state.todos = state.todos.filter((todo) => todo.id !== id);
	saveStateToStorage();
	saveToHistory();
	renderTodos();
}

// Toggle todo complete status
function toggleTodoComplete(id: string): void {
	const todo = state.todos.find((t) => t.id === id);
	if (todo) {
		todo.completed = !todo.completed;
		saveStateToStorage();
		saveToHistory();
		renderTodos();
	}
}

// Update username
function updateUsername(e: Event): void {
	const input = e.target as HTMLInputElement;
	state.username = input.value;
	saveStateToStorage();
}

// Toggle theme
function toggleTheme(): void {
	state.theme = state.theme === "light" ? "dark" : "light";
	saveStateToStorage();
	applyTheme();
}

// Apply theme
function applyTheme(): void {
	document.body.classList.toggle("dark-mode", state.theme === "dark");
	elements.toggleThemeIcon.classList.toggle("sun", state.theme === "light");
	elements.toggleThemeIcon.classList.toggle("moon", state.theme === "dark");

	// Update button and input styles
	document.querySelectorAll(".ui.button, input, .filter-btn").forEach((el) => {
		el.classList.toggle("dark-mode", state.theme === "dark");
	});
}

// Show error message with animation
function showError(message: string): void {
	elements.renderError.textContent = message;
	elements.renderError.classList.remove("hidden");
	elements.renderError.classList.add("fadeIn");
	setTimeout(() => {
		elements.renderError.classList.remove("fadeIn");
		elements.renderError.classList.add("hidden");
	}, 3000);
}

// Update year range in footer
function updateYearRange(): void {
	const currentYear = new Date().getFullYear();
	const createdYear = 2023;
	elements.yearRangeElement.textContent =
		createdYear === currentYear
			? `${createdYear}`
			: `${createdYear} - ${currentYear}`;
}

// Toggle edit mode
function toggleEdit(id: string): void {
	const listItem = elements.listContainer.querySelector(
		`[data-id="${id}"]`
	) as HTMLElement;
	const todoText = listItem.querySelector(".todo-text") as HTMLElement;
	const editInput = document.createElement("input");
	editInput.type = "text";
	editInput.className =
		"todo-edit-input bg-white dark:bg-gray-700 dark:text-white border rounded px-2 py-1 flex-grow";
	editInput.value = todoText.textContent || "";

	const editBtn = listItem.querySelector(".edit-btn") as HTMLElement;

	todoText.replaceWith(editInput);
	editInput.focus();

	editBtn.innerHTML = '<i class="check icon"></i>';

	const saveEdit = () => {
		const newText = editInput.value.trim();
		if (newText) {
			saveEditedTodo(id, newText);
		} else {
			showError("Error: You cannot leave the todo empty!");
		}
		editInput.replaceWith(todoText);
		editBtn.innerHTML = '<i class="edit icon"></i>';
	};

	editInput.addEventListener("blur", saveEdit);
	editInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			saveEdit();
		}
	});
}

// Save the edited todo
function saveEditedTodo(id: string, newText: string): void {
	const todo = state.todos.find((t) => t.id === id);
	if (todo) {
		todo.text = newText;
		saveStateToStorage();
		saveToHistory();
		renderTodos();
	}
}

// Update todo priority
function updateTodoPriority(
	id: string,
	priority: "low" | "medium" | "high"
): void {
	const todo = state.todos.find((t) => t.id === id);
	if (todo) {
		todo.priority = priority;
		saveStateToStorage();
		saveToHistory();
		renderTodos();
	}
}

// Filter todos
function filterTodos(todos: Todo[], filter: string): Todo[] {
	switch (filter) {
		case "active":
			return todos.filter((todo) => !todo.completed);
		case "completed":
			return todos.filter((todo) => todo.completed);
		default:
			return todos;
	}
}

// Sort todos
function sortTodos(todos: Todo[], sortBy: string): Todo[] {
	switch (sortBy) {
		case "alphabetical":
			return [...todos].sort((a, b) => a.text.localeCompare(b.text));
		case "priority":
			return [...todos].sort((a, b) => {
				const priorityOrder = { high: 0, medium: 1, low: 2 };
				return priorityOrder[a.priority] - priorityOrder[b.priority];
			});
		default:
			return [...todos].sort(
				(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
			);
	}
}

// Clear completed tasks
function clearCompletedTasks(): void {
	state.todos = state.todos.filter((todo) => !todo.completed);
	saveStateToStorage();
	saveToHistory();
	renderTodos();
}

// Update tasks count
function updateTasksCount(): void {
	const totalTasks = state.todos.length;
	const completedTasks = state.todos.filter((todo) => todo.completed).length;
	elements.tasksCountElement.textContent = `${completedTasks}/${totalTasks} completed`;
}

// Initialize sort dropdown
function initializeSortDropdown(): void {
	elements.sortDropdown?.addEventListener("click", (e: Event) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains("item")) {
			state.sort = target.dataset.value as
				| "created"
				| "alphabetical"
				| "priority";
			renderTodos();
		}
	});
}

// Filter Logic
$$(".filter-btn").forEach((button) => {
	button.addEventListener("click", (e: Event) => {
		const filter = (e.target as HTMLElement).id.replace("filter-", "") as
			| "all"
			| "active"
			| "completed";
		$(".filter-btn.active")?.classList.remove("active");
		(e.target as HTMLElement).classList.add("active");
		state.filter = filter;
		renderTodos();
	});
});

// Handle Search
function handleSearch(): void {
	state.searchQuery = elements.searchBox?.value.toLowerCase() || "";
	renderTodos();
}

// Clear Selected Todos
function clearSelectedTodos(): void {
	state.todos = state.todos.filter((todo) => !state.selectedTodos.has(todo.id));
	state.selectedTodos.clear();
	saveStateToStorage();
	saveToHistory();
	renderTodos();
}

// Toggle Todo Selection
function toggleTodoSelection(id: string): void {
	if (state.selectedTodos.has(id)) {
		state.selectedTodos.delete(id);
	} else {
		state.selectedTodos.add(id);
	}
	renderTodos();
}

// Initialize the app
initializeApp();
