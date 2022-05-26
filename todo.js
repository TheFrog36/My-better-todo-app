const arrayPresetTags = ['spesa','hobby','lavoro','casa','famiglia','amici']
const TODO_URL = 'https://62860d1bf0e8f0bb7c0f4284.mockapi.io/todos'
const tagTemplate = `
    <input type="checkbox" class="checkbox" id="checkbox#TAGNUMBER">
    <label for="checkbox#TAGNUMBER" id="label#TAGNUMBER">
        <div class="tag-div">#TAG</div>
    </label>`

let id = -1
let finalPriority = 0
const cardTemplace = `
    <div class="task-card">
        <div class="name-container">
            <label class="name-label">
                <input type="text" id="input-name" required value="#TASKNAME">
                <span class="placeholder">Task name</span>
            </label>
        </div>
        <div class="separation-line"></div>
        <div class="tags-container">
        
        </div>
        <div class="separation-line"></div>
        <div class="priority-container">
        <button class="priority" id="low" onclick="selectPriority(0)">
            low
        </button>
        <button class="priority" id="medium" onclick="selectPriority(1)">
            medium
        </button>
        <button class="priority" id="high" onclick="selectPriority(2)">
            high
        </button>
        <button class="priority" id="very-high" onclick="selectPriority(3)">
            very high
        </button>
        </div>
    </div>`
// function parseUrlParams(){
//     const url = window.location.href
//     const urlArray = url.split('?')
//     const paramsString = urlArray[1]
//     console.log(paramsString);
//     if(paramsString){
//         const paramsArray = paramsString.split('&')
//         console.log(paramsArray);
//         const paramsObj = {}
//         for (const string of paramsArray) {
//             const stringArray = string.split('=')
//             paramsObj[stringArray[0]] = stringArray[1].replaceAll('%20', ' ')
//         }
//         console.log(paramsObj)
//     } else {
//         return null;
//     }
// }

// function getTodoFromSession(){
//     const todoString = sessionStorage.getItem('selectedTodo')
//     if(todoString){
//         const todo = JSON.parse(todoString)
//         console.log(todo);
//     }
// }

function print(){
    console.log('ciaociao')
}
function parseUrlParams(){
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams)
    console.log(params);

    return params
}

function responseCallBack(response){
    if(response.status === 500) return ''
    console.log(response);
    return response.json();
   
}

function resultCallBack(result){
    console.log(result);
    loadTodoCard(result)
    
}

function loadTodo(params){
    fetch(TODO_URL + '/' + params.id)
        .then(responseCallBack)
        .then(resultCallBack)
        .catch(error => console.log(error))
}

function loadTodoCard(todo){
    console.log(todo);
    const container = document.getElementById('tasks-container')
    container.innerHTML = ''
    if(todo != []){
        id = todo.id
        const updatedTemplate = cardTemplace.replace('#TASKNAME', todo.name)
        container.innerHTML = updatedTemplate
        const tagContainer = document.querySelector('.tags-container')
        for(let i = 0; i < arrayPresetTags.length; i++){
            const tag = arrayPresetTags[i]
            const myTagtemplate = tagTemplate.replaceAll('#TAGNUMBER', i).replace('#TAG', tag)
            tagContainer.innerHTML += myTagtemplate
        }
        for(let i = 0; i < arrayPresetTags.length; i++){
            const tag = arrayPresetTags[i]
            const isTagPresent = todo.tags.indexOf(tag)
            const checkboxString = '#checkbox'+i
            const checkbox = container.querySelector(checkboxString)
            console.log(checkbox);
            if(isTagPresent !== -1) checkbox.checked  = true;
        }
        selectPriority(todo.priority)
        document.getElementById('add-edit-task').innerHTML = 'Edit taks'
    } else {
        const updatedTemplate = cardTemplace.replace('#TASKNAME', '')
        container.innerHTML = updatedTemplate
        const tagContainer = document.querySelector('.tags-container')
        for(let i = 0; i < arrayPresetTags.length; i++){
            const tag = arrayPresetTags[i]
            const myTagtemplate = tagTemplate.replaceAll('#TAGNUMBER', i).replace('#TAG', tag)
            tagContainer.innerHTML += myTagtemplate
        }
        document.getElementById('add-edit-task').innerHTML = 'Add taks'
    }
}

function selectPriority(priority) {
    priority = parseInt(priority)
    finalPriority = priority
    const container = document.getElementById('tasks-container')
    resetPriorityColors()
    switch (priority) {
        case 0:
            container.querySelector('#low').style.backgroundColor = 'green'
            break;
        case 1:
            container.querySelector('#medium').style.backgroundColor = 'yellow'
            break;
        case 2:
            container.querySelector('#high').style.backgroundColor = 'orange'
            break;
        case 3:
            container.querySelector('#very-high').style.backgroundColor = 'red'
            break;
    }
}

function resetPriorityColors(){
    const container = document.getElementById('tasks-container')
    container.querySelector('#low').style.backgroundColor = 'transparent'
    container.querySelector('#medium').style.backgroundColor = 'transparent'
    container.querySelector('#high').style.backgroundColor = 'transparent'
    container.querySelector('#very-high').style.backgroundColor = 'transparent'
}

function addTask(){
    let url = 'https://62860d1bf0e8f0bb7c0f4284.mockapi.io/todos'
    const myObj ={}
    const container = document.getElementById('tasks-container')
    const savedTags = []
    for(let i = 0; i < arrayPresetTags.length; i++){
        if(container.querySelector('#checkbox'+i).checked)
            savedTags.push(arrayPresetTags[i])
    }
    myObj['creationDate'] = new Date().getTime()
    const nameInput = document.getElementById('input-name').value.trim()
    myObj['name'] = nameInput === '' ? 'Task name': nameInput
    myObj['tags'] = savedTags
    myObj['priority'] = finalPriority
    let myMethod
    if(id != -1){
        url += '/' + id
        myMethod = 'put'
    } else {
        myMethod = 'post'
    }
    console.log(myObj);
    fetch(url, {
        method: myMethod,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(myObj)
      }).then((response)=> console.log(response)).then(() =>window.location.href = './index.html')
      
}
loadTodo(parseUrlParams())
