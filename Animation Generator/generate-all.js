function generateAll() {
    const allBodies = Array.from(document.querySelectorAll(".tab-body"))

    const allAnimations = {}

    for (body of allBodies) {
        const name = body.querySelector("#a-name").value
        const dpf = parseFloat(body.querySelector("#dpf").value)
        const strategy = body.querySelector("#strategy").value
        const inputs = [name, dpf, strategy]
        
        const frames = JSON.parse(body.dataset.frames)
        frames.forEach(frame => {
            if (!frame.duration) {
                frame.duration = dpf
            }
        })

        if (inputs.some(input => input === "") || frames.length === 0) {
            console.log("missing input");
            return;
        }
        
        console.log(frames)

        const animationData = {name, frameCoordinates: frames, durationPerFrame: dpf, strategy}
        allAnimations[name] = animationData
    }

    if (genAllBtn.value === "json") {
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

    else if (genAllBtn.value === "typescript") {
        // Build TypeScript code by looping animations
        let tsCode = `// You can edit the duration of each frame if needed\n\n`

        for (const [name, animationData] of Object.entries(allAnimations)) {
            tsCode += `const ${name} = ex.Animation.fromSpriteSheetCoordinates({\n`
            tsCode += `    spriteSheet: "REPLACE WITH YOUR SPRITESHEET",\n`
            tsCode += `    durationPerFrame: ${animationData.durationPerFrame},\n`
            tsCode += `    frameCoordinates: ${JSON.stringify(animationData.frameCoordinates, null, 8)},\n`
            tsCode += `    strategy: AnimationStrategy.${animationData.strategy}\n`
            tsCode += `})\n\n`
        }

        const blob = new Blob([tsCode], { type: "text/typescript" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "animation.ts"
        a.click()
        URL.revokeObjectURL(url)
    }

}

const genAllBtn = document.querySelector(".generate-all")
genAllBtn.addEventListener("change", () => { generateAll() })

const regenAll = document.querySelector(".regen-all")
regenAll.addEventListener("click", () => {
    if (genAllBtn.value) {
        generateAll()
    }
})
