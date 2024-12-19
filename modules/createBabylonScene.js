export function createBabylonScene(canvasId, modelPath) {
    const canvas = document.getElementById(canvasId);
    const engine = new BABYLON.Engine(canvas, true);

    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera(
        "camera", 
        Math.PI / 2, 
        Math.PI / 3, 
        5, 
        BABYLON.Vector3.Zero(), 
        scene
    );
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    BABYLON.SceneLoader.Append("", modelPath, scene, function () {
        console.log(`${modelPath} loaded into ${canvasId}`);
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}
