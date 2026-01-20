window.onload = function() {
    // Logo toggle functionality
    const logo = document.getElementById('logo');
    let isFirstLogo = true;

    if (logo) {
        logo.addEventListener('click', () => {
            if (isFirstLogo) {
                logo.src = "images/sxtp_logo_2.png";
            } else {
                logo.src = "images/sxtp_logo_1.png";
            }
            isFirstLogo = !isFirstLogo;
        });
    }

    // Live timestamp
    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeString = `🕰 ${year}-${month}-${day} || ${hours}:${minutes}:${seconds}`;
        
        const timeElement = document.getElementById('live-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // Navigation links with simple alerts (replace with actual navigation later)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            console.log(`Navegando a: ${section}`);
            // You can implement actual page navigation or section scrolling here
        });
    });

    // Button interactions
    const buttons = document.querySelectorAll('.retro-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent;
            console.log(`Botón clickeado: ${text}`);
            // Add actual functionality for each button
        });
    });

    // Control icons interaction
    const controlIcons = document.querySelectorAll('.control-icon');
    controlIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const text = this.textContent;
            console.log(`Control clickeado: ${text}`);
        });
    });

    // Easter egg: Random color changes on certain elements
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        let clickCount = 0;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];
        
        heroTitle.addEventListener('click', function() {
            clickCount++;
            this.style.color = colors[clickCount % colors.length];
        });
    }

    // ===== DRAGGABLE BLOCKS FUNCTIONALITY (Mouse-based for cross-browser compatibility) =====
    const draggableBlocks = document.querySelectorAll('.draggable-block');
    
    draggableBlocks.forEach(block => {
        let isDragging = false;
        let startX, startY;
        let initialX, initialY;
        let currentX = 0, currentY = 0;
        let originalRect = null;

        // Mouse events
        block.addEventListener('mousedown', function(e) {
            // Prevent default to avoid text selection
            e.preventDefault();
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            // Get the current position
            const rect = this.getBoundingClientRect();
            originalRect = {
                top: rect.top,
                left: rect.left
            };
            
            initialX = currentX;
            initialY = currentY;
            
            this.classList.add('dragging');
            this.style.zIndex = '1000';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            currentX = initialX + deltaX;
            currentY = initialY + deltaY;
            
            block.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            
            isDragging = false;
            block.classList.remove('dragging');
            block.classList.add('returning');
            
            // Return to original position
            block.style.transform = 'translate(0, 0)';
            currentX = 0;
            currentY = 0;
            
            // Remove returning class after animation
            setTimeout(() => {
                block.classList.remove('returning');
                block.style.zIndex = '';
            }, 600);
        });

        // Touch events for mobile
        block.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            isDragging = true;
            startX = touch.clientX;
            startY = touch.clientY;
            
            const rect = this.getBoundingClientRect();
            originalRect = {
                top: rect.top,
                left: rect.left
            };
            
            initialX = currentX;
            initialY = currentY;
            
            this.classList.add('dragging');
            this.style.zIndex = '1000';
        });

        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            currentX = initialX + deltaX;
            currentY = initialY + deltaY;
            
            block.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }, { passive: false });

        document.addEventListener('touchend', function() {
            if (!isDragging) return;
            
            isDragging = false;
            block.classList.remove('dragging');
            block.classList.add('returning');
            
            // Return to original position
            block.style.transform = 'translate(0, 0)';
            currentX = 0;
            currentY = 0;
            
            setTimeout(() => {
                block.classList.remove('returning');
                block.style.zIndex = '';
            }, 600);
        });
    });
}
