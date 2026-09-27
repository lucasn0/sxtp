# sxtp.com.ar

**¿Querés cambiar los shows o subir fotos?** Todo está en la carpeta
[`contenido`](contenido), con las instrucciones paso a paso.

---

For development: the site is static HTML/CSS/JS, published by
`.github/workflows/deploy.yml`. On each push the workflow runs
`scripts/build-content.mjs`, which rewrites the shows list in `index.html` and
the grid in `pages/gallery.html` from `contenido/`. Run it locally
(`node scripts/build-content.mjs`) to preview those changes.
