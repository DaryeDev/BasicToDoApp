const newTableNameSuggestions = [
    "📖 School Tasks",
    "🏠 Home Tasks",
    "💼 Work Tasks",
    "🎓 University Tasks",
    "🧙‍♂️ Spells to Learn",
    "🔍 Findings to Research",
    "🎵 Songs to Learn",
    "🎥 Movies to Watch",
    "🎮 Games to Play",
    "🎲 Board Games to Play",
    "🎲 Card Games to Play",
    "🎲 Dice Games to Play",
];

var tables = {};

const app = document.getElementById("app");

function toggleDarkMode(value = null) {
    let nextValue;
    if (value !== null) {
        nextValue = value === "true";
    } else {
        const currentValue = localStorage.getItem("darkMode") === "true";
        nextValue = !currentValue;
    }

    if (nextValue) {
        app.classList.add("dark");
    } else {
        app.classList.remove("dark");
    }

    localStorage.setItem("darkMode", String(nextValue));
    console.log("darkMode:", nextValue);
}



const sidebarContent = document.getElementById("sidebarList");
function updateSidebarFades() {
    console.log("updateSidebarFades");
    if (!sidebarContent) return;
    const scrollTop = sidebarContent.scrollTop;
    const clientHeight = sidebarContent.clientHeight;
    const scrollHeight = sidebarContent.scrollHeight;

    const showTop = scrollTop > 0;
    const showBottom = scrollTop + clientHeight < scrollHeight - 1;
    const showBoth = showTop && showBottom;
    
    if (showBoth) {
        sidebarContent.classList.remove("showTopFade");
        sidebarContent.classList.remove("showBottomFade");
        sidebarContent.classList.add("showBothFades");
    } else {
        sidebarContent.classList.remove("showBothFades");
        sidebarContent.classList.toggle("showTopFade", showTop);
        sidebarContent.classList.toggle("showBottomFade", showBottom);
    }
}



const newTableDialog = document.getElementById("newTableDialog");
const newTableNameInput = document.getElementById("newTableName");
var changeNewTableNameSuggestion = false;
newTableDialog.returnValue = "newTable";
function openNewTableDialog() {
    newTableDialog.classList.add("show");
    newTableNameInput.value = "";
    newTableNameInput.focus();

    changeNewTableNameSuggestion = true;
}
function onNewTableNameInput(e) {
    if (e.key === "Enter" && newTableNameInput.value && newTableNameInput.value.trim() !== "") {
        e.preventDefault();

        newTableName = e.target.value;
        newTableNameInput.value = "";
        createTable(null, newTableName);
    }
}
function closeNewTableDialog() {
    newTableDialog.classList.remove("show");

    changeNewTableNameSuggestion = false;
}



const deleteTableDialog = document.getElementById("deleteTableDialog");
const deleteTableName = document.getElementById("deleteTableName");
const deleteTableConfirmButton = document.getElementById("deleteTableConfirmButton");
function openDeleteTableDialog(tableName, id) {
    deleteTableConfirmButton.setAttribute("onclick", `deleteTable("${id}")`);
    deleteTableName.innerHTML = tableName;

    deleteTableDialog.classList.add("show");
}
function closeDeleteTableDialog() {
    deleteTableDialog.classList.remove("show");

    deleteTableConfirmButton.removeAttribute("onclick");
    deleteTableName.innerHTML = "";
}
function tableDeleteButtonClick(e) {
    e.stopPropagation();
    
    const deleteButton = e.target.closest(".deleteButton");
    const tableElement = deleteButton.closest(".sidebarItem");
    const tableId = tableElement.getAttribute("id");
    const tableName = tableElement.getAttribute("title");
    openDeleteTableDialog(tableName, tableId);
}



