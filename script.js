const ioniconsList = [
    "list-outline",
    "settings-outline",
    "help-outline",
    "person-outline",
    "log-out-outline",
    "moon-outline",
    "sunny-outline",
];

const app = document.getElementById("app");
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

function init() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
        app.classList.add("dark");
    }
    updateSidebarFades();
}

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

function addSidebarItem() {
    const sidebarList = document.getElementById("sidebar-list");
    const newItem = document.createElement("li");
    newItem.classList.add("sidebar-item");
    newItem.innerHTML = `<ion-icon class="icon" name="${ioniconsList[Math.floor(Math.random() * ioniconsList.length)]}"></ion-icon>`;
    sidebarList.appendChild(newItem);
    updateSidebarFades();
}

init();

// listeners para actualizar los fades de la sidebar
if (sidebarContent) {
    sidebarContent.addEventListener("scroll", updateSidebarFades);
}
window.addEventListener("resize", updateSidebarFades);