# SXTP frontend style guide

## Instructions for Claude and other frontend contributors

Read this file before creating or changing frontend UI. Use it for layout, styling, interaction, and responsive decisions. Preserve the band's visual identity while making every page usable on small screens. Explicit task requirements take precedence.

This guide describes the existing design and sets an improved direction for future work. It does not mean the current implementation already meets these requirements. Base the implementation on the existing HTML, CSS, JavaScript, and assets; a redesign does not require a new framework or UI library.

## The identity

**An underground band website assembled like a photocopied gig flyer, an early personal homepage, and a malfunctioning desktop.** Loud, handmade, playful, slightly abrasive, and full of actual band material.

The current visual language comes from `index.html`, `pages/gallery.html`, `pages/audio.html`, their stylesheets, and `scripts/script.js`:

- Electric-blue page backgrounds with magenta, cyan, green, and orange interruptions.
- Courier typography, lowercase navigation, uppercase announcements, underlines, and hard offset shadows.
- Square panels, thick black outlines, chunky buttons, gray desktop-style popup windows.
- Flash photography, dark live-show images, cut-and-paste word artwork, TV color bars, and looping camera footage.
- Visitor counters, a live clock, a scrolling news strip, draggable photos, a small game, and glitch fragments.

The sketchy quality comes primarily from collage, rough source imagery, abrupt color changes, and deliberately uneven composition. Do not turn every border into a hand-drawn squiggle. Keep controls precise even when the surrounding artwork feels improvised.

Aim for **intentional visual disorder with a dependable reading and interaction order**. A visitor should immediately find the music, downloads, and shows.

## Visual rules

### Color

Use this palette as shared CSS custom properties when touching shared styles:

```css
:root {
  --sxtp-blue: #0000ff;
  --sxtp-black: #000000;
  --sxtp-white: #ffffff;
  --sxtp-cyan: #00ffff;
  --sxtp-magenta: #ff00ff;
  --sxtp-pink: #ff1493;
  --sxtp-green: #00ff00;
  --sxtp-yellow: #ffff00;
  --sxtp-orange: #ff8c00;
  --sxtp-purple: #8b00ff;
  --sxtp-window: #c0c0c0;
  --sxtp-font: 'Courier New', Courier, monospace;
  --sxtp-border: 3px solid var(--sxtp-black);
  --sxtp-shadow: 5px 5px 0 var(--sxtp-black);
}
```

Blue is the page canvas; black provides visual rest; neon colors identify panels, actions, and decorative fragments. Use one dominant accent per component. A full rainbow belongs in a featured poster or collage, not every paragraph.

Prefer white on blue or black, green/cyan on black, and black on cyan, pink, magenta, yellow, orange, or gray. Avoid small red/purple text on blue and white text on bright pink. Check the actual foreground/background combination, including hover and focus states; aim for at least 4.5:1 for ordinary text and 3:1 for large text and meaningful control boundaries. Shadows do not substitute for readable contrast.

Gradients may appear in psychedelic poster art, existing magenta-to-cyan panels, and blue desktop title bars. Put dense copy on a solid inset surface. Preserve flat saturated color as the dominant treatment.

### Type and copy

- Use the system Courier stack throughout. No external font is needed.
- Body text: `1rem`, line-height `1.45–1.6`. Secondary metadata: `0.75–0.875rem`; never use tiny text for essential instructions or actions.
- Section headings: `1.25–2rem`, bold. Main display headings: `clamp(2rem, 5vw, 4.5rem)`, line-height `1.05–1.15`.
- Preserve the italic, underlined `sxtp` wordmark and its hard black shadow. Use hard text shadows mainly for display type.
- Use uppercase for brief headings, gig-flyer announcements, and main actions. Use normal sentence case for longer copy and lowercase for short navigation labels.
- Preserve the site's Spanish voice, accents, band names, and informal phrasing. Existing labels such as `gallery`, `audio`, and `play!` can stay. Do not invent shows, releases, or promotional claims.
- Let announcements wrap naturally. Avoid hard-coded `<br>` elements that only work at one desktop width. Keep long text to roughly `45–65ch` where practical.

### Surfaces, space, and composition

