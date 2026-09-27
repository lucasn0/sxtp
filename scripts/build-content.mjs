// Rebuilds the parts of the site that the band edits without touching HTML:
//   contenido/shows.txt   -> the "próximos shows" list in index.html
//   contenido/galeria/*   -> the photo grid in pages/gallery.html
//
// Runs in the deploy workflow on every push, and locally with
//   node scripts/build-content.mjs
// It only rewrites the text between <!-- auto:NAME --> and <!-- /auto:NAME -->
// markers, so running it twice changes nothing. No dependencies.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOWS_FILE = join(ROOT, 'contenido/shows.txt');
const GALLERY_DIR = join(ROOT, 'contenido/galeria');
const CAPTIONS_FILE = join(GALLERY_DIR, 'descripciones.txt');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
// Browsers other than Safari can't show these; flag them instead of publishing a broken tile.
const UNSUPPORTED_EXTS = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp', '.raw', '.dng']);
// A show stays listed through the day it happens, and a date without a year
// means the next one coming up, allowing this many days for a late upload.
const YEAR_GRACE_DAYS = 60;

const warnings = [];
// GitHub Actions turns "::warning::" lines into annotations on the run page.
const warn = msg => {
    warnings.push(msg);
    console.log(process.env.GITHUB_ACTIONS ? `::warning::${msg}` : `aviso: ${msg}`);
};

const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Lines of a hand-edited text file, minus comments and blanks, split on "|".
function readTable(file) {
    if (!existsSync(file)) return [];
    return readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .map((text, i) => ({ text: text.trim(), line: i + 1 }))
        .filter(({ text }) => text && !text.startsWith('#'))
        .map(({ text, line }) => ({ line, cells: text.split('|').map(c => c.trim()) }));
}

function replaceBlock(html, name, content, file) {
    const re = new RegExp(`(<!-- auto:${name} -->)[\\s\\S]*?(\\n[ \\t]*<!-- /auto:${name} -->)`);
    if (!re.test(html)) throw new Error(`${file}: no encuentro los marcadores auto:${name}`);
    return html.replace(re, (_, open, close) => `${open}\n${content}${close}`);
}

function updateFile(relPath, blocks) {
    const file = join(ROOT, relPath);
    const before = readFileSync(file, 'utf8');
    let after = before;
    for (const [name, content] of Object.entries(blocks)) after = replaceBlock(after, name, content, relPath);
    if (after !== before) writeFileSync(file, after);
    console.log(`${relPath}: ${after !== before ? 'actualizado' : 'sin cambios'}`);
}

/* ===== SHOWS ===== */

function todayUTC() {
    const now = new Date();
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDate(text, today) {
    const m = text.match(/^(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2}|\d{4}))?$/);
    if (!m) return null;
    const day = Number(m[1]);
    const month = Number(m[2]);
    let year = m[3] ? Number(m[3]) : null;
    if (year !== null && year < 100) year += 2000;
    if (year === null) {
        const thisYear = new Date(today).getUTCFullYear();
        year = Date.UTC(thisYear, month - 1, day) < today - YEAR_GRACE_DAYS * 864e5 ? thisYear + 1 : thisYear;
    }
    const time = Date.UTC(year, month - 1, day);
    const d = new Date(time);
    // Rejects 31/02 and friends, which Date would silently roll over.
    if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
    return time;
}

