window.onload = function() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Random Glitch Effects
    function createGlitch() {
        if (reducedMotion.matches) return;
        const surface = document.querySelector(".photo");
        if (!surface) return;
        const glitchColors = [
            '#ff00ff', '#00ffff', '#ff0000', '#00ff00', 
            '#ffff00', '#0000ff', '#ffffff', '#000000'
        ];
        
        // Create 3-8 random glitch squares
        const glitchCount = 1;
        
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
            
            surface.appendChild(glitch);
            
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
            if (!reducedMotion.matches) scheduleNextGlitch();
        }, delay);
    }
    
    // Start glitch effects
    if (!reducedMotion.matches) scheduleNextGlitch();

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
    const sidebarVideo = document.querySelector('.tv video');
    const videoOverlay = document.querySelector('.tv__toggle');
    // The files are named with spaces, so the paths stay percent-encoded.
    const videos = [
        'images/vids-gifs/VID%20WEB%201.mp4',
        'images/vids-gifs/VID%20WEB%202.mp4',
        'images/vids-gifs/VID%20WEB%203.mp4',
        'images/vids-gifs/VID%20WEB%204.mp4',
        'images/vids-gifs/VID%20WEB%205.mp4'
    ];
    const videoNote = document.querySelector('.panel--tv .panel__note');

    let currentVideoIndex = Math.floor(Math.random() * videos.length);

    // Point the player at the current clip and keep the panel label honest.
    const loadVideo = () => {
        sidebarVideo.src = videos[currentVideoIndex];
        if (videoNote) videoNote.textContent = `vid ${currentVideoIndex + 1}`;
    };

    // Function to cycle to next video
    const cycleVideo = () => {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        loadVideo();
        sidebarVideo.play().catch(() => {});
    };
    
    if (sidebarVideo) {
        // Set initial random video
        loadVideo();

        if (!reducedMotion.matches) sidebarVideo.play().catch(() => {});
        reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) sidebarVideo.pause(); });
        sidebarVideo.addEventListener("play", () => { videoOverlay.textContent = "Ⅱ"; videoOverlay.setAttribute("aria-label", "Pausar video"); });
        sidebarVideo.addEventListener("pause", () => { videoOverlay.textContent = "▶"; videoOverlay.setAttribute("aria-label", "Reproducir video"); });
        if (reducedMotion.matches) { videoOverlay.textContent = "▶"; videoOverlay.setAttribute("aria-label", "Reproducir video"); }
        // Add click listener to video
        sidebarVideo.addEventListener('click', cycleVideo);
        
        // Add hover cursor style
        sidebarVideo.style.cursor = 'pointer';
    }
    
    if (videoOverlay) {
        // Add click listener to overlay button
        videoOverlay.addEventListener('click', () => {
            if (sidebarVideo.paused) sidebarVideo.play().catch(() => {});
            else sidebarVideo.pause();
        });
        
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
                    createSharePopup(false);
                }
            }
        });
    }

    function setupPopup(popup) {
        const trigger = document.activeElement;
        const titlebar = popup.querySelector('.popup-titlebar');
        const close = popup.querySelector('.popup-close');
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', popup.querySelector('.popup-title').textContent);
        const place = (x, y) => {
            const width = document.documentElement.clientWidth;
            const height = window.innerHeight;
            popup.style.left = Math.max(16, Math.min(x, width - popup.offsetWidth - 16)) + 'px';
            popup.style.top = Math.max(16, Math.min(y, height - popup.offsetHeight - 16)) + 'px';
        };
        const fit = () => place(parseFloat(popup.style.left) || 16, parseFloat(popup.style.top) || 16);
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(popup);
        window.addEventListener('resize', fit);
        let drag = null;
        titlebar.addEventListener('pointerdown', event => {
            if (event.target.closest('button') || event.button !== 0) return;
            event.preventDefault();
            close.focus({ preventScroll: true });
            const rect = popup.getBoundingClientRect();
            drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
            titlebar.setPointerCapture(event.pointerId);
        });
        titlebar.addEventListener('pointermove', event => {
            if (drag) place(event.clientX - drag.x, event.clientY - drag.y);
        });
        titlebar.addEventListener('pointerup', () => { drag = null; });
        titlebar.addEventListener('pointercancel', () => { drag = null; });
        const dismiss = () => {
            observer.disconnect();
            window.removeEventListener('resize', fit);
            popup.remove();
            const remaining = document.querySelectorAll('.popup-window');
            if (remaining.length) remaining[remaining.length - 1].querySelector('.popup-close').focus();
            else if (trigger && trigger.isConnected) trigger.focus();
        };
        close.addEventListener('click', dismiss);
        popup.addEventListener('keydown', event => {
            if (event.key === 'Escape') { event.stopPropagation(); dismiss(); }
        });
        popup.addEventListener('pointerdown', () => {
            document.querySelectorAll('.popup-window').forEach(p => p.style.zIndex = '10000');
            popup.style.zIndex = '10001';
        });
        close.focus({ preventScroll: true });
    }

    function createSharePopup(copied = true) {
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
                <button type="button" class="popup-close" aria-label="Cerrar">X</button>
            </div>
            <div class="popup-content" style="padding: 20px; text-align: center;">
                <p style="color: #000; font-size: 16px; font-weight: bold;">${copied ? "LINK COPIADO!" : "No se pudo copiar. Copiá la dirección de esta página."}</p>
            </div>
        `;

        document.body.appendChild(popup);

        setupPopup(popup);
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
                <button type="button" class="popup-close" aria-label="Cerrar">X</button>
            </div>
            <div class="popup-content">
                <div class="popup-buttons popup-buttons--stack">
                    <a href="audio/demo_1.mp4" download class="popup-btn" style="background: #ff6600">demo_1</a>
                    <a href="images/mceui.pdf" download class="popup-btn" style="background: #ffff00">mceui.pdf</a>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        setupPopup(popup);
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
                <button type="button" class="popup-close" aria-label="Cerrar">X</button>
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

        setupPopup(popup);
    }

    // Audio player functionality
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.querySelector('.play-btn');

    if (audioPlayer && playButton) {
        // Set volume to 60%
        audioPlayer.volume = 0.6;
        
        playButton.addEventListener('click', async function(e) {
            e.stopPropagation(); // Prevent default nav-link behavior
            
            if (audioPlayer.paused) {
                try { await audioPlayer.play(); }
                catch { playButton.textContent = "reintentar"; return; }
                playButton.textContent = 'pause';
            } else {
                audioPlayer.pause();
                playButton.textContent = 'play!';
            }
        });
        
        // Reset button text when audio ends
        audioPlayer.addEventListener('ended', function() {
            playButton.textContent = 'play!';
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
    const controlIcons = document.querySelectorAll('.link-row');
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
    const isMobile = () => window.innerWidth < 900 || window.matchMedia("(pointer: coarse)").matches;
    
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
                left: rect.left,
                right: rect.right
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
            
            currentX = Math.max(-originalRect.left, Math.min(initialX + deltaX, document.documentElement.clientWidth - originalRect.right));
            currentY = initialY + deltaY;
            
            // `translate` (not `transform`) so a dragged photo keeps its .tilt-* rotation.
            block.style.translate = `${currentX}px ${currentY}px`;
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            
            isDragging = false;
            block.classList.remove('dragging');
            block.classList.add('returning');
            
            // Return to original position
            block.style.translate = '0px 0px';
            currentX = 0;
            currentY = 0;
            
            // Remove returning class after animation
            setTimeout(() => {
                block.classList.remove('returning');
                block.style.zIndex = '';
            }, 600);
        });

    });

    // ===== FISH GAME — flappy-style, sized to its own canvas =====
    function initFishGame() {
        const canvas = document.getElementById('fish-game-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Playfield in CSS pixels. Everything below is derived from these.
        let W = 0, H = 0;

        // Physics is expressed per SECOND and as a fraction of the playfield
        // height. The old constants were per-frame pixel values tuned for a much
        // taller canvas, so in a 200px panel the fish crossed the whole screen in
        // about a third of a second — and ran at double speed on a 120Hz display.
        const GRAVITY_H = 2.6;    // playfield-heights per second squared
        const FLAP_H    = 1.21;   // upward velocity on a flap, heights per second
        const MAX_VY_H  = 2.2;    // terminal fall speed, heights per second

        const fish = { x: 0, y: 0, vy: 0, w: 0, h: 0 };
        let obstacles = [];
        let bubbles   = [];

        let gameRunning = false;
        let isDead      = false;
        let deathTimer  = 0;      // seconds since death
        let score       = 0;
        let best        = 0;
        let speed       = 0;      // px per second
        let obsTimer    = 0;      // seconds since last spawn
        let obsInterval = 0;      // seconds between spawns
        let hookR       = 12;     // hook bend radius
        let OBS_W       = 28;     // collision width of one hook pair
        let gameT       = 0;
        let gameFrame   = null;
        let lastTime    = 0;

        function requestGameFrame() {
            if (gameFrame === null && (!reducedMotion.matches || gameRunning || isDead)) {
                gameFrame = requestAnimationFrame(gameLoop);
            }
        }
        reducedMotion.addEventListener('change', requestGameFrame);

        // — Canvas sizing, device-pixel aware so the outlines stay crisp —
        function resize() {
            const cw = canvas.clientWidth;
            const ch = canvas.clientHeight;
            if (!cw || !ch) return false;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const pw  = Math.round(cw * dpr);
            const ph  = Math.round(ch * dpr);
            if (canvas.width !== pw || canvas.height !== ph) {
                canvas.width  = pw;
                canvas.height = ph;
                bubbles = [];
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            W = cw;
            H = ch;
            fish.h  = Math.max(16, Math.min(30, H * 0.135));
            fish.w  = fish.h * 1.75;
            fish.x  = Math.max(22, W * 0.2);
            hookR   = Math.max(9, Math.min(15, H * 0.062));
            OBS_W   = hookR * 2 + 4;
            if (!bubbles.length) seedBubbles();
            return true;
        }

        function seedBubbles() {
            const n = Math.max(5, Math.round(W / 55));
            for (let i = 0; i < n; i++) {
                bubbles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: 1.5 + Math.random() * 3,
                    v: 9 + Math.random() * 18,
                    drift: (Math.random() - 0.5) * 14
                });
            }
        }

        // Scanline tile, the same TV motif the video panel uses.
        let scanlines = null;
        (function buildScanlines() {
            const tile  = document.createElement('canvas');
            tile.width  = 1;
            tile.height = 3;
            const tctx  = tile.getContext('2d');
            tctx.fillStyle = 'rgba(0,0,0,0.20)';
            tctx.fillRect(0, 0, 1, 1);
            scanlines = ctx.createPattern(tile, 'repeat');
        })();

        // The gap has to clear the fish comfortably on a short playfield.
        function gapSize() { return Math.max(fish.h * 3.4, H * 0.44); }

        function resetFish() {
            fish.y  = H / 2 - fish.h / 2;
            fish.vy = 0;
        }

        function spawnObstacle() {
            const gs  = gapSize();
            const min = gs / 2 + H * 0.09;
            const max = H - gs / 2 - H * 0.09;
            obstacles.push({
                x: W + OBS_W,
                cy: min + Math.random() * Math.max(1, max - min),
                passed: false
            });
        }

        function flap() {
            if (isDead) return;
            if (!gameRunning) { startGame(); return; }
            fish.vy = -FLAP_H * H;
        }

        function startGame() {
            gameRunning = true;
            isDead      = false;
            score       = 0;
            speed       = W * 0.28;
            obsInterval = 1.7;
            obsTimer    = obsInterval - 0.55;   // first hook arrives promptly
            obstacles   = [];
            resetFish();
            fish.vy     = -FLAP_H * H * 0.6;
            requestGameFrame();
        }

        function die() {
            isDead      = true;
            deathTimer  = 0;
            gameRunning = false;
            if (score > best) best = score;
            requestGameFrame();
        }

        // — Water: flat, dark, hard-edged. The fish and the hooks carry the screen. —
        function drawWater(dt) {
            ctx.fillStyle = '#03003d';
            ctx.fillRect(0, 0, W, H);

            const surface = Math.round(H * 0.15);
            ctx.fillStyle = '#0d0090';
            ctx.fillRect(0, 0, W, surface);
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(0, surface, W, 2);

            // Light shafts drifting down from the surface.
            ctx.save();
            ctx.globalAlpha = 0.07;
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 3; i++) {
                const sx = ((gameT * 7 + i * (W / 3 + 40)) % (W + 160)) - 80;
                ctx.beginPath();
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx + 24, 0);
                ctx.lineTo(sx + 62, H);
                ctx.lineTo(sx + 16, H);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();

            // Bubbles.
            ctx.strokeStyle = 'rgba(0,255,255,0.4)';
            ctx.lineWidth = 1;
            for (const b of bubbles) {
                b.y -= b.v * dt;
                b.x += Math.sin(gameT * 2 + b.y * 0.06) * b.drift * dt;
                if (b.y + b.r < 0) { b.y = H + b.r; b.x = Math.random() * W; }
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Sea bed — marks the floor that kills you.
            const bed = Math.max(4, Math.round(H * 0.045));
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, H - bed, W, bed);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, H - bed, W, 2);

            if (scanlines) { ctx.fillStyle = scanlines; ctx.fillRect(0, 0, W, H); }
        }

        // — One hook. tipY is the dangerous end, at the edge of the gap. —
        function drawHook(cx, tipY, fromTop) {
            const R    = hookR;
            const dir  = fromTop ? 1 : -1;          // toward the tip
            const bx   = cx - R;                    // shaft sits left of centre
            const cxb  = cx;                        // centre of the J bend
            const shaftEndY = tipY - dir * R;

            ctx.save();
            ctx.lineCap  = 'round';
            ctx.lineJoin = 'round';

            // Line running back to the wall.
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(bx, fromTop ? 0 : H);
            ctx.lineTo(bx, shaftEndY - dir * R * 1.6);
            ctx.stroke();

            // Shaft + J bend + the point curling back.
            const hook = new Path2D();
            hook.moveTo(bx, shaftEndY - dir * R * 1.6);
            hook.lineTo(bx, shaftEndY);
            hook.arc(cxb, shaftEndY, R, Math.PI, 0, fromTop);
            hook.lineTo(cx + R, tipY - dir * R * 1.9);

            // Black plate first, steel over it — the site's hard-outline treatment.
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = R * 0.62;
            ctx.stroke(hook);
            ctx.strokeStyle = '#e8e8f2';
            ctx.lineWidth = R * 0.3;
            ctx.stroke(hook);

            // Barb.
            const barb = new Path2D();
            barb.moveTo(cx + R, tipY - dir * R * 1.9);
            barb.lineTo(cx + R * 1.75, tipY - dir * R * 1.05);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = R * 0.42;
            ctx.stroke(barb);
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = R * 0.18;
            ctx.stroke(barb);

            ctx.restore();
        }

        function drawObstacles() {
            const gs = gapSize();
            for (const obs of obstacles) {
                const cx = obs.x + OBS_W / 2;
                drawHook(cx, obs.cy - gs / 2, true);
                drawHook(cx, obs.cy + gs / 2, false);
            }
        }

        // — Fish: flat colour, hard black outline, one clear silhouette. —
        function drawFish(dead) {
            const w = fish.w, h = fish.h;
            const cx = fish.x + w / 2, cy = fish.y + h / 2;
            const body = dead ? '#8a8a96' : '#00ffff';
            const fin  = dead ? '#5a5a66' : '#ff00ff';
            const wag  = dead ? 0 : Math.sin(gameT * 11) * h * 0.13;

            ctx.save();
            ctx.translate(cx, cy);
            if (dead) {
                ctx.scale(1, -1);                    // belly up
            } else {
                ctx.rotate(Math.max(-0.5, Math.min(0.5, fish.vy / (H * 3))));
            }

            ctx.lineJoin  = 'round';
            ctx.lineCap   = 'round';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = Math.max(2, h * 0.12);

            // Tail — forked, which is what makes the silhouette read as a fish.
            ctx.beginPath();
            ctx.moveTo(-w * 0.28, 0);
            ctx.lineTo(-w * 0.68, -h * 0.62 + wag);
            ctx.lineTo(-w * 0.56, wag * 0.5);
            ctx.lineTo(-w * 0.68,  h * 0.62 + wag);
            ctx.closePath();
            ctx.fillStyle = fin; ctx.fill(); ctx.stroke();

            // Dorsal fin.
            ctx.beginPath();
            ctx.moveTo(-w * 0.16, -h * 0.34);
            ctx.lineTo(-w * 0.02, -h * 0.95);
            ctx.lineTo( w * 0.20, -h * 0.30);
            ctx.closePath();
            ctx.fillStyle = fin; ctx.fill(); ctx.stroke();

            // Pectoral fin.
            ctx.beginPath();
            ctx.moveTo(-w * 0.02, h * 0.10);
            ctx.lineTo(-w * 0.12, h * 0.56);
            ctx.lineTo( w * 0.16, h * 0.22);
            ctx.closePath();
            ctx.fillStyle = fin; ctx.fill(); ctx.stroke();

            // Body.
            ctx.beginPath();
            ctx.ellipse(0, 0, w * 0.42, h * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = body; ctx.fill(); ctx.stroke();

            // Gill stroke.
            ctx.beginPath();
            ctx.moveTo(w * 0.06, -h * 0.28);
            ctx.quadraticCurveTo(w * 0.14, 0, w * 0.06, h * 0.28);
            ctx.lineWidth = Math.max(1.4, h * 0.07);
            ctx.stroke();

            // Eye.
            const ex = w * 0.23, ey = -h * 0.13, er = h * 0.2;
            ctx.beginPath();
            ctx.arc(ex, ey, er, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; ctx.fill();
            ctx.lineWidth = Math.max(1.4, h * 0.07); ctx.stroke();

            ctx.strokeStyle = '#000000';
            if (dead) {
                ctx.lineWidth = Math.max(1.6, h * 0.08);
                ctx.beginPath();
                ctx.moveTo(ex - er * 0.62, ey - er * 0.62); ctx.lineTo(ex + er * 0.62, ey + er * 0.62);
                ctx.moveTo(ex + er * 0.62, ey - er * 0.62); ctx.lineTo(ex - er * 0.62, ey + er * 0.62);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(ex + er * 0.24, ey, er * 0.48, 0, Math.PI * 2);
                ctx.fillStyle = '#000000'; ctx.fill();
            }

            ctx.restore();
        }

        // — Courier, outlined so it reads over anything —
        function stamp(text, x, y, size, color, align) {
            ctx.font = 'bold ' + size + 'px "Courier New", Courier, monospace';
            ctx.textAlign = align || 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = Math.max(3, size * 0.34);
            ctx.strokeText(text, x, y);
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        }

        function checkHit(obs) {
            const gs     = gapSize();
            const gapTop = obs.cy - gs / 2;
            const gapBot = obs.cy + gs / 2;
            // Hitbox inset a little for fairness.
            const fx = fish.x + fish.w * 0.18, fr = fish.x + fish.w * 0.86;
            const fy = fish.y + fish.h * 0.16, fb = fish.y + fish.h * 0.84;
            if (fr <= obs.x || fx >= obs.x + OBS_W) return false;
            return (fy < gapTop || fb > gapBot);
        }

        function gameLoop(now) {
            gameFrame = null;
            if (!resize()) { requestGameFrame(); return; }

            const t = (typeof now === 'number') ? now : performance.now();
            let dt = lastTime ? (t - lastTime) / 1000 : 1 / 60;
            lastTime = t;
            dt = Math.min(Math.max(dt, 0), 1 / 20);   // survive a tab switch
            gameT += dt;

            drawWater(dt);

            // Idle / start screen. The fish bobs mid-field and the prompt sits
            // below it — centred text would land on top of the fish at 360px.
            if (!gameRunning && !isDead) {
                fish.y = H / 2 - fish.h / 2 + Math.sin(gameT * 1.6) * H * 0.05;
                drawFish(false);
                const s = Math.max(10, Math.min(17, W / 24));
                stamp('ESPACIO / TAP PARA JUGAR', W / 2, H * 0.68, s, '#ffff00');
                stamp('esquivá los anzuelos', W / 2, H * 0.68 + s * 1.5, s * 0.82, '#00ffff');
                requestGameFrame();
                return;
            }

            // Death screen.
            if (isDead) {
                deathTimer += dt;
                drawObstacles();
                drawFish(true);
                const s = Math.max(12, Math.min(20, W / 20));
                stamp('ATRAPADO — ' + score, W / 2, H / 2 - s * 0.85, s, '#ff00ff');
                stamp('tap / espacio para volver', W / 2, H / 2 + s * 0.85, s * 0.72, '#ffffff');
                if (deathTimer > 1.4) { isDead = false; resetFish(); }
                requestGameFrame();
                return;
            }

            // Physics.
            fish.vy = Math.min(fish.vy + GRAVITY_H * H * dt, MAX_VY_H * H);
            fish.y += fish.vy * dt;

            if (fish.y <= 0 || fish.y + fish.h >= H) {
                fish.y = Math.max(0, Math.min(fish.y, H - fish.h));
                die();
                return;
            }

            // Obstacles.
            obsTimer += dt;
            if (obsTimer >= obsInterval) {
                spawnObstacle();
                obsTimer = 0;
                obsInterval = Math.max(1.05, obsInterval - 0.04);
            }

            let killed = false;
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obs = obstacles[i];
                obs.x -= speed * dt;
                if (!obs.passed && obs.x + OBS_W < fish.x) {
                    obs.passed = true;
                    score++;
                    if (score % 5 === 0) speed = Math.min(speed * 1.08, W * 0.55);
                }
                if (obs.x + OBS_W < -40) { obstacles.splice(i, 1); continue; }
                if (checkHit(obs)) killed = true;
            }

            if (killed) { die(); return; }

            drawObstacles();
            drawFish(false);

            // Score, on its own plate so it never fights the water.
            const s = Math.max(11, Math.min(16, W / 26));
            ctx.fillStyle = '#000000';
            ctx.fillRect(8, 8, s * 5.4, s * 1.7);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(8, 8, s * 5.4, 2);
            stamp(String(score).padStart(2, '0') + (best ? '  b' + best : ''),
                  8 + s * 0.5, 8 + s * 0.9, s, '#00ff00', 'left');

            requestGameFrame();
        }

        // — Input —
        canvas.addEventListener('keydown', function (e) {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (isDead && deathTimer > 0.45) { isDead = false; resetFish(); return; }
                flap();
            }
        });
        canvas.addEventListener('click', function () {
            canvas.focus();
            if (isDead && deathTimer > 0.45) { isDead = false; resetFish(); return; }
            flap();
        });
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (isDead && deathTimer > 0.45) { isDead = false; resetFish(); return; }
            flap();
        }, { passive: false });

        window.addEventListener('resize', function () {
            if (!resize()) return;
            if (!gameRunning && !isDead) resetFish();
            requestGameFrame();
        });

        resize();
        resetFish();
        gameLoop();
    }

    initFishGame();

    // ===== FISH CURSOR =====
function initFishCursor() {
    if (reducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 70;
    canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;display:none';
    const cursorLayer = document.createElement('div');
    cursorLayer.setAttribute('aria-hidden', 'true');
    cursorLayer.style.cssText = 'position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:999999;contain:paint';
    cursorLayer.appendChild(canvas);
    document.body.appendChild(cursorLayer);
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
        if (reducedMotion.matches) { canvas.style.display = "none"; return; }
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
        // The minigame draws its own fish; a second one swimming over the
        // playfield just reads as a bug, so the cursor stands down in there.
        const overGame = e.target && e.target.closest && e.target.closest('.game__stage');
        canvas.style.display = (reducedMotion.matches || overGame) ? 'none' : 'block';
    });

    loop();
}

initFishCursor();
}
