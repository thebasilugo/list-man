const inputBox = document.querySelector("#input-box");
const listContainer = document.querySelector("#list-container");
const renderError = document.querySelector("#error");
const renderHint = document.querySelector("#hint")

// On load, get the username (if any) from localStorage and display it
window.addEventListener('load', () => {
    const nameInput = document.querySelector('#name');
    const username = localStorage.getItem('username') || '';
    nameInput.value = username;
    
    // Save the changed username to localStorage 
    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })
})

// Functions
    // Display an error message when the 'Add' button is clicked, without any text being entered
    function errorMsg(){
        renderError.textContent = "Error. You have to write something!";
        setTimeout(endTimeout, 2000);
    }
    
    // Hint for users unaware of using 'Enter' to save messages 
    function hintMsg(){
        renderHint.textContent = "Hint: You can save information by clicking the 'Enter' key."
        setTimeout(endTimeout, 2000);
    }

    // Remove the error message
    function endTimeout(){
        renderError.textContent = "";
        renderHint.textContent = "";
    }   

    // Add a To-Do when the 'Add' button is pressed
    function addTask(){
        
        if(inputBox.value === ''){
            // If there's nothing in the textbox, then display the error message
            errorMsg();
            saveData();
   
        }else {
            // If there's text inside the textbox, then add the To-Do to the To-Do List
            const li = document.createElement("li");
            // let a = document.createElement("a");
            const span = document.createElement("span");
            const editImg = document.createElement("img");
            let editBtn = document.createElement("button");
            editImg.src = "/images/edit-pen.png"

            li.textContent = inputBox.value;
            li.appendChild(editBtn);
            editBtn.appendChild(editImg);
            span.textContent = "\u00d7";
            li.appendChild(span);

            listContainer.appendChild(li);
            saveData();
        }
        inputBox.value = "";
        saveData();
    }

    // Add a To-Do when the 'Enter' is pressed
    inputBox.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key
        if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the add-btn 'button' element with a click
        document.querySelector(".add-btn").click();
        }
    }); 
    
    // Creating a list item, to save the typed information in the HTML
    listContainer.addEventListener("click", function(e){
        if (e.target.tagName === "LI"){
            e.target.classList.toggle("checked");
            saveData();
        }else if (e.target.tagName === "SPAN"){
            e.target.parentElement.remove();
            saveData();
        }
        else if (e.target.tagName === "IMG" || e.target.tagName === "BUTTON"){
            inputBox.focus();
            inputBox.addEventListener('blur', e => {
                saveData();
                showTask()
            })
            // e.target.parentElement.focus();
            saveData();
        }
    }, false)

    // Saving the data to the browser's local storage so that reloads, refreshing or closing of the page doesn't affect it.
    function saveData(){
        localStorage.setItem("savedata", listContainer.innerHTML);
    }

    // Display of saved data to localstorage upon restoration of webpage
    function showTask(){
        listContainer.innerHTML = localStorage.getItem("savedata");
    }
    showTask();

    let filterInput = document.querySelector("#filter-btn");
    filterCount = 1;

    function createFilterInput() {
        for (i = 0; i < filterCount; i--) {
            const filterTextBox = document.createElement("input");
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            document.body.appendChild(input);
        }
    }
