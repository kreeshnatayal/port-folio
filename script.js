document.addEventListener('DOMContentLoaded', function() {
    const bootScreen = document.getElementById('boot-screen');
    const mainArchive = document.getElementById('main-archive');
    
    // Handle Enter key to boot the system
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !bootScreen.classList.contains('hidden')) {
            bootScreen.classList.add('hidden');
            mainArchive.classList.remove('hidden');
            
            // Add a slight delay for cinematic effect
            setTimeout(() => {
                mainArchive.style.opacity = '1';
            }, 100);
        }
    });
    
    // Add glitch effect on hover for navigation links
    const navLinks = document.querySelectorAll('.archive-nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('glitch');
        });
        link.addEventListener('mouseleave', () => {
            link.classList.remove('glitch');
        });
    });
    
    // Add glitch effect on hover for case files
    const caseFiles = document.querySelectorAll('.case-file');
    caseFiles.forEach(file => {
        file.addEventListener('mouseenter', () => {
            file.classList.add('glitch');
        });
        file.addEventListener('mouseleave', () => {
            file.classList.remove('glitch');
        });
    });
    
    // Add glitch effect on hover for capability items
    const caps = document.querySelectorAll('.cap');
    caps.forEach(cap => {
        cap.addEventListener('mouseenter', () => {
            cap.classList.add('glitch');
        });
        cap.addEventListener('mouseleave', () => {
            cap.classList.remove('glitch');
        });
    });
    
    // Add occasional static flicker for immersion
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance
            const staticOverlay = document.createElement('div');
            staticOverlay.className = 'static-noise';
            staticOverlay.style.position = 'fixed';
            staticOverlay.style.top = '0';
            staticOverlay.style.left = '0';
            staticOverlay.style.width = '100%';
            staticOverlay.style.height = '100%';
            staticOverlay.style.pointerEvents = 'none';
            staticOverlay.style.zIndex = '1000';
            document.body.appendChild(staticOverlay);
            
            setTimeout(() => {
                staticOverlay.remove();
            }, 100 + Math.random() * 200); // Random duration between 100-300ms
        }
    }, 5000); // Check every 5 seconds
    
    // Add scanline animation to archive sections
    const sections = document.querySelectorAll('.archive-section');
    sections.forEach(section => {
        section.classList.add('scanline-animation');
    });
    
    // Add subtle movement to background elements for unease
    setInterval(() => {
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 2;
        document.body.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    }, 3000);
    
    // Initialize the main archive with opacity transition
    mainArchive.style.opacity = '0';
    setTimeout(() => {
        mainArchive.style.transition = 'opacity 1s ease';
        mainArchive.style.opacity = '1';
    }, 500);
});