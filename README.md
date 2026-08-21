# Larco Visión — sitio web

Clínica y cirugía de ojos, Quito. Sitio estático: HTML, CSS y un archivo JS sin
dependencias ni build. Se abre `index.html` y funciona.

Implementa el artboard **Inicio** del proyecto de Claude Design
[“Website mockup creation”](https://claude.ai/design/p/f77e51cf-320f-4e19-8f78-36ab6697be1a),
con la paleta del design system de Larco Visión. Del board de referencia que
mandó el cliente se toma la composición —esquinas redondeadas, display ligero,
tiles separados— y el tipo de fotografía, no sus colores cálidos.

## Correr en local

```bash
python3 -m http.server 8731
```

Luego `http://localhost:8731`. Hace falta un servidor (no `file://`) porque las
fuentes se cargan con rutas relativas y `file://` las bloquea por CORS.

## Estructura

```
index.html                  Página de Inicio, completa
assets/
  css/
    fonts.css               @font-face de Montserrat (self-hosted)
    tokens.css              Paleta, tipografía, espaciado, tema claro/oscuro, base
    components.css          Botón, PillTag, SectionLabel, StatCounter,
                            ServiceCard, DoctorCard, TestimonialCard
    site.css                Layout de la página, responsive, motion, print
  js/site.js                Header, menús, modo oscuro, zoom de texto,
                            reveals y contadores
  fonts/                    Montserrat woff2 (variable, latin + latin-ext)
  img/                      Logos + fotografía (ver photos/CREDITS.md)
_design/                    Fuente importada de Claude Design (no se sirve)
```

Los `<link>` y `<script>` llevan `?v=N`. **Al cambiar un CSS o el JS, súbele el
número** o los navegadores servirán la versión vieja en caché.

Las imágenes y las fuentes **no** llevan `?v=N` a propósito: son demasiadas para
mantenerlas a mano. La regla para ellas es al revés — **una foto que se
reemplaza estrena nombre de archivo** (`dr-marcelo-larco-2.webp`), así la URL
cambia con el contenido. Cuando haya hosting, lo definitivo es cache inmutable
para `/assets/img/` y `/assets/fonts/`.

## Diseño

Paleta en `assets/css/tokens.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--surface-page` | `#FFFFFF` | Fondo general, blanco puro |
| `--surface-raised` | `#FFFFFF` | Paneles y superposiciones (menús, skip link) |
| `--surface-card` | `#EEF4FB` | Tarjetas de contenido, con tinte azul |
| `--border-card` | `#D2E0F0` | Filo de esas tarjetas |
| `--surface-sunken` | `#F7FAFD` | Secciones alternas, apenas perceptible |
| `--text-body` / `--petrol` | `#27285A` | Tinta petróleo |
| `--brand-deep` | `#27285A` | Botón primario, tarjetas sobre foto |
| `--accent` / `--teal` | `#4F8FCC` | Rellenos, botón flotante, marcador de dos puntos |
| `--accent-display` | `#4581BC` | El acento como texto grande (titulares) y anillo de foco |
| `--accent-strong` | `#35659B` | El acento como texto chico (enlaces, hover) |
| `--accent-light` | `#6FA6DB` | El acento como texto en tema oscuro |
| `--mark` | `#E8802F` | Punto de 12px que abre cada titular — el único ámbar |

El acento tiene varios pasos porque el mismo teal no puede ser relleno y texto
legible de 13px a la vez: `--accent` se queda en 3,15:1 sobre el fondo, así que
los titulares usan `--accent-display` y el texto chico `--accent-strong`. Los 42
pares de color de la página pasan WCAG AA en ambos temas.

Es una clínica, así que el fondo es blanco puro y el color lo llevan las
tarjetas: relleno `#EEF4FB` con filo `#D2E0F0`, como en la referencia que
aprobó el cliente. Las secciones alternas van a `#F7FAFD`, lo justo para dar
ritmo sin romper la lectura de blanco.

El tema oscuro es el del mockup: `#13142E` de fondo, `#1B1C40` en tarjetas.

Tipografía: **Montserrat** en todo, incluido el display — así lo fija el mockup,
que sobreescribe la Playfair Display del design system. Está self-hosted en
`assets/fonts/`: el sitio no hace ninguna petición a terceros en runtime.

Modo oscuro y zoom de lectura (100 / 112 / 125 %) se guardan en `localStorage`
(`lv-dark`, `lv-zoom`).

**Menú móvil** (≤1024px): hoja a pantalla completa bajo el header. Las dos
secciones con hijos —Sobre Nosotros y Servicios— son acordeones cerrados por
defecto, cada uno con su propio botón de despliegue, así que el menú abre en
cinco filas en vez de cuarenta enlaces. Tocar el texto navega; tocar el chevron
despliega.

## Configuración

`assets/js/site.js`, arriba del todo:

```js
var CONFIG = {
  whatsapp: '',      // ← número real de la clínica; vacío = sin configurar
  animations: true   // false apaga reveals y contadores
};
```

`whatsapp` alimenta los enlaces con `data-whatsapp` (el botón flotante y el
enlace del pie). Se limpia a dígitos y arma `https://wa.me/<número>`.

**Mientras esté vacío** esos enlaces conservan su destino del HTML —
`contactanos.html`— en vez de apuntar a un número que no es de la clínica. En
cuanto pongas el número real (mínimo 8 dígitos), pasan a abrir WhatsApp.

## Pendiente

Marcado en la página con `[ … ]` o con la palabra “pendiente”:

- [ ] **Video del hero** — hoy es una foto con el aviso “video pendiente — foto provisional”
- [ ] **Casos clínicos 01–03** — “[ pendiente de información del cliente ]”
- [ ] **Dirección y teléfono** — “Cumbayá · Quito, Ecuador — dirección por confirmar”
- [ ] **Número de WhatsApp** — `CONFIG.whatsapp` está vacío; hasta que se llene,
      los enlaces de WhatsApp llevan a `contactanos.html`
- [ ] **Mapa** — el pie tiene un recuadro “[ mapa — Google Maps ]”
- [ ] **Facebook e Instagram** — los enlaces apuntan a `#`
- [ ] **Testimonios** — los tres dicen “testimonio de ejemplo”
- [ ] **Fotografía propia** — todo es placeholder de Unsplash, incluidos los
      retratos, que **no son los doctores reales**
      (ver `assets/img/photos/CREDITS.md`)

## Páginas que faltan

La navegación y el pie ya enlazan a las cinco páginas restantes del proyecto de
diseño, que **todavía no están implementadas** — esos enlaces dan 404:

`sobre-nosotros.html` · `consultas-examenes.html` · `especialidades.html` ·
`casos-clinicos.html` · `contactanos.html`

Sus artboards existen en el proyecto de Claude Design; ver `_design/README.md`
para cómo leerlos.