- Default corner radius: `0`. Use 2px borders for inset rows and 3–4px borders for major panels.
- Use black shadows with zero blur and offsets of 3–8px. Reserve glow for occasional media effects; avoid soft floating-card shadows.
- Use a spacing rhythm of 4, 8, 12, 16, 24, and 32px. Compact is good; touching labels and crowded controls are not.
- Build the page on a real grid, then vary image proportions, panel sizes, and accent colors. Small rotations up to about 2 degrees are optional on decorative artwork only.
- Keep text, navigation, and forms upright. Decorative overlaps must not cover content, focus rings, or hit targets.
- Do not add pill buttons, glass panels, pastel backgrounds, generic rounded dashboard cards, stock business illustrations, or huge empty marketing sections.

### Images and texture

Use existing assets first: `images/sxtp-imgs/`, `images/gallery/`, `images/vids-gifs/`, `images/word-collage.jpg`, and `images/no-signal.jpg`. Actual performance photos and artwork carry the identity better than manufactured decoration.

Preserve photographic grain and strong contrast. Avoid stacking filters until faces or artwork disappear. Use `object-fit: cover` for deliberate photo crops and `contain` for complete artwork and enlarged gallery images. Set intrinsic dimensions or an aspect ratio to prevent layout jumps. Do not stretch images.

Optional grain, scanlines, tape edges, or registration offsets should be subtle, confined to art surfaces, and ignore pointer events. Do not put a readability-reducing texture over the whole interface. Apply `image-rendering: pixelated` only to genuinely pixel-based artwork.

## Responsive layout contract

All dimensions below refer to **CSS viewport pixels**, not physical display pixels. 720p means testing at 1280 × 720; 1080p means 1920 × 1080. Browser chrome, zoom, and OS scaling can leave less space, so the page must also work between these sizes and at shorter heights.

Start with a single-column layout. Add columns only when their content fits. Never scale the entire desktop page down, use a fixed page width, or hide overflow to disguise a broken layout. Vertical scrolling is expected.

| Viewport width | Home page | Gallery and gear |
| --- | --- | --- |
| 320–599px | One column; announcement and actions first, then shows and supporting media/social content | One column; stacked labels and values |
| 600–899px | Main content plus a compact sidebar only if readable; shows remain in normal flow | Gallery can use two columns; gear can stay one column |
| 900–1199px | Two outer columns; place shows below the main area rather than squeezing it | Two or three gallery columns; gear columns depend on actual card width |
| 1200px and above | Three columns with modest sidebars and a flexible central area | Up to three columns inside a bounded content area |

Use approximately 12–16px page gutters on phones and 20–32px on desktops. Bound the overall content around 1600px and center it on large displays, retaining the blue background. Existing gallery and gear limits around 1400px and 1200px are useful starting points.

An illustrative desktop shell, to adapt to the actual content:

```css
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  max-width: 100rem;
  margin-inline: auto;
}

.content-grid > * { min-width: 0; }

@media (min-width: 56.25rem) {
  .content-grid {
    grid-template-columns: clamp(10rem, 16vw, 13rem) minmax(0, 1fr);
  }
}

@media (min-width: 75rem) {
  .content-grid {
    grid-template-columns:
      clamp(11rem, 16vw, 15rem)
      minmax(0, 1fr)
      clamp(14rem, 20vw, 19rem);
  }
}
```

This is a sizing example, not a drop-in migration: update existing grid placements and DOM order together. Preserve a meaningful reading and keyboard order rather than only rearranging the visual layout with CSS.

Specific requirements:

- On mobile, music and its primary actions precede the long media sidebar. Shows must remain available; move them instead of using `display: none`.
- Navigation wraps into deliberate rows. Playback controls can occupy a second row; keep play/pause usable on every width. The clock is expendable decoration.
- Keep a sticky header compact. On short or landscape screens, allow header/footer chrome to return to normal flow if it crowds the content.
- At 1280 × 720, avoid the current `324px 1fr 450px` shell: it leaves only 506px for the center before its own padding. Use flexible sidebars and allow the hero's inner panels to stack independently.
- At 1920 × 1080, keep the content bounded rather than stretching text and controls across the display. More space may reveal more collage; it should not inflate every font.
- Use `minmax(0, 1fr)`, `min-width: 0`, wrapping flex rows, and `overflow-wrap: anywhere` for long filenames/URLs. Gear labels and values stack when the card is narrow, even on a wide screen.
- Images and videos must fit their containers. Use explicit aspect ratios instead of percentage heights with an undefined parent height.
- Popups need viewport gutters of at least 12–16px, a width no greater than the available viewport, and a maximum height based on `100dvh` with internal scrolling. Clamp dragged windows to visible bounds after dragging and resizing.
- Fixed tickers must reserve their actual wrapped height in the page and account for `env(safe-area-inset-bottom)`. Prefer an in-flow, wrapping news strip on narrow screens.

