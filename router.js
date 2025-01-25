const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home/home.html",
    "/about": "/pages/about.html",
    "/contact": "/pages/contact.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    if (path === '/' || path === '/pages/home/home.html') {
        // Import the slider.js module dynamically
        import('./modules/slider.js').then(module => {
            // Slider module loaded and executed
        }).catch(err => console.error('Failed to load slider module: ', err));

        // Import the createBabylonScene.js module dynamically
        import('./modules/createBabylonScene.js').then(module => {
            console.log('createBabylonScene module loaded');
            // Now you can call the function to initialize the scenes
            window.addEventListener("load", function () {
                console.log("Initializing Babylon.js scenes...");
                module.createBabylonScene("canvas1", "../../assets/cup.glb");
                module.createBabylonScene("canvas2", "../../assets/icosphere.glb");
                module.createBabylonScene("canvas3", "../../assets/torus.glb");
            });
        }).catch(err => console.error('Failed to load createBabylonScene module: ', err));
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();






//run local server:
//python3 -m http.server 9000