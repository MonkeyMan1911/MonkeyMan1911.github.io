const xButtons = document.querySelectorAll(".close-tab")
Array.from(xButtons).forEach(button => {
    xButtonEventListener(button)
})
function xButtonEventListener(xButton) {
    xButton.addEventListener("click", () => { eventListenerContent(xButton) })
}
function eventListenerContent(xButton) {
    const idNumber = xButton.id.split("-")[1]
    const tabToDelete = document.getElementById(`tab-${idNumber}`)
    const bodyToDelete = document.getElementById(`body-${idNumber}`)

    if (tabToDelete.classList.contains("active")) {
        const tabsLeft = document.querySelectorAll(".tab")
        const activeTab = Array.from(tabsLeft)[0]
        activeTab.classList.add("active")
        const activeBody = document.getElementById(`body-${activeTab.id.split("-")[1]}`)
        activeBody.classList.add("body-active")
        activeBody.style.display = "block"
    }

    document.querySelector(".tab-manager").removeChild(tabToDelete)
    document.body.removeChild(bodyToDelete)
}