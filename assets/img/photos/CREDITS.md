# Fotografía — provisional

Todas estas imágenes son **placeholders de Unsplash**, elegidas para igualar el
board de referencia aprobado (macro de iris en oscuro, óptica sobre fondo claro,
equipo oftalmológico en gris azulado, macro de ojo cálido). Se reemplazan por
fotografía propia de la clínica antes de publicar.

Licencia Unsplash: uso comercial permitido, sin atribución obligatoria. Aun así
se deja el registro para poder dar crédito y para reponer el original.

| Archivo | Unsplash ID | Uso en la página |
| --- | --- | --- |
| `hero-ojo.webp`, `hero-ojo-800.webp` | — (aportada por el cliente) | Fondo del hero, en color |
| `cirugias.webp` | `Nanf8oLglmg` | Tarjeta de servicio 01 · Cirugías |
| `examenes.webp` | `fiHQ3-D45zo` | Tarjeta de servicio 02 · Exámenes |
| `consultas.webp` | `3r0Mv2Muvyk` | Tarjeta de servicio 03 · Consultas |
| `dr-marcelo-larco-3.webp` | Pexels `8460090` | Retrato Dr. Marcelo Larco. Recorte 9:16 de 800×1422 (x≈48%, alto completo). |
| `dr-roberto-larco-3.webp` | Pexels `8460094` | Retrato Dr. Roberto Larco. Recorte 9:16 (x≈48%, 78% del alto) para igualar el tamaño de cabeza del anterior. |
| `dra-ana-larco.webp` | Pexels `8459997` | Retrato Dra. Ana Larco. Recorte 9:16 (x≈70%, 86% del alto). |
| `equipo-optica.webp` | `C6sxSzPUjss` | Ficha de instalaciones en sobre-nosotros |
| `equipo-iol-master.webp` | `D74jLvxv6yo` | Ficha de equipos (IOL Master 700) en sobre-nosotros |
| `equipo-pentacam.webp` | `-OpWKFHA_yQ` | Ficha de equipos (Pentacam OCT) en sobre-nosotros |
| `equipo-oct-triton.webp` | `mDCuzdHh_bw` | Ficha de equipos (OCT Triton Plus) en sobre-nosotros |
| `equipo-humphrey.webp` | `aWiUrTr16S4` | Ficha de equipos (Humphrey FA3) en sobre-nosotros |
| `equipo-laser-pascal.webp` | `IzvQ1R5I_Gw` | Ficha de equipos (Láser Pascal 577) en sobre-nosotros |
| `intro-tecnologia.webp` | `aMmDIsdnUro` | Sin uso desde el rediseño editorial (la intro salió de la portada); se conserva por si vuelve |
| `intro-doctor-paciente.webp` | `ibZ2QiKkEsg` | Sin uso desde el rediseño editorial; se conserva por si vuelve |

Página de origen: `https://unsplash.com/photos/<ID>`

Los tres retratos son de **Pexels**, los tres de la misma serie de *Los Muertos
Crew*: tres personas distintas con el mismo tratamiento de luz, que es lo que
hace que la fila se lea pareja. Antes eran dos fotos de Unsplash del **mismo
modelo de stock**, que era justo lo que se notaba.

Licencia Pexels: uso comercial permitido, sin atribución obligatoria.

La búsqueda de Unsplash dejó de responder sin credencial, así que para reponer
una foto de ahí hay que usar el ID exacto de la tabla. Las de Pexels se reponen
con la API y el ID de la tabla.

**Los retratos no son los doctores reales.** Son marcadores de composición y
deben sustituirse antes de cualquier publicación.

## Reponer una imagen

    curl -sSL -o /tmp/src.jpg "https://unsplash.com/photos/<ID>/download?w=1080"
    cwebp -quiet -q 78 /tmp/src.jpg -o <nombre>.webp
