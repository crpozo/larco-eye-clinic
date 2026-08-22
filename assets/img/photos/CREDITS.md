# Fotografía — provisional

Todas estas imágenes son **placeholders de Unsplash**, elegidas para igualar el
board de referencia aprobado (macro de iris en oscuro, óptica sobre fondo claro,
equipo oftalmológico en gris azulado, macro de ojo cálido). Se reemplazan por
fotografía propia de la clínica antes de publicar.

Licencia Unsplash: uso comercial permitido, sin atribución obligatoria. Aun así
se deja el registro para poder dar crédito y para reponer el original.

| Archivo | Unsplash ID | Uso en la página |
| --- | --- | --- |
| `hero-iris.webp`, `hero-iris-1200.webp` | `2wDxCCw83HM` | Hero. Recortado a cuadrado sobre el iris; el original trae mucho negro arriba y abajo. **Va a reemplazarse por video.** |
| `cirugias.webp` | `Nanf8oLglmg` | Tarjeta de servicio 01 · Cirugías |
| `examenes.webp` | `fiHQ3-D45zo` | Tarjeta de servicio 02 · Exámenes |
| `consultas.webp` | `3r0Mv2Muvyk` | Tarjeta de servicio 03 · Consultas |
| `dr-marcelo-larco-2.webp` | `VAvkPtF4HJI` | Retrato Dr. Marcelo Larco. Recorte 2:3 de 800×1200 sobre el rostro (x≈50,5%, 72% del alto del original), para la ficha vertical de la portada. |
| `dr-roberto-larco-2.webp` | `XSPFs82j_v0` | Retrato Dr. Roberto Larco. Recorte 2:3 de 800×1200 (x≈57%, alto completo), encuadrado para igualar el plano del anterior. |
| `equipo-optica.webp` | `C6sxSzPUjss` | Carrusel · Óptica ZEISS |
| `equipo-iol-master.webp` | `D74jLvxv6yo` | Carrusel · IOL Master 700 |
| `equipo-pentacam.webp` | `-OpWKFHA_yQ` | Carrusel · Pentacam OCT |
| `equipo-oct-triton.webp` | `mDCuzdHh_bw` | Carrusel · OCT Triton Plus |
| `equipo-humphrey.webp` | `aWiUrTr16S4` | Carrusel · Humphrey FA3 |
| `equipo-laser-pascal.webp` | `IzvQ1R5I_Gw` | Carrusel · Láser Pascal 577 |
| `intro-tecnologia.webp` | `aMmDIsdnUro` | Foto vertical de la sección de introducción |
| `intro-doctor-paciente.webp` | `ibZ2QiKkEsg` | Foto pequeña superpuesta de la introducción |

Página de origen: `https://unsplash.com/photos/<ID>`

Los dos retratos venían apaisados (1400×788) y la ficha nueva de la portada es
vertical 2:3, así que se rehicieron desde el original de Unsplash a 800×1200 en
vez de dejar que el navegador recortara el 31% central y lo escalara. El mismo
archivo alimenta la ficha de `sobre-nosotros.html`, que ya era vertical.

**Los retratos no son los doctores reales.** Son marcadores de composición y
deben sustituirse antes de cualquier publicación.

## Reponer una imagen

    curl -sSL -o /tmp/src.jpg "https://unsplash.com/photos/<ID>/download?w=1080"
    cwebp -quiet -q 78 /tmp/src.jpg -o <nombre>.webp

## Video de portada

`../../video/hero.mp4` es material que aportó el cliente (macro de iris), no de
Unsplash. `hero-poster.webp` es un fotograma extraído de ese mismo video, para
que el estado previo a la carga y el primer cuadro coincidan.
