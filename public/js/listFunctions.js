let itemNum = 0;
const item = document.getElementById("item-input");
const listnameInputElement = document.getElementById('listname');
const validationMsg = {
    empty: 'empty',
    tooLong: 'too long, max length x',
    valid: 'valid'
};

function removeListRow(itemNode) {
    let rowNode = itemNode.parentNode;
    let listNode = rowNode.parentNode;
    listNode.removeChild(rowNode);// removes whole list-row
}

function removeDeletedRows() {
    const elements = Array.from(document.getElementsByClassName('deleted'));
    console.log(elements);
    for (const itemNode of elements) {
        removeRowElement(itemNode);
    }
}

function removeRowElement(itemNode) {
    console.log('itemNode: ' + itemNode.id);
    let rowNode = itemNode.parentNode;
    console.log('rowNode: ' + rowNode.className);
    let listNode = rowNode.parentNode;
    console.log('listNode: ' + listNode.id);
    listNode.removeChild(rowNode);// removes whole list-row
}

function validateAddedItem(value) {
    let msg = validationMsg.valid;
    if (value === '') {
        console.log(validationMsg.empty);
        msg = validationMsg.empty
    }
    if (msg === validationMsg.valid) {
        return;
    }
    alert('input is ' + msg);
}


// parent to row items as buttons
function appendRowDiv() {
    let rowDiv = document.createElement('LI');
    rowDiv.setAttribute('class', 'list-row list-group-item');
    document.getElementById('list-items').appendChild(rowDiv);
    return rowDiv;
}

function appendItemDiv(rowDiv, item, id) {
    let itemDiv = document.createElement('DIV');
    itemDiv.setAttribute('id', id);
    itemDiv.setAttribute('class', 'list-item');
    let textNode = document.createTextNode(item);
    itemDiv.appendChild(textNode);
    rowDiv.appendChild(itemDiv);
    return itemDiv;
}


function appendRemoveButton(parent, id, action) {
    console.log('appending remove button');
    let button = document.createElement('I');
    button.setAttribute('class', 'remove-btn material-icons-two-tone');
    button.setAttribute('data-itemId', id);
    button.setAttribute('data-toggle', 'tooltip');
    button.setAttribute('title', 'delete item');
    let textNode = document.createTextNode('delete');
    button.appendChild(textNode);
    parent.appendChild(button);
    button.addEventListener('click', action);
}

function appendUndoButton(parent, id, action) {
    console.log('appending undo button');
    let undoButton = document.createElement('I');
    undoButton.setAttribute('id', 'undo' + id);
    undoButton.setAttribute('class', 'undo-btn hide material-icons-two-tone');
    undoButton.setAttribute('data-itemId', id);
    undoButton.setAttribute('data-toggle', 'tooltip');
    undoButton.setAttribute('title', 'undo delete');
    let textNode = document.createTextNode('undo');
    undoButton.appendChild(textNode);
    parent.appendChild(undoButton);
    // TODO how to get this to work for add and show???
    undoButton.addEventListener('click', action);
}

//remove from DOM
function removeItem(itemId) {
    let element = document.getElementById(itemId);
    removeListRow(element);
}

function addItem() {
    let value = document.getElementById('item-input').value;
    validateAddedItem(value);

    console.log('adding an item');
    console.log(value);
    let id = 'a' + itemNum++;

    const rowDiv = appendRowDiv();
    appendRemoveButton(rowDiv, id, deleteAction);
    appendUndoButton(rowDiv, id, undoAction);
    appendItemDiv(rowDiv, value, id);

    document.getElementById('item-input').value = ''; // reset input text
    setAddItemfocus();
}

// Execute a function when the user releases a key on the keyboard
if (item) {
    item.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            console.log('you hit enter');
            // document.getElementById('add').click();
            addItem();
        }
    });
}
if (listnameInputElement) {
    listnameInputElement.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            console.log('you hit enter');
            document.getElementById('submit').click();
        }
    });
}

function setAddItemfocus() {
    document.getElementById("item-input").focus();
}

function editLists() {
    toggle_edit_save();
    toggle_remove_undo();
}

function toggle_edit_save() {
    console.log('toggle edit save');
    const elements = document.getElementsByClassName('update-page');
    for (const el of elements) {
        el.classList.toggle('hide');
    }
}

function toggle_remove_undo() {
    const elements = document.getElementsByClassName('remove-btn');
    for (const el of elements) {
        el.classList.toggle('hide');
    }
}

const deleteAction = function (event) {
    console.log('you clicked delete item');
    console.log(event);
    let itemId = event.target.getAttribute('data-itemId');
    let element = document.getElementById(itemId);
    element.classList.toggle('deleted');
    let undoButton = document.getElementById('undo' + itemId);
    undoButton.classList.toggle('hide');
    event.target.classList.toggle('hide');
};