function createTable(id, name, tasks = {}, addToLocalStorage = true) {
    let newTableId;
    if (id) {
        newTableId = id;
    } else {
        newTableId = Math.random().toString(36).substr(2, 9);
    }
    if (!newTableId || newTableId.trim() === "") {
        return;
    }

    let newTableName;
    if (name) {
        newTableName = name;
    } else {
        newTableName = document.getElementById("newTableName").value;
    }
    if (!newTableName || newTableName.trim() === "") {
        return;
    }

    console.log("newTable:", newTableId, newTableName, tasks);

    tables[newTableId] = {
        name: newTableName,
        tasks: tasks,
    };

    if (addToLocalStorage) {
        localStorage.setItem("tables", JSON.stringify(tables));
    }

    // update sidebar
    const sidebarList = document.getElementById("sidebarList");
    const newItem = document.createElement("li");
    newItem.classList.add("sidebarItem");
    newItem.setAttribute("title", newTableName);
    newItem.setAttribute("id", newTableId);
    newItem.onclick = () => selectTable(newTableId);
    newItem.innerHTML = `<div class="deleteButton" onclick="tableDeleteButtonClick(event)">
                            <ion-icon class="icon" name="close"></ion-icon>
                        </div>
                        
                        <p class="icon">${Array.from(newTableName)[0].toUpperCase()}</p>`; // Array.from(string) evita que, de ser un emoji el primer caracter, no se copie correctamente el primer caracter.
    sidebarList.appendChild(newItem);
    updateSidebarFades();

    closeNewTableDialog();
    renderAllTables();
    selectTable(newTableId);
}
function deleteTable(id) {
    delete tables[id];
    localStorage.setItem("tables", JSON.stringify(tables));
    const sidebarList = document.getElementById("sidebarList");
    const item = sidebarList.querySelector(`li[id="${id}"]`);
    sidebarList.removeChild(item);
    closeDeleteTableDialog();
    renderAllTables();
}
function loadTablesFromLocalStorage() {
    var loadedTables = localStorage.getItem("tables");
    if (loadedTables) {
        loadedTables = JSON.parse(loadedTables);
        for (const tableId in loadedTables) {
            createTable(tableId, loadedTables[tableId].name, loadedTables[tableId].tasks, false);
        }
    }
}



