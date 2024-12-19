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