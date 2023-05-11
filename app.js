// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption  = document.querySelector('.filter-todo');

// Declaration of global variables
let fullDate = new Date();
let date, month, year, hour, minute, second;
date = fullDate.getDate();
month = fullDate.getMonth() +1;
year = fullDate.getFullYear();
hour = fullDate.getHours();
minute = fullDate.getMinutes();
second = fullDate.getSeconds();
console.log(date, month, year, hour, minute, second);

// Event Listener
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteAndCheck);
filterOption.addEventListener('click', filterTodo);

// Functions
function addTodo(event) {
    // Preventing form from submiting
    event.preventDefault();

    // Creating div element
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    var activity = todoInput.value;
    if (!activity) {
        alert("Don't empety its column");
    } else {
        // Creating li element
        const newTodo = document.createElement('li');
        newTodo.innerText = activity;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);

        //adding todo to localstorage
        saveLocalTodos(activity);

        // Create Check button of todo item
        const completedButton = document.createElement('button');
        // completedButton.innerHTML = '<i class="fas fa-check clicked"></i>';
        completedButton.innerHTML = '<b class="clicked">O</b>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);

        // Create Check button of todo item
        const trashButton = document.createElement('button');
        // trashButton.innerHTML = '<i class="fas fa-trash clicked"></i>';
        trashButton.innerHTML = '<b class="clicked">X</b>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);

        //Append to List
        todoList.appendChild(todoDiv);

        // Clear todoInput value
        todoInput.value = '';
    }
}

// When todoList (the ul tag is clicked, how the system must to do)
function deleteAndCheck(e) {
    // Preventing form from submiting
    e.preventDefault();

    const item = e.target;

    // Delete todo
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        //animations
        todo.classList.add("fall");
        // remove item from local storage
        removeLocalTodos(todo);
        //wait until transition end
        todo.addEventListener('transitionend', function() {
            todo.remove();
        })
        // todo.remove();
    }

    // Check todo
    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
        const completed_item = todo.children[0].innerText;
        saveCompleted(completed_item);
        // console.log(completed_item);
    }

    // edit todo
    if (item.classList[0] === "todo-item") {
        let completed = checkCompleted();
        let i = completed.indexOf(item.innerText);
        if (!(i >= 0 && i <= completed.length)) {
            let divTodo = item.parentElement;

            // Creating form element
            const formUpdate = document.createElement('div');
            formUpdate.classList.add('form-update');

            // Creating input element
            const input = document.createElement('input');
            input.type = "text";
            input.value = item.innerText;
            input.classList.add('input-update');
            formUpdate.appendChild(input);

            // Create save button of update item
            const saveButton = document.createElement('button');
            // saveButton.innerHTML = '<i class="fas fa-check clicked"></i>';
            saveButton.innerHTML = '<b class="clicked">S</b>';
            saveButton.classList.add('save-update-btn');
            formUpdate.appendChild(saveButton);

            // Create CANCEL button of todo item
            const cancelButton = document.createElement('button');
            // cancelButton.innerHTML = '<i class="fas fa-trash clicked"></i>';
            cancelButton.innerHTML = '<b class="clicked">X</b>';
            cancelButton.classList.add('cancel-update-btn');
            formUpdate.appendChild(cancelButton);

            // Buat style display none "ITEM SEBELUMNYA YANG DIMILIKI DIV"
            let li, coBtn, trBtn;
            li = divTodo.children[0];
            coBtn = divTodo.children[1];
            trBtn = divTodo.children[2];
            li.style.display = 'none';
            coBtn.style.display = 'none';
            trBtn.style.display = 'none';

            // APPEND FORM TO DIV
            divTodo.appendChild(formUpdate);
            divTodo.classList.add("div-form");

            // const todo = item.parentElement;
            // todo.classList.toggle('completed');
            // const completed_item = todo.children[0].innerText;
            // saveCompleted(completed_item);
            // console.log(divTodo.children[0]);
        }
    }

    // save updated todo
    if (item.classList[0] === "save-update-btn") {
        let form = item.parentElement;
        let divTodo = form.parentElement;

        let firstValue = divTodo.children[0].innerText;
        let newValue = form.children[0].value;
        // console.log(firstvalue, newValue);

        // "KEMBALIKAN ITEM SEBELUMNYA YANG DIMILIKI DIV"
        let li, coBtn, trBtn;
        li = divTodo.children[0];
        coBtn = divTodo.children[1];
        trBtn = divTodo.children[2];
        form = divTodo.children[3];
        li.style.display = 'inline-block';
        coBtn.style.display = 'inline-block';
        trBtn.style.display = 'inline-block';
        form.remove();
        divTodo.classList.remove("div-form");
        updateTodoLocal(firstValue, newValue);

        // updating li with new value
        li.innerText = newValue;
        // console.log("first value: "+firstValue, "new value: "+newValue);
    }

    // cancel edit todo
    if (item.classList[0] === "cancel-update-btn") {
        // window.location.reload();
        // let resultOfUpdate = todoUpdateInput.value;

        let form = item.parentElement;
        let divTodo = form.parentElement;

        let firstvalue = divTodo.children[0].innerText;
        // console.log(firstvalue, form.children[0].value);

        // "KEMBALIKAN ITEM SEBELUMNYA YANG DIMILIKI DIV"
        let li, coBtn, trBtn;
        li = divTodo.children[0];
        coBtn = divTodo.children[1];
        trBtn = divTodo.children[2];
        form = divTodo.children[3];
        li.style.display = 'inline-block';
        coBtn.style.display = 'inline-block';
        trBtn.style.display = 'inline-block';
        form.remove();
        divTodo.classList.remove("div-form");
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;

    todos.forEach(function(todo) {
       switch (e.target.value) {
        case "completed":
            if (todo.classList.contains('completed')) {
                todo.style.display = 'flex';
            } else {
                todo.style.display = 'none';                
            }
            break;
        case "uncompleted":
            if (!todo.classList.contains('completed')) {
                todo.style.display = 'flex';
            } else {
                todo.style.display = 'none';                
            }
            break;
       
        default:
            todo.style.display = 'flex';
            break;
       } 
    });
}

