const fileInput = document.getElementById("fileInput");
const output = document.getElementById("image");
const widthInput = document.getElementById("s-width");
const heightInput = document.getElementById("s-height");

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

            canvas.style.backgroundColor = "white";
            canvas.style.margin = "5px";

            // Draw slice scaled up
            ctx.drawImage(
                img,
                x, y, spriteWidth, spriteHeight,
                0, 0, canvas.width, canvas.height
            );

            // Toggle select on click
            canvas.addEventListener("click", () => toggleSelection(canvas));

            output.appendChild(canvas);
        }
    }
} 

// Toggle select/deselect
function toggleSelection(canvas) {
    if (canvas.dataset.selected === "false") {
        canvas.dataset.selected = "true";
        frames.push({ x: parseFloat(canvas.dataset.x), y: parseFloat(canvas.dataset.y) });
        canvas.style.backgroundColor = "blue";
    } else {
        const index = frames.findIndex(
            (f) => f.x === canvas.dataset.x && f.y === canvas.dataset.y
        );
        if (index > -1) frames.splice(index, 1);
        canvas.style.backgroundColor = "white";
        canvas.dataset.selected = "false";
    }
    console.log(frames);
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
widthInput.addEventListener("input", drawPieces);
heightInput.addEventListener("input", drawPieces);
