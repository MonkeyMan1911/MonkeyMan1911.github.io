function init(body) {

const fileInput = body.querySelector("#fileInput");
const output = body.querySelector("#image");
const widthInput = body.querySelector("#s-width");
const heightInput = body.querySelector("#s-height"); 
const generateButton = body.querySelector("#generate")
const currentName = body.querySelector("#a-name")
const deselectBtn = body.querySelector("#deselect-all")

let img = null;
let frames = [];

// Main function to slice + draw
function drawPieces() {
    if (!img) return;

    // Clear previous canvases
    output.innerHTML = "";
    frames = [];

    const spriteWidth = Number(widthInput.value);
    const spriteHeight = Number(heightInput.value);

    for (let y = 0; y < img.height; y += spriteHeight) {
        for (let x = 0; x < img.width; x += spriteWidth) {
            const canvas = document.createElement("canvas");
            canvas.width = spriteWidth * 2;
            canvas.height = spriteHeight * 2;
            canvas.dataset.x = x / spriteWidth;
            canvas.dataset.y = y / spriteHeight;
            canvas.dataset.selected = "false";

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            canvas.style.backgroundColor = "rgb(29, 29, 29)";
            canvas.style.margin = "5px";

            // Draw slice scaled up
            ctx.drawImage(
                img,
                x, y, spriteWidth, spriteHeight,
                0, 0, canvas.width, canvas.height
            );

            // Toggle select on click
            canvas.addEventListener("click", () => toggleSelection(canvas));
            canvas.addEventListener("contextmenu", (event) => {
                event.preventDefault()
                customDuration(canvas)
            })

            output.appendChild(canvas);
        }
    }
} 

function redrawAllBadges() {
    const spriteWidth = Number(widthInput.value);
    const spriteHeight = Number(heightInput.value);

    // Loop through all canvases
    output.querySelectorAll("canvas").forEach((canvas) => {
        const ctx = canvas.getContext("2d");

        // Clear + redraw sprite
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            canvas.dataset.x * spriteWidth,
            canvas.dataset.y * spriteHeight,
            spriteWidth,
            spriteHeight,
            0, 0, canvas.width, canvas.height
        );

        // If selected, draw badge with its current index
        const frameIndex = frames.findIndex(
            (f) => f.x === parseFloat(canvas.dataset.x) && f.y === parseFloat(canvas.dataset.y)
        );

        if (frameIndex > -1) {
            const badgeSize = 16;
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(canvas.width - badgeSize, canvas.height - badgeSize, badgeSize, badgeSize);

            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${frameIndex}`, canvas.width - badgeSize / 2, canvas.height - badgeSize / 2);
        }
    });
}


// Toggle select/deselect
function toggleSelection(canvas) {
    const ctx = canvas.getContext("2d")

    if (canvas.dataset.selected === "false") {
        frames.push({ x: parseFloat(canvas.dataset.x), y: parseFloat(canvas.dataset.y) });
        canvas.style.backgroundColor = "blue";
        canvas.dataset.selected = "true";
        body.dataset.frames = JSON.stringify(frames)

        const badgeSize = 16;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";  // semi-transparent dark background
        ctx.fillRect(canvas.width - badgeSize, canvas.height - badgeSize, badgeSize, badgeSize);

        ctx.fillStyle = "white";               // text color
        ctx.font = "12px Arial";               // font size
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

            // Draw a character/number in the badge
        ctx.fillText(`${frames.length - 1}`, canvas.width - badgeSize / 2, canvas.height - badgeSize / 2);
    } 
    else {
        const index = frames.findIndex(
            (f) => f.x === parseFloat(canvas.dataset.x) && f.y === parseFloat(canvas.dataset.y)
        );
        if (index > -1) { frames.splice(index, 1) };
        canvas.style.backgroundColor = "rgb(29, 29, 29)";
        canvas.dataset.selected = "false";

        redrawAllBadges()
    }
}
function customDuration(canvas) {
    function createOverlay(defaultValue = "") {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            Object.assign(overlay.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999"
            });

            const popup = document.createElement("div");
            Object.assign(popup.style, {
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                minWidth: "200px"
            });

            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = "Duration (ms)";
            input.style.marginBottom = "10px";
            input.style.width = "100%";
            input.classList.add("custom-duration-input")
            if (defaultValue) input.value = defaultValue;

            const okBtn = document.createElement("button");
            okBtn.textContent = "OK";
            okBtn.style.marginRight = "10px";
            okBtn.classList.add("ok-btn")

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancel";
            cancelBtn.classList.add("cancel-btn")

            okBtn.onclick = () => {
                document.body.removeChild(overlay);
                resolve({ action: "ok", value: input.value });
            };

            document.onkeydown = (event) => {
                if (event.key === "Enter") {
                    document.body.removeChild(overlay)
                    resolve({ action: "ok", value: input.value })
                }
            }

            cancelBtn.onclick = () => {
                document.body.removeChild(overlay);
                resolve({ action: "cancel" });
            };

            popup.appendChild(input);
            popup.appendChild(document.createElement("br"));
            popup.appendChild(okBtn);
            popup.appendChild(cancelBtn);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);
        });
    }

    // Main logic, waits until user chooses
    (async () => {
        const defaultVal = canvas.dataset.selected === "true" ? canvas.dataset.duration : "";
        const result = await createOverlay(defaultVal);
        const ctx = canvas.getContext("2d")

        if (result.action === "ok" && result.value) {
            const index = frames.findIndex(
                (f) => f.x === parseFloat(canvas.dataset.x) && f.y === parseFloat(canvas.dataset.y)
            );
            if (index > -1) { frames.splice(index, 1) };
            frames.push({
                x: parseFloat(canvas.dataset.x),
                y: parseFloat(canvas.dataset.y),
                duration: parseFloat(result.value)
            });
            canvas.dataset.duration = parseFloat(result.value);
            canvas.style.backgroundColor = "red";
            canvas.dataset.selected = "true";
            console.log(frames)
        } 
        else if (result.action === "ok") {
            const index = frames.findIndex(
                (f) => f.x === parseFloat(canvas.dataset.x) && f.y === parseFloat(canvas.dataset.y)
            );
            if (index > -1) { frames.splice(index, 1) };
            frames.push({
                x: parseFloat(canvas.dataset.x),
                y: parseFloat(canvas.dataset.y)
            });
            canvas.style.backgroundColor = "blue";
            canvas.dataset.selected = "true";
            console.log(frames);
        } 
        else if (result.action === "cancel" && canvas.dataset.selected !== "true") {
            // first-time cancel = still add a frame
            const index = frames.findIndex(
                (f) => f.x === parseFloat(canvas.dataset.x) && f.y === parseFloat(canvas.dataset.y)
            );
            if (index > -1) { frames.splice(index, 1) };    
            frames.push({
                x: parseFloat(canvas.dataset.x),
                y: parseFloat(canvas.dataset.y)
            });
            canvas.style.backgroundColor = "blue";
            canvas.dataset.selected = "true";
            console.log(frames);
        }

        const badgeSize = 16;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";  // semi-transparent dark background
        ctx.fillRect(canvas.width - badgeSize, canvas.height - badgeSize, badgeSize, badgeSize);

        ctx.fillStyle = "white";               // text color
        ctx.font = "12px Arial";               // font size
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

            // Draw a character/number in the badge
        ctx.fillText(`${frames.length - 1}`, canvas.width - badgeSize / 2, canvas.height - badgeSize / 2);

        body.dataset.frames = JSON.stringify(frames);
    })();
}


// Load file
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    img = new Image();
    img.onload = drawPieces;
    img.src = URL.createObjectURL(file);
});

// Re-draw when inputs change
widthInput.addEventListener("input", () => {
    if (widthInput.value) { drawPieces() }
});
heightInput.addEventListener("input", () => {
    if (heightInput.value) { drawPieces() }
});

generateButton.addEventListener("click", () => { generateOne(body, frames) })

currentName.addEventListener("input", () => {
    const currentTabId = body.id.split("-")[1]
    const activeTab = document.getElementById(`tab-${currentTabId}`)
    if (currentName.value) {
        activeTab.innerHTML = (`
            ${currentName.value.slice(0, 10)}
            <span class="close-tab" id="close-${currentTabId}" onclick="eventListenerContent(this)">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m256-168-88-88 224-224-224-224 88-88 224 224 224-224 88 88-224 224 224 224-88 88-224-224-224 224Z"/></svg>
            </span>
        `)
    }
    else {
        activeTab.innerHTML = (`
            Untitled
            <span class="close-tab" id="close-${currentTabId}" onclick="eventListenerContent(this)">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m256-168-88-88 224-224-224-224 88-88 224 224 224-224 88 88-224 224 224 224-88 88-224-224-224 224Z"/></svg>
            </span>
        `)
    }
})

deselectBtn.addEventListener("click", () => {
    if (frames.length === 0) { return }

    const allCanvases = Array.from(output.children)
    allCanvases.forEach(canvas => {
        const point = { x: parseFloat(canvas.dataset.x), y: parseFloat(canvas.dataset.y) }
        const index = frames.findIndex(
            (f) => f.x === point.x && f.y === point.y
        );
        if (index > -1) { frames.splice(index, 1) };
        canvas.style.backgroundColor = "rgb(29, 29, 29)";
        canvas.dataset.selected = "false";

        redrawAllBadges()
    })
})

}

const startingBody = document.querySelector(".tab-body")
init(startingBody)