function createVisualizer (mesh, sound, scene) {

    //sets up analyzer
    const myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 512;
    myAnalyser.SMOOTHING = 0.9;

    // GUI for play/stop buttons
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const panel = new BABYLON.GUI.StackPanel();
    panel.width = "300px";
    panel.height = "200px";
    panel.paddingLeftInPixels=100;
    panel.isVertical = false;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    advancedTexture.addControl(panel);

    const playButton = BABYLON.GUI.Button.CreateSimpleButton("play", "Play");
    playButton.width = "70px";
    playButton.height = "40px";
    playButton.color = "white";
    playButton.paddingLeftInPixels = 10;
    playButton.cornerRadius = 20;
    playButton.background = "purple";
    panel.addControl(playButton);				

    const stopButton = BABYLON.GUI.Button.CreateSimpleButton("stop", "Stop");
    stopButton.width = "80px";
    stopButton.height = "40px";
    stopButton.color = "white";
    stopButton.paddingLeftInPixels = 20;
    stopButton.cornerRadius = 20;
    stopButton.background = "purple";
    panel.addControl(stopButton);	


    function createParticleSystem (emitterMesh, z) {
        var particleSystem = new BABYLON.ParticleSystem("particles", 500, scene);
        particleSystem.particleTexture = new BABYLON.Texture("https://rawcdn.githack.com/3dwebgs/miscWebGLpages/9924eb2ae9f6a6573cfee3cc99d97cfba9164b45/textures/musical_note.jpg", scene);
        particleSystem.emitter = emitterMesh;
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.minEmitBox = new BABYLON.Vector3(-2, 0, z); // Starting all From
        particleSystem.maxEmitBox = new BABYLON.Vector3(2, 3, z); // To...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 1.0;
        particleSystem.maxLifeTime = 5.0;
        particleSystem.emitRate = 100;
        particleSystem.direction1 = new BABYLON.Vector3(10, 10, 10);
        particleSystem.direction2 = new BABYLON.Vector3(-10, -10, -10);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        particleSystem.maxEmitPower = 1;
        particleSystem.updateSpeed = 0.01;
        return particleSystem;
    }

    scene.registerBeforeRender(function () {
        //creates array, copies frequency data into the passed unsigned byte array 
        var workingArrayFreq = myAnalyser.getByteFrequencyData();
        var workingArrayTime = myAnalyser.getByteTimeDomainData();
        // //loop scales mesh with each value
        for (var i = 0; i < myAnalyser.getFrequencyBinCount(); i++) {  //frequency bin count is 1/2 of FFT_SIZE
            let size = workingArrayTime[i] / 256;
            mesh.scaling.scaleInPlace(1); //this keeps the scaling assignment below from mirroring the mesh
            mesh.scaling = new BABYLON.Vector3(size,size,size); 
        }
    });

    const particles = createParticleSystem(mesh, -2);
    let isPlaying = false;

    playButton.onPointerClickObservable.add(function(){
            if (!isPlaying){  //conditional keeps sound from playing more than once over previous playing
                sound.play();
                isPlaying = true;
            }
            particles.start();
    })

    stopButton.onPointerClickObservable.add(function(){
            sound.stop();
            isPlaying = false;
            particles.stop();
            particles.reset();
    })

}



export default createVisualizer;