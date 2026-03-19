window.onload = function() {
    // Random Glitch Effects
    function createGlitch() {
        const glitchColors = [
            '#ff00ff', '#00ffff', '#ff0000', '#00ff00', 
            '#ffff00', '#0000ff', '#ffffff', '#000000'
        ];
        
        // Create 3-8 random glitch squares
        const glitchCount = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < glitchCount; i++) {
            const glitch = document.createElement('div');
            glitch.className = 'glitch-square';
            
            // Random size between 10px and 80px
            const size = Math.floor(Math.random() * 70) + 10;
            glitch.style.width = size + 'px';
            glitch.style.height = size + 'px';
            
            // Random position
            glitch.style.left = Math.random() * 100 + '%';
            glitch.style.top = Math.random() * 100 + '%';
            
            // Random color
            glitch.style.backgroundColor = glitchColors[Math.floor(Math.random() * glitchColors.length)];
            
            // Random opacity
            glitch.style.opacity = Math.random() * 0.5 + 0.5;
            
            document.body.appendChild(glitch);
            
            // Remove after animation
            setTimeout(() => {
                glitch.remove();
            }, 300);
        }
    }
    
    // Trigger glitches randomly every 3-8 seconds
    function scheduleNextGlitch() {
        const delay = Math.floor(Math.random() * 5000) + 3000; // 3-8 seconds
        setTimeout(() => {
            createGlitch();
            scheduleNextGlitch();
        }, delay);
    }
    
    // Start glitch effects
    scheduleNextGlitch();

    // Visit Counter functionality
    const counterValue = document.getElementById('counter-value');
    const counterEndpoint = 'https://api.counterapi.dev/v2/lucass-team-1-2580/first-counter-2580/up';
    
    if (counterValue) {
        // Fetch and increment counter
        fetch(counterEndpoint)
            .then(response => response.json())
            .then(data => {
                console.log('Counter data:', data);
                if (data.data && data.data.up_count !== undefined) {
                    // Format the number with leading zeros (5 digits)
                    const formattedCount = String(data.data.up_count).padStart(5, '0');
                    counterValue.textContent = formattedCount;
                } else {
                    counterValue.textContent = '00000';
                }
            })
            .catch(error => {
                console.error('Error fetching counter:', error);
                counterValue.textContent = '00000';
            });
    }

    // Sidebar video cycling functionality
    const sidebarVideo = document.querySelector('.sidebar-img');
    const videoOverlay = document.querySelector('.video-overlay');
    const videos = [
        'images/vids-gifs/camara-3.mp4',
        'images/vids-gifs/camara-4.mp4',
        'images/vids-gifs/camara-5.mp4',
        'images/vids-gifs/camara-7.mp4'
    ];
    
    let currentVideoIndex = Math.floor(Math.random() * videos.length);
    
    // Function to cycle to next video
    const cycleVideo = () => {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        sidebarVideo.src = videos[currentVideoIndex];
        sidebarVideo.play();
    };
    
    if (sidebarVideo) {
        // Set initial random video
        sidebarVideo.src = videos[currentVideoIndex];
        
        // Add click listener to video
        sidebarVideo.addEventListener('click', cycleVideo);
        
        // Add hover cursor style
        sidebarVideo.style.cursor = 'pointer';
    }
    
    if (videoOverlay) {
        // Add click listener to overlay button
        videoOverlay.addEventListener('click', cycleVideo);
        
        // Add hover cursor style
        videoOverlay.style.cursor = 'pointer';
    }

    // Logo shuffle functionality
    const logo = document.getElementById('logo');

    if (logo) {
        logo.addEventListener('click', () => {
            // Get current text
            const currentText = logo.textContent;
            // Convert to array and shuffle
            const chars = currentText.split('');
            
            // Fisher-Yates shuffle algorithm
            for (let i = chars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [chars[i], chars[j]] = [chars[j], chars[i]];
            }
            
            // Set shuffled text
            logo.textContent = chars.join('');
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

    // Share button functionality
    const shareButton = document.querySelector('.cyan-btn');
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            // Check if mobile (screen width < 900px)
            const isMobile = window.innerWidth < 900;
            
            if (isMobile && navigator.share) {
                // Use native share on mobile
                try {
                    await navigator.share({
                        title: 'sxtp - Official Site',
                        text: 'poderoso dolor humano',
                        url: window.location.href
                    });
                } catch (err) {
                    // User cancelled or error occurred
                    if (err.name !== 'AbortError') {
                        console.log('Error sharing:', err);
                    }
                }
            } else {
                // Desktop: copy to clipboard and show popup
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    createSharePopup();
                } catch (err) {
                    console.log('Error copying to clipboard:', err);
                    createSharePopup(); // Show popup anyway
                }
            }
        });
    }

    function createSharePopup() {
        const popup = document.createElement('div');
        popup.className = 'popup-window';
        
        // Check if mobile
        const isMobile = window.innerWidth < 900;
        
        // Position popup
        const baseX = isMobile ? 50 : 300;
        const baseY = isMobile ? 150 : 200;
        popup.style.left = baseX + 'px';
        popup.style.top = baseY + 'px';

        popup.innerHTML = `
            <div class="popup-titlebar">
                <div class="popup-title">COMPARTIR</div>
                <div class="popup-close">X</div>
            </div>
            <div class="popup-content" style="padding: 20px; text-align: center;">
                <p style="color: #00ff00; font-size: 16px; font-weight: bold;">LINK COPIADO!</p>
            </div>
        `;

        document.body.appendChild(popup);

        // Make draggable
        const titlebar = popup.querySelector('.popup-titlebar');
        let isDragging = false;
        let currentX = baseX;
        let currentY = baseY;
        let initialX, initialY;
        let xOffset = baseX;
        let yOffset = baseY;

        // Mouse events for desktop
        titlebar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Touch events for mobile
        titlebar.addEventListener('touchstart', touchStart, { passive: false });
        document.addEventListener('touchmove', touchDrag, { passive: false });
        document.addEventListener('touchend', touchEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titlebar || e.target.classList.contains('popup-title')) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                popup.style.left = currentX + 'px';
                popup.style.top = currentY + 'px';
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function touchStart(e) {
            if (e.target === titlebar || e.target.classList.contains('popup-title')) {
                const touch = e.touches[0];
                initialX = touch.clientX - xOffset;
                initialY = touch.clientY - yOffset;
                isDragging = true;
                e.preventDefault();
            }
        }

        function touchDrag(e) {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                popup.style.left = currentX + 'px';
                popup.style.top = currentY + 'px';
            }
        }

        function touchEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // Close button
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });

        // Bring to front on click
        popup.addEventListener('mousedown', () => {
            const allPopups = document.querySelectorAll('.popup-window');
            allPopups.forEach(p => p.style.zIndex = '10000');
            popup.style.zIndex = '10001';
        });
    }

    // DESCARGAR button - Create download pop-up
    const descargarButton = document.querySelector('.orange-btn');
    if (descargarButton) {
        descargarButton.addEventListener('click', () => {
            createDownloadPopup();
        });
    }

    function createDownloadPopup() {
        const popup = document.createElement('div');
        popup.className = 'popup-window';
        
        // Check if mobile
        const isMobile = window.innerWidth < 900;
        
        // Position popup
        const baseX = isMobile ? 50 : 200;
        const baseY = isMobile ? 100 : 150;
        popup.style.left = baseX + 'px';
        popup.style.top = baseY + 'px';

        popup.innerHTML = `
            <div class="popup-titlebar">
                <div class="popup-title">DEMOS</div>
                <div class="popup-close">X</div>
            </div>
            <div class="popup-content">
                <div class="popup-buttons">
                    <a href="audio/sexo-debil.mp3" download class="popup-btn" style="background: #ff6600">demo_1</a>
                    <a href="audio/sexo-debil.mp3" download class="popup-btn" style="background: #ff6600">demo_2</a>
                    <a href="audio/sexo-debil.mp3" download class="popup-btn" style="background: #ff6600">demo_3</a>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Make draggable
        const titlebar = popup.querySelector('.popup-titlebar');
        let isDragging = false;
        let currentX = baseX;
        let currentY = baseY;
        let initialX, initialY;
        let xOffset = baseX;
        let yOffset = baseY;

        // Mouse events for desktop
        titlebar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Touch events for mobile
        titlebar.addEventListener('touchstart', touchStart, { passive: false });
        document.addEventListener('touchmove', touchDrag, { passive: false });
        document.addEventListener('touchend', touchEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titlebar || e.target.classList.contains('popup-title')) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                popup.style.left = currentX + 'px';
                popup.style.top = currentY + 'px';
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function touchStart(e) {
            if (e.target === titlebar || e.target.classList.contains('popup-title')) {
                const touch = e.touches[0];
                initialX = touch.clientX - xOffset;
                initialY = touch.clientY - yOffset;
                isDragging = true;
                e.preventDefault();
            }
        }

        function touchDrag(e) {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                popup.style.left = currentX + 'px';
                popup.style.top = currentY + 'px';
            }
        }

        function touchEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // Close button
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });

        // Bring to front on click
        popup.addEventListener('mousedown', () => {
            const allPopups = document.querySelectorAll('.popup-window');
            allPopups.forEach(p => p.style.zIndex = '10000');
            popup.style.zIndex = '10001';
        });
    }

    // ESCUCHAR button - Create pop-up windows
    const escucharButton = document.querySelector('.pink-btn');
    if (escucharButton) {
        escucharButton.addEventListener('click', () => {
            createPopups();
        });
    }

    function createPopups() {
        const popupData = [
            { 
                title: 'Ruidos de la Humanidad', 
                color: '#ff00ff',
                spotifyLink: 'https://open.spotify.com/album/76TGAKQaOBouIo1JsD1yzI?si=To0boAUzQu-MAMf7IIO_FA',
                appleMusicLink: 'https://music.apple.com/album/YOUR_ALBUM_ID_1'
            },
            { 
                title: 'Alter Ego', 
                color: '#00ffff',
                spotifyLink: 'https://open.spotify.com/album/0XAaFU3DbefXcGVPma9s6B?si=i_lDAq6VS4mXOcZzJBCpfg',
                appleMusicLink: 'https://music.apple.com/es/album/alter-ego/1795668610'
            },
            { 
                title: 'Casa Tomada', 
                color: '#ff1493',
                spotifyLink: 'https://open.spotify.com/album/37pGzPZjupVqyyOCDVgy3L?si=NcCQ9pYHTkSHBRYGeKnOfg',
                appleMusicLink: 'https://music.apple.com/es/album/casa-tomada-ep/1704255838'
            },
            { 
                title: 'Fuego Amigo', 
                color: '#ffff00',
                spotifyLink: 'https://open.spotify.com/album/6Oibkx9hcil55damCZohBz?si=NMNFlVNuSyC_qHReYWA1dg',
                appleMusicLink: 'https://music.apple.com/es/album/fuego-amigo/1755710029'
            }
        ];

        const images = [
            'images/sxtp-imgs/ruidos-de-la-humanidad.jpg',
            'images/sxtp-imgs/alter-ego.jpg',
            'images/sxtp-imgs/casa-tomada.jpg',
            'images/sxtp-imgs/9.jpg'
        ];

        popupData.forEach((data, index) => {
            setTimeout(() => {
                createPopup(data, images[index], index);
            }, index * 150); // Stagger creation
        });
    }

    function createPopup(data, imageSrc, index) {
        const popup = document.createElement('div');
        popup.className = 'popup-window';
        
        // Check if mobile
        const isMobile = window.innerWidth < 900;
        
        // Calculate position with overlap
        // On mobile: position at left side of screen, on desktop: center-left area
        const baseX = isMobile ? 10 + (index * 20) : 100 + (index * 30);
        const baseY = isMobile ? 50 + (index * 40) : 100 + (index * 30);
        popup.style.left = baseX + 'px';
        popup.style.top = baseY + 'px';

        popup.innerHTML = `
            <div class="popup-titlebar">
                <div class="popup-title">${data.title}</div>
                <div class="popup-close">X</div>
            </div>
            <div class="popup-content">
                <img src="${imageSrc}" alt="popup image">
                <div class="popup-buttons">
                    <a href="${data.spotifyLink}" target="_blank" class="popup-btn" style="background: ${data.color}">spotify</a>
                    <a href="${data.appleMusicLink}" target="_blank" class="popup-btn" style="background: ${data.color}">music</a>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Make draggable
        const titlebar = popup.querySelector('.popup-titlebar');
        let isDragging = false;
        let currentX = baseX;
        let currentY = baseY;
        let initialX, initialY;
        let xOffset = baseX;
        let yOffset = baseY;

        // Mouse events for desktop
        titlebar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Touch events for mobile
        titlebar.addEventListener('touchstart', touchStart, { passive: false });
        document.addEventListener('touchmove', touchDrag, { passive: false });
        document.addEventListener('touchend', touchEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titlebar || e.target.classList.contains('popup-title')) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                popup.style.left = currentX + 'px';
                popup.style.top = currentY + 'px';
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // Touch event handlers
        function touchStart(e) {
            if (e.target === titlebar || e.target.classList.contains('popup-title')) {
                const touch = e.touches[0];
                initialX = touch.clientX - xOffset;
                initialY = touch.clientY - yOffset;
                isDragging = true;
                e.preventDefault();
            }
        }

        function touchDrag(e) {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                popup.style.left = currentX + 'px';
                popup.style.top = currentY + 'px';
            }
        }

        function touchEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // Close button
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });

        // Bring to front on click
        popup.addEventListener('mousedown', () => {
            const allPopups = document.querySelectorAll('.popup-window');
            allPopups.forEach(p => p.style.zIndex = '10000');
            popup.style.zIndex = '10001';
        });
    }

    // Audio player functionality
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.querySelector('.play-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDisplay = document.getElementById('volume-display');
    const volumeControl = document.querySelector('.volume-control');
    
    if (audioPlayer && playButton) {
        // Set volume to 60%
        audioPlayer.volume = 0.6;
        
        // Volume slider control
        if (volumeSlider && volumeDisplay) {
            volumeSlider.addEventListener('input', function() {
                const volume = this.value / 100;
                audioPlayer.volume = volume;
                volumeDisplay.textContent = this.value + '%';
            });
        }
        
        playButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent default nav-link behavior
            
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.textContent = 'pause';
                // Show volume control when playing (only on desktop via CSS)
                if (volumeControl) {
                    volumeControl.classList.add('visible');
                }
            } else {
                audioPlayer.pause();
                playButton.textContent = 'play!';
                // Hide volume control when paused
                if (volumeControl) {
                    volumeControl.classList.remove('visible');
                }
            }
        });
        
        // Reset button text and hide volume control when audio ends
        audioPlayer.addEventListener('ended', function() {
            playButton.textContent = 'play!';
            if (volumeControl) {
                volumeControl.classList.remove('visible');
            }
        });
    }

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
    
    // Check if device is mobile (screen width < 900px for desktop breakpoint)
    const isMobile = () => window.innerWidth < 900;
    
    draggableBlocks.forEach(block => {
        let isDragging = false;
        let startX, startY;
        let initialX, initialY;
        let currentX = 0, currentY = 0;
        let originalRect = null;

        // Mouse events - only on desktop
        block.addEventListener('mousedown', function(e) {
            // Disable dragging on mobile
            if (isMobile()) return;
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

        // Touch events for mobile - disabled for dragging (click-to-expand still works)
        block.addEventListener('touchstart', function(e) {
            // Disable dragging on mobile, but allow click-to-expand
            return;
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
            // Disabled for mobile
            return;
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
            // Disabled for mobile
            return;
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

    // ===== FISH GAME — Flappy Bird style =====
    function initFishGame() {
        const canvas = document.getElementById('fish-game-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // — Constants —
        const OBS_W    = 32;    // obstacle column width
        const GRAVITY  = 0.52;  // gravity per frame
        const FLAP_V   = -10.0; // upward velocity on flap
        const MAX_VY   = 14;    // terminal fall speed

        // — State —
        let gameRunning = false;
        let isDead      = false;
        let deathTimer  = 0;
        let score       = 0;
        let speed       = 2.5;
        let obsTimer    = 0;
        let obsInterval = 140;  // frames between obstacle pairs

        const fish = { x: 80, y: 0, vy: 0, w: 44, h: 26 };
        let obstacles  = [];

        // — Canvas sizing —
        function resize() {
            const box = canvas.parentElement;
            canvas.width  = box.offsetWidth;
            canvas.height = box.offsetHeight || 180;
        }
        resize();
        window.addEventListener('resize', function() {
            resize();
            if (!gameRunning && !isDead) resetFish();
        });

        // Gap size scales with canvas height
        function gapSize() { return Math.max(80, canvas.height * 0.40); }

        function resetFish() {
            fish.y  = canvas.height / 2 - fish.h / 2;
            fish.vy = 0;
        }
        resetFish();

        function spawnObstacle() {
            const gs  = gapSize();
            const min = gs / 2 + 20;
            const max = canvas.height - gs / 2 - 20;
            obstacles.push({
                x:      canvas.width + 10,
                cy:     min + Math.random() * (max - min),
                passed: false
            });
        }

        // — Flap (works ANY time during play) —
        function flap() {
            if (isDead) return;
            if (!gameRunning) { startGame(); return; }
            fish.vy = FLAP_V;
        }

        function startGame() {
            gameRunning = true;
            isDead      = false;
            score       = 0;
            speed       = 2.5;
            obsTimer    = 80;   // start close to first spawn so obstacles appear quickly
            obsInterval = 100;  // interval between subsequent pairs
            obstacles   = [];
            resetFish();
        }

        // — Draw fish (tilts with velocity) —
        function drawFish(dead) {
    const stops = [
        [255,0,200],[0,230,255],[200,255,0],[255,200,0],[120,0,255],[255,0,200]
    ];
    function iridColor(phase, alpha=1){
        const n = stops.length-1;
        const pos = ((phase % n) + n) % n;
        const i = Math.floor(pos), f = pos - i;
        const a = stops[i], b = stops[(i+1) % stops.length];
        const r = Math.round(a[0]+(b[0]-a[0])*f);
        const g = Math.round(a[1]+(b[1]-a[1])*f);
        const bl= Math.round(a[2]+(b[2]-a[2])*f);
        if(dead) return `rgba(100,100,110,${alpha})`;
        return `rgba(${r},${g},${bl},${alpha})`;
    }

    // t viene del scope de initFishGame — si no existe, crealo arriba del gameLoop
    const base = (typeof gameT !== 'undefined' ? gameT : 0) * 0.35;
    const { x, y, w, h } = fish;
    const cx = x + w/2, cy = y + h/2;

    ctx.save();

    // Tilt por velocidad
    if(!dead){
        const tilt = Math.max(-0.45, Math.min(0.45, fish.vy * 0.055));
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.translate(-cx, -cy);
    }

    ctx.translate(cx, cy);

    const tw = Math.sin((typeof gameT !== 'undefined' ? gameT : 0) * 3) * 4;

    // Cola — lóbulo superior
    ctx.beginPath();
    ctx.moveTo(-w*0.45, 0);
    ctx.bezierCurveTo(-w*0.6,-3+tw,-w*0.85,-h*0.55+tw,-w*0.8,-h*0.22+tw);
    ctx.bezierCurveTo(-w*0.75,0,-w*0.55,0,-w*0.45,0);
    const tg1 = ctx.createLinearGradient(-w*0.85,-h*0.55,-w*0.45,0);
    tg1.addColorStop(0, iridColor(base+2.5, dead?0.3:0.4));
    tg1.addColorStop(1, iridColor(base+2.5, dead?0.6:0.9));
    ctx.fillStyle = tg1; ctx.fill();
    ctx.strokeStyle = iridColor(base+2.8, 0.5); ctx.lineWidth=0.8; ctx.stroke();

    // Cola — lóbulo inferior
    ctx.beginPath();
    ctx.moveTo(-w*0.45, 0);
    ctx.bezierCurveTo(-w*0.6,3-tw,-w*0.85,h*0.55-tw,-w*0.8,h*0.22-tw);
    ctx.bezierCurveTo(-w*0.75,0,-w*0.55,0,-w*0.45,0);
    const tg2 = ctx.createLinearGradient(-w*0.85,h*0.55,-w*0.45,0);
    tg2.addColorStop(0, iridColor(base+1.8, dead?0.3:0.4));
    tg2.addColorStop(1, iridColor(base+1.8, dead?0.6:0.9));
    ctx.fillStyle = tg2; ctx.fill();
    ctx.strokeStyle = iridColor(base+2.0, 0.5); ctx.lineWidth=0.8; ctx.stroke();

    // Cuerpo
    if(!dead){ ctx.shadowBlur=8; ctx.shadowColor=iridColor(base,0.3); }
    ctx.beginPath();
    ctx.ellipse(0, 0, w*0.5, h*0.5, 0, 0, Math.PI*2);
    const bodyGrad = ctx.createLinearGradient(-w*0.5,-h*0.5,w*0.5,h*0.5);
    bodyGrad.addColorStop(0,   iridColor(base+0,   0.95));
    bodyGrad.addColorStop(0.35,iridColor(base+0.9, 0.85));
    bodyGrad.addColorStop(0.7, iridColor(base+1.7, 0.90));
    bodyGrad.addColorStop(1,   iridColor(base+2.5, 0.80));
    ctx.fillStyle = bodyGrad; ctx.fill();
    ctx.strokeStyle = iridColor(base+1, 0.85); ctx.lineWidth=1.2; ctx.stroke();
    ctx.shadowBlur=0;

    // Highlight especular
    ctx.beginPath();
    ctx.ellipse(-w*0.05,-h*0.18,w*0.28,h*0.15,-0.1,0,Math.PI*2);
    const hilite=ctx.createLinearGradient(-w*0.3,-h*0.3,w*0.2,0);
    hilite.addColorStop(0,'rgba(255,255,255,0)');
    hilite.addColorStop(0.4,'rgba(255,255,255,0.5)');
    hilite.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hilite; ctx.fill();

    // Escamas
    const scaleRows=[
        {oy:-0.12,oxs:[-0.32,-0.16,0,0.16],r:h*0.28},
        {oy: 0.06,oxs:[-0.24,-0.08,0.08,0.22],r:h*0.26},
        {oy: 0.22,oxs:[-0.18,-0.04,0.1],r:h*0.22},
    ];
    scaleRows.forEach((row,ri)=>{
        row.oxs.forEach((ox,si)=>{
            const ph=base+ri*0.7+si*0.45;
            ctx.beginPath();
            ctx.arc(ox*w, row.oy*h, row.r, Math.PI*1.05, Math.PI*0.05, true);
            ctx.strokeStyle=iridColor(ph,0.5); ctx.lineWidth=0.7; ctx.stroke();
        });
    });

    // Aleta dorsal
    ctx.beginPath();
    ctx.moveTo(-w*0.15,-h*0.5);
    ctx.bezierCurveTo(-w*0.05,-h*1.0,w*0.15,-h*1.1,w*0.35,-h*0.5);
    ctx.strokeStyle=iridColor(base+1.5,0.7); ctx.lineWidth=0.9; ctx.stroke();
    for(let i=0;i<4;i++){
        const f2=i/3;
        const fx=(-0.15+f2*0.5)*w;
        const fy=(-0.5-Math.sin(f2*Math.PI)*0.6)*h;
        ctx.beginPath();
        ctx.moveTo(fx,-h*0.5); ctx.lineTo(fx, fy);
        ctx.strokeStyle=iridColor(base+i*0.4,0.25); ctx.lineWidth=0.5; ctx.stroke();
    }

    // Aleta pectoral
    ctx.beginPath();
    ctx.moveTo(w*0.05,h*0.25);
    ctx.bezierCurveTo(w*0.22,h*0.6,w*0.38,h*0.55,w*0.35,h*0.25);
    ctx.strokeStyle=iridColor(base+2.2,0.6); ctx.lineWidth=0.8; ctx.stroke();

    // Cabeza
    ctx.beginPath();
    ctx.moveTo(w*0.42,-h*0.32);
    ctx.bezierCurveTo(w*0.62,-h*0.1,w*0.65,h*0.1,w*0.42,h*0.32);
    ctx.strokeStyle=iridColor(base+0.8,0.75); ctx.lineWidth=1; ctx.stroke();

    // Ojo
    ctx.shadowBlur=5; ctx.shadowColor=iridColor(base+0.5,0.5);
    ctx.beginPath(); ctx.arc(w*0.35,-h*0.06,h*0.22,0,Math.PI*2);
    const eyeGrad=ctx.createRadialGradient(w*0.33,-h*0.1,0.5,w*0.35,-h*0.06,h*0.22);
    eyeGrad.addColorStop(0,  iridColor(base+1,  0.95));
    eyeGrad.addColorStop(0.6,iridColor(base+2.5,0.7));
    eyeGrad.addColorStop(1,  'rgba(0,0,0,0.85)');
    ctx.fillStyle=eyeGrad; ctx.fill();
    ctx.strokeStyle=iridColor(base,0.8); ctx.lineWidth=0.7; ctx.stroke();
    ctx.shadowBlur=0;
    // Pupila
    ctx.beginPath(); ctx.arc(w*0.36,-h*0.06,h*0.1,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.9)'; ctx.fill();
    // Brillos
    ctx.beginPath(); ctx.arc(w*0.33,-h*0.12,h*0.07,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill();
    ctx.beginPath(); ctx.arc(w*0.38,-h*0.02,h*0.04,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fill();

    // X en los ojos si muerto
    if(dead){
        ctx.strokeStyle='rgba(255,80,80,0.9)'; ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(w*0.28,-h*0.18); ctx.lineTo(w*0.43,h*0.06);
        ctx.moveTo(w*0.43,-h*0.18); ctx.lineTo(w*0.28,h*0.06);
        ctx.stroke();
    }

    ctx.restore();
}

        // — Draw one hook (top or bottom) —
        // tipY = the dangerous end closest to the gap
        function drawHookShape(cx, tipY, fromTop) {
            ctx.save();
            const wallY     = fromTop ? 0 : canvas.height;
            const shaftBase = tipY + (fromTop ? -40 : 40);

            // Fishing line from wall
            ctx.strokeStyle = 'rgba(210,210,210,0.7)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, wallY); ctx.lineTo(cx, shaftBase); ctx.stroke();

            // Shaft + J-bend
            ctx.strokeStyle = '#c8c8c8'; ctx.lineWidth = 5;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx, shaftBase);
            ctx.lineTo(cx, tipY);
            if (fromTop) {
                // J curves right then the point aims back up
                ctx.quadraticCurveTo(cx + 24, tipY, cx + 24, tipY - 18);
            } else {
                // Inverted J curves right then point aims back down
                ctx.quadraticCurveTo(cx + 24, tipY, cx + 24, tipY + 18);
            }
            ctx.stroke();

            // Barb
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (fromTop) {
                ctx.moveTo(cx + 24, tipY - 18); ctx.lineTo(cx + 12, tipY - 32);
            } else {
                ctx.moveTo(cx + 24, tipY + 18); ctx.lineTo(cx + 12, tipY + 32);
            }
            ctx.stroke();

            // Metal glint
            ctx.fillStyle = 'rgba(255,255,255,0.88)';
            ctx.beginPath();
            ctx.arc(cx + 1, shaftBase + (fromTop ? 9 : -9), 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        function drawObstacles() {
            const gs = gapSize();
            obstacles.forEach(function(obs) {
                const cx     = obs.x + OBS_W / 2;
                const topTip = obs.cy - gs / 2;   // bottom of top hook
                const botTip = obs.cy + gs / 2;   // top of bottom hook
                drawHookShape(cx, topTip, true);
                drawHookShape(cx, botTip, false);
            });
        }

        // — Collision: fish hitbox vs obstacle gap —
        function checkHit(obs) {
            const gs     = gapSize();
            const gapTop = obs.cy - gs / 2;
            const gapBot = obs.cy + gs / 2;
            // Inset hitbox slightly for fairness
            const fx = fish.x + 6,  fy = fish.y + 5;
            const fr = fish.x + fish.w - 9, fb = fish.y + fish.h - 5;
            if (fr <= obs.x || fx >= obs.x + OBS_W) return false;
            return (fy < gapTop || fb > gapBot);
        }

        // — Game loop —
        function gameLoop() {
            resize();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Start screen
            if (!gameRunning && !isDead) {
                ctx.fillStyle = 'rgba(0,0,0,0.68)';
                ctx.textAlign = 'center';
                ctx.font = 'bold ' + Math.min(20, Math.floor(canvas.width / 26)) + 'px "Courier New"';
                ctx.fillText('ESPACIO / TAP PARA JUGAR', canvas.width / 2, canvas.height / 2 - 14);
                ctx.font = 'bold ' + Math.min(15, Math.floor(canvas.width / 36)) + 'px "Courier New"';
                ctx.fillText('esquivá los anzuelos', canvas.width / 2, canvas.height / 2 + 14);
                drawFish(false);
                requestAnimationFrame(gameLoop);
                return;
            }

            // Death screen
            if (isDead) {
                deathTimer++;
                drawObstacles();
                drawFish(true);
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.textAlign = 'center';
                ctx.font = 'bold ' + Math.min(22, Math.floor(canvas.width / 22)) + 'px "Courier New"';
                ctx.fillText('ATRAPADO!  score: ' + score, canvas.width / 2, canvas.height / 2 - 10);
                ctx.font = 'bold ' + Math.min(15, Math.floor(canvas.width / 36)) + 'px "Courier New"';
                ctx.fillText('tap / espacio para volver', canvas.width / 2, canvas.height / 2 + 16);
                if (deathTimer > 80) { isDead = false; resetFish(); }
                requestAnimationFrame(gameLoop);
                return;
            }

            // — Physics —
            fish.vy = Math.min(fish.vy + GRAVITY, MAX_VY);
            fish.y += fish.vy;

            // Wall collision → die
            if (fish.y <= 0 || fish.y + fish.h >= canvas.height) {
                isDead = true; deathTimer = 0; gameRunning = false;
                requestAnimationFrame(gameLoop);
                return;
            }

            // — Obstacles —
            obsTimer++;
            if (obsTimer >= obsInterval) {
                spawnObstacle();
                obsTimer    = 0;
                obsInterval = Math.max(72, obsInterval - 2);
            }

            let killed = false;
            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].x -= speed;
                // Score when fish passes the obstacle
                if (!obstacles[i].passed && obstacles[i].x + OBS_W < fish.x) {
                    obstacles[i].passed = true;
                    score++;
                    // Speed up every 5 points
                    if (score % 5 === 0) speed = Math.min(speed + 0.55, 9);
                }
                if (obstacles[i].x + OBS_W < -40) { obstacles.splice(i, 1); continue; }
                if (checkHit(obstacles[i])) killed = true;
            }

            if (killed) {
                isDead = true; deathTimer = 0; gameRunning = false;
                requestAnimationFrame(gameLoop);
                return;
            }

            drawObstacles();
            drawFish(false);

            // Score display
            ctx.fillStyle = 'rgba(0,0,0,0.58)';
            ctx.textAlign = 'left';
            ctx.font = 'bold ' + Math.min(18, Math.floor(canvas.width / 30)) + 'px "Courier New"';
            ctx.fillText('score: ' + score, 10, 28);

            requestAnimationFrame(gameLoop);
        }

        // — Input —
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                const tag = document.activeElement ? document.activeElement.tagName : '';
                if (tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
                if (isDead && deathTimer > 30) { isDead = false; resetFish(); return; }
                flap();
            }
        });
        canvas.addEventListener('click', function() {
            if (isDead && deathTimer > 30) { isDead = false; resetFish(); return; }
            flap();
        });
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (isDead && deathTimer > 30) { isDead = false; resetFish(); return; }
            flap();
        }, { passive: false });

        gameLoop();
    }

    initFishGame();

    // ===== FISH CURSOR =====
function initFishCursor() {
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 70;
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999999;display:none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let mx=300, my=300, px=300, py=300, angle=0, targetAngle=0, t=0;

    const stops = [
        [255,0,200],[0,230,255],[200,255,0],[255,200,0],[120,0,255],[255,0,200]
    ];

    function iridColor(phase, alpha=1){
        const n = stops.length-1;
        const pos = ((phase % n) + n) % n;
        const i = Math.floor(pos), f = pos - i;
        const a = stops[i], b = stops[(i+1) % stops.length];
        const r = Math.round(a[0]+(b[0]-a[0])*f);
        const g = Math.round(a[1]+(b[1]-a[1])*f);
        const bl= Math.round(a[2]+(b[2]-a[2])*f);
        return `rgba(${r},${g},${bl},${alpha})`;
    }

    function drawMetallicFish(){
        ctx.clearRect(0, 0, 140, 70);
        ctx.save();
        ctx.translate(58, 35);

        const base = t * 0.35;
        const tw = Math.sin(t * 3) * 5;

        // Cola — lóbulo superior
        ctx.beginPath();
        ctx.moveTo(-26, 0);
        ctx.bezierCurveTo(-36,-4+tw,-52,-14+tw,-50,-6+tw);
        ctx.bezierCurveTo(-48,2,-34,0,-26,0);
        const tg1 = ctx.createLinearGradient(-50,-14,-26,0);
        tg1.addColorStop(0, iridColor(base+2.5, 0.3));
        tg1.addColorStop(1, iridColor(base+2.5, 0.9));
        ctx.fillStyle = tg1;
        ctx.fill();
        ctx.strokeStyle = iridColor(base+2.8, 0.6);
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Cola — lóbulo inferior
        ctx.beginPath();
        ctx.moveTo(-26, 0);
        ctx.bezierCurveTo(-36,4-tw,-52,14-tw,-50,6-tw);
        ctx.bezierCurveTo(-48,-2,-34,0,-26,0);
        const tg2 = ctx.createLinearGradient(-50,14,-26,0);
        tg2.addColorStop(0, iridColor(base+1.8, 0.3));
        tg2.addColorStop(1, iridColor(base+1.8, 0.9));
        ctx.fillStyle = tg2;
        ctx.fill();
        ctx.strokeStyle = iridColor(base+2.0, 0.6);
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Cuerpo — glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = iridColor(base, 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 12, 0, 0, Math.PI*2);
        const bodyGrad = ctx.createLinearGradient(-30,-12,30,12);
        bodyGrad.addColorStop(0,   iridColor(base+0,   0.95));
        bodyGrad.addColorStop(0.3, iridColor(base+0.8, 0.85));
        bodyGrad.addColorStop(0.6, iridColor(base+1.6, 0.90));
        bodyGrad.addColorStop(1,   iridColor(base+2.4, 0.80));
        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.strokeStyle = iridColor(base+1, 0.9);
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Línea lateral
        ctx.beginPath();
        ctx.moveTo(-24, 1);
        ctx.bezierCurveTo(-8,3,8,2,26,0);
        ctx.strokeStyle = iridColor(base+3, 0.35);
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Highlight especular
        ctx.beginPath();
        ctx.ellipse(-2,-4,18,4,-0.1,0,Math.PI*2);
        const hilite = ctx.createLinearGradient(-20,-8,16,0);
        hilite.addColorStop(0,   'rgba(255,255,255,0)');
        hilite.addColorStop(0.4, 'rgba(255,255,255,0.55)');
        hilite.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = hilite;
        ctx.fill();

        // Escamas — 3 filas de arcos
        const scaleRows = [
            { y:-3, xs:[-18,-10,-2,6,14], r:6.5 },
            { y: 2, xs:[-14,-6,2,10,18],  r:6   },
            { y: 7, xs:[-10,-2,6,14],     r:5.5 },
        ];
        scaleRows.forEach((row, ri) => {
            row.xs.forEach((sx, si) => {
                const ph = base + ri*0.7 + si*0.45;
                ctx.beginPath();
                ctx.arc(sx, row.y, row.r, Math.PI*1.05, Math.PI*0.05, true);
                ctx.strokeStyle = iridColor(ph, 0.55);
                ctx.lineWidth = 0.75;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(sx-1, row.y-1, row.r*0.45, Math.PI*1.3, Math.PI*1.85, false);
                ctx.strokeStyle = iridColor(ph+1, 0.3);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        });

        // Aleta dorsal
        ctx.beginPath();
        ctx.moveTo(-8,-12);
        ctx.bezierCurveTo(-2,-24,10,-26,20,-12);
        ctx.strokeStyle = iridColor(base+1.5, 0.75);
        ctx.lineWidth = 0.9;
        ctx.stroke();
        for(let i=0;i<4;i++){
            const f2=i/3;
            const fx=-8+f2*28, fy=-12-Math.sin(f2*Math.PI)*14;
            ctx.beginPath();
            ctx.moveTo(fx,-12);
            ctx.lineTo(fx+(fx+8)*0.05, fy);
            ctx.strokeStyle = iridColor(base+i*0.4, 0.3);
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Aleta pectoral
        ctx.beginPath();
        ctx.moveTo(4,8);
        ctx.bezierCurveTo(12,16,22,14,20,8);
        ctx.strokeStyle = iridColor(base+2.2, 0.6);
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Cabeza
        ctx.beginPath();
        ctx.moveTo(26,-8);
        ctx.bezierCurveTo(36,-3,38,3,26,8);
        ctx.strokeStyle = iridColor(base+0.8, 0.8);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ojo
        ctx.shadowBlur = 6;
        ctx.shadowColor = iridColor(base+0.5, 0.5);
        ctx.beginPath();
        ctx.arc(28,-1,4,0,Math.PI*2);
        const eyeGrad = ctx.createRadialGradient(27,-1.5,0.5,28,-1,4);
        eyeGrad.addColorStop(0,   iridColor(base+1,   0.95));
        eyeGrad.addColorStop(0.6, iridColor(base+2.5, 0.7));
        eyeGrad.addColorStop(1,   'rgba(0,0,0,0.85)');
        ctx.fillStyle = eyeGrad;
        ctx.fill();
        ctx.strokeStyle = iridColor(base, 0.8);
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(28.5,-1,1.8,0,Math.PI*2);
        ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fill();
        ctx.beginPath(); ctx.arc(27.2,-2.2,1.1,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
        ctx.beginPath(); ctx.arc(29.5,-0.5,0.5,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();

        ctx.restore();
    }

    function loop(){
        t += 0.038;
        px += (mx-px) * 0.10;
        py += (my-py) * 0.10;
        const dx=mx-px, dy=my-py;
        if(Math.abs(dx)>0.5 || Math.abs(dy)>0.5) targetAngle = Math.atan2(dy, dx);
        let da = targetAngle - angle;
        while(da >  Math.PI) da -= Math.PI*2;
        while(da < -Math.PI) da += Math.PI*2;
        angle += da * 0.11;
        canvas.style.left  = (px-58) + 'px';
        canvas.style.top   = (py-35) + 'px';
        canvas.style.transform = `rotate(${angle}rad)`;
        drawMetallicFish();
        requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        canvas.style.display = 'block';
    });

    loop();
}

initFishCursor();
}
