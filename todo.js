function parseUrlParams(){
    const url = window.location.href
    const urlArray = url.split('?')
    const paramsString = urlArray[1]
    console.log(paramsString);
    if(paramsString){
        const paramsArray = paramsString.split('&')
        console.log(paramsArray);
        const paramsObj = {}
        for (const string of paramsArray) {
            const stringArray = string.split('=')
            paramsObj[stringArray[0]] = stringArray[1].replaceAll('%20', ' ')
        }
        console.log(paramsObj)
    } else {
        return null;
    }
}

function parseUrlParams2(){
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams)
    console.log(params);
    return params
}

function getTodoFromSession(){
    const todoString = sessionStorage.getItem('selectedTodo')
    if(todoString){
        const todo = JSON.parse(todoString)
        console.log(todo);
    }
}
parseUrlParams2()
