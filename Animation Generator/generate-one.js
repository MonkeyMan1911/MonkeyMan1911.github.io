function generateOne(body, frames) {
    const name = body.querySelector("#a-name").value
    const dpf = parseFloat(body.querySelector("#dpf").value)
    const strategy = body.querySelector("#strategy").value
    const outputType = body.querySelector("#output-type").value
    const inputs = [name, dpf, strategy, outputType]
    
    if (inputs.some(input => input === "") || frames.length === 0) {
        console.log("missing input");
        console.log(frames)
        return;
    }


    frames.forEach(frame => {
        frame.duration = dpf
    })

    const animationData = {name, frameCoordinates: frames, durationPerFrame: dpf, strategy}

    if (outputType === "json") {
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
        const tsCode = ` // You can edit the duration each frame as you need
const ${name} = ex.Animation.fromSpriteSheetCoordinates({
    spriteSheet: "REPLACE WITH YOUR SPRITESHEET",
    durationPerFrame: ${animationData.durationPerFrame},
    frameCoordinates: ${JSON.stringify(animationData.frameCoordinates, null, 8)},
    strategy: AnimationStrategy.${animationData.strategy}
})`
        const blob = new Blob([tsCode], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'animation.ts'; 
        a.click();

        URL.revokeObjectURL(url);
    }  
}