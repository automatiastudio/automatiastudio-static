# Automatia Studio — sitio web

Sitio estático. No necesita build, ni Node, ni framework. Solo son archivos.
Abre `index.html` con doble clic y funciona, incluso sin internet.

## Archivos

```
site/
├── index.html          Landing principal
├── terminos.html       Contrato de Servicio SmartApps
├── privacidad.html     Política de Privacidad
├── styles.css          Estilos base + estados (hover, active, responsive)
├── script.js           Header, animaciones, video, Cal.com y fondo del hero
├── vendor/             Librerías empaquetadas (no requieren internet)
│   ├── three.min.js        Fondo animado del hero
│   ├── fonts.css           Jost e Inter
│   ├── phosphor.css        Iconos
│   └── fonts/              Archivos .woff2 de las tres familias
└── assets/
    ├── logo.png
    └── img/
        ├── video-cover.jpg     Portada del video
        ├── clientes/           30 logos de clientes
        ├── tools/              6 logos de herramientas
        ├── equipo/             3 fotos de testimonios + retrato
        └── DESCARGAR.md        Tabla ruta → origen de esas 40 imágenes
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube el **contenido** de esta carpeta a la raíz del repositorio (que `index.html` quede en la raíz).
3. En el repo, ve a **Settings → Pages**.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
5. En un par de minutos queda publicado en `https://tuusuario.github.io/tu-repo/`.

Para dominio propio: en **Settings → Pages → Custom domain** escribe `automatiastudio.com` y apunta el DNS a GitHub Pages.

## Imágenes

Todo es local: no queda ninguna referencia a `automatiastudio.com`. El HTML apunta
directamente a `assets/img/…`, así que **esos 40 archivos tienen que existir** en las rutas
indicadas o esas imágenes saldrán rotas. No hay respaldo remoto.

La tabla ruta → origen de cada archivo está en
[`assets/img/DESCARGAR.md`](assets/img/DESCARGAR.md), por si necesitas reponer alguno.

Con esos archivos en su lugar, el sitio abre y se ve completo sin conexión.

## Lo que siempre necesita internet

- **Cal.com** el calendario de agendamiento. Sin conexión aparece un aviso con el botón de
  WhatsApp en su lugar.
- **YouTube** el video del lightbox. La portada sí es local.

## Qué se puede cambiar sin tocar diseño

Arriba de `script.js`:

```js
var CONFIG = {
  videoId: 'faTA1PrSasA',              // ID del video de YouTube
  calLink: 'sebastianmejia/asesoria',  // enlace del calendario de Cal.com
  calNamespace: 'asesoria'
};
```

WhatsApp y correo están escritos directo en el HTML. Para cambiarlos, busca y reemplaza
`19302006200` y `info@automatiastudio.com` en los cuatro archivos `.html` con contenido.

## Notas técnicas

- Los estilos van en línea en el HTML, y `styles.css` contiene solo lo que el atributo `style`
  no puede expresar: hover, active, focus, media queries, keyframes y scrollbar. Por eso la
  página pinta antes de que cargue el CSS.
- Los logos de clientes se ven blancos gracias a `filter: brightness(0) invert(1)`, sin importar
  el color del archivo original.
- Con `prefers-reduced-motion` activo, el fondo animado no arranca y las apariciones se desactivan.
- Las páginas legales llevan `noindex, nofollow`.
- El botón flotante de WhatsApp es el enlace con clase `om-wa`, fijo abajo a la derecha con
  20px de margen y `z-index: 120` (queda por debajo del lightbox del video). Está en la home,
  Diagnóstico y las dos páginas legales; su hover vive en `styles.css`.
