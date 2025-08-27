const tabs = document.querySelectorAll(".tab")
Array.from(tabs).forEach(tab => {
    tabEventListener(tab)
})
function tabEventListener(tab) {
    tab.addEventListener("click", () => { changeTab(tab) })
}
function changeTab(tab) {
    if (!tab.classList.contains("active")) {
        const activeTab = document.querySelector(".active")
        const activeId = activeTab.id.split("-")[1]
        const activeBody = document.getElementById(`body-${activeId}`)
        activeTab.classList.remove("active")
        activeBody.classList.remove("body-active")
        activeBody.style.display = "none"

        const newId = tab.id.split("-")[1]
        const newBody = document.getElementById(`body-${newId}`)
        tab.classList.add("active")
        tab.innerHTML = (`
            Current Tab
            <span class="close-tab" id="close-${newId}" onclick="eventListenerContent(this)">x</span>
        `)
        newBody.classList.add("body-active")
        newBody.style.display = "block"
    }
}