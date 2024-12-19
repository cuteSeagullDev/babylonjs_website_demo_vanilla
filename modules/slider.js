window.slideIndex = 1;
window.showSlides = function(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {window.slideIndex = 1}
    if (n < 1) {window.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[window.slideIndex-1].style.display = "block";
    dots[window.slideIndex-1].className += " active";
};

window.plusSlides = function(n) {
    window.showSlides(window.slideIndex += n);
};

window.currentSlide = function(n) {
    window.showSlides(window.slideIndex = n);
};

window.showSlides(window.slideIndex);

console.log("Slider script loaded");