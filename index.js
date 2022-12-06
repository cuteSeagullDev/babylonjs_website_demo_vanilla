import makeVisualizer from "../modules/visualizer.js";


/*
*
*menu toggle
*
*/

const hamburger = document.querySelector('.hamburger');
const hamburger_icon = hamburger.querySelector('span');
const mobile_menu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger_icon.innerText = hamburger_icon.innerText === 'menu' ? 'close' : 'menu';
    mobile_menu.classList.toggle('is-open');
})


/*
*
BabylonJS script
*
*/


const canvas = document.getElementById("renderCanvas"); 
const engine = new BABYLON.Engine(canvas, true); 


const isPortrait = window.innerWidth < window.innerHeight;
const isLandscape = window.innerHeight <= window.innerWidth;

const createScene = function () {

    const scene = new BABYLON.Scene(engine);
    // scene.debugLayer.show();
    const pi = Math.PI;
    //this camera will be overwritten later in this specific scene, but normally, enter approptiate alpha/beta/radius
    const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    //loads HDRI
    const environment = new BABYLON.HDRCubeTexture("https://raw.githack.com/cgcreatexyz/CGcreate_assets/main/textures/HDRIs/purplesky.hdr", scene, 256, false, true, false, true);
    scene.environmentTexture = environment;
    const skybox = scene.createDefaultSkybox(scene.environmentTexture);

    // const light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(1, -0.5, -3), scene);
    // light.shadowMinZ = 0;
    // light.shadowMaxZ = 100;

    //  removed visualizer to target issues
    // const music = new BABYLON.Sound("song", "assets/smooth4.wav", scene, null, {loop:true});


    //  IMPORTS MESH. all changes to mesh must be within onSuccess callback
    BABYLON.SceneLoader.ImportMesh("", "assets/", "boomboxlowerpoly.glb", scene, function (meshes) {  
        //along with scaleInPlace in line 153, keeps mesh from mirroring backward
        scene.createDefaultCamera(true, true, true);
        // scene.useRightHandedSystem = true;
        const cam = scene.activeCamera;

        //mesh and camera positioning
        const boomBox = meshes[0];
        boomBox.position.x -=0.4
        cam.setTarget = new BABYLON.Vector3.Zero();
        cam.alpha = 7*pi/4;
        cam.alpha = 5*Math.PI/3;
        cam.radius = 6;

        //ground is invisible in scene, but used for shadow, below
        const ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
        ground.receiveShadows = true;
        ground.position = new BABYLON.Vector3(0,-0.8,0);

        //additional lighting
        var hemLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 3, 0), scene);
        hemLight.diffuse = new BABYLON.Color3(0.96, 0.02, 0.84);
        hemLight.groundColor = new BABYLON.Color3(0, 1, 0.87);
        const hemLight2 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(-1, 3, -10), scene);
        hemLight2.diffuse = new BABYLON.Color3(1, 1, 1);
        hemLight2.intensity = 2;
    
        //CREATING THE SHADOW
        //this light is used to direct shadow
        const light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, 5, -12), scene);
        light2.shadowMinZ = 0;
        light2.shadowMaxZ = 100;
        //shadowgenerator and parameters for blurring
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.addShadowCaster(boomBox, true);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.useKernelBlur = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.blurKernel = 1;
        shadowGenerator.depthScale = 10;
        //color for shadow, sets the rest of ground to invisible
        const backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
        backgroundMaterial.primaryColor = new BABYLON.Color3(1, 0, 0.78);
        backgroundMaterial.shadowOnly = true;
        ground.material = backgroundMaterial;


    })  

    return scene;

};

const scene = createScene(); 

engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});




//device orientation playground test:
//https://playground.babylonjs.com/#JR6K11#1

//with purple hdri, for realistic
//https://playground.babylonjs.com/#0DDTS1#1
