# LEV Wild Spirit - Catálogo Web Oficial 🚴‍♂️⚡
**Dominio Oficial:** [https://levwild.com/](https://levwild.com/)

Catálogo interactivo de alto rendimiento para **LEV Wild Spirit**, especializado en equipamiento deportivo para Ciclismo, Gimnasio y Escalada.

---

## 🚀 Características Principales

- **Arquitectura dinámica desacoplada:** Todo el inventario se gestiona centralizadamente desde [`data/productos.json`](data/productos.json).
- **URLs 100% Limpias para SEO (Sin Hashtags `#`):**
  - Subpáginas canónicas dedicadas: `/cascos/`, `/guantes/`, `/luces-delanteras/`, `/luces-traseras/`, `/audifonos/`, `/gafas/`, `/bolsas/`, `/gorras/`, `/componentes/`.
  - Open Graph y Twitter Cards dedicados con vista previa enriquecida para WhatsApp y redes sociales.
  - Generación automática de `sitemap.xml` y `robots.txt`.
- **Selector de variantes interactivo:** Cambio de color/diseño en tiempo real directamente en la tarjeta de producto y en el modal detallado.
- **Zoom HD estilo Amazon:** Lupa de hover sobre las fotos y lightbox HD de pantalla completa con pan/zoom táctil y controles de escala.
- **Botones inteligentes de WhatsApp:** Mensajes predeterminados automáticos con el Nombre exacto, Variante de color y Precio en USD.
- **Integración con Meta Commerce:** Archivo `catalogo-meta.csv` sincronizado para Facebook & Instagram Shopping.
- **100% Responsive & Mobile-First:** Adaptado para teléfonos inteligentes, tablets y computadoras de escritorio.

---

## 📂 Estructura del Proyecto

```
├── index.html              # Página de inicio del catálogo general (https://levwild.com/)
├── CNAME                   # Configuración del dominio personalizado (levwild.com)
├── style.css               # Sistema de diseño, Dark Mode atlético y responsive
├── app.js                  # Motor dinámico del catálogo, routing limpio y zoom
├── sync_catalogo.py        # Sincronizador maestro automático
├── sitemap.xml             # Mapa del sitio oficial para indexación en Google
├── robots.txt              # Directivas de rastreo para buscadores
├── 404.html                # Enrutador fallback para GitHub Pages
├── catalogo-meta.csv       # Catálogo exportable para Meta (Facebook/Instagram)
├── data/
│   └── productos.json      # Base de datos maestra de productos y categorías
├── images/
│   ├── brand/              # Logos y favicons oficiales
│   └── products/           # Fotografías WebP y videos demostrativos
├── cascos/                 # Subpágina SEO: https://levwild.com/cascos/
├── guantes/                # Subpágina SEO: https://levwild.com/guantes/
├── luces-delanteras/       # Subpágina SEO: https://levwild.com/luces-delanteras/
├── luces-traseras/         # Subpágina SEO: https://levwild.com/luces-traseras/
├── audifonos/              # Subpágina SEO: https://levwild.com/audifonos/
├── gafas/                  # Subpágina SEO: https://levwild.com/gafas/
├── bolsas/                 # Subpágina SEO: https://levwild.com/bolsas/
├── gorras/                 # Subpágina SEO: https://levwild.com/gorras/
└── componentes/            # Subpágina SEO: https://levwild.com/componentes/
```

---

## ⚡ Cómo Agregar Productos, Cambiar Precios o Modificar Stock

El flujo está completamente estandarizado en 3 simples pasos:

1. **Editar datos:** Abre [`data/productos.json`](data/productos.json) y agrega/modifica productos o precios.
2. **Sincronizar:** Ejecuta en la terminal:
   ```bash
   python3 sync_catalogo.py
   ```
3. **Publicar:**
   ```bash
   git add .
   git commit -m "Actualizar catálogo"
   git push origin main
   ```
*(El script `sync_catalogo.py` se encarga automáticamente de actualizar `app.js`, todas las subpáginas, el archivo `catalogo-meta.csv` y el `sitemap.xml` sin alterar el formato ni diseño).*

---

© 2026 LEV Wild Spirit. Todos los derechos reservados.
