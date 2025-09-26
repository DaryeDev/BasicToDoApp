const ioniconsList = [
    "list-outline",
    "settings-outline",
    "help-outline",
    "person-outline",
    "log-out-outline",
    "moon-outline",
    "sunny-outline",
];

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



const sidebarContent = document.getElementById("sidebar-list");
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
        sidebarContent.classList.remove("show-top-fade");
        sidebarContent.classList.remove("show-bottom-fade");
        sidebarContent.classList.add("show-both-fades");
    } else {
        sidebarContent.classList.remove("show-both-fades");
        sidebarContent.classList.toggle("show-top-fade", showTop);
        sidebarContent.classList.toggle("show-bottom-fade", showBottom);
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
    const tableElement = deleteButton.closest(".sidebar-item");
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
    const sidebarList = document.getElementById("sidebar-list");
    const newItem = document.createElement("li");
    newItem.classList.add("sidebar-item");
    newItem.setAttribute("title", newTableName);
    newItem.setAttribute("id", newTableId);
    newItem.innerHTML = `<div class="deleteButton" onclick="tableDeleteButtonClick(event)">
                            <ion-icon class="icon" name="close"></ion-icon>
                        </div>
                        
                        <p class="icon">${Array.from(newTableName)[0].toUpperCase()}</p>`; // Array.from(string) evita que, de ser un emoji el primer caracter, no se copie correctamente el primer caracter.
    sidebarList.appendChild(newItem);
    updateSidebarFades();

    closeNewTableDialog();
}
function deleteTable(id) {
    delete tables[id];
    localStorage.setItem("tables", JSON.stringify(tables));
    const sidebarList = document.getElementById("sidebar-list");
    const item = sidebarList.querySelector(`li[id="${id}"]`);
    sidebarList.removeChild(item);
    closeDeleteTableDialog();
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

function init() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
        app.classList.add("dark");
    }

    loadTablesFromLocalStorage();
    updateSidebarFades();



    // listeners para actualizar los fades de la sidebar
    if (sidebarContent) {
        sidebarContent.addEventListener("scroll", updateSidebarFades);
    }
    window.addEventListener("resize", updateSidebarFades);
}
init();
