let itemNum = 0
const item = document.getElementById("item-input");
const listname = document.getElementById('listname');
const validationMsg = {
    empty: 'empty',
    tooLong: 'too long, max length x',
    valid: 'valid'
}

function removeListRow(itemNode) {
    let rowNode = itemNode.parentNode;
    let listNode = rowNode.parentNode
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
    let listNode = rowNode.parentNode
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
    return;
}

function appendListItem(item, id) {
    let rowDiv = document.createElement('DIV')
    rowDiv.setAttribute('class', 'list-row');
    let itemDiv = document.createElement('DIV');
    itemDiv.setAttribute('id', id);
    itemDiv.setAttribute('class', 'list-item');
    let textNode = document.createTextNode(item)
    itemDiv.appendChild(textNode);
    document.getElementById('list-items').appendChild(rowDiv);
    rowDiv.appendChild(itemDiv);
    return itemDiv;
}

function appendRemoveButton(itemNode, action) {
    const parent = itemNode.parentNode;
    console.log('appending remove button');
    let button = document.createElement('BUTTON');
    button.setAttribute('class', 'remove-btn');
    button.setAttribute('type', 'button');
    button.setAttribute('data-itemId', itemNode.id);
    let textNode = document.createTextNode('remove')
    button.appendChild(textNode);
    parent.appendChild(button);
    button.addEventListener('click', action);
}

function appendUndoButton(itemNode, action) {
    console.log('appending undo button');
    let parent = itemNode.parentNode;
    let undoButton = document.createElement('BUTTON');
    undoButton.setAttribute('id', 'undo' + itemNode.id);  //TODO can you chain these?
    undoButton.setAttribute('class', 'undo-btn hide');
    undoButton.setAttribute('type', 'button');
    undoButton.setAttribute('data-itemId', itemNode.id);
    // undoButton.setAttribute('class', 'remove-btn hide');
    let textNode = document.createTextNode('undo')
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

// Execute a function when the user releases a key on the keyboard
if (item) {
    item.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            console.log('you hit enter');
            document.getElementById('add').click();
        }
    });
}
if (listname) {
    listname.addEventListener("keyup", function (event) {
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
}

const undoAction = function (event) {
    console.log('you clicked undo');
    console.log(event);
    let itemId = event.target.getAttribute('data-itemId');
    let element = document.getElementById(itemId);
    element.classList.toggle('deleted');
    let delButton = document.getElementById('del' + itemId);
    delButton.classList.toggle('hide');
    event.target.classList.toggle('hide');
}

function getDeletedItems() {
    let items = [];
    let elements = document.getElementsByClassName('list-item');
    console.log(elements);
    for (const el of elements) {
        console.log(el.innerText);
        if (el.classList.contains('deleted')) {
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
        console.log('this is the closure version');
        console.log('ready state: ' + xhr.readyState)
        console.log('xhr status ' + xhr.status);
        console.log(xhr.response);
        const response = JSON.parse(xhr.response);
        const msg = response.msg;
        if (xhr.status === 200) {
            if (response.status === 'success') {
                console.log('save was successful');
                console.log(msg);
                removeDeletedRows();
                toggle_edit_save();
                toggle_remove_undo();
                toggle_add_item();
            } else {
                console.log(msg);
            }

        } else {
            alert('Error! changes not saved');
        }
    }
}

function toggle_add_item() {
    const input = document.getElementById('item-input');
    const add = document.getElementById('add');
    if (input && add) {
        input.classList.toggle('hide');
        add.classList.toggle('hide');
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
    const deletedItems = document.getElementsByClassName('deleted');
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

//
// functions from show.ejs
//
function showEditAction() {
    toggle_edit_save();
    toggle_remove_undo();
    toggle_add_item();
    setAddItemfocus();
}