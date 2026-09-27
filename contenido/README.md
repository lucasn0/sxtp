# Cómo actualizar la página

Todo lo que se actualiza seguido está en esta carpeta. No hace falta tocar
ningún otro archivo ni saber programar: cambiás algo acá, guardás, y en uno o
dos minutos aparece en [sxtp.com.ar](https://sxtp.com.ar).

| Qué querés cambiar | Dónde |
| --- | --- |
| Los próximos shows | [`shows.txt`](shows.txt) |
| Las fotos de la galería | la carpeta [`galeria`](galeria) |

---

## Agregar o cambiar un show

1. Abrí [`shows.txt`](shows.txt).
2. Tocá el **lápiz ✏️** arriba a la derecha ("Edit this file").
3. Escribí una línea por show, así:

   ```
   15/11 | El Portal, Almagro | https://www.tikzet.com/events/lo-que-sea
   22/11 | Parque Patricios
   ```

   Primero la fecha, después el lugar, y si hay link de entradas va al final.
   Separás cada cosa con una barra `|`.
4. Tocá el botón verde **Commit changes...** y de nuevo **Commit changes**
   en la ventanita (dejá marcado "Commit directly to the main branch").

Cosas que la página hace sola:

- Ordena los shows por fecha, así que no importa en qué orden los escribas.
- Esconde los shows que ya pasaron. No hace falta borrarlos.
- Si no queda ningún show, muestra "nuevas fechas pronto".

## Subir fotos a la galería

1. Entrá a la carpeta [`galeria`](galeria).
2. Tocá **Add file** → **Upload files**.
3. Arrastrá las fotos (podés subir varias juntas).
4. Tocá el botón verde **Commit changes**.

Listo: las fotos nuevas aparecen primeras en la galería. El nombre del archivo
no importa.

- Subí las fotos en **.jpg** o **.png**. Si mandás una foto de iPhone en
  formato HEIC, no se va a mostrar: exportala como JPG primero.
- Si una foto es un **flyer o una tapa** y querés que se vea entera (en vez de
  recortada en un cuadrado), o querés escribirle una descripción, agregá una
  línea en [`galeria/descripciones.txt`](galeria/descripciones.txt). Es opcional.

### Sacar una foto

Entrá a la foto dentro de [`galeria`](galeria), tocá los tres puntitos **···**
arriba a la derecha → **Delete file** → **Commit changes**.

---

## ¿Salió bien?

Después de guardar, arriba de la lista de archivos aparece un circulito al
lado de tu cambio:

- 🟡 amarillo: se está publicando, esperá un minuto.
- ✅ verde: ya está en la página. Si no lo ves, recargá la página.
- ❌ rojo: algo falló. Avisale a Lucas.

Si te equivocás en algo, no pasa nada: se puede volver para atrás. Cualquier
cosa rara en `shows.txt` (una fecha mal escrita, por ejemplo) no rompe la
página, solo se saltea esa línea.
