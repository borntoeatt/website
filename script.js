// Select the dark mode toggle button
const toggleButton = document.getElementById('darkModeToggle');

// Check and apply saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleButton) {
        toggleButton.textContent = 'Light Mode';
    }
}

// Add click event listener to toggle dark mode
if (toggleButton) {
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
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't prevent default for PDF export button
        if (this.id === 'exportPdfBtn') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 50;
        if (target) {
            smoothScrollTo(target, offset, 1600);
        }
    });
});

// Custom Smooth Scroll Function
function smoothScrollTo(target, offset = 0, duration = 800) {
    const start = window.pageYOffset;
    const end = target.getBoundingClientRect().top + start - offset;
    const distance = end - start;
    const startTime = performance.now();

    const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function animationLoop(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuad(progress);
        window.scrollTo(0, start + distance * ease);

        if (elapsed < duration) {
            requestAnimationFrame(animationLoop);
        }
    }

    requestAnimationFrame(animationLoop);
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
        
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'Dimitar_Porkov_Portfolio.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 1.5,
                useCORS: true,
                logging: false,
                width: 816,
                windowWidth: 816
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(element).save().then(() => {
            // Hide URL again after PDF generation
            pdfOnlyElements.forEach(el => {
                el.style.display = 'none';
            });
            
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
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            }
        });
    });
}
