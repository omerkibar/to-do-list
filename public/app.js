'use strict';

let toDoList = [];
let nextId = 0;

(function(){
    let request = new XMLHttpRequest();
    let url = "/api/db"
    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            let db = JSON.parse(request.response);
            toDoList = db.toDoList;
            nextId = db.nextId;
            loadList();
        }
    }
    request.open('GET',url,true);
    request.send();
})();

function loadList(){
    let list = document.getElementById("toDoListItems");
    list.innerHTML="";
    for (const item of toDoList) {
       let display = item.isDone ==="true" ? "block": "none";
       let width = display==="block" ? "89%" : "93%"; 
       list.innerHTML += `<div class="list-item"><label style="display:${display}" id="${item.id}" 
       class="tick-label" onclick="mark(${item.id})">&#10003;</label>
       <label style="width:${width}" id="${item.id}d" class="label-data" onclick="mark(${item.id})"></label>
       <button onclick="deleteItem(${item.id})">X</button>
       </div>`;
       document.getElementById(item.id+"d").innerText = item.name; 
    }
}


function deleteItem(id){
    toDoList.splice(toDoList.findIndex(item => item.id === id),1);
    loadList();
    saveList();
}

document.getElementById("addItemForm").addEventListener('submit',function(e){
    e.preventDefault();
    let inputField = document.querySelector("#addItemForm input");
    if(inputField.value === "" || inputField.value.length>72){
        return;
    }
    toDoList.unshift({
        id:nextId++,
        name:inputField.value,
        isDone:"false"}
    );
    inputField.value = "";
    loadList();
    saveList();
})

function mark(id){
    let tickLabel = document.getElementById(id);
    if(tickLabel.style.display==="" || tickLabel.style.display==="none"){
        tickLabel.style.display = "block";
        document.getElementById(id+"d").style.width = "89%";
        toDoList[toDoList.findIndex(item => item.id === id)].isDone = "true";
    }
    else{
        tickLabel.style.display = "none";
        document.getElementById(id+"d").style.width = "93%";
        toDoList[toDoList.findIndex(item => item.id === id)].isDone = "false";
    }
    saveList();
}

function saveList(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/db");

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    let data = {
        "toDoList":toDoList,
        "nextId":nextId
    }
    xhr.send(JSON.stringify(data));
}