const undoAction = function (event) {
    console.log('you clicked undo');
    console.log(event);
    let itemId = event.target.getAttribute('data-itemId');
    let element = document.getElementById(itemId);
    element.classList.toggle('deleted');
    let delButton = document.getElementById('del' + itemId);
    delButton.classList.toggle('hide');
    event.target.classList.toggle('hide');
};


function getDeletedItemIds() {
    let items = [];
    let elements = document.getElementsByClassName('list-item');
    console.log(elements);
    for (const el of elements) {
        console.log(el.id);
        if (el.classList.contains('deleted')) {
            items.push(el.id);
        }
    }
    return items;
}

function getDeletedItemNames() {
    let items = [];
    let elements = document.getElementsByClassName('list-item');
    console.log(elements);
    for (const el of elements) {
        if (el.classList.contains('deleted')) {
            console.log(el.innerText);
            items.push(el.innerText);
        }
    }
    return items;
}

function getRemainingItems() {
    let items = [];
    let elements = document.getElementsByClassName('list-item');
    console.log(elements);
    for (const el of elements) {
        console.log(el.innerText);
        if (!el.classList.contains('deleted')) {
            items.push(el.innerText);
        }
    }
    return items;
}

function saveOnloadAction(xhr) {
    return function () {
        console.log('xhr status ' + xhr.status);
        const response = JSON.parse(xhr.response);
        console.log(response);
        const msg = response.msg;
        if (xhr.status === 200) {
            if (response._status === 'success') {
                console.log('save was successful');
                console.log(msg);
                removeDeletedRows();
                toggle_edit_save();
                toggle_remove_undo();
                toggle_add_item();
                $('#save-ok').show();
            } else {
                $('#save-failed').show();
                console.log(msg);
            }

        } else {
            alert('Error! changes not saved');
            $('#save-failed').show();
        }
    }
}

function deleteList(userId, listId) {
    $('p#deleted-lists').text(listname);
    $('#delete-modal').modal({
        keyboard: true
    });
    $('#delete-modal').modal('show');
}

function showSaveAction(userId, listId, listName) {
    const xhr = new XMLHttpRequest();
    // send the updated list
    xhr.open("PATCH", '/lists/' + userId + '/' + listId, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    let items = getRemainingItems();
    let list = {id: listId, listname: listName, items: items};
    console.log('list ' + list);
    xhr.send(JSON.stringify(list));
    xhr.onload = saveOnloadAction(xhr);
    xhr.onerror = function () {
        console.log('there was an error saving changes');
    }
}



function deleteListConfirmed(userId, listId) {
    const xhr = new XMLHttpRequest();
    // delete list
    xhr.open("DELETE", '/lists/' + userId + '/' + listId, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('list deleted');
            window.location.replace('/lists/' + userId);
        }
    };
    xhr.onerror = function () {
        console.log('there was an error deleting the list');
    }
}

function saveLists(userId) {
    console.log('you clicked save lists');
    // TODO show names in an li
    let deletedListNames = getDeletedItemNames();
    $('p#deleted-lists').text(deletedListNames);
    $('#delete-modal').modal({
        keyboard: true
    });
    $('#delete-modal').modal('show');
}

function saveListsConfirmed(userId){
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", '/lists/' + userId, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let deletedListIds = getDeletedItemIds();
    let list = {listnames: deletedListIds};
    console.log(JSON.stringify(list));
    xhr.send(JSON.stringify(list));
    xhr.onload = saveOnloadAction(xhr);
    xhr.onerror = function () {
        console.log('there was an error saving changes');
    }
}

function toggle_add_item() {
    const input = document.getElementById('item-input');
    // const add = document.getElementById('add');
    if (input) {
        input.classList.toggle('hide');
        // add.classList.toggle('hide');
    }
}

function cancelAction() {
    toggle_edit_save();
    toggle_add_item();
    toggle_deleted_items();
    hide_by_class_name('remove-btn');
    hide_by_class_name('undo-btn');
    remove_added();
}

function toggle_deleted_items() {
    const deletedItems = Array.from(document.getElementsByClassName('deleted'));
    for (const item of deletedItems) {
        item.classList.toggle('deleted');
    }
}

function hide_by_class_name(className) {
    const elements = document.getElementsByClassName(className);
    for (const el of elements) {
        if (!el.classList.contains('hide')) {
            el.classList.add('hide');
        }
    }
}

function remove_added() {
    const listItems = document.getElementsByClassName('list-item');
    for (const item of listItems) {
        if (item.id.startsWith('a')) {
            console.log('removing item');
            removeRowElement(item);
        }
    }
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//
// functions from show.ejs
//
function showEditAction() {
    toggle_edit_save();
    toggle_remove_undo();
    toggle_add_item();
    setAddItemfocus();
}
