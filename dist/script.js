var _a;
// Selecting elements from the DOM
var inputBox = document.querySelector("#input-box");
var addBtn = document.querySelector("#add-btn");
var listContainer = document.querySelector("#list-container");
var renderError = document.querySelector("#error");
// const renderHint = document.querySelector<HTMLDivElement>("#hint");
// On load, get the username (if any) from localStorage and display it
window.addEventListener("load", function () {
	var nameInput = document.querySelector("#name");
	var username = localStorage.getItem("username") || "";
	if (nameInput) {
		nameInput.value = username;
		// Save the changed username to localStorage
		nameInput.addEventListener("change", function (e) {
			var target = e.target;
			localStorage.setItem("username", target.value);
		});
	}
});
// Functions
// Display an error message when the 'Add' button is clicked, without any text being entered
var errorMsg = function () {
	if (renderError) {
		renderError.textContent = "Error. You have to write something!";
		setTimeout(endTimeout, 2000);
	}
};
// Remove the error message
function endTimeout() {
	if (renderError) {
		renderError.textContent = "";
	}
}
var addTask = function () {
	if (inputBox && inputBox.value.trim() === "") {
		// If there's nothing in the textbox, then display the error message
		errorMsg();
	} else {
		addListItem();
	}
	if (inputBox) {
		inputBox.value = "";
	}
};
// Add a To-Do when the 'Add' button is pressed
if (addBtn) {
	addBtn.addEventListener("click", addTask);
}
// Add a To-Do when the 'Enter' is pressed
if (inputBox) {
	inputBox.addEventListener("keypress", function (event) {
		// If the user presses the "Enter" key
		if (event.key === "Enter") {
			// Cancel the default action, if needed
			event.preventDefault();
			// Trigger the add-btn 'button' element with a click
			addTask();
		}
	});
}
// Function to handle the click event on the list items
listContainer === null || listContainer === void 0
	? void 0
	: listContainer.addEventListener(
			"click",
			function (e) {
				var target = e.target;
				if (target.tagName === "LI") {
					target.classList.toggle("checked");
					saveData();
				} else if (
					target.classList.contains("delete-btn") ||
					target.closest(".delete-btn")
				) {
					removeListItem(e);
				} else if (target.tagName === "BUTTON") {
					var listItem = target.parentElement;
					expandButtons(listItem); // This will now work
				}
			},
			false
	  );
// Function to expand buttons (example functionality)
function expandButtons(listItem) {
	// Example: Toggle visibility of an element within the list item
	var additionalButtons = listItem.querySelector(".additional-buttons");
	if (additionalButtons) {
		additionalButtons.classList.toggle("visible");
	}
}
// Updated removeListItem function to use the event object
function removeListItem(e) {
	var _a;
	var target = e.target;
	// If the clicked element is the delete button, remove its parent (the list item)
	if (target.classList.contains("delete-btn")) {
		(_a = target.parentElement) === null || _a === void 0
			? void 0
			: _a.remove();
		saveData();
	}
	// If the clicked element is within a delete button (e.g., an icon inside the button), remove the closest list item
	else if (target.closest(".delete-btn")) {
		target.closest("li").remove();
		saveData();
	}
}
// Saving the data to the browser's local storage so that reloads, refreshing, or closing of the page doesn't affect it.
function saveData() {
	if (listContainer) {
		localStorage.setItem("savedata", listContainer.innerHTML);
	}
}
// Display of saved data to localstorage upon restoration of the webpage
function showTask() {
	if (listContainer) {
		listContainer.innerHTML = localStorage.getItem("savedata") || "";
	}
}
showTask();
// Function to add a new list item
function addListItem() {
	// Create the new list item and its contents
	var listItem = document.createElement("li");
	listItem.classList.add("list-item");
	var textNode = document.createTextNode(
		(inputBox === null || inputBox === void 0 ? void 0 : inputBox.value) || ""
	);
	var deleteButton = document.createElement("button");
	deleteButton.classList.add("delete-btn", "ui", "icon", "button", "circular");
	var icon = document.createElement("i");
	icon.classList.add("x", "icon");
	// Append the contents to the list item
	listItem.appendChild(textNode);
	listItem.appendChild(deleteButton);
	deleteButton.appendChild(icon);
	// Append the list item to the list container
	if (listContainer) {
		listContainer.appendChild(listItem);
	}
}
// toggle theme
// Function to toggle dark mode and update the icon
function toggleDarkMode() {
	var body = document.body;
	var toggleThemeIcon = document.querySelector("#toggle-theme-icon");
	// Toggle the 'dark-mode' class on the body
	body.classList.toggle("dark-mode");
	// Update the icon based on the current theme
	if (body.classList.contains("dark-mode")) {
		if (toggleThemeIcon) {
			toggleThemeIcon.classList.replace("moon", "sun");
		}
		localStorage.setItem("theme", "dark");
	} else {
		if (toggleThemeIcon) {
			toggleThemeIcon.classList.replace("sun", "moon");
		}
		localStorage.setItem("theme", "light");
	}
}
// Function to apply the saved theme from localStorage on page load
function applySavedTheme() {
	var savedTheme = localStorage.getItem("theme");
	var body = document.body;
	var toggleThemeIcon = document.querySelector("#toggle-theme-icon");
	if (savedTheme === "dark") {
		body.classList.add("dark-mode");
		if (toggleThemeIcon) {
			toggleThemeIcon.classList.replace("moon", "sun");
		}
	} else {
		body.classList.remove("dark-mode");
		if (toggleThemeIcon) {
			toggleThemeIcon.classList.replace("sun", "moon");
		}
	}
}
// Add event listener to the theme toggle button
(_a = document.querySelector("#toggle-theme")) === null || _a === void 0
	? void 0
	: _a.addEventListener("click", toggleDarkMode);
// Apply the saved theme when the document content is fully loaded
document.addEventListener("DOMContentLoaded", applySavedTheme);
window.addEventListener("DOMContentLoaded", function () {
	var yearRangeElement = document.getElementById("year-range");
	if (yearRangeElement) {
		var currentYear = new Date().getFullYear();
		var createdYear = 2023; // Replace with the year your website was created
		if (createdYear === currentYear) {
			yearRangeElement.textContent = "".concat(createdYear);
		} else {
			yearRangeElement.textContent = ""
				.concat(createdYear, " - ")
				.concat(currentYear);
		}
	}
});