## Component behavior

### Buttons, links, and controls

Keep the chunky colored rectangle, black border, and offset shadow. Use a short 80–150ms press response: translate 2px and reduce the shadow. Hover is an enhancement for fine pointers; provide equally clear keyboard focus and pressed states.

Use `<a>` for navigation/download destinations and `<button>` for actions. Avoid clickable `<div>` controls. Provide a visible focus ring, such as a white outline with a black outer edge, that survives every accent background. Touch targets should be at least 44 × 44px, including popup close buttons and playback controls. A small icon can sit inside a larger target.

Underline text links and explicitly set their colors so browser defaults do not disappear against blue. Indicate current navigation with both text/decoration and `aria-current`. Label sliders programmatically. Loading, disabled, error, and success states need readable text; color alone is insufficient.

### Media, gallery, and windows

- Audio starts only after a user action. Keep playback state and displayed volume accurate. Handle failed playback visibly.
- Muted decorative video may loop with `playsinline`, but provide pause control and a static alternative. Avoid preloading every video/audio asset.
- Gallery thumbnails keep simple black frames and hard shadows. Enlargement needs a visible close button, Escape support, keyboard activation, and appropriate focus handling.
- Gray window bodies and blue title bars preserve the retro desktop motif. Open windows in response to an intentional action. Do not generate unsolicited popup piles.
- For modal dialogs, label the dialog, move focus inside, contain focus while open, and restore it to the trigger on close. For nonmodal windows, keep background interaction and keyboard navigation available.
- Dragging photos/windows is optional play. It must not be required to read content or perform an action, and must not intercept normal phone scrolling. Restrict drag gestures to explicit handles or disable them for coarse pointers.
- Keep the game secondary to music and shows. Its canvas must fit the container and offer understandable touch controls and a text description.

### Glitches and motion

Glitch is a decorative accent: a brief displaced edge, a tiny color fragment, or a momentary image offset. Keep it local to artwork. Avoid global random flashing overlays, rapid high-contrast flashing, or effects that obscure the interface.

Essential labels and payment/download links must remain continuously visible. Replace blinking calls to action with a static bright fill, underline, or shadow. Provide pause/stop controls for ongoing animated news and decorative motion.

Honor `prefers-reduced-motion: reduce` in both CSS and JavaScript: stop glitch timers, color cycling, ticker travel, decorative video autoplay, and nonessential animation loops. Show a static, fully readable news strip; remove ticker transforms and its offscreen starting padding. Keep user-requested playback and functional state changes usable. A CSS animation override alone does not stop JavaScript effects or video.

## Improvements to apply when changing existing UI

1. Replace the oversized fixed desktop columns with flexible, bounded columns and move to three columns only when they fit.
2. Put the main announcement/actions early in mobile reading order and keep show information visible.
3. Bound popup dimensions and drag positions; increase close-button targets.
4. Improve tiny metadata, low-contrast text, focus visibility, and nonsemantic controls without removing the neon palette.
5. Replace disappearing links and page-wide glitch flashes with restrained, controllable effects.
6. Consolidate duplicate popup CSS, repeated styles, and the duplicate home-page stylesheet include when touching those areas. Share tokens and component rules across pages; avoid new `!important` overrides.

These are intended improvements, not claims of completed fixes. Preserve the existing assets and character throughout.

## Acceptance checklist for frontend changes

Check every affected page and its interactive states, not just the home page screenshot:

- Test 320 × 568, 390 × 844, 768 × 1024, 1280 × 720, 1366 × 768, and 1920 × 1080 CSS viewports, plus a short landscape phone viewport.
- Resize between breakpoints and test desktop browser zoom at 200%. Text must reflow without clipping or horizontal page scrolling.
- Check the longest announcement, gear value, filename, and navigation state with playback controls visible.
- Verify shows, music actions, and the final content item remain reachable and are not covered by fixed chrome.
- Open each popup and gallery view on the smallest screen; verify close, scroll, focus, and resize behavior.
- Navigate with keyboard alone and touch. No action depends solely on hover, dragging, or color.
- Check reduced motion, paused media, missing images, loading, and failed media/share requests. Status messages stay readable and in the same visual language.
- Confirm the result still looks like SXTP: electric blue, neon blocks, Courier, hard edges, real band imagery, and a little controlled disorder.

For documentation-only changes, review the guide against the source; runtime checks apply when implementing UI changes. Report what was actually tested and any remaining limitations.
