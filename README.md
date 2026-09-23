# LEV Wild Spirit - Catálogo Web Oficial 🚴‍♂️⚡

Catálogo interactivo de alto rendimiento para **LEV Wild Spirit**, especializado en equipamiento deportivo para Ciclismo, Gimnasio y Escalada.

## 🚀 Características Principales
- **Arquitectura desacoplada:** Todo el inventario se gestiona dinámicamente desde `data/productos.json`.
- **Zoom interactivo estilo Amazon:** Lupa de hover sobre las fotos y lightbox HD de pantalla completa con pan/zoom táctil y botones de escala.
- **Deep Linking con URLs únicas:** Cada producto cuenta con enlace directo (ej: `#producto-lev-cas-12h15-001`) mediante History API sin recargas.
- **Optimización Meta & SEO:** Metatags Open Graph dinámicos y datos estructurados Schema.org (`Product` JSON-LD).
- **Integración con Meta Commerce:** Archivo `catalogo-meta.csv` listo para sincronizar con Facebook e Instagram Shopping.
- **Botones dinámicos de WhatsApp:** Mensajes predeterminados personalizados por producto con variante, precio y referencia.
- **100% Responsivo:** Adaptado para móviles, tabletas y computadoras.

---

## 📂 Estructura del Proyecto

```
├── index.html              # Estructura principal y metatags SEO/Open Graph
├── style.css               # Sistema de diseño, Dark Mode atlético y responsive
├── app.js                  # Motor de catálogo, routing, zoom y WhatsApp
├── catalogo-meta.csv       # Catálogo exportable para Meta (Facebook/Instagram)
├── data/
│   └── productos.json      # Base de datos de productos y categorías
├── images/
│   ├── brand/              # Logos y favicons oficiales
│   └── products/           # Fotografías y videos demostrativos
├── favicon.ico             # Favicon raíz del león oficial
├── favicon.png             # Favicon PNG de alta resolución
└── README.md               # Documentación del proyecto
```

---

## 🌐 Publicar en GitHub Pages (Paso a Paso)

1. **Crear repositorio en GitHub:**
   - Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio (ej: `lev-wild-spirit`).

2. **Subir el código:**
   ```bash
   git init
   git add .
   git commit -m "Catálogo oficial LEV Wild Spirit v1.0"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

3. **Activar GitHub Pages (Sitio Web Gratis con HTTPS):**
   - En tu repositorio en GitHub, ve a **Settings** &rarr; **Pages**.
   - En **Build and deployment** &rarr; **Branch**: Selecciona `main` y carpeta `/(root)`.
   - Haz clic en **Save**.
   - ¡Tu sitio web estará publicado en pocos minutos en `https://TU-USUARIO.github.io/TU-REPOSITORIO/`!

---

© 2026 LEV Wild Spirit. Todos los derechos reservados.
