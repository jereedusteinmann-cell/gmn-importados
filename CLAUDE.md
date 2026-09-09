# GMN Importados — sitio de demo para pitch de rediseño

## Qué es esto
Sitio estático (HTML/CSS/JS puro, sin build ni framework) que recrea la tienda
real de **GMN Importados** (decants de perfumes originales, Villa Luzuriaga,
Buenos Aires) con un diseño mejorado. El objetivo es mostrárselo al dueño real
del negocio para venderle un rediseño de su tienda actual.

- Tienda real (referencia): https://gmnimportados.mitiendanube.com
- Demo publicada: https://magenta-fairy-f7115d.netlify.app (Netlify, cuenta
  reclamada por el usuario — para actualizar: pestaña **Deploys** del proyecto
  en app.netlify.com, arrastrar `web-lista.zip` ahí)
- WhatsApp real del negocio: `541128710667` (botón/CTA) — el texto de otras
  páginas de la tienda real menciona `1157939374`, pero se usa el primero
  (confirmado con el usuario) porque es el que está en el botón activo.
- Teléfono: `1128710667`
- Dirección: Del Campillo 2752, entre Jujuy y Juan Florio, Villa Luzuriaga —
  retiro lunes a viernes de 12 a 17 hs.
- Instagram: @gmn.importados

## Estructura
- `index.html`, `decants.html`, `perfumes.html`, `mayorista.html`,
  `producto.html` (ficha genérica, lee `?id=`), `como-comprar.html`,
  `preguntas-frecuentes.html`, `cambios-y-devoluciones.html`
- `site.css` — hoja de estilos compartida por todas las páginas
- `motion.css` / `motion.js` — mini kit de animación vanilla (reveal on
  scroll, contador, marquee, pulso); no tocar la lógica salvo que haga falta
- `decants-data.js` — array `DECANTS` con los **83 productos reales**
  (49 decants + 34 perfumes de liquidación), cada uno con `category`
  (`'decant'` o `'perfume'`), `id`, `slug`, `name`, `brand`, `price`, `img`,
  `desc`. `decants.html`/`perfumes.html` filtran por `category` y renderizan
  el grid con JS; `producto.html` busca por `id` y muestra la ficha.
- `assets/` — logo, hero banner, fotos reales de producto (`assets/decants/`,
  `assets/perfumes/`), todas descargadas de la tienda real (algunas
  recortadas para aislar el frasco cuando el original traía carteles de
  oferta superpuestos)
- `original/` — HTML crudo descargado de la tienda real (páginas de
  categoría, JSON de productos) — material de referencia para extraer más
  datos si hace falta, no se publica
- `web-lista.zip` — paquete listo para subir a Netlify; **regenerar después
  de cualquier cambio** con:
  `tar -a -cf web-lista.zip index.html decants.html producto.html perfumes.html mayorista.html como-comprar.html preguntas-frecuentes.html cambios-y-devoluciones.html decants-data.js site.css motion.css motion.js assets`
  (en Windows, usar la ruta completa `/c/Windows/System32/tar.exe` — el
  `tar` de Git Bash no crea zips de verdad)
- `branding.json`, `diagnostico.md`, `propuesta.md`,
  `preguntas-reunion-tiendanube.md` — material de venta/contexto, no forman
  parte del sitio publicado

## Dirección de arte actual
Minimalismo claro, inspirado en apple.com/store:
- Fondo claro `#F5F5F7`, tarjetas blancas, texto casi negro `#1D1D1F`
- Acento dorado `#97740A` (texto/links), usado con moderación — es el único
  color de marca real que tiene el negocio (viene del logo y las fotos)
- Header y footer oscuros (como el nav/footer de Apple), el resto de la
  página clara
- Tipografía: **Poppins** (peso 700–900) para títulos — elegida porque se
  parece a la fuente gruesa y geométrica del logo real ("GMN"); fuente del
  sistema (`-apple-system`, etc., sin cargar nada) para el texto normal
- Tarjetas con radio de esquina chico (8px) y botones en pastilla (999px) —
  se probó con radios grandes (18px+) y el usuario lo sintió "genérico/IA",
  se bajó a propósito
- Jerarquía de títulos: h1 en negrita fuerte (800), h2/h3 más livianos (600)
  — antes todo estaba al mismo peso y se sentía "de plantilla"

## Reglas que ya se acordaron con el usuario
- **Nunca inventar datos del negocio** (precios, teléfonos, reseñas) — todo
  lo que se muestra viene de la tienda real, extraído y verificado
- Las fotos de producto de la tienda real vienen con carteles de marketing
  superpuestos ("SALE 50%", "HOT SALE") — se usan tal cual cuando el usuario
  pidió fidelidad exacta a la tienda real; para los "más vendidos" curados sí
  se recortaron para aislar el frasco
- **No hay backend ni carrito real** — es un sitio estático de demo. El botón
  de compra siempre manda a WhatsApp. Si el dueño acepta el rediseño, el
  paso siguiente (proyecto aparte, no en este repo) sería construir esto
  como un **tema real de Tiendanube** (su lenguaje de plantillas propio) para
  que el carrito/cobro reales sigan funcionando sin migrar de plataforma —
  ver `preguntas-reunion-tiendanube.md` para la explicación completa.
- Filtros de catálogo (precio/marca) se probaron y se sacaron — el usuario
  prefirió dejarlo simple (solo orden) hasta que haya un backend real.

## Para previsualizar en local
```
py -3 -m http.server 8777
```
y abrir `http://localhost:8777` (usar `py -3`, no `python3`, en Windows).
