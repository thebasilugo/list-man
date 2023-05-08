const inputBox = document.querySelector("#input-box");
const listContainer = document.querySelector("#list-container");
const renderError = document.querySelector("#error");

// Functions
function errorMsg(){
    renderError.textContent = "Error. You have to write something!";
}

function endTimeout(){
    renderError.textContent = "";
}

function addTask(){
    if(inputBox.value === ''){
        errorMsg();
        // Make the error message end/disappear.
        setTimeout(endTimeout, 1000);
        saveData();

    }else {
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

listContainer.addEventListener("click", function(e){
    if (e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }else if (e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false)

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

function thereExists(){
    // If the To-Do exists?
    if (li.includes(inputBox.value)){
        alert("yes")
    }else alert("no") 
}
