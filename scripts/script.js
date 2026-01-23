window.onload = function() {
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

    // Sidebar GIF cycling functionality
    const sidebarImg = document.querySelector('.sidebar-img');
    const videoOverlay = document.querySelector('.video-overlay');
    const gifs = [
        'images/vids-gifs/sxtp-gif1.gif',
        'images/vids-gifs/sxtp-gif2.gif',
        'images/vids-gifs/sxtp-gif3.gif'
    ];
    
    let currentGifIndex = Math.floor(Math.random() * gifs.length);
    
    // Function to cycle to next gif
    const cycleGif = () => {
        currentGifIndex = (currentGifIndex + 1) % gifs.length;
        sidebarImg.src = gifs[currentGifIndex];
    };
    
    if (sidebarImg) {
        // Set initial random gif
        sidebarImg.src = gifs[currentGifIndex];
        
        // Add click listener to image
        sidebarImg.addEventListener('click', cycleGif);
        
        // Add hover cursor style
        sidebarImg.style.cursor = 'pointer';
    }
    
    if (videoOverlay) {
        // Add click listener to overlay button
        videoOverlay.addEventListener('click', cycleGif);
        
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
                        title: '$xtp - Official Site',
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

    // MERCHANDISING button - Create coming soon pop-up
    const merchandisingBtn = document.getElementById('merchandising-btn');
    if (merchandisingBtn) {
        merchandisingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            createMerchandisingPopup();
        });
    }

    function createMerchandisingPopup() {
        const popup = document.createElement('div');
        popup.className = 'popup-window';
        
        // Check if mobile
        const isMobile = window.innerWidth < 900;
        
        // Position popup
        const baseX = isMobile ? 50 : 250;
        const baseY = isMobile ? 120 : 180;
        popup.style.left = baseX + 'px';
        popup.style.top = baseY + 'px';

        popup.innerHTML = `
            <div class="popup-titlebar">
                <div class="popup-title">MERCHANDISING</div>
                <div class="popup-close">X</div>
            </div>
            <div class="popup-content" style="padding: 20px; text-align: center;">
                <p style="color: #ff00ff; font-size: 16px; font-weight: bold;">Proximamente...</p>
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

    // END OF MERCHANDISING FUNCTIONALITY. SOON TO BE DELETED.

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
}
