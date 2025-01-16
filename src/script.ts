// Selecting elements from the DOM
const inputBox = document.querySelector<HTMLInputElement>("#input-box");
const addBtn = document.querySelector<HTMLButtonElement>("#add-btn");
const listContainer =
	document.querySelector<HTMLUListElement>("#list-container");
const renderError = document.querySelector<HTMLDivElement>("#error");
// const renderHint = document.querySelector<HTMLDivElement>("#hint");

// On load, get the username (if any) from localStorage and display it
window.addEventListener("load", () => {
	const nameInput = document.querySelector<HTMLInputElement>("#name");
	const username = localStorage.getItem("username") || "";
	if (nameInput) {
		nameInput.value = username;
		// Save the changed username to localStorage
		nameInput.addEventListener("change", (e: Event) => {
			const target = e.target as HTMLInputElement;
			localStorage.setItem("username", target.value);
		});
	}
});

// Functions
// Display an error message when the 'Add' button is clicked, without any text being entered
const errorMsg = () => {
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

const addTask = () => {
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
	inputBox.addEventListener("keypress", (event: KeyboardEvent) => {
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
listContainer?.addEventListener(
	"click",
	function (e: MouseEvent) {
		const target = e.target as HTMLElement;

		if (target.tagName === "LI") {
			(target as HTMLLIElement).classList.toggle("checked");
			saveData();
		} else if (
			target.classList.contains("delete-btn") ||
			target.closest(".delete-btn")
		) {
			removeListItem(e);
		} else if (target.tagName === "BUTTON") {
			const listItem = target.parentElement as HTMLElement;
			expandButtons(listItem); // This will now work
		}
	},
	false
);

// Function to expand buttons (example functionality)
function expandButtons(listItem: HTMLElement): void {
	// Example: Toggle visibility of an element within the list item
	const additionalButtons = listItem.querySelector(".additional-buttons");
	if (additionalButtons) {
		additionalButtons.classList.toggle("visible");
	}
}

// Updated removeListItem function to use the event object
function removeListItem(e: MouseEvent) {
	const target = e.target as HTMLElement;

	// If the clicked element is the delete button, remove its parent (the list item)
	if (target.classList.contains("delete-btn")) {
		(target as HTMLElement).parentElement?.remove();
		saveData();
	}
	// If the clicked element is within a delete button (e.g., an icon inside the button), remove the closest list item
	else if (target.closest(".delete-btn")) {
		(target.closest("li") as HTMLElement).remove();
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
	const listItem = document.createElement("li");
	listItem.classList.add("list-item");

	const textNode = document.createTextNode(inputBox?.value || "");

	const deleteButton = document.createElement("button");
	deleteButton.classList.add("delete-btn", "ui", "icon", "button", "circular");

	const icon = document.createElement("i");
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
	const body = document.body;
	const toggleThemeIcon =
		document.querySelector<HTMLElement>("#toggle-theme-icon");

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
	const savedTheme = localStorage.getItem("theme");
	const body = document.body;
	const toggleThemeIcon =
		document.querySelector<HTMLElement>("#toggle-theme-icon");

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
document
	.querySelector<HTMLElement>("#toggle-theme")
	?.addEventListener("click", toggleDarkMode);

// Apply the saved theme when the document content is fully loaded
document.addEventListener("DOMContentLoaded", applySavedTheme);

window.addEventListener("DOMContentLoaded", () => {
	const yearRangeElement = document.getElementById("year-range");

	if (yearRangeElement) {
		const currentYear = new Date().getFullYear();
		const createdYear = 2023; // Replace with the year your website was created
		if (createdYear === currentYear) {
			yearRangeElement.textContent = `${createdYear}`;
		} else {
			yearRangeElement.textContent = `${createdYear} - ${currentYear}`;
		}
	}
});
