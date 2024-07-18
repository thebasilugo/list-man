const inputBox = document.querySelector("#input-box");
const addBtn = document.querySelector("#add-btn");
const listContainer = document.querySelector("#list-container");
const renderError = document.querySelector("#error");
// const renderHint = document.querySelector("#hint");

// On load, get the username (if any) from localStorage and display it
window.addEventListener("load", () => {
  const nameInput = document.querySelector("#name");
  const username = localStorage.getItem("username") || "";
  nameInput.value = username;

  // Save the changed username to localStorage
  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
  });
});

// Functions
// Display an error message when the 'Add' button is clicked, without any text being entered
function errorMsg() {
  renderError.textContent = "Error. You have to write something!";
  setTimeout(endTimeout, 2000);
}

// Remove the error message
function endTimeout() {
  renderError.textContent = "";
  // renderHint.textContent = "";
}

const addTask = () => {
  if (inputBox.value.trim() === "") {
    // If there's nothing in the textbox, then display the error message
    errorMsg();
    saveData();
  } else {
    addListItem();
    saveData();
  }
  inputBox.value = "";
  saveData();
};

// Add a To-Do when the 'Add' button is pressed
addBtn.addEventListener("click", addTask);

// Add a To-Do when the 'Enter' is pressed
inputBox.addEventListener("keypress", (event) => {
  // If the user presses the "Enter" key
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the add-btn 'button' element with a click
    addTask();
  }
});

// Function to handle the click event on the list items
// Event delegation to handle button clicks inside listContainer
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (
      e.target.classList.contains("delete-btn") ||
      e.target.closest(".delete-btn")
    ) {
      // Directly call removeListItem here, passing the event
      removeListItem(e);
    } else if (e.target.tagName === "BUTTON") {
      const listItem = e.target.parentElement;
      expandButtons(listItem);
    }
  },
  false
);

// Updated removeListItem function to use the event object
function removeListItem(e) {
  // If the clicked element is the delete button, remove its parent (the list item)
  if (e.target.classList.contains("delete-btn")) {
    e.target.parentElement.remove();
    saveData();
  }
  // If the clicked element is within a delete button (e.g., an icon inside the button), remove the closest list item
  else if (e.target.closest(".delete-btn")) {
    e.target.closest("li").remove();
    saveData();
  }
}

// Saving the data to the browser's local storage so that reloads, refreshing or closing of the page doesn't affect it.
function saveData() {
  localStorage.setItem("savedata", listContainer.innerHTML);
}

// Display of saved data to localstorage upon restoration of webpage
function showTask() {
  listContainer.innerHTML = localStorage.getItem("savedata");
}
showTask();

// Function to add a new list item
function addListItem() {
  // Create the new list item and its contents
  const listItem = document.createElement("li");
  listItem.classList.add("list-item");

  const textNode = document.createTextNode(inputBox.value);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn", "ui", "icon", "button", "circular");

  const icon = document.createElement("i");
  icon.classList.add("x", "icon");

  // Append the contents to the list item
  listItem.appendChild(textNode);
  listItem.appendChild(deleteButton);
  deleteButton.appendChild(icon);

  // Append the list item to the list container
  listContainer.appendChild(listItem);
}