function buildShows() {
    const today = todayUTC();
    const shows = [];
    for (const { line, cells } of readTable(SHOWS_FILE)) {
        const [dateText = '', place = '', link = ''] = cells;
        const time = parseDate(dateText, today);
        if (time === null) { warn(`shows.txt línea ${line}: no entiendo la fecha "${dateText}" (tiene que ser día/mes, ej. 03/10)`); continue; }
        if (!place) { warn(`shows.txt línea ${line}: falta el lugar después de la fecha`); continue; }
        if (link && !/^https?:\/\//i.test(link)) { warn(`shows.txt línea ${line}: el link tiene que empezar con https:// — lo ignoro`); }
        if (time < today) continue;
        shows.push({ time, place, link: /^https?:\/\//i.test(link) ? link : '' });
    }
    shows.sort((a, b) => a.time - b.time);

    const pad = ' '.repeat(24);
    const items = shows.map(({ time, place, link }) => {
        const d = new Date(time);
        const iso = d.toISOString().slice(0, 10);
        const label = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        const tickets = link ? `<a class="show-tickets" href="${escapeHtml(link)}">entradas ↗</a>` : '';
        return `${pad}<li class="show-item" data-date="${iso}"><time class="show-date" datetime="${iso}">${label}</time><span class="show-place">${escapeHtml(place)}</span>${tickets}</li>`;
    });
    // Shown when nothing is coming up; script.js also reveals it once past shows are hidden.
    items.push(`${pad}<li class="show-item show-item--empty"${shows.length ? ' hidden' : ''}>nuevas fechas pronto</li>`);
    console.log(`shows: ${shows.length} próximos`);
    return items.join('\n');
}

/* ===== GALLERY ===== */

// Width/height straight from the file header, so each tile reserves its space
// before the photo loads. Returns null for anything it can't read.
function imageSize(buf) {
    // PNG
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
        return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    // GIF
    if (buf.toString('ascii', 0, 3) === 'GIF') {
        return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    }
    // WebP
    if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
        const chunk = buf.toString('ascii', 12, 16);
        if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
        if (chunk === 'VP8L') {
            const b = buf.readUInt32LE(21);
            return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
        }
        if (chunk === 'VP8X') return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
        return null;
    }
    // JPEG: walk the segments to the frame header, noting the EXIF orientation on the way.
    if (buf[0] === 0xff && buf[1] === 0xd8) {
        let orientation = 1;
        let i = 2;
        while (i + 9 < buf.length) {
            if (buf[i] !== 0xff) { i++; continue; }
            const marker = buf[i + 1];
            if (marker === 0xff) { i++; continue; }
            const len = buf.readUInt16BE(i + 2);
            if (marker === 0xe1 && buf.toString('ascii', i + 4, i + 8) === 'Exif') {
                orientation = exifOrientation(buf, i + 10) ?? orientation;
            }
            const isSOF = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
            if (isSOF) {
                const height = buf.readUInt16BE(i + 5);
                const width = buf.readUInt16BE(i + 7);
                // Phones store portrait shots sideways and set orientation 5–8;
                // browsers rotate them, so the tile needs the rotated size.
                return orientation >= 5 ? { width: height, height: width } : { width, height };
            }
            i += 2 + len;
        }
    }
    return null;
}

function exifOrientation(buf, tiff) {
    try {
        const le = buf.toString('ascii', tiff, tiff + 2) === 'II';
        const u16 = o => le ? buf.readUInt16LE(o) : buf.readUInt16BE(o);
        const u32 = o => le ? buf.readUInt32LE(o) : buf.readUInt32BE(o);
        const ifd = tiff + u32(tiff + 4);
        const count = u16(ifd);
        for (let n = 0; n < count; n++) {
            const entry = ifd + 2 + n * 12;
            if (u16(entry) === 0x0112) return u16(entry + 8);
        }
    } catch { /* malformed EXIF: keep the default */ }
    return null;
}

// When each photo first landed in the repo, newest first. Moves count as a
// fresh add, which is fine: files that arrive together keep their name order.
function addedTimes() {
    const times = new Map();
    try {
        const log = execFileSync('git', ['log', '--no-renames', '--diff-filter=A', '--format=@%at', '--name-only', '--', 'contenido/galeria'], { cwd: ROOT, encoding: 'utf8' });
        let current = 0;
        for (const line of log.split('\n')) {
            if (line.startsWith('@')) current = Number(line.slice(1));
            else if (line.trim()) {
                const name = line.trim().split('/').pop();
                // git log lists newest commits first; keep the most recent add.
                if (!times.has(name)) times.set(name, current);
            }
        }
    } catch {
        warn('no pude leer el historial de git: ordeno las fotos por nombre');
    }
    return times;
}

function buildGallery() {
    const captions = new Map();
    for (const { cells } of readTable(CAPTIONS_FILE)) {
        const [name, alt = '', flag = ''] = cells;
        if (name) captions.set(name.toLowerCase(), { alt, art: /^(flyer|tapa|arte)$/i.test(flag) });
    }

    const added = addedTimes();
    const now = Math.floor(Date.now() / 1000); // not committed yet: treat as the newest
    const byName = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

    const photos = [];
    for (const name of readdirSync(GALLERY_DIR)) {
        if (name.startsWith('.')) continue;
        const ext = extname(name).toLowerCase();
        if (UNSUPPORTED_EXTS.has(ext)) { warn(`galería: "${name}" está en un formato que la mayoría de los navegadores no muestra. Subila como .jpg`); continue; }
        if (!IMAGE_EXTS.has(ext)) continue;
        const size = imageSize(readFileSync(join(GALLERY_DIR, name)));
        if (!size && ext !== '.avif') warn(`galería: no pude leer el tamaño de "${name}", la muestro igual`);
        photos.push({ name, size, added: added.get(name) ?? now, ...captions.get(name.toLowerCase()) });
    }
    photos.sort((a, b) => b.added - a.added || byName.compare(a.name, b.name));

    const pad = ' '.repeat(16);
    const tiles = photos.map((photo, i) => {
        const src = `../contenido/galeria/${encodeURIComponent(photo.name)}`;
        const alt = escapeHtml(photo.alt || 'Foto de SXTP');
        const dims = photo.size ? ` width="${photo.size.width}" height="${photo.size.height}"` : '';
        // The first row is on screen at load; the rest can wait.
        const lazy = i >= 3 ? ' loading="lazy" decoding="async"' : '';
        return [
            `${pad}<a class="gallery-item${photo.art ? ' gallery-item--art' : ''} grain" href="${src}">`,
            `${pad}    <img src="${src}"${dims}${lazy}`,
            `${pad}         alt="${alt}">`,
            `${pad}    <span class="gallery-item__no">${String(i + 1).padStart(2, '0')}</span>`,
            `${pad}</a>`,
        ].join('\n');
    });
    console.log(`galería: ${photos.length} fotos`);
    return {
        'gallery-count': `            <span class="page-sub">${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'}</span>`,
        'gallery': tiles.join('\n'),
    };
}

updateFile('index.html', { shows: buildShows() });
updateFile('pages/gallery.html', buildGallery());

if (process.env.GITHUB_STEP_SUMMARY && warnings.length) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, `## Avisos\n\n${warnings.map(w => `- ${w}`).join('\n')}\n`, { flag: 'a' });
}
