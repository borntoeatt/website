// Select the dark mode toggle button
const toggleButton = document.getElementById('darkModeToggle');

// Check and apply saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = 'Light Mode'; // Update button text
}

// Add click event listener to toggle dark mode
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Save the user's theme preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleButton.textContent = 'Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        toggleButton.textContent = 'Dark Mode';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 50; // Adjust this value based on your sticky header height
        if (target) {
            smoothScrollTo(target, offset, 1600); // 1600ms for duration
        }
    });
});

// Custom Smooth Scroll Function
function smoothScrollTo(target, offset = 0, duration = 800) {
    const start = window.pageYOffset; // Starting position
    const end = target.getBoundingClientRect().top + start - offset; // Target position
    const distance = end - start; // Total distance to scroll
    const startTime = performance.now(); // Start time

    // Easing Function (ease-in-out)
    const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Animation Loop
    function animationLoop(currentTime) {
        const elapsed = currentTime - startTime; // Elapsed time
        const progress = Math.min(elapsed / duration, 1); // Ensure progress does not exceed 1
        const ease = easeInOutQuad(progress); // Apply easing
        window.scrollTo(0, start + distance * ease); // Scroll position

        if (elapsed < duration) {
            requestAnimationFrame(animationLoop); // Continue animation
        }
    }

    requestAnimationFrame(animationLoop); // Start the animation loop
}
