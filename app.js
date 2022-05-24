const DATAURL = 'https://62860d1bf0e8f0bb7c0f4284.mockapi.io/todos'

let toDoList = []
template = `
<div class="task-content">
    <div class="task-title-container">
        <div class="left-title-container">
            <span class="task-title">#TITLE</span>
            <input type="checkbox">
        </div>
        <div class="right-title-container">
            <button class="edit-button">edit</button>
            <button class="delete-button">delete</button>
        </div>
    </div>
    <div class="separation-line"></div>
    <div class="tags-container">
    </div>
    <div class="date-container">
        #CREATIONDATE
    </div>
</div>
<div class="priority-container", style ="background-color: #COLOR">
</div>`

function loadTodos() {
    startLoading()
    fetch(DATAURL)
        .then(responseCallBack)
        .then(resultCallBack)
        .catch(error => stopLoading())
}

function responseCallBack(response) {
    console.log(response);
    return response.json();
}

function manageError(error) {
    console.log(error);
}

function resultCallBack(result) {
    document.getElementById('tasks-container').innerHTML = ''
    console.log(result);
    toDoList = convertArrayToTodoList(result)
    toDoList.sort((e1,e2) => e2._priority.order - e1._priority.order)
    console.log(toDoList);
    // toDoList.map(obj => display(obj))
    display(toDoList)
    stopLoading()
}

function convertArrayToTodoList(result) {
    const arrayOfTask = result.map(obj => ToDo.fromObjToTask(obj))
    return arrayOfTask
}

function display(tasks) {
    document.getElementById('tasks-container').innerHTML = ''
    for (const task of tasks) {
        const taskContainer = document.getElementById('tasks-container')
        const todoCard = document.createElement('div')
        todoCard.className = 'task-card'
        const content = template.replaceAll('#TITLE', task.name)
            .replaceAll('#CREATIONDATE', ToDo.getHumanDate(task.creationDate))
            .replaceAll('#COLOR', task._priority.color)
        todoCard.innerHTML = content
        const tagsContainer = todoCard.querySelector('.tags-container')
        const deleteButton = todoCard.querySelector('.delete-button');
        console.log(task);
        deleteButton.onclick = () => confirmDeletion(task.id);
        populateTagContainer(tagsContainer, task.tags)
        taskContainer.appendChild(todoCard)
    }

}

function populateTagContainer(container, tags) {
    
    for (const tag of tags) {
        const div = document.createElement('div');
        div.classList.add('tag');
        const node = document.createTextNode('#' + tag);
        div.appendChild(node);
        container.appendChild(div)
    }
    if(tags.length > 0){
        container.innerHTML += '<div class="separation-line"></div>'
    }
}

function startLoading() {
    const loader = document.getElementById('loader')
    loader.style.display = 'inline-block'
    const refresh = document.getElementById('refresh-button');
    refresh.style.display = 'none';
}

function stopLoading() {
    const loader = document.getElementById('loader')
    loader.style.display = 'none'
    const refresh = document.getElementById('refresh-button');
    refresh.style.display = 'inline-block';
}

function deleteTodo(id) {
    console.log(id);
    startLoading()
    const deleteUrl = DATAURL + '/' + id;
    const fetchOptions = { method: 'delete' };
    fetch(deleteUrl, fetchOptions)
        .then(response => response.json())
        .then(result => removeTodoAndRefesh(result))
        .catch(error => stopLoading())
}

function removeTodoAndRefesh(todo) {
    stopLoading()
    toDoList = toDoList.filter(t1 => filterTodos(t1, todo))
    display(toDoList);
}

function filterTodos(t1, t2) {
    return t1.id !== t2.id;
}

function confirmDeletion(id){
    const answer = prompt("Type 'yes' to confirm deletion of the task")
    if(answer === 'yes') deleteTodo(id)
}
loadTodos()