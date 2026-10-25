/* =============================================================
   RABBIT HOLE
   The first drawing sits in the home page's photo grid like any other photo. Each drawing has one
   part you can click; clicking it dives into that spot and comes out in the
   next drawing, and every drawing you leave behind piles up over the page,
   until the hole is all there is. The last one brings you back up.

   Para cambiar el orden o qué parte se clickea en cada dibujo, editá STEPS:
   x / y / w / h son el rectángulo clickeable, en % del dibujo (800 × 600),
   y `label` es lo que se lee en voz alta para ese botón.
   ============================================================= */
(function () {
    const STEPS = [
        {
            src: 'images/rabbit-hole/1-1.png',
            accent: 'var(--sxtp-pink)',
            spot: { x: 44.5, y: 79.5, w: 46.5, h: 8, label: 'quisiera odiarlos a todos' },
            alt: '¿Ya te olvidaron? ¿Ya te olvidaron? ¿Ya te olvidaron? — ¿Por qué nunca te alcanza? El otro día golpeé mi cara alrededor de quince veces en frente del espejo de la facultad. Me di cuenta que la clase había terminado porque todos mis compañeros salieron hablando de lo difícil que va a ser el parcial del viernes; interrumpidos por la imagen de la resignación encarnada en mí, empezaron a hacer preguntas que nunca supe contestar, así que simplemente limpié la sangre de mis nudillos e inventé que un familiar estaba internado. Ese día volví llorando a mi casa y escribí esto. Después pedí un resumen en el grupo de WhatsApp. Al pie, subrayado: quisiera odiarlos a todos.',
        },
        {
            src: 'images/rabbit-hole/2-1.png',
            accent: 'var(--sxtp-cyan)',
            spot: { x: 0, y: 51, w: 50.5, h: 11.5, label: 'puede leer esto' },
            alt: 'Solo el 41% de niños argentinos puede leer esto (tres veces). 59% de los niños argentinos que llega a la edad de finalizar la primaria no logra un nivel mínimo de comprensión lectora. El salario bruto docente promedio de marzo de 2026 se ubicó 13,3% por debajo del nivel real de diciembre de 2019. En Matemática, el 76% de los estudiantes argentinos de 15 años no llega al nivel 2, el mínimo que define la OCDE.',
        },
        {
            src: 'images/rabbit-hole/2-2.png',
            accent: 'var(--sxtp-yellow)',
            spot: { x: 32, y: 22.5, w: 36, h: 55, label: 'la cara partida al medio' },
            alt: 'Una cara cortada en dos en el medio de un texto: una familia rota en el pasado, otra en el futuro. Subo cargado al colectivo. Ayer descubrí que todo el dolor y todo el amor que siento vienen del mismo collar. He estado hundiéndome desde el primer día que elegí a mi padre por sobre mis intereses. Yo era solo un niño y el mundo era una idea. Caminé y me llamaste y mi corazón latía muy fuerte, entonces me di vuelta y vi mi sueño por última vez. En sus ojos hay angustia y entrega. Dios, no me arrebates la gracia de su entrega, pero mis piernas siguen caminando como si mis pies no pudiesen darse vuelta. Ese día escuché la dinastía Scorpio sabiendo que nada jamás volverá a ser lo mismo. El fin de las vacaciones, de las mejores.',
        },
        {
            src: 'images/rabbit-hole/2-3.png',
            accent: 'var(--sxtp-magenta)',
            spot: { x: 12.5, y: 67.5, w: 75, h: 9, label: '2022 dedicado a toda la tristeza humana' },
            alt: 'Tres hojas escritas a mano. Una en rojo: a ver, pasaron cosas que no permití. Otra repite: quiero sentirme bien, quiero saber qué ves, saber cuándo mentís, saber mentir también. Otra en verde: yo también hablo en serio. Abajo, subrayado: 2022 dedicado a toda la tristeza humana.',
        },
        {
            src: 'images/rabbit-hole/2-4.png',
            accent: 'var(--sxtp-white)',
            spot: { x: 26.5, y: 42.5, w: 47, h: 14, label: 'mi corazón es un imán' },
            alt: 'Sobre blanco: mi corazón es un imán. 2027. sxtp.',
        },
        {
            src: 'images/rabbit-hole/3-1.png',
            accent: 'var(--sxtp-green)',
            spot: { x: 0, y: 75, w: 54, h: 9.5, label: 'vas a tener que volver a confiar' },
            alt: 'Conjugué palabras que valen más que muchas acciones. Yo no creo que tus amigos cumplan todas sus promesas. ¿Y vos? ¿Cuántos amigos te hicieron daño? ¿Ya te olvidaron? No sé… Al final confiás o no confiás, nadie puede meterse en el corazón del otro. A lo sumo podrías poner una cámara y un par de micrófonos, hacerte pasar por otra persona, montar una farsa. No es tan difícil. Tu celular y el suyo tienen cámaras e inteligencia artificial. Un micrófono espía traído de China sale $10.000 (oct 2026). Podrías esperar a que te invite a su casa y esconder todo dentro de… No, aun así vos podrías mentirte. Ojos que no ven. Amor verdadero. Todavía besamos con lengua. Todos cometemos errores. Ahora que lo pienso, vas a tener que volver a confiar. Al lado, una estatua de una mujer con una nena.',
        },
        {
            src: 'images/rabbit-hole/3-2.png',
            accent: 'var(--sxtp-green)',
            spot: { x: 48.5, y: 72, w: 51, h: 24, label: 'volver a la superficie' },
            alt: 'Tres retratos de hombres jóvenes entre dos citas. «Si alguno viene a mí, y no aborrece a su padre y a su madre, ni a su mujer y sus hijos, ni a sus hermanos y hermanas, y ni siquiera a su propia vida, no puede ser mi discípulo» — San Lucas 14:26. «Las personas que están construyendo IA creen sinceramente que podría matarnos a todos para finales de la década».',
        },
    ];

    const entry = document.querySelector('.hole-entry');
    if (!entry) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const page = document.querySelector('.page');
    const entryImg = entry.querySelector('img');
    const HINT_DELAY = 6000;

    let overlay, frame, frameImg, spot, depthEl, countEl, ticks, debris, exitBtn;
    let index = 0;
    let busy = false;
    let hintTimer = 0;

    function placeSpot(button, s) {
        button.style.setProperty('--x', s.x + '%');
        button.style.setProperty('--y', s.y + '%');
        button.style.setProperty('--w', s.w + '%');
        button.style.setProperty('--h', s.h + '%');
    }

    // The way in: the first drawing's own clickable part, right on the page.
    const entrySpot = document.createElement('button');
    entrySpot.type = 'button';
    entrySpot.className = 'hole-spot';
    entrySpot.setAttribute('aria-label', STEPS[0].spot.label + ' — entrar');
    placeSpot(entrySpot, STEPS[0].spot);
    entry.appendChild(entrySpot);
    entrySpot.addEventListener('click', open);

    // Fetch the rest once someone shows interest, so the dive never waits.
    let preloaded = false;
    function preload() {
        if (preloaded) return;
        preloaded = true;
        STEPS.slice(1).forEach(step => { new Image().src = step.src; });
    }
    ['pointerenter', 'focus', 'touchstart'].forEach(type =>
        entrySpot.addEventListener(type, preload, { once: true, passive: true }));

    function anim(el, keyframes, options) {
        if (reducedMotion.matches || !el.animate) return Promise.resolve();
        return el.animate(keyframes, { fill: 'both', ...options }).finished.catch(() => {});
    }

    function build() {
        overlay = document.createElement('div');
        overlay.className = 'hole';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'rabbit hole');
        overlay.innerHTML = `
            <div class="hole__debris" aria-hidden="true"></div>
            <div class="hole__hud">
                <p class="hole__depth"><span class="hole__depth-label">profundidad</span> <span class="hole__depth-value"></span></p>
                <ol class="hole__ticks" aria-hidden="true">${STEPS.map(() => '<li></li>').join('')}</ol>
                <button type="button" class="hole__exit">salir ✕</button>
            </div>
            <figure class="hole__frame grain">
                <img alt="" width="800" height="600">
                <button type="button" class="hole-spot hole-spot--deep"></button>
            </figure>
            <p class="hole__count" aria-live="polite"></p>`;
        debris = overlay.querySelector('.hole__debris');
        depthEl = overlay.querySelector('.hole__depth-value');
        ticks = overlay.querySelectorAll('.hole__ticks li');
        countEl = overlay.querySelector('.hole__count');
        frame = overlay.querySelector('.hole__frame');
        frameImg = frame.querySelector('img');
        spot = frame.querySelector('.hole-spot');
        exitBtn = overlay.querySelector('.hole__exit');

        spot.addEventListener('click', () => dive(index + 1));
        exitBtn.addEventListener('click', () => leave(false));
        overlay.addEventListener('keydown', event => {
            if (event.key === 'Escape') { event.preventDefault(); leave(false); }
            // Two controls; Tab just swaps between them.
            if (event.key === 'Tab') {
                event.preventDefault();
                (document.activeElement === spot ? exitBtn : spot).focus();
            }
        });
        document.body.appendChild(overlay);
    }

    // Puts step i on screen: picture, its clickable part, the depth readout,
    // and how far the hole has swallowed the page (--grow, 0 → 1).
    function show(i) {
        const step = STEPS[i];
        index = i;
        frameImg.src = step.src;
        frameImg.alt = step.alt;
        placeSpot(spot, step.spot);
        spot.setAttribute('aria-label', step.spot.label + (i === STEPS.length - 1 ? '' : ' — seguir bajando'));
        spot.classList.remove('is-hinting');
        overlay.style.setProperty('--accent', step.accent);
        root.style.setProperty('--grow', (i / (STEPS.length - 1)).toFixed(3));
        depthEl.textContent = '−' + (i + 1);
        countEl.textContent = `dibujo ${i + 1} de ${STEPS.length}`;
        ticks.forEach((tick, t) => tick.classList.toggle('is-past', t <= i));
        overlay.dataset.last = i === STEPS.length - 1 ? 'true' : 'false';

        // Lost? After a while the clickable part shows itself.
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => spot.classList.add('is-hinting'), HINT_DELAY);
    }

    // The drawing you leave doesn't go away: it lands somewhere on the pile.
    function drop(src, accent) {
        const scrap = document.createElement('img');
        scrap.src = src;
        scrap.alt = '';
        scrap.className = 'hole__scrap';
        // Each one lands a golden-angle turn from the last, out by the edges,
        // so the pile closes in around the frame instead of hiding behind it.
        const angle = debris.children.length * 2.4 + Math.random() * 0.6;
        scrap.style.left = (50 + Math.cos(angle) * (36 + Math.random() * 10)) + '%';
        scrap.style.top = (50 + Math.sin(angle) * (30 + Math.random() * 12)) + '%';
        const tilt = (Math.random() * 24 - 12).toFixed(1);
        scrap.dataset.tilt = tilt;
        scrap.style.setProperty('--tilt', tilt + 'deg');
        scrap.style.setProperty('--accent', accent);
        debris.appendChild(scrap);
        anim(scrap, [
            { transform: 'translate(-50%, -50%) scale(2.4) rotate(0deg)', opacity: 0 },
            { opacity: 1, offset: 0.35 },
            { transform: `translate(-50%, -50%) scale(1) rotate(${tilt}deg)`, opacity: 1 },
        ], { duration: 520, easing: 'cubic-bezier(.2,.9,.3,1.15)', fill: 'backwards' });
    }

    function open() {
        if (busy) return;
        if (!overlay) build();
        preload();
        busy = true;
        debris.replaceChildren();
        page.inert = true;
        root.classList.add('hole-open');
        show(0);
        overlay.hidden = false;

        // The drawing lifts off the page into the frame (FLIP) ...
        const from = entryImg.getBoundingClientRect();
        const to = frame.getBoundingClientRect();
        anim(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        anim(frame, [
            {
                transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`,
                transformOrigin: '0 0',
            },
            { transform: 'none', transformOrigin: '0 0' },
        ], { duration: 420, easing: 'cubic-bezier(.3,.7,.2,1)' })
            // ... and you're already falling into the part you clicked.
            .then(() => { busy = false; dive(1); });
    }

    async function dive(next) {
        if (busy) return;
        if (next >= STEPS.length) { leave(true); return; }
        busy = true;
        clearTimeout(hintTimer);

        const s = STEPS[index].spot;
        const origin = `${s.x + s.w / 2}% ${s.y + s.h / 2}%`;
        const incoming = new Image();
        incoming.src = STEPS[next].src;
        const ready = incoming.decode ? incoming.decode().catch(() => {}) : Promise.resolve();

        // Zoom straight into the clicked part, splitting into ink plates.
        frame.classList.add('is-diving');
        await anim(frameImg, [
            { transformOrigin: origin, transform: 'scale(1)', filter: 'none', opacity: 1 },
            { transformOrigin: origin, transform: 'scale(1.6)', filter: 'drop-shadow(-6px 0 0 #0ff) drop-shadow(6px 0 0 #f0f)', opacity: 1, offset: 0.35 },
            { transformOrigin: origin, transform: 'scale(7)', filter: 'drop-shadow(-14px 0 0 #0ff) drop-shadow(14px 0 0 #f0f) blur(2px)', opacity: 0 },
        ], { duration: 560, easing: 'cubic-bezier(.6,0,.9,.4)' });
        await ready;

        drop(STEPS[index].src, STEPS[index].accent);
        show(next);
        frame.classList.remove('is-diving');

        // The next drawing comes up out of the dark.
        await anim(frameImg, [
            { transform: 'scale(0.12) rotate(-6deg)', opacity: 0 },
            { opacity: 1, offset: 0.3 },
            { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        ], { duration: 520, easing: 'cubic-bezier(.2,1.25,.4,1)' });
        frameImg.getAnimations?.().forEach(a => a.cancel());
        busy = false;
        spot.focus({ preventScroll: true });
    }

    // Out of the hole. From the bottom (surfaced) the pile blows away first.
    async function leave(surfaced) {
        if (!overlay || overlay.hidden) return;
        busy = true;
        clearTimeout(hintTimer);
        if (surfaced) {
            await Promise.all([...debris.children].map((scrap, n) => anim(scrap, [
                { transform: `translate(-50%, -50%) scale(1) rotate(${scrap.dataset.tilt}deg)`, opacity: 1 },
                { transform: `translate(-50%, ${n % 2 ? '-' : ''}260%) scale(0.6) rotate(${scrap.dataset.tilt * 4}deg)`, opacity: 0 },
            ], { duration: 520, delay: n * 40, easing: 'cubic-bezier(.5,0,.9,.5)' })));
        }
        root.style.setProperty('--grow', '0');
        await anim(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: 260 });
        overlay.hidden = true;
        overlay.getAnimations?.({ subtree: true }).forEach(a => a.cancel());
        root.classList.remove('hole-open');
        page.inert = false;
        busy = false;
        entrySpot.focus({ preventScroll: true });
    }
})();
