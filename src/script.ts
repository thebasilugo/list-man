// type definitions
type NullableElement = Element | null;
type NullableHTMLElement = HTMLElement | null;
type NullableInputElement = HTMLInputElement | null;
type NullableDataListElement = HTMLDataListElement | null;

// Selecting elements from the DOM
const inputBox: NullableInputElement = document.querySelector("#input-box");
const addBtn: NullableElement = document.querySelector("#add-btn");
const listContainer: NullableElement =
	document.querySelector("#list-container");
const renderError: NullableElement = document.querySelector("#error");
// const renderHint = document.querySelector("#hint");

// On load, get the username (if any) from localStorage and display it
window?.addEventListener("load", () => {
	const nameInput: any = document.querySelector("#name"); // use any type
	const username: any = localStorage.getItem("username") || "";
	nameInput!.value = username;

	// Save the changed username to localStorage
	nameInput?.addEventListener("change", (e: any) => {
		localStorage.setItem("username", e.target.value);
	});
});

// Functions
// Display an error message when the 'Add' button is clicked, without any text being entered
const errorMsg = () => {
	renderError!.textContent = "Error. You have to write something!";
	setTimeout(endTimeout, 2000);
};

// Remove the error message
function endTimeout() {
	renderError!.textContent = "";
	// renderHint.textContent = "";
}
