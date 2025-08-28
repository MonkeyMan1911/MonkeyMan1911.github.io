const addTabBtn = document.querySelector(".add-tab")
addTabBtn.addEventListener("click", () => {
    // Get last tab number for new tab
    const tabs = document.querySelectorAll(".tab")
    let lastTabNumber = 0
    Array.from(tabs).forEach(tab => {
        const num = tab.id.split("-")
        if (Number(num[1]) > lastTabNumber) {
            lastTabNumber = Number(num[1])
        }
    })  
    const newTabNumber = lastTabNumber + 1

    // Deactivate old tab
    const currentTab = document.querySelector(".active")
    currentTab.classList.remove("active")
    const currentTabIdNum = currentTab.id.split("-")[1]

    // Create new tab
    const tabManager = document.querySelector(".tab-manager")
    const newTab = document.createElement("button")
    newTab.classList.add("tab")
    newTab.classList.add("active")
    newTab.id = `tab-${newTabNumber}`
    newTab.innerHTML = (`
        Untitled
        <span class="close-tab" id="close-${newTabNumber}" onclick="eventListenerContent(this)">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m256-168-88-88 224-224-224-224 88-88 224 224 224-224 88 88-224 224 224 224-88 88-224-224-224 224Z"/></svg>
        </span>
    `)
    tabEventListener(newTab)
    tabManager.insertBefore(newTab, addTabBtn)

    // Hide other tab body and show new one 
    const currentTabBody = document.getElementById(`body-${currentTabIdNum}`)
    currentTabBody.classList.remove("body-active")
    currentTabBody.style.display = "none"

    const newTabBody = document.createElement("div")
    newTabBody.classList.add("tab-body")
    newTabBody.classList.add("body-active")
    newTabBody.id = `body-${newTabNumber}`
    newTabBody.innerHTML = (`
        <input type="file" id="fileInput">
        <input type="number" placeholder="Sprite Width" id="s-width" value="16">
        <input type="number" placeholder="Sprite Height" id="s-height" value="16">
        <input type="text" placeholder="Animation Name" id="a-name">
        <input type="number" placeholder="Duration/Frame (ms)" id="dpf">
        <select id="strategy">
            <option value="" disabled selected>--Choose a Strategy--</option>
            <option value="End">End</option>
            <option value="Freeze">Freeze</option>
            <option value="Loop">Loop</option>
            <option value="PingPong">Pingpong</option>
        </select>
        <select id="output-type">
            <option value="" disabled selected>--Choose an Output Type--</option>
            <option value="json">Json</option>
            <option value="typescript">TypeScript</option>
        </select>
        <button id="generate">Generate</button>
        <button id="deselect-all">Deselect All</button>
        <div id="image"></div>
    `)
    document.body.insertBefore(newTabBody, document.querySelector(".instructions"))
    
    init(newTabBody)
})