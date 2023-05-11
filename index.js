const inputBox = document.querySelector("#input-box");
const listContainer = document.querySelector("#list-container");
const renderError = document.querySelector("#error");




// Functions
    // Display an error message when the 'Add' button is clicked, without any text being entered
    function errorMsg(){
        renderError.textContent = "Error. You have to write something!";
    }

    // Remove the error message
    function endTimeout(){
        renderError.textContent = "";
    }

    // Add a To-Do when the 'Add' button is pressed
    function addTask(){
        
        if(inputBox.value === ''){
            // If there's nothing in the textbox, then display the error message
            errorMsg();
            // Make the error message end/disappear.
            setTimeout(endTimeout, 1000);
            saveData();

            
        }else {
            // run 'listExists()'

            // If there's text inside the textbox, then add the To-Do to the To-Do List
            let li = document.createElement("li");
            li.textContent = inputBox.value;
            listContainer.appendChild(li);
            let span = document.createElement("span");
            span.textContent = "\u00d7";
            li.appendChild(span);
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
    }, false)

    // Saving the data to the browser's local storage so that reloads, refreshing or closing of the page doesn't affect it.
    // NB: Clearing of browser cache relative to time that the To-Dos were saved will affect saved information
    function saveData(){
        localStorage.setItem("savedata", listContainer.innerHTML);
    }

    // Display of saved data to localstorage upon restoration of webpage
    function showTask(){
        listContainer.innerHTML = localStorage.getItem("savedata");
    }
    showTask();