// ***function of checking stuff that stored in localStorage
// Checking todos
function checkTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
// Checking completed item ---
function checkCompleted() {
    let completed;
    if (localStorage.getItem("completed") === null) {
        completed = [];
    } else {
        completed = JSON.parse(localStorage.getItem("completed"));
    }
    return completed;
}

// ***function of saving saving to localStorage
// saving todos
function saveLocalTodos(todo) {
    //Check, Do I already have this thing on there?
    let todos = checkTodos();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}
// saving completed item ---
function saveCompleted(completed_item) {
    //Check, Do I already have this thing on there?
    let completed = checkCompleted();
    let isFound = completed.indexOf(completed_item);
    // console.log(isFound, completed.length);
    if (isFound >= 0 && isFound < completed.length) {
        removeCompleted(completed_item);
    } else {
        completed.push(completed_item);
        localStorage.setItem("completed", JSON.stringify(completed));
    }
}

// ***function of geting value from localStorage
function getTodos() {
    //Check, Do I already have this thing on there?
    let todos = checkTodos();
    let completed = checkCompleted();
    todos.forEach(function(todo) {
        // Creating div element
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

            // Creating li element
            const newTodo = document.createElement('li');
            newTodo.innerText = todo;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);

            // Create Check button of todo item
            const completedButton = document.createElement('button');
            // completedButton.innerHTML = '<i class="fas fa-check clicked"></i>';
            completedButton.innerHTML = '<b class="clicked">O</b>';
            completedButton.classList.add('complete-btn');
            todoDiv.appendChild(completedButton);

            // Create Check button of todo item
            const trashButton = document.createElement('button');
            // trashButton.innerHTML = '<i class="fas fa-trash clicked"></i>';
            trashButton.innerHTML = '<b class="clicked">X</b>';
            trashButton.classList.add('trash-btn');
            todoDiv.appendChild(trashButton);

            //Adding class completed if the element is "ada" dalam list completed
            let i = completed.indexOf(todo);
            if (i >= 0 && i <= completed.length) {
                todoDiv.classList.add('completed');
            }

            //Append to List
            todoList.appendChild(todoDiv);
        });
}

// ***function of removing stuff from localStorage
// function of removing todo
function removeLocalTodos(todo) {
    let todos = checkTodos();
    let completed = checkCompleted();
    const textClicked = todo.children[0].innerText;
    todos.splice(todos.indexOf(textClicked), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    // if todo is removed, item in completed array in local storage must also removed
    let i = completed.indexOf(textClicked);
    if (i >= 0 && i <= completed.length) {
        completed.splice(completed.indexOf(textClicked), 1);
        localStorage.setItem("completed", JSON.stringify(completed));
    }

}
// function of removing completed
function removeCompleted(completed_item) {
    let completed = checkCompleted();
    // const textClicked = todo.children[0].innerText;
    completed.splice(completed.indexOf(completed_item), 1);
    localStorage.setItem("completed", JSON.stringify(completed));
}

// console.log(todoList.childNodes);

// +++update todo function
function updateTodoLocal(firstValue, newValue) {
    let todos = checkTodos();
    let i = todos.indexOf(firstValue);
    if (i >= 0 && i <= todos.length) {
        todos[i] = newValue;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

// <<<<<<<<<<< Bagian Khusus sistem timer dan membuat item yang ada di array completed masuk ke bin atau tong sampah >>>>>>>>

