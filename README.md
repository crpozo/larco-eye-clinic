# Larco Visión — sitio web

Clínica y cirugía de ojos, Quito. Sitio estático: HTML, CSS y un archivo JS sin
dependencias ni build. Se abre `index.html` y funciona.

Implementa el artboard **Inicio** del proyecto de Claude Design
[“Website mockup creation”](https://claude.ai/design/p/f77e51cf-320f-4e19-8f78-36ab6697be1a),
con la paleta y la fotografía del board de referencia que aprobó el cliente.

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

## Diseño

Paleta del board aprobado, en `assets/css/tokens.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--surface-page` | `#F1EFEC` | Papel cálido, fondo general |
| `--surface-raised` | `#FAF9F7` | Tarjetas |
| `--surface-sunken` | `#E7E4DF` | Secciones alternas |
| `--ink` / `--text-body` | `#1C1E20` | Texto |
| `--brand-deep` | `#2A2D30` | Botón primario, tarjetas oscuras |
| `--slate` | `#8FA0AC` | Gris azulado clínico, placeholders |
| `--accent` | `#D2703C` | Terracota: rellenos, display, marcador de dos puntos |
| `--accent-strong` | `#A9512A` | El mismo acento cuando es texto chico (contraste) |

Tipografía: **Montserrat** en todo, incluido el display — así lo fija el mockup,
que sobreescribe la Playfair Display del design system. Está self-hosted en
`assets/fonts/`: el sitio no hace ninguna petición a terceros en runtime.

Modo oscuro y zoom de lectura (100 / 112 / 125 %) se guardan en `localStorage`
(`lv-dark`, `lv-zoom`).

## Configuración

`assets/js/site.js`, arriba del todo:

```js
var CONFIG = {
  whatsapp: '593 99 999 9999',   // ← número real de la clínica
  animations: true               // false apaga reveals y contadores
};
```

`whatsapp` alimenta todos los enlaces con `data-whatsapp` (el botón flotante y el
enlace del pie). Se limpia a dígitos y arma `https://wa.me/<número>`.

## Pendiente

Marcado en la página con `[ … ]` o con la palabra “pendiente”:

- [ ] **Video del hero** — hoy es una foto con el aviso “video pendiente — foto provisional”
- [ ] **Casos clínicos 01–03** — “[ pendiente de información del cliente ]”
- [ ] **Dirección y teléfono** — “Cumbayá · Quito, Ecuador — dirección por confirmar”
- [ ] **Número de WhatsApp** — `CONFIG.whatsapp` es un placeholder
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
