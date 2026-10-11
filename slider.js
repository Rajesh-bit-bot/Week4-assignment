class ImageSlider {

    constructor() {
        this.track = document.getElementById("sliderTrack");
        this.dotsContainer = document.getElementById("sliderDots");

        this.previousButton = document.querySelector(".prev");
        this.nextButton = document.querySelector(".next");

        // There are 4 original images.
        this.totalSlides = 4;

        // Because the first and last images are cloned,
        // the real slider starts at index 1.
        this.currentIndex = 1;

        this.isAnimating = false;

        this.init();
    }

    init() {
        this.createDots();
        this.updateSlider(false);

        this.nextButton.addEventListener("click", () => {
            this.next();
        });

        this.previousButton.addEventListener("click", () => {
            this.previous();
        });

        this.track.addEventListener("transitionend", () => {
            this.handleLoop();
        });
    }

    /*
     * Create navigation dots dynamically
     */
    createDots() {

        this.dotsContainer.innerHTML = "";

        for (let i = 0; i < this.totalSlides; i++) {

            const dot = document.createElement("button");

            dot.classList.add("dot");

            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);

            dot.addEventListener("click", () => {
                this.goToSlide(i + 1);
            });

            this.dotsContainer.appendChild(dot);
        }

        this.updateDots();
    }

    /*
     * Move to the next slide
     */
    next() {

        if (this.isAnimating) {
            return;
        }

        this.currentIndex++;

        this.isAnimating = true;

        this.updateSlider(true);
    }

    /*
     * Move to the previous slide
     */
    previous() {

        if (this.isAnimating) {
            return;
        }

        this.currentIndex--;

        this.isAnimating = true;

        this.updateSlider(true);
    }

    /*
     * Move directly to a selected slide
     */
    goToSlide(index) {

        if (this.isAnimating || index === this.currentIndex) {
            return;
        }

        this.currentIndex = index;

        this.isAnimating = true;

        this.updateSlider(true);
    }

    /*
     * Calculate the horizontal position and move the track
     */
    updateSlider(animate = true) {

        if (animate) {
            this.track.style.transition = "transform 0.5s ease-in-out";
        } else {
            this.track.style.transition = "none";
        }

        const translateValue = -(this.currentIndex * 100);

        this.track.style.transform = `translateX(${translateValue}%)`;

        this.updateDots();
    }

    /*
     * Update active navigation dot
     */
    updateDots() {

        const dots = document.querySelectorAll(".dot");

        let activeIndex = this.currentIndex - 1;

        /*
         * If we are temporarily on a clone,
         * show the corresponding real slide as active.
         */
        if (activeIndex < 0) {
            activeIndex = this.totalSlides - 1;
        }

        if (activeIndex >= this.totalSlides) {
            activeIndex = 0;
        }

        dots.forEach((dot, index) => {

            if (index === activeIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }

        });
    }

    /*
     * Handle seamless infinite looping
     */
    handleLoop() {

        /*
         * We have moved to the cloned first image.
         * Instantly move to the real first image.
         */
        if (this.currentIndex === this.totalSlides + 1) {

            this.currentIndex = 1;

            this.track.style.transition = "none";

            this.track.style.transform =
                `translateX(-${this.currentIndex * 100}%)`;
        }

        /*
         * We have moved to the cloned last image.
         * Instantly move to the real last image.
         */
        else if (this.currentIndex === 0) {

            this.currentIndex = this.totalSlides;

            this.track.style.transition = "none";

            this.track.style.transform =
                `translateX(-${this.currentIndex * 100}%)`;
        }

        this.updateDots();

        this.isAnimating = false;
    }
}


/*
 * Start the image slider after the page loads
 */
document.addEventListener("DOMContentLoaded", () => {
    new ImageSlider();
});