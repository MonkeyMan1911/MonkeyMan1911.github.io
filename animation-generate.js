const generateBtn = document.getElementById("generate")

generateBtn.addEventListener("click", () => {
    const name = document.getElementById("a-name").value
    const dpf = document.getElementById("dpf").value
    const strategy = document.getElementById("strategy").value
    const outputType = document.getElementById("output-type").value
    const inputs = [name, dpf, strategy, outputType]
    
    if (inputs.some(input => input === "") || frames.length === 0) {
        console.log("missing input");
        return;
    }

    if (outputType === "json") {
        const animationData = {name, frameCoordinates: frames, durationPerFrame: dpf, strategy}
        const jsonStr = JSON.stringify(animationData, null, 4)

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
    else {
        const animationData = {name, frameCoordinates: frames, durationPerFrame: dpf, strategy}
        const tsCode = `const ${name} = ex.Animation.fromSpriteSheetCoordinates({
    spriteSheet: "REPLACE WITH YOUR SPRITESHEET",
    durationPerFrame: ${animationData.durationPerFrame},
    frameCoordinates: ${JSON.stringify(animationData.frameCoordinates)},
    strategy: "${animationData.strategy}"
    })`
        const blob = new Blob([tsCode], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'animation.ts'; 
        a.click();

        URL.revokeObjectURL(url);
    }
})
