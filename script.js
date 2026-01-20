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

// PDF Export Functionality
const exportPdfBtn = document.getElementById('exportPdfBtn');
if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if html2pdf is loaded
        if (typeof html2pdf === 'undefined') {
            alert('PDF library is still loading. Please try again in a moment.');
            return;
        }
        
        const element = document.getElementById('resume-content');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Temporarily switch to light mode for PDF
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
        }
        
        // Show URL only during PDF generation
        const pdfOnlyElements = document.querySelectorAll('.pdf-only');
        pdfOnlyElements.forEach(el => {
            el.style.display = 'block';
        });
        
        // Show PDF header
        const pdfHeader = document.querySelector('.pdf-header');
        if (pdfHeader) {
            pdfHeader.style.display = 'block';
        }
        
        // Hide Home Lab section for PDF
        const homelabSection = document.getElementById('homelab');
        let homelabDisplay = '';
        
        if (homelabSection) {
            homelabDisplay = homelabSection.style.display;
            homelabSection.style.display = 'none';
        }
        
        const opt = {
            margin: 0.5,
            filename: 'Dimitar_Porkov_Portfolio.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait'
            }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(element).save().then(() => {
            // Hide URL again after PDF generation
            pdfOnlyElements.forEach(el => {
                el.style.display = 'none';
            });
            
            // Hide PDF header again
            if (pdfHeader) {
                pdfHeader.style.display = 'none';
            }
            
            // Show Home Lab section again
            if (homelabSection) {
                homelabSection.style.display = homelabDisplay;
            }
            
            // Restore dark mode if it was enabled
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            }
        }).catch(err => {
            console.error('PDF generation error:', err);
            alert('Error generating PDF. Please try again.');
            
            // Restore state on error
            pdfOnlyElements.forEach(el => {
                el.style.display = 'none';
            });
            if (pdfHeader) {
                pdfHeader.style.display = 'none';
            }
            if (homelabSection) {
                homelabSection.style.display = homelabDisplay;
            }
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            }
        });
    });
}