function closeAllDialogs(e) {
    if (e && (e.target !== e.currentTarget) ) {
        return;
    }

    const dialogs = document.querySelectorAll(".dialog");
    dialogs.forEach(dialog => {
        dialog.classList.remove("show");
    });
}


    async function startChangeNewTableNameSuggestion() {
        while (true) {
            var selectedSuggestion = newTableNameSuggestions[Math.floor(Math.random() * newTableNameSuggestions.length)];

            while (newTableNameInput.getAttribute("placeholder").length < Array.from(selectedSuggestion).length) {
                var placeholder = newTableNameInput.getAttribute("placeholder");
                newTableNameInput.setAttribute("placeholder", placeholder + Array.from(selectedSuggestion)[placeholder.length]);
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            while (newTableNameInput.getAttribute("placeholder").length > 0) {
                var placeholder = newTableNameInput.getAttribute("placeholder");
                newTableNameInput.setAttribute("placeholder", Array.from(placeholder).slice(0, -1).join(""));
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    startChangeNewTableNameSuggestion()



// ===== Kanban Rendering and Interactions =====
const tablesContainer = document.getElementById("tableContainer");
const allTablesItem = document.getElementById("allTablesItem");

function renderAllTables(selectedId = null) {
    if (!tablesContainer) return;
    tablesContainer.innerHTML = "";

    const ids = Object.keys(tables);
    ids.forEach((id) => {
        const table = tables[id];
        const card = createTableCard(id, table.name, table.tasks);
        tablesContainer.appendChild(card);
    });

    // When a single table is selected, apply compact mode and fade others
    if (selectedId && tables[selectedId]) {
        const cards = tablesContainer.querySelectorAll('.table');
        cards.forEach(card => {
            if (card.dataset.id !== selectedId) {
                card.classList.add('fade-out');
                card.remove();
                // setTimeout(() => card.remove(), 300);
            } else {
                card.classList.remove('fade-out');
            }
        });
    }
}

function createTableCard(id, name, tasks = {}) {
    const ensuredTasks = {
        todo: tasks.todo || [],
        progress: tasks.progress || [],
        done: tasks.done || [],
    };

    if (tables[id]) tables[id].tasks = ensuredTasks;

    const card = document.createElement('div');
    card.className = 'table fade-in';
    card.dataset.id = id;

    const label = document.createElement('div');
    label.className = 'tableLabel';
    label.textContent = name;
    card.appendChild(label);

    const todoColumn = columnTemplate('To Do', 'todo', 'todo');
    const progressColumn = columnTemplate('In Progress', 'progress', 'progress');
    const doneColumn = columnTemplate('Done!', 'done', 'done');

    const board = document.createElement('div');
    board.className = 'board';
    board.appendChild(todoColumn);
    board.appendChild(progressColumn);
    board.appendChild(doneColumn);
    card.appendChild(board);

    // create Task Elements
    [['todo', todoColumn],['progress', progressColumn],['done', doneColumn]].forEach(([col, column]) => {
        const ul = column.querySelector('.tasks');
        ensuredTasks[col].forEach((t, idx) => {
            ul.appendChild(createTaskItem(id, col, idx, t));
        });
    });

    // addTaskButton handlers
    const addButtons = card.querySelectorAll('.addTaskButton');
    addButtons.forEach(btn => btn.addEventListener('click', () => addTask(id, btn.dataset.col)));

    // setTimeout(() => card.classList.remove('fade-in'), 300);
    
    return card;
}

function columnTemplate(title, colId, theme) {
    const column = document.createElement('div');
    column.className = `column ${theme}`;

    const header = document.createElement('div');
    header.className = 'columnHeader';
    header.textContent = title;
    column.appendChild(header);

    const body = document.createElement('div');
    body.className = 'columnBody';
    body.setAttribute('data-col', colId);

    const tasks = document.createElement('div');
    tasks.className = 'tasks';
    tasks.setAttribute('data-col', colId);
    body.appendChild(tasks);

    const btn = document.createElement('button');
    btn.className = 'addTaskButton';
    btn.setAttribute('data-col', colId);
    btn.innerHTML = '<ion-icon class="icon" name="add"></ion-icon>';
    body.appendChild(btn);

    column.appendChild(body);

    return column;
}

function createTaskItem(tableId, col, index, title) {
    const task = document.createElement('div');
    task.className = 'task';

    const input = document.createElement('input');
    input.className = 'title';
    input.value = title || 'Nueva tarea';
    input.onchange = () => editTask(tableId, col, index, input.value);
    task.appendChild(input);

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.innerHTML = `
        <div class="actionButton" title="Borrar" data-act="delete"><ion-icon name="trash-outline"></ion-icon></div>
        <div class="actionButton" title="Izquierda" data-act="left"><ion-icon name="arrow-back-outline"></ion-icon></div>
        <div class="actionButton" title="Derecha" data-act="right"><ion-icon name="arrow-forward-outline"></ion-icon></div>
    `;
    task.appendChild(actions);

    actions.addEventListener('click', (e) => {
        const btn = e.target.closest('.actionButton');
        if (!btn) return;
        const act = btn.dataset.act;
        if (act === 'delete') deleteTask(tableId, col, index);
        if (act === 'left') moveTask(tableId, col, index, -1);
        if (act === 'right') moveTask(tableId, col, index, 1);
    });

    return task;
}

function saveAndRerender() {
    localStorage.setItem('tables', JSON.stringify(tables));
    // keep current selection
    const selected = document.querySelector('#sidebarList .sidebarItem.selected');
    const selectedId = selected && selected.id !== 'allTablesItem' ? selected.id : null;
    renderAllTables(selectedId);
}

function addTask(tableId, col) {
    const taskTitle = 'New Task';
    tables[tableId].tasks[col].push(taskTitle);
    saveAndRerender();
}

function editTask(tableId, col, index, newTitle) {
    tables[tableId].tasks[col][index] = newTitle || 'Task';
    saveAndRerender();
}

function deleteTask(tableId, col, index) {
    tables[tableId].tasks[col].splice(index, 1);
    saveAndRerender();
}

function moveTask(tableId, col, index, direction) {
    const order = ['todo','progress','done'];
    const fromIdx = order.indexOf(col);
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= order.length) return;
    const [item] = tables[tableId].tasks[col].splice(index, 1);
    tables[tableId].tasks[order[toIdx]].push(item);
    saveAndRerender();
}

// Sidebar selection logic
function selectTable(id) {
    const list = document.getElementById('sidebarList');
    list.querySelectorAll('.sidebarItem').forEach(i => i.classList.remove('selected'));
    const item = list.querySelector(`li[id="${id}"]`);
    if (item) item.classList.add('selected');

    renderAllTables();

    const cards = tablesContainer.querySelectorAll('.table');
    cards.forEach(card => {
        if (card.dataset.id !== id) {
            card.classList.add('fade-out');
            card.remove();
            // setTimeout(() => card.remove(), 300);
        } else {
            card.classList.remove('fade-out');
        }
    });
}

function showAllTables() {
    renderAllTables();

    const list = document.getElementById('sidebarList');
    list.querySelectorAll('.sidebarItem').forEach(i => i.classList.remove('selected'));
    if (allTablesItem) allTablesItem.classList.add('selected');

    app.classList.add('showAllTables');
}

if (allTablesItem) {
    allTablesItem.onclick = () => showAllTables();
}




function init() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
        app.classList.add("dark");
    } else {
        app.classList.remove("dark");
    }


    loadTablesFromLocalStorage();
    updateSidebarFades();
    showAllTables();


    // listeners para actualizar los fades de la sidebar
    if (sidebarContent) {
        sidebarContent.addEventListener("scroll", updateSidebarFades);
    }
    window.addEventListener("resize", updateSidebarFades);
}
init();