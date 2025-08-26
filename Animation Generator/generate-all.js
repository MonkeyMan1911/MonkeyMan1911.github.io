function generateAll() {
    const allBodies = Array.from(document.querySelectorAll(".tab-body"))

    const allAnimations = {}

    for (body of allBodies) {
        const name = body.querySelector("#a-name").value
        const dpf = parseFloat(body.querySelector("#dpf").value)
        const strategy = body.querySelector("#strategy").value
        const outputType = body.querySelector("#output-type").value
        const inputs = [name, dpf, strategy, outputType]
        
        const frames = JSON.parse(body.dataset.frames)
        frames.forEach(frame => {
            frame.duration = dpf
        })

        if (inputs.some(input => input === "") || frames.length === 0) {
            console.log("missing input");
            return;
        }
        
        console.log(frames)

        const animationData = {name, frameCoordinates: frames, durationPerFrame: dpf, strategy}
        allAnimations[name] = animationData
    }

    const jsonStr = JSON.stringify(allAnimations, null, 4)
    const blob = new Blob([jsonStr], {type: "application/json"})
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "animationData.json"; 
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const genAllBtn = document.querySelector(".generate-all")
genAllBtn.addEventListener("click", () => { generateAll() })