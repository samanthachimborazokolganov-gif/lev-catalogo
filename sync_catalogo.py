#!/usr/bin/env python3
"""
LEV WILD SPIRIT - Sincronizador Maestro del Catálogo v3.0
==========================================================
Este script es la herramienta estándar para actualizar el catálogo.
Cada vez que agregues un producto, cambies un precio o modifiques inventario:
1. Edita 'data/productos.json'
2. Ejecuta: python3 sync_catalogo.py
3. Haz git add . && git commit -m "update: ..." && git push

El script genera automáticamente:
- app.js (con el dataset embebido de respaldo y URLs limpias)
- index.html (limpio sin hashtags para SEO)
- Subpáginas por categoría (/cascos/, /guantes/, /luces-delanteras/, etc.)
- catalogo-meta.csv (sincronizado para Facebook & Instagram Shopping)
- sitemap.xml (actualizado con fechas y prioridades SEO)
- robots.txt
- 404.html (para GitHub Pages routing)
"""

import os
import re
import csv
import json

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT_DIR)

# 1. Cargar datos maestros
with open('data/productos.json', 'r', encoding='utf-8') as f:
    catalog_data = json.load(f)

json_str = json.dumps(catalog_data, ensure_ascii=False, indent=2)

# 2. Construir app.js
app_js_code = f"""/**
 * LEV WILD SPIRIT - MOTOR DE CATÁLOGO DINÁMICO v3.0
 * - URLs 100% LIMPIAS SIN HASHTAGS (#) PARA SEO (ej: https://levwild.com/cascos/, https://levwild.com/guantes/)
 * - Subpáginas estáticas dedicadas por categoría con Metatags Open Graph y Twitter Cards
 * - Sincronización en tiempo real de variantes de diseño y color en tarjeta y modal
 * - Mensajes de WhatsApp predeterminados exactos con Nombre, Variante y Precio USD
 * - Showcase cinemático de videos demostrativos en ruta
 * - Zoom interactivo HD con lupa y Lightbox fullscreen
 */

(function () {{
  'use strict';

  function getBasePrefix() {{
    if (typeof window !== 'undefined') {{
      if (window.location.protocol === 'file:') {{
        const scriptEl = document.querySelector('script[src*="app.js"]');
        return scriptEl ? scriptEl.getAttribute('src').replace('app.js', '') : './';
      }}
      return '/';
    }}
    return './';
  }}

  // Configuración global
  const CONFIG = {{
    dataPath: getBasePrefix() + 'data/productos.json',
    imagesPath: getBasePrefix() + 'images/products/',
    defaultWhatsapp: '593985346800',
    siteUrl: 'https://levwild.com'
  }};

  // Estado de la aplicación
  const state = {{
    data: null,
    products: [],
    categories: [],
    disciplines: [],
    videos: [],
    activeDiscipline: 'todos',
    activeCategory: 'todos',
    activeSubcategory: 'todos',
    searchQuery: '',
    carousels: {{}},
    currentModalProduct: null
  }};

  // Estado del Zoom Fullscreen / Lightbox
  const zoomState = {{
    isOpen: false,
    photos: [],
    currentIndex: 0,
    title: '',
    scale: 1.0,
    minScale: 1.0,
    maxScale: 4.0,
    panX: 0,
    panY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    hasMoved: false
  }};

  // Elementos DOM
  const DOM = {{}};

  function populateDOM() {{
    DOM.header = document.getElementById('siteHeader');
    DOM.navDesktop = document.getElementById('navDesktop');
    DOM.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    DOM.mobileDrawer = document.getElementById('mobileDrawer');
    DOM.mobileCategoriesList = document.getElementById('mobileCategoriesList');
    DOM.videoShowcaseContainer = document.getElementById('videoShowcaseContainer');
    DOM.categoryPillsContainer = document.getElementById('categoryPillsContainer');
    DOM.searchInput = document.getElementById('searchInput');
    DOM.searchClearBtn = document.getElementById('searchClearBtn');
    DOM.searchToggleBtn = document.getElementById('searchToggleBtn');
    DOM.searchBoxWrapper = document.getElementById('searchBoxWrapper');
    DOM.resultsCountText = document.getElementById('resultsCountText');
    DOM.resetFiltersBtn = document.getElementById('resetFiltersBtn');
    DOM.catalogLoading = document.getElementById('catalogLoading');
    DOM.catalogContainer = document.getElementById('catalogContainer');
    DOM.noResultsState = document.getElementById('noResultsState');
    DOM.clearSearchActionBtn = document.getElementById('clearSearchActionBtn');
    DOM.footerCategoriesList = document.getElementById('footerCategoriesList');
    DOM.productModal = document.getElementById('productModal');
    DOM.modalBody = document.getElementById('modalBody');
    DOM.modalCloseBtn = document.getElementById('modalCloseBtn');
    DOM.toastNotification = document.getElementById('toastNotification');
    
    // Zoom Modal
    DOM.imageFullscreenModal = document.getElementById('imageFullscreenModal');
    DOM.zoomPhotoTitle = document.getElementById('zoomPhotoTitle');
    DOM.zoomPhotoCounter = document.getElementById('zoomPhotoCounter');
    DOM.zoomInBtn = document.getElementById('zoomInBtn');
    DOM.zoomOutBtn = document.getElementById('zoomOutBtn');
    DOM.zoomResetBtn = document.getElementById('zoomResetBtn');
    DOM.zoomCloseBtn = document.getElementById('zoomCloseBtn');
    DOM.zoomViewport = document.getElementById('zoomViewport');
    DOM.zoomFullscreenImg = document.getElementById('zoomFullscreenImg');
    DOM.zoomNavPrev = document.getElementById('zoomNavPrev');
    DOM.zoomNavNext = document.getElementById('zoomNavNext');
    DOM.zoomThumbnails = document.getElementById('zoomThumbnails');

    // Theme Toggle
    DOM.themeToggleBtn = document.getElementById('themeToggleBtn');
    DOM.mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');

    // Meta & Schema
    DOM.metaDescription = document.getElementById('metaDescription');
    DOM.ogTitle = document.getElementById('ogTitle');
    DOM.ogDescription = document.getElementById('ogDescription');
    DOM.ogImage = document.getElementById('ogImage');
    DOM.ogUrl = document.getElementById('ogUrl');
    DOM.ogType = document.getElementById('ogType');
    DOM.twitterTitle = document.getElementById('twitterTitle');
    DOM.twitterDescription = document.getElementById('twitterDescription');
    DOM.twitterImage = document.getElementById('twitterImage');
    DOM.structuredData = document.getElementById('structuredData');
  }}

  // ==========================================================================
  // 1. INICIALIZACIÓN Y CARGA DE DATOS
  // ==========================================================================
  async function init() {{
    populateDOM();
    initTheme();
    setupEventListeners();
    setupZoomModalEvents();
    setupHistoryRouting();
    await loadCatalogData();
    renderVideoShowcase();
    renderCategoryPills();
    renderNavigationLinks();
    
    // Verificar deep links (limpios sin hashtags)
    checkDeepLink();
    renderCatalog();
    setupScrollAnimations();
  }}

  async function loadCatalogData() {{
    try {{
      const response = await fetch(CONFIG.dataPath);
      if (!response.ok) throw new Error(`HTTP error! status: ${{response.status}}`);
      const json = await response.json();
      state.data = json;
      state.products = json.productos || [];
      state.categories = json.categorias || [];
      state.disciplines = json.disciplinas || [];
      state.videos = json.videos || [];
      
      if (json.marca && json.marca.whatsapp_numero) {{
        CONFIG.defaultWhatsapp = json.marca.whatsapp_numero;
      }}
    }} catch (err) {{
      console.warn('Cargando dataset sincronizado de respaldo:', err);
      loadFallbackData();
    }} finally {{
      if (DOM.catalogLoading) {{
        DOM.catalogLoading.style.display = 'none';
      }}
    }}
  }}

  // ==========================================================================
  // 2. GENERACIÓN DE MENSAJES Y ENLACES WHATSAPP PRECISOS
  // ==========================================================================
  function formatPriceText(price) {{
    if (price === null || price === undefined || price === '') return '';
    const num = parseFloat(price);
    if (isNaN(num)) return '';
    return `$${{num.toFixed(2)}} USD`;
  }}

  function getProductWhatsAppUrl(prod, customGreeting = 'Quiero pedir información y comprar') {{
    const nombre = (prod.nombre || 'Producto LEV').trim();
    const variante = prod.subcategoria ? ` en color/modelo *${{prod.subcategoria}}*` : '';
    const priceStr = formatPriceText(prod.precio);
    const precio = priceStr ? ` por el valor de *${{priceStr}}*` : '';
    
    const msg = `¡Hola LEV Wild Spirit! 👋 ${{customGreeting}}: *${{nombre}}*${{variante}}${{precio}}. ¿Tienen stock disponible y cuál es el procedimiento de entrega?`;
    return `https://wa.me/${{CONFIG.defaultWhatsapp}}?text=${{encodeURIComponent(msg)}}`;
  }}

  function getModalWhatsAppUrl(prod) {{
    return getProductWhatsAppUrl(prod, 'Deseo realizar el pedido de');
  }}

  // ==========================================================================
  // 3. SHOWCASE DE VIDEOS HORIZONTALES CINEMÁTICO
  // ==========================================================================
  function renderVideoShowcase() {{
    if (!DOM.videoShowcaseContainer || !state.videos || state.videos.length === 0) return;

    let html = '';
    state.videos.forEach(vid => {{
      const vidWaMsg = `¡Hola LEV Wild Spirit! 👋 Vi el video de *${{vid.producto_nombre || vid.titulo}}* en su catálogo web y quiero consultar disponibilidad y precio.`;
      const vidWaUrl = `https://wa.me/${{CONFIG.defaultWhatsapp}}?text=${{encodeURIComponent(vidWaMsg)}}`;

      html += `
        <div class="video-card-cinematic" id="${{vid.id}}">
          <div class="video-player-box-cinematic">
            <video class="video-element-cinematic" controls playsinline preload="metadata">
              <source src="${{CONFIG.imagesPath}}${{vid.archivo}}" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>
          </div>
          <div class="video-info-cinematic">
            <div class="video-badge-row">
              <span class="video-tag-pill">${{vid.badge || '⚡ DEMOSTRACIÓN EN RUTA'}}</span>
              <span class="video-category-pill">🚴 ${{vid.disciplina || vid.categoria}}</span>
            </div>
            <h3 class="video-title-cinematic">${{vid.titulo}}</h3>
            <p class="video-desc-cinematic">${{vid.subtitulo || 'Comprobación de rendimiento, resistencia y visibilidad en ruta real.'}}</p>
            
            <div class="video-actions-cinematic">
              <button class="btn-video-product" data-ref="${{vid.producto_ref}}">
                <span>Ver Ficha del Producto</span> &rarr;
              </button>
              <a href="${{vidWaUrl}}" target="_blank" rel="noopener noreferrer" class="btn-video-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.12 .94 11.503.94c-5.44 0-9.866 4.372-9.87 9.802 0 1.83.504 3.619 1.46 5.181l-.959 3.501 3.616-.948l.307.182zm11.391-7.795c-.328-.162-1.94-.949-2.24-.1.057-.301-.15-.406-.328-.488-.3-.136-.527-.243-.728-.544-.2-.301-.2-.581-.1-.861.1-.281.428-.681.628-.881.2-.201.272-.281.399-.481.129-.2.057-.381-.043-.581-.1-.2-.828-1.971-1.128-2.693-.3-.721-.586-.622-.8-.632l-.685-.01c-.243 0-.643.09-.971.451-.328.361-1.257 1.213-1.257 2.946 0 1.733 1.271 3.407 1.443 3.637.171.23 2.5 3.778 6.057 5.283.846.357 1.506.57 2.02.729.85.267 1.624.23 2.235.14.68-.101 2.086-.842 2.371-1.663.286-.822.286-1.523.2-1.663-.085-.141-.314-.221-.643-.382z"/>
                </svg>
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }});

    DOM.videoShowcaseContainer.innerHTML = html;

    DOM.videoShowcaseContainer.querySelectorAll('.btn-video-product').forEach(btn => {{
      btn.addEventListener('click', (e) => {{
        e.preventDefault();
        const ref = btn.dataset.ref;
        const targetProd = state.products.find(p => p.codigo === ref || slugify(p.codigo) === slugify(ref));
        if (targetProd) {{
          openProductModal(targetProd, 'video', true);
        }}
      }});
    }});
  }}

  // ==========================================================================
  // 4. RENDERIZADO DE PASTILLAS Y NAVEGACIÓN (URLs LIMPIAS SIN HASHTAGS)
  // ==========================================================================
  function getCategoryPath(catName, subcat = 'todos') {{
    const cName = (catName || '').toLowerCase();
    if (cName === 'todos' || !cName) return '/';
    if (cName.includes('casco')) return '/cascos/';
    if (cName.includes('guante')) return '/guantes/';
    if (cName.includes('iluminac') || cName.includes('luz') || cName.includes('luces')) {{
      if (subcat === 'delantera') return '/luces-delanteras/';
      if (subcat === 'trasera') return '/luces-traseras/';
      return '/luces-delanteras/';
    }}
    if (cName.includes('audifono')) return '/audifonos/';
    if (cName.includes('gafa')) return '/gafas/';
    if (cName.includes('bolsa')) return '/bolsas/';
    if (cName.includes('gorra')) return '/gorras/';
    if (cName.includes('componente') || cName.includes('pedal')) return '/componentes/';

    const catObj = state.categories.find(c => c.nombre.toLowerCase() === cName);
    const slug = catObj ? (catObj.slug || slugify(catObj.nombre)) : slugify(catName);
    return `/${{slug}}/`;
  }}

  function renderCategoryPills() {{
    if (!DOM.categoryPillsContainer) return;

    const filteredByDiscipline = filterByDisciplineOnly(state.products, state.activeDiscipline);
    const totalCount = filteredByDiscipline.length;

    let html = `
      <a href="/" class="cat-pill ${{state.activeCategory === 'todos' ? 'active' : ''}}" data-cat="todos">
        <span>⚡ Todos</span>
        <span class="count">${{totalCount}}</span>
      </a>
    `;

    state.categories.forEach(cat => {{
      const catCount = filteredByDiscipline.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
      if (catCount > 0 || state.activeDiscipline === 'todos') {{
        const isCatActive = state.activeCategory.toLowerCase() === cat.nombre.toLowerCase();
        const path = getCategoryPath(cat.nombre, 'todos');
        html += `
          <a href="${{path}}" class="cat-pill ${{isCatActive ? 'active' : ''}}" data-cat="${{cat.nombre}}" data-slug="${{cat.slug || slugify(cat.nombre)}}">
            <span>${{cat.icono || '🏷️'}} ${{cat.nombre}}</span>
            <span class="count">${{catCount}}</span>
          </a>
        `;
      }}
    }});

    DOM.categoryPillsContainer.innerHTML = html;

    DOM.categoryPillsContainer.querySelectorAll('.cat-pill').forEach(pill => {{
      pill.addEventListener('click', (e) => {{
        e.preventDefault();
        const cat = pill.dataset.cat;
        activateCategory(cat, 'todos', true);
      }});
    }});
  }}

  function renderNavigationLinks() {{
    if (DOM.footerCategoriesList) {{
      let footerCatsHtml = '';
      state.categories.forEach(cat => {{
        const path = getCategoryPath(cat.nombre, 'todos');
        footerCatsHtml += `
          <li>
            <a href="${{path}}" data-cat-link="${{cat.nombre}}">
              ${{cat.icono || '🏷️'}} ${{cat.nombre}}
            </a>
          </li>
        `;
      }});
      DOM.footerCategoriesList.innerHTML = footerCatsHtml;

      DOM.footerCategoriesList.querySelectorAll('a').forEach(link => {{
        link.addEventListener('click', (e) => {{
          e.preventDefault();
          const cat = link.dataset.catLink;
          if (cat) {{
            activateCategory(cat, 'todos', true);
          }}
        }});
      }});
    }}

    if (DOM.mobileCategoriesList) {{
      let mobileCatsHtml = '';
      state.categories.forEach(cat => {{
        const path = getCategoryPath(cat.nombre, 'todos');
        mobileCatsHtml += `
          <li>
            <a href="${{path}}" class="drawer-cat-link" data-cat="${{cat.nombre}}">
              <span>${{cat.icono || '🏷️'}} ${{cat.nombre}}</span>
              <span class="arrow">&rarr;</span>
            </a>
          </li>
        `;
      }});
      DOM.mobileCategoriesList.innerHTML = mobileCatsHtml;

      DOM.mobileCategoriesList.querySelectorAll('.drawer-cat-link').forEach(link => {{
        link.addEventListener('click', (e) => {{
          e.preventDefault();
          const cat = link.dataset.cat;
          DOM.mobileDrawer.classList.remove('open');
          DOM.mobileMenuToggle.classList.remove('open');
          activateCategory(cat, 'todos', true);
        }});
      }});
    }}

    // Quick tags en Hero
    document.querySelectorAll('#heroCategoryQuickBar a, .hero-quick-tag').forEach(tag => {{
      tag.addEventListener('click', (e) => {{
        e.preventDefault();
        const catAttr = tag.dataset.cat || '';
        const href = tag.getAttribute('href') || '';
        const cleanPath = catAttr || href.replace(/^\\//, '').replace(/\\/$/, '').replace('#', '');
        handleCategoryRoute(cleanPath);
      }});
    }});
  }}

  // ==========================================================================
  // 5. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
  // ==========================================================================
  function renderCatalog() {{
    if (!DOM.catalogContainer) {{
      DOM.catalogContainer = document.getElementById('catalogContainer');
      if (!DOM.catalogContainer) return;
    }}

    const filteredProducts = getFilteredProducts();
    updateResultsSummary(filteredProducts.length);

    if (filteredProducts.length === 0) {{
      DOM.catalogContainer.innerHTML = '';
      if (DOM.noResultsState) DOM.noResultsState.style.display = 'block';
      return;
    }}

    if (DOM.noResultsState) DOM.noResultsState.style.display = 'none';

    // Agrupar productos por Categoría
    const groupedByCategory = {{}};
    filteredProducts.forEach(prod => {{
      if (!groupedByCategory[prod.categoria]) {{
        groupedByCategory[prod.categoria] = [];
      }}
      groupedByCategory[prod.categoria].push(prod);
    }});

    let catalogHtml = '';

    Object.keys(groupedByCategory).forEach(catName => {{
      const catProducts = groupedByCategory[catName];
      const catMeta = state.categories.find(c => c.nombre.toLowerCase() === catName.toLowerCase()) || {{
        icono: getCategoryEmoji(catName),
        nombre: catName,
        slug: slugify(catName)
      }};
      const catSlug = catMeta.slug || slugify(catName);

      const subfilters = getCategorySubfilters(catName, catProducts);
      let subfiltersHtml = '';
      if (subfilters.length > 1) {{
        subfiltersHtml = `
          <div class="category-subfilters" data-cat="${{catName}}">
            ${{subfilters.map(sf => `
              <button class="subfilter-chip ${{state.activeSubcategory.toLowerCase() === sf.id.toLowerCase() ? 'active' : ''}}" 
                      data-subfilter="${{sf.id}}" 
                      data-cat="${{catName}}">
                ${{sf.label}}
              </button>
            `).join('')}}
          </div>
        `;
      }}

      catalogHtml += `
        <section class="category-section scroll-reveal revealed visible" id="cat-${{catSlug}}">
          <div class="category-header-wrapper">
            <div class="category-header">
              <div class="category-title-group">
                <div class="category-icon-badge">${{catMeta.icono}}</div>
                <h2 class="category-title">${{catName}}</h2>
              </div>
              <span class="category-count">${{catProducts.length}} ${{catProducts.length === 1 ? 'producto' : 'productos'}}</span>
            </div>

            ${{subfiltersHtml}}
          </div>

          <div class="products-grid">
            ${{catProducts.map(prod => renderProductCard(prod)).join('')}}
          </div>
        </section>
      `;
    }});

    DOM.catalogContainer.innerHTML = catalogHtml;
    attachProductCardEvents();
    attachCategoryActionEvents();
    setupScrollAnimations();
  }}

  function getCategorySubfilters(catName, products) {{
    const list = [{{ id: 'todos', label: '⚡ Todos los Modelos' }}];
    const catLower = catName.toLowerCase();

    if (catLower.includes('iluminac')) {{
      list.push({{ id: 'delantera', label: '🔦 Delanteras (1000/1300 lm)' }});
      list.push({{ id: 'trasera', label: '🚨 Traseras con Sensor de Freno' }});
      return list;
    }}

    if (catLower.includes('casco')) {{
      const distinctModels = [];
      products.forEach(p => {{
        const baseName = getProductFamilyName(p.nombre);
        if (baseName && !distinctModels.includes(baseName)) {{
          distinctModels.push(baseName);
        }}
      }});
      if (distinctModels.length > 1) {{
        distinctModels.forEach(m => {{
          list.push({{ id: slugify(m), label: m }});
        }});
      }}
      return list;
    }}

    if (catLower.includes('guante')) {{
      list.push({{ id: 'adulto', label: '🧑 Adultos' }});
      list.push({{ id: 'niño', label: '🧒 Niños' }});
      return list;
    }}

    return list;
  }}

  function renderProductCard(prod) {{
    const photos = prod.fotos && prod.fotos.length > 0 ? prod.fotos : [];
    const hasMultipleMedia = photos.length > 1 || !!prod.video;
    const hasVideo = !!prod.video;
    const cardId = `card-${{slugify(prod.codigo)}}`;

    // Carrusel de imágenes
    let slidesHtml = '';
    photos.forEach((photo, idx) => {{
      slidesHtml += `
        <div class="carousel-slide ${{idx === 0 ? 'active' : ''}}" data-index="${{idx}}">
          <img src="${{CONFIG.imagesPath}}${{photo}}" 
               alt="${{prod.nombre}} - ${{prod.subcategoria || ''}}" 
               loading="lazy"
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'photo-placeholder\\'><span class=\\'placeholder-icon\\'>${{getCategoryEmoji(prod.categoria)}}</span></div>';">
        </div>
      `;
    }});

    if (hasVideo) {{
      slidesHtml += `
        <div class="carousel-slide slide-video" data-index="${{photos.length}}">
          <video class="card-carousel-video" muted loop playsinline preload="none">
            <source src="${{CONFIG.imagesPath}}${{prod.video}}" type="video/mp4">
          </video>
          <div class="video-play-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      `;
    }}

    if (photos.length === 0 && !hasVideo) {{
      slidesHtml = `
        <div class="carousel-slide active">
          <div class="photo-placeholder">
            <span class="placeholder-icon">${{getCategoryEmoji(prod.categoria)}}</span>
          </div>
        </div>
      `;
    }}

    // Puntos indicadores
    let dotsHtml = '';
    const totalSlides = photos.length + (hasVideo ? 1 : 0);
    if (totalSlides > 1) {{
      for (let i = 0; i < totalSlides; i++) {{
        dotsHtml += `<span class="carousel-dot ${{i === 0 ? 'active' : ''}}" data-index="${{i}}"></span>`;
      }}
    }}

    // Selector interactivo de variantes
    const siblings = getSiblingVariants(prod);
    let variantsRowHtml = '';
    if (siblings.length > 1) {{
      variantsRowHtml = `
        <div class="card-variants-row" title="Seleccionar color o variante">
          <span class="variants-row-label">Color / Modelo:</span>
          <div class="variants-pills-list">
            ${{siblings.map(sib => {{
              const isActive = sib.codigo === prod.codigo;
              const colorDot = getVariantColorHex(sib.subcategoria || sib.nombre);
              return `
                <button class="variant-pill-btn ${{isActive ? 'active' : ''}}" 
                        data-code="${{sib.codigo}}" 
                        title="${{sib.subcategoria || sib.nombre}}">
                  ${{colorDot ? `<span class="variant-color-dot" style="background: ${{colorDot}};"></span>` : ''}}
                  <span class="variant-name">${{sib.subcategoria || sib.nombre}}</span>
                </button>
              `;
            }}).join('')}}
          </div>
        </div>
      `;
    }}

    // Especificaciones
    let specsHtml = '';
    if (prod.especificaciones && Object.keys(prod.especificaciones).length > 0) {{
      const specKeys = Object.keys(prod.especificaciones).slice(0, 3);
      specsHtml = `
        <div class="card-specs-grid">
          ${{specKeys.map(k => `
            <div class="spec-pill">
              <span class="spec-name">${{k}}:</span>
              <span class="spec-val">${{prod.especificaciones[k]}}</span>
            </div>
          `).join('')}}
        </div>
      `;
    }}

    const priceFormatted = formatPriceText(prod.precio);
    const priceDisplay = priceFormatted 
      ? `<span class="price-value">${{priceFormatted}}</span>` 
      : `<span class="price-pending">[Consultar PVP]</span>`;

    const waUrl = getProductWhatsAppUrl(prod);

    return `
      <article class="product-card" data-code="${{prod.codigo}}" data-category="${{prod.categoria}}" data-discipline="${{prod.disciplina || 'todos'}}">
        <div class="product-carousel" data-card-id="${{cardId}}">
          ${{hasVideo ? `
            <div class="carousel-badges">
              <span class="badge-video">🎬 Video</span>
            </div>
          ` : ''}}

          <div class="carousel-track">
            ${{slidesHtml}}
          </div>

          ${{hasMultipleMedia ? `
            <button class="carousel-btn prev" aria-label="Foto anterior" data-action="prev">&lsaquo;</button>
            <button class="carousel-btn next" aria-label="Foto siguiente" data-action="next">&rsaquo;</button>
            <div class="carousel-dots">
              ${{dotsHtml}}
            </div>
          ` : ''}}

          <button class="card-zoom-btn" title="Ver detalle completo y zoom" data-action="zoom" aria-label="Ampliar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title">${{prod.nombre}}</h3>
          </div>

          ${{variantsRowHtml}}

          ${{hasVideo ? `
            <button class="btn-card-video" data-action="open-video">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Ver Video en Ruta</span>
            </button>
          ` : ''}}

          <p class="card-description">${{prod.descripcion || 'Equipamiento deportivo de alto rendimiento LEV Wild Spirit.'}}</p>

          ${{specsHtml}}

          <div class="card-footer">
            <div class="price-row">
              <span class="price-label">PRECIO AL PÚBLICO</span>
              ${{priceDisplay}}
            </div>

            <a href="${{waUrl}}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.12 .94 11.503.94c-5.44 0-9.866 4.372-9.87 9.802 0 1.83.504 3.619 1.46 5.181l-.959 3.501 3.616-.948l.307.182zm11.391-7.795c-.328-.162-1.94-.949-2.24-.1.057-.301-.15-.406-.328-.488-.3-.136-.527-.243-.728-.544-.2-.301-.2-.581-.1-.861.1-.281.428-.681.628-.881.2-.201.272-.281.399-.481.129-.2.057-.381-.043-.581-.1-.2-.828-1.971-1.128-2.693-.3-.721-.586-.622-.8-.632l-.685-.01c-.243 0-.643.09-.971.451-.328.361-1.257 1.213-1.257 2.946 0 1.733 1.271 3.407 1.443 3.637.171.23 2.5 3.778 6.057 5.283.846.357 1.506.57 2.02.729.85.267 1.624.23 2.235.14.68-.101 2.086-.842 2.371-1.663.286-.822.286-1.523.2-1.663-.085-.141-.314-.221-.643-.382z"/>
              </svg>
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }}

  // ==========================================================================
  // 6. EVENTOS DE TARJETA, VARIANTES Y ACCIONES
  // ==========================================================================
  function attachCategoryActionEvents() {{
    document.querySelectorAll('.subfilter-chip').forEach(chip => {{
      chip.addEventListener('click', (e) => {{
        e.stopPropagation();
        const cat = chip.dataset.cat;
        const subfilter = chip.dataset.subfilter;
        state.activeCategory = cat;
        state.activeSubcategory = subfilter;
        renderCatalog();
      }});
    }});
  }}

  function attachProductCardEvents() {{
    document.querySelectorAll('.product-carousel').forEach(carouselEl => {{
      const cardId = carouselEl.dataset.cardId;
      const track = carouselEl.querySelector('.carousel-track');
      const slides = carouselEl.querySelectorAll('.carousel-slide');
      const dots = carouselEl.querySelectorAll('.carousel-dot');
      const prevBtn = carouselEl.querySelector('.carousel-btn.prev');
      const nextBtn = carouselEl.querySelector('.carousel-btn.next');
      const zoomBtn = carouselEl.querySelector('.card-zoom-btn');
      
      const cardEl = carouselEl.closest('.product-card');
      const prodCode = cardEl ? cardEl.dataset.code : null;
      const prod = state.products.find(p => p.codigo === prodCode);

      if (!state.carousels[cardId]) {{
        state.carousels[cardId] = {{
          currentIndex: 0,
          totalSlides: slides.length
        }};
      }}

      const updateSlide = (newIndex) => {{
        const total = slides.length;
        if (total === 0) return;
        const normalizedIndex = (newIndex + total) % total;
        state.carousels[cardId].currentIndex = normalizedIndex;
        if (track) {{
          track.style.transform = `translateX(-${{normalizedIndex * 100}}%)`;
        }}
        dots.forEach((dot, idx) => {{
          dot.classList.toggle('active', idx === normalizedIndex);
        }});

        slides.forEach((s, idx) => {{
          const vid = s.querySelector('video');
          if (vid && idx !== normalizedIndex) {{
            vid.pause();
          }}
        }});
      }};

      if (prevBtn) {{
        prevBtn.onclick = (e) => {{
          e.stopPropagation();
          updateSlide(state.carousels[cardId].currentIndex - 1);
        }};
      }}

      if (nextBtn) {{
        nextBtn.onclick = (e) => {{
          e.stopPropagation();
          updateSlide(state.carousels[cardId].currentIndex + 1);
        }};
      }}

      dots.forEach(dot => {{
        dot.onclick = (e) => {{
          e.stopPropagation();
          const idx = parseInt(dot.dataset.index, 10);
          updateSlide(idx);
        }};
      }});

      if (zoomBtn && prod) {{
        zoomBtn.onclick = (e) => {{
          e.stopPropagation();
          openProductModal(prod, 'image', true);
        }};
      }}

      carouselEl.onclick = (e) => {{
        if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot') || e.target.closest('.card-zoom-btn')) return;
        if (prod) openProductModal(prod, 'image', true);
      }};
    }});

    // Cambiar variante en la tarjeta
    document.querySelectorAll('.variant-pill-btn').forEach(pill => {{
      pill.addEventListener('click', (e) => {{
        e.stopPropagation();
        const code = pill.dataset.code;
        const cardEl = pill.closest('.product-card');
        const targetProd = state.products.find(p => p.codigo === code);
        if (targetProd && cardEl) {{
          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = renderProductCard(targetProd);
          const newCard = tempContainer.firstElementChild;
          cardEl.replaceWith(newCard);
          attachProductCardEvents();
        }}
      }});
    }});

    document.querySelectorAll('.btn-card-video, .badge-video').forEach(btn => {{
      btn.addEventListener('click', (e) => {{
        e.stopPropagation();
        const cardEl = btn.closest('.product-card');
        const prodCode = cardEl ? cardEl.dataset.code : null;
        const prod = state.products.find(p => p.codigo === prodCode);
        if (prod) {{
          openProductModal(prod, 'video', true);
        }}
      }});
    }});
  }}

  // ==========================================================================
  // 7. MODAL DE DETALLE COMPLETO Y SELECTOR DE VARIANTES
  // ==========================================================================
  function openProductModal(prod, initialMedia = 'image', pushHistory = true) {{
    if (!DOM.productModal || !DOM.modalBody || !prod) {{
      DOM.productModal = document.getElementById('productModal');
      DOM.modalBody = document.getElementById('modalBody');
      if (!DOM.productModal || !DOM.modalBody || !prod) return;
    }}

    state.currentModalProduct = prod;

    const photos = prod.fotos && prod.fotos.length > 0 ? prod.fotos : [];
    const hasVideo = !!prod.video;
    const startWithVideo = hasVideo && initialMedia === 'video';
    let currentPhotoIdx = 0;

    const siblings = getSiblingVariants(prod);
    const hasVariants = siblings.length > 1;

    // Enlace de WhatsApp en Modal
    const waUrl = getModalWhatsAppUrl(prod);

    let specsTableHtml = '';
    if (prod.especificaciones && Object.keys(prod.especificaciones).length > 0) {{
      specsTableHtml = `
        <div class="modal-specs-title">ESPECIFICACIONES TÉCNICAS</div>
        <div class="modal-specs-table">
          ${{Object.entries(prod.especificaciones).map(([k, v]) => `
            <div class="spec-row">
              <span class="spec-key">${{k}}</span>
              <span class="spec-val">${{v}}</span>
            </div>
          `).join('')}}
        </div>
      `;
    }}

    let modalVariantsHtml = '';
    if (hasVariants) {{
      modalVariantsHtml = `
        <div class="modal-variants-box">
          <div class="modal-variants-label">
            <span>🎨 Selecciona el color / diseño:</span>
            <span style="font-size: 0.78rem; color: var(--accent-volt); font-weight: 700;">${{prod.subcategoria || 'Original'}}</span>
          </div>
          <div class="modal-variants-grid">
            ${{siblings.map(sib => {{
              const isActive = sib.codigo === prod.codigo;
              const thumb = sib.fotos && sib.fotos.length > 0 ? sib.fotos[0] : '';
              return `
                <button class="modal-variant-btn ${{isActive ? 'active' : ''}}" data-code="${{sib.codigo}}">
                  ${{thumb ? `<img src="${{CONFIG.imagesPath}}${{thumb}}" class="modal-variant-thumb" alt="${{sib.subcategoria || ''}}">` : ''}}
                  <span>${{sib.subcategoria || sib.nombre}}</span>
                </button>
              `;
            }}).join('')}}
          </div>
        </div>
      `;
    }}

    let mainMediaHtml = '';
    if (startWithVideo) {{
      mainMediaHtml = `
        <video class="modal-main-video" controls autoplay playsinline id="modalMainVideo">
          <source src="${{CONFIG.imagesPath}}${{prod.video}}" type="video/mp4">
          Tu navegador no soporta reproducción de video.
        </video>
      `;
    }} else if (photos.length > 0) {{
      mainMediaHtml = `
        <img src="${{CONFIG.imagesPath}}${{photos[0]}}" 
             id="modalMainImg" 
             alt="${{prod.nombre}}"
             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'photo-placeholder\\'><span class=\\'placeholder-icon\\'>${{getCategoryEmoji(prod.categoria)}}</span></div>';">
        <div class="modal-zoom-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <span>Pasa el cursor para zoom &bull; Clic para ver gigante</span>
        </div>
      `;
    }} else {{
      mainMediaHtml = `
        <div class="photo-placeholder">
          <span class="placeholder-icon">${{getCategoryEmoji(prod.categoria)}}</span>
        </div>
      `;
    }}

    let thumbnailsHtml = '';
    if (photos.length > 1 || hasVideo) {{
      thumbnailsHtml += photos.map((photo, i) => `
        <div class="modal-thumb ${{!startWithVideo && i === 0 ? 'active' : ''}}" data-type="image" data-src="${{CONFIG.imagesPath}}${{photo}}" data-index="${{i}}">
          <img src="${{CONFIG.imagesPath}}${{photo}}" alt="${{prod.nombre}} - miniatura ${{i + 1}}">
        </div>
      `).join('');

      if (hasVideo) {{
        thumbnailsHtml += `
          <div class="modal-thumb modal-thumb-video ${{startWithVideo ? 'active' : ''}}" data-type="video" data-video-src="${{CONFIG.imagesPath}}${{prod.video}}">
            <div class="thumb-video-icon">▶</div>
            <span>VIDEO</span>
          </div>
        `;
      }}
    }}

    const priceFormatted = formatPriceText(prod.precio);
    const modalHtml = `
      <div class="modal-layout">
        <div class="modal-gallery">
          <div class="modal-main-img-box ${{startWithVideo ? 'has-video' : ''}}" id="modalMainMediaBox">
            ${{mainMediaHtml}}
          </div>
          ${{thumbnailsHtml ? `<div class="modal-thumbnails">${{thumbnailsHtml}}</div>` : ''}}
        </div>

        <div class="modal-details">
          <div class="modal-header-tag">${{prod.categoria.toUpperCase()}}</div>
          <h2 class="modal-title">${{prod.nombre}}</h2>
          <div style="display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;">
            <span class="badge-brand">${{detectBrand(prod)}}</span>
            ${{hasVideo ? `<span class="badge-video">🎬 Video en Acción</span>` : ''}}
          </div>

          <p class="modal-description">${{prod.descripcion || 'Equipamiento deportivo de élite LEV Wild Spirit diseñado para superar los límites del rendimiento.'}}</p>

          ${{modalVariantsHtml}}

          ${{specsTableHtml}}

          <div class="modal-purchase-footer">
            <div class="modal-price-box">
              <span class="price-label">PRECIO AL PÚBLICO</span>
              ${{priceFormatted 
                ? `<span class="price-value">${{priceFormatted}}</span>` 
                : `<span class="price-pending">[Consultar PVP]</span>`
              }}
            </div>

            <a href="${{waUrl}}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-full btn-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.12 .94 11.503.94c-5.44 0-9.866 4.372-9.87 9.802 0 1.83.504 3.619 1.46 5.181l-.959 3.501 3.616-.948l.307.182zm11.391-7.795c-.328-.162-1.94-.949-2.24-.1.057-.301-.15-.406-.328-.488-.3-.136-.527-.243-.728-.544-.2-.301-.2-.581-.1-.861.1-.281.428-.681.628-.881.2-.201.272-.281.399-.481.129-.2.057-.381-.043-.581-.1-.2-.828-1.971-1.128-2.693-.3-.721-.586-.622-.8-.632l-.685-.01c-.243 0-.643.09-.971.451-.328.361-1.257 1.213-1.257 2.946 0 1.733 1.271 3.407 1.443 3.637.171.23 2.5 3.778 6.057 5.283.846.357 1.506.57 2.02.729.85.267 1.624.23 2.235.14.68-.101 2.086-.842 2.371-1.663.286-.822.286-1.523.2-1.663-.085-.141-.314-.221-.643-.382z"/>
              </svg>
              <span>Pedir este producto por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    `;

    DOM.modalBody.innerHTML = modalHtml;
    DOM.productModal.classList.add('open');
    DOM.productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const productSlug = slugify(prod.codigo);
    if (pushHistory) {{
      const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
      const targetUrl = `${{currentPath}}?p=${{productSlug}}`;
      history.pushState({{ productCode: prod.codigo, slug: productSlug }}, '', targetUrl);
    }}

    updateProductMeta(prod);

    DOM.modalBody.querySelectorAll('.modal-variant-btn').forEach(btn => {{
      btn.addEventListener('click', () => {{
        const code = btn.dataset.code;
        const newVariant = state.products.find(p => p.codigo === code);
        if (newVariant) {{
          openProductModal(newVariant, 'image', true);
        }}
      }});
    }});

    const mediaBox = document.getElementById('modalMainMediaBox');

    const attachHoverZoom = () => {{
      const img = mediaBox.querySelector('img');
      if (!img) return;

      mediaBox.classList.remove('has-video');

      mediaBox.onmousemove = (e) => {{
        const rect = mediaBox.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${{x}}% ${{y}}%`;
        img.style.transform = 'scale(2.2)';
      }};

      mediaBox.onmouseleave = () => {{
        img.style.transformOrigin = 'center center';
        img.style.transform = 'scale(1)';
      }};

      mediaBox.onclick = () => {{
        if (photos.length > 0) {{
          openFullscreenZoom(photos, currentPhotoIdx, prod.nombre);
        }}
      }};
    }};

    if (!startWithVideo && photos.length > 0) {{
      attachHoverZoom();
    }}

    DOM.modalBody.querySelectorAll('.modal-thumb').forEach(thumb => {{
      thumb.addEventListener('click', () => {{
        DOM.modalBody.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        const type = thumb.dataset.type;
        if (type === 'video') {{
          const videoSrc = thumb.dataset.videoSrc;
          mediaBox.className = 'modal-main-img-box has-video';
          mediaBox.onmousemove = null;
          mediaBox.onmouseleave = null;
          mediaBox.onclick = null;
          mediaBox.innerHTML = `
            <video class="modal-main-video" controls autoplay playsinline id="modalMainVideo">
              <source src="${{videoSrc}}" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>
          `;
        }} else {{
          const src = thumb.dataset.src;
          currentPhotoIdx = parseInt(thumb.dataset.index, 10) || 0;
          mediaBox.className = 'modal-main-img-box';
          mediaBox.innerHTML = `
            <img src="${{src}}" id="modalMainImg" alt="${{prod.nombre}}">
            <div class="modal-zoom-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Pasa el cursor para zoom &bull; Clic para ver gigante</span>
            </div>
          `;
          attachHoverZoom();
        }}
      }});
    }});
  }}

  function closeProductModal(updateHistory = true) {{
    if (!DOM.productModal) return;
    DOM.productModal.classList.remove('open');
    DOM.productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.currentModalProduct = null;

    const modalVid = DOM.productModal.querySelector('video');
    if (modalVid) modalVid.pause();

    if (updateHistory) {{
      let targetPath = '/';
      if (state.activeCategory !== 'todos') {{
        targetPath = getCategoryPath(state.activeCategory, state.activeSubcategory);
      }}
      history.pushState(null, '', targetPath);
      updateProductMeta(null);
    }}
  }}

  // ==========================================================================
  // 8. ZOOM FULLSCREEN / LIGHTBOX HD
  // ==========================================================================
  function setupZoomModalEvents() {{
    if (!DOM.imageFullscreenModal) return;

    if (DOM.zoomCloseBtn) DOM.zoomCloseBtn.addEventListener('click', closeFullscreenZoom);
    if (DOM.zoomInBtn) DOM.zoomInBtn.addEventListener('click', zoomIn);
    if (DOM.zoomOutBtn) DOM.zoomOutBtn.addEventListener('click', zoomOut);
    if (DOM.zoomResetBtn) DOM.zoomResetBtn.addEventListener('click', zoomReset);

    if (DOM.zoomNavPrev) {{
      DOM.zoomNavPrev.addEventListener('click', (e) => {{
        e.stopPropagation();
        setZoomPhoto(zoomState.currentIndex - 1);
      }});
    }}

    if (DOM.zoomNavNext) {{
      DOM.zoomNavNext.addEventListener('click', (e) => {{
        e.stopPropagation();
        setZoomPhoto(zoomState.currentIndex + 1);
      }});
    }}

    if (DOM.zoomViewport) {{
      DOM.zoomViewport.addEventListener('wheel', (e) => {{
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      }}, {{ passive: false }});

      DOM.zoomViewport.addEventListener('mousedown', (e) => {{
        if (zoomState.scale <= 1.05) return;
        zoomState.isDragging = true;
        zoomState.startX = e.clientX - zoomState.panX;
        zoomState.startY = e.clientY - zoomState.panY;
        zoomState.hasMoved = false;
        DOM.zoomViewport.style.cursor = 'grabbing';
      }});

      window.addEventListener('mousemove', (e) => {{
        if (!zoomState.isDragging) return;
        zoomState.panX = e.clientX - zoomState.startX;
        zoomState.panY = e.clientY - zoomState.startY;
        zoomState.hasMoved = true;
        applyZoomTransform();
      }});

      window.addEventListener('mouseup', () => {{
        if (zoomState.isDragging) {{
          zoomState.isDragging = false;
          if (DOM.zoomViewport) DOM.zoomViewport.style.cursor = zoomState.scale > 1.05 ? 'grab' : 'default';
        }}
      }});
    }}
  }}

  function openFullscreenZoom(photos, initialIndex = 0, title = 'Detalle de Producto') {{
    if (!DOM.imageFullscreenModal || !photos || photos.length === 0) return;

    zoomState.isOpen = true;
    zoomState.photos = photos;
    zoomState.title = title;
    zoomState.scale = 1.0;
    zoomState.panX = 0;
    zoomState.panY = 0;

    if (DOM.zoomPhotoTitle) DOM.zoomPhotoTitle.textContent = title;
    setZoomPhoto(initialIndex);

    DOM.imageFullscreenModal.classList.add('open');
    DOM.imageFullscreenModal.setAttribute('aria-hidden', 'false');
  }}

  function setZoomPhoto(index) {{
    const total = zoomState.photos.length;
    if (total === 0) return;
    const normalized = (index + total) % total;
    zoomState.currentIndex = normalized;
    zoomState.scale = 1.0;
    zoomState.panX = 0;
    zoomState.panY = 0;

    const photo = zoomState.photos[normalized];
    if (DOM.zoomFullscreenImg) {{
      DOM.zoomFullscreenImg.src = `${{CONFIG.imagesPath}}${{photo}}`;
    }}

    if (DOM.zoomPhotoCounter) {{
      DOM.zoomPhotoCounter.textContent = `Foto ${{normalized + 1}} de ${{total}}`;
    }}

    applyZoomTransform();
    renderZoomThumbnails();
  }}

  function renderZoomThumbnails() {{
    if (!DOM.zoomThumbnails) return;
    if (zoomState.photos.length <= 1) {{
      DOM.zoomThumbnails.innerHTML = '';
      return;
    }}

    let html = '';
    zoomState.photos.forEach((p, idx) => {{
      const isActive = idx === zoomState.currentIndex;
      html += `
        <div class="zoom-thumb ${{isActive ? 'active' : ''}}" data-index="${{idx}}">
          <img src="${{CONFIG.imagesPath}}${{p}}" alt="Miniatura ${{idx + 1}}">
        </div>
      `;
    }});

    DOM.zoomThumbnails.innerHTML = html;

    DOM.zoomThumbnails.querySelectorAll('.zoom-thumb').forEach(t => {{
      t.addEventListener('click', (e) => {{
        e.stopPropagation();
        const idx = parseInt(t.dataset.index, 10);
        setZoomPhoto(idx);
      }});
    }});
  }}

  function zoomIn() {{
    zoomState.scale = Math.min(zoomState.maxScale, zoomState.scale + 0.4);
    applyZoomTransform();
  }}

  function zoomOut() {{
    zoomState.scale = Math.max(zoomState.minScale, zoomState.scale - 0.4);
    if (zoomState.scale <= 1.05) {{
      zoomState.panX = 0;
      zoomState.panY = 0;
    }}
    applyZoomTransform();
  }}

  function zoomReset() {{
    zoomState.scale = 1.0;
    zoomState.panX = 0;
    zoomState.panY = 0;
    applyZoomTransform();
  }}

  function applyZoomTransform() {{
    if (!DOM.zoomFullscreenImg) return;
    DOM.zoomFullscreenImg.style.transform = `translate(${{zoomState.panX}}px, ${{zoomState.panY}}px) scale(${{zoomState.scale}})`;
  }}

  function closeFullscreenZoom() {{
    if (!DOM.imageFullscreenModal) return;
    zoomState.isOpen = false;
    DOM.imageFullscreenModal.classList.remove('open');
    DOM.imageFullscreenModal.setAttribute('aria-hidden', 'true');
  }}

  // ==========================================================================
  // 9. ROUTING 100% LIMPIO SIN HASHTAGS (SEO FRIENDLY)
  // ==========================================================================
  function setupHistoryRouting() {{
    window.addEventListener('popstate', (e) => {{
      if (e.state && e.state.productCode) {{
        const prod = state.products.find(p => p.codigo === e.state.productCode);
        if (prod) openProductModal(prod, 'image', false);
      }} else if (e.state && e.state.category) {{
        activateCategory(e.state.category, e.state.subcategory || 'todos', false);
        closeProductModal(false);
      }} else {{
        checkDeepLink();
      }}
    }});
  }}

  function checkDeepLink() {{
    const initialCat = document.body.dataset.initialCat;
    const initialSubcat = document.body.dataset.subcat || 'todos';
    if (initialCat) {{
      activateCategory(initialCat, initialSubcat, false);
      return;
    }}

    const path = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const prodParam = searchParams.get('producto') || searchParams.get('p');
    const catParam = searchParams.get('categoria') || searchParams.get('cat');
    const subcatParam = searchParams.get('subcategoria') || searchParams.get('subcat');

    const hash = window.location.hash.toLowerCase();
    if (hash && hash.length > 1) {{
      const cleanHash = hash.replace('#cat-', '').replace('#producto-', '').replace('#', '');
      if (hash.startsWith('#producto-')) {{
        const matched = state.products.find(p => slugify(p.codigo) === cleanHash || p.codigo.toLowerCase() === cleanHash);
        if (matched) {{
          history.replaceState(null, '', `?p=${{slugify(matched.codigo)}}`);
          openProductModal(matched, 'image', false);
          return;
        }}
      }} else {{
        handleCategoryRoute(cleanHash, true);
        return;
      }}
    }}

    if (prodParam && state.products.length > 0) {{
      const matchedProd = state.products.find(p => 
        slugify(p.codigo) === slugify(prodParam) ||
        p.codigo.toLowerCase() === prodParam.toLowerCase() ||
        slugify(p.nombre) === slugify(prodParam)
      );

      if (matchedProd) {{
        setTimeout(() => {{
          openProductModal(matchedProd, 'image', false);
        }}, 150);
        return;
      }}
    }}

    if (path.includes('/cascos')) {{
      activateCategory('Cascos', 'todos', false);
      return;
    }}
    if (path.includes('/guantes')) {{
      activateCategory('Guantes', 'todos', false);
      return;
    }}
    if (path.includes('/luces-delanteras')) {{
      activateCategory('Iluminación', 'delantera', false);
      return;
    }}
    if (path.includes('/luces-traseras')) {{
      activateCategory('Iluminación', 'trasera', false);
      return;
    }}
    if (path.includes('/iluminacion') || path.includes('/luces')) {{
      activateCategory('Iluminación', 'todos', false);
      return;
    }}
    if (path.includes('/audifonos')) {{
      activateCategory('Audífonos', 'todos', false);
      return;
    }}
    if (path.includes('/gafas')) {{
      activateCategory('Gafas', 'todos', false);
      return;
    }}
    if (path.includes('/bolsas')) {{
      activateCategory('Bolsas y Magnesio', 'todos', false);
      return;
    }}
    if (path.includes('/gorras')) {{
      activateCategory('Gorras', 'todos', false);
      return;
    }}
    if (path.includes('/componentes')) {{
      activateCategory('Componentes', 'todos', false);
      return;
    }}

    if (catParam) {{
      activateCategory(catParam, subcatParam || 'todos', false);
    }}
  }}

  function handleCategoryRoute(routeStr, replaceHistory = false) {{
    const h = (routeStr || '').toLowerCase();

    if (h.includes('casco')) {{
      activateCategory('Cascos', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('guante')) {{
      activateCategory('Guantes', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('luces-delanteras') || h.includes('luz-delantera') || h.includes('delantera')) {{
      activateCategory('Iluminación', 'delantera', true, replaceHistory);
      return;
    }}
    if (h.includes('luces-traseras') || h.includes('luz-trasera') || h.includes('trasera')) {{
      activateCategory('Iluminación', 'trasera', true, replaceHistory);
      return;
    }}
    if (h.includes('iluminac') || h.includes('luz') || h.includes('luces')) {{
      activateCategory('Iluminación', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('audifono')) {{
      activateCategory('Audífonos', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('gafa')) {{
      activateCategory('Gafas', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('bolsa') || h.includes('magnesio')) {{
      activateCategory('Bolsas y Magnesio', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('gorra')) {{
      activateCategory('Gorras', 'todos', true, replaceHistory);
      return;
    }}
    if (h.includes('componente') || h.includes('pedal')) {{
      activateCategory('Componentes', 'todos', true, replaceHistory);
      return;
    }}

    const matchedCategory = state.categories.find(c => 
      slugify(c.nombre) === h || 
      (c.slug && c.slug === h) ||
      c.id.toLowerCase() === h
    );

    if (matchedCategory) {{
      activateCategory(matchedCategory.nombre, 'todos', true, replaceHistory);
    }}
  }}

  function activateCategory(categoryName, subcategory = 'todos', pushState = true, replaceState = false) {{
    state.activeCategory = categoryName;
    state.activeSubcategory = subcategory || 'todos';
    state.activeDiscipline = 'todos';
    state.searchQuery = '';

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'none';

    renderCategoryPills();
    renderCatalog();

    if (pushState || replaceState) {{
      const targetPath = getCategoryPath(categoryName, subcategory);
      if (replaceState) {{
        history.replaceState({{ category: categoryName, subcategory: subcategory }}, '', targetPath);
      }} else {{
        history.pushState({{ category: categoryName, subcategory: subcategory }}, '', targetPath);
      }}
    }}

    updateCategoryMeta(categoryName, subcategory);
    scrollToSection('filterBar');
  }}

  // ==========================================================================
  // 10. METATAGS OPEN GRAPH & DATOS ESTRUCTURADOS (SCHEMA.ORG)
  // ==========================================================================
  function detectBrand(prod) {{
    const code = (prod.codigo || '').toUpperCase();
    const name = (prod.nombre || '').toLowerCase();
    const specs = JSON.stringify(prod.especificaciones || {{}}).toLowerCase();
    const raw = (prod.especificaciones_raw || '').toLowerCase();

    if (code.includes('LEV-CAS-12H') || name.includes('promend') || code.includes('LEV-PED') || specs.includes('promend') || raw.includes('promend')) {{
      return 'Promend';
    }}
    if (code.includes('LEV-CAS-11H') || name.includes('bike boy') || name.includes('bikeboy')) {{
      return 'Bike Boy';
    }}
    if (code.includes('LEV-GAF') || name.includes('rockbros') || name.includes('rockbross')) {{
      return 'ROCKBROS';
    }}
    if (code.includes('LEV-GUA-NINO') || name.includes('knightlaood')) {{
      return 'Knightlaood';
    }}
    if (code.includes('TS19') || name.includes('langsdom')) {{
      return 'Langsdom';
    }}
    if (code.includes('LEV-BOL-ESC') || name.includes('luckstone')) {{
      return 'Luckstone';
    }}
    return 'LEV Wild Spirit';
  }}

  function updateCategoryMeta(catName, subcatName) {{
    let title = `${{catName}} | Catálogo Oficial LEV Wild Spirit`;
    let desc = `Descubre todos los modelos, diseños y colores de ${{catName}} en LEV Wild Spirit. Equipamiento deportivo de alto rendimiento.`;
    const cleanPath = getCategoryPath(catName, subcatName);
    const pageUrl = `https://levwild.com${{cleanPath}}`;
    
    if (catName.toLowerCase().includes('iluminac') && subcatName === 'delantera') {{
      title = 'Luces Delanteras de Alta Potencia | LEV Wild Spirit';
      desc = 'Luces delanteras LED de 1000 y 1300 lúmenes con batería recargable USB para ciclismo de ruta y montaña.';
    }} else if (catName.toLowerCase().includes('iluminac') && subcatName === 'trasera') {{
      title = 'Luces Traseras Inteligentes con Sensor de Freno | LEV Wild Spirit';
      desc = 'Luces traseras inteligentes con sensor de freno automático y tecnología LED COB para máxima seguridad ciclista.';
    }}

    document.title = title;
    setMeta('metaDescription', desc, 'name', 'description');
    setMeta('ogTitle', title, 'property', 'og:title');
    setMeta('ogDescription', desc, 'property', 'og:description');
    setMeta('ogUrl', pageUrl, 'property', 'og:url');
    setMeta('twitterTitle', title, 'name', 'twitter:title');
    setMeta('twitterDescription', desc, 'name', 'twitter:description');
  }}

  function updateProductMeta(prod) {{
    if (!prod) {{
      const defaultTitle = 'LEV Wild Spirit | Catálogo Oficial de Equipamiento Deportivo';
      const defaultDesc = 'Catálogo oficial de LEV Wild Spirit. Equipamiento de alto rendimiento para ciclismo, gimnasio y escalada: cascos, gafas polarizadas, audífonos deportivos, iluminación LED, guantes, pedales y bolsas técnicas.';
      const defaultImg = 'https://levwild.com/images/brand/logo-lev-nav.png';
      const defaultUrl = 'https://levwild.com/';

      document.title = defaultTitle;
      setMeta('metaDescription', defaultDesc, 'name', 'description');
      setMeta('ogTitle', defaultTitle, 'property', 'og:title');
      setMeta('ogDescription', defaultDesc, 'property', 'og:description');
      setMeta('ogImage', defaultImg, 'property', 'og:image');
      setMeta('ogUrl', defaultUrl, 'property', 'og:url');
      setMeta('ogType', 'website', 'property', 'og:type');
      setMeta('twitterTitle', defaultTitle, 'name', 'twitter:title');
      setMeta('twitterDescription', defaultDesc, 'name', 'twitter:description');
      setMeta('twitterImage', defaultImg, 'name', 'twitter:image');

      if (DOM.structuredData) {{
        DOM.structuredData.textContent = JSON.stringify(generateOrganizationSchema());
      }}
      return;
    }}

    const prodTitle = `${{prod.nombre}} | LEV Wild Spirit`;
    const prodDesc = `${{prod.descripcion || 'Equipamiento de alto rendimiento LEV Wild Spirit.'}} ${{prod.subcategoria ? `Variante: ${{prod.subcategoria}}.` : ''}} Precio al público: ${{formatPriceText(prod.precio)}}. Pedidos inmediatos por WhatsApp.`;
    const prodImg = (prod.fotos && prod.fotos.length > 0) ? `https://levwild.com/images/products/${{prod.fotos[0]}}` : 'https://levwild.com/images/brand/logo-lev-nav.png';
    const prodUrl = `https://levwild.com/?p=${{slugify(prod.codigo)}}`;

    document.title = prodTitle;
    setMeta('metaDescription', prodDesc, 'name', 'description');
    setMeta('ogTitle', prodTitle, 'property', 'og:title');
    setMeta('ogDescription', prodDesc, 'property', 'og:description');
    setMeta('ogImage', prodImg, 'property', 'og:image');
    setMeta('ogUrl', prodUrl, 'property', 'og:url');
    setMeta('ogType', 'product', 'property', 'og:type');
    setMeta('twitterTitle', prodTitle, 'name', 'twitter:title');
    setMeta('twitterDescription', prodDesc, 'name', 'twitter:description');
    setMeta('twitterImage', prodImg, 'name', 'twitter:image');

    if (DOM.structuredData) {{
      DOM.structuredData.textContent = JSON.stringify(generateProductSchema(prod, prodUrl, prodImg));
    }}
  }}

  function setMeta(elementKey, value, attrType, attrName) {{
    let el = DOM[elementKey] || document.querySelector(`meta[${{attrType}}="${{attrName}}"]`);
    if (!el) {{
      el = document.createElement('meta');
      el.setAttribute(attrType, attrName);
      document.head.appendChild(el);
      DOM[elementKey] = el;
    }}
    el.setAttribute('content', value);
  }}

  function generateOrganizationSchema() {{
    return {{
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      "name": "LEV Wild Spirit",
      "url": "https://levwild.com",
      "logo": "https://levwild.com/images/brand/logo-lev-nav.png",
      "description": "Equipamiento deportivo de alto rendimiento para ciclismo, gimnasio y escalada.",
      "telephone": "+593985346800",
      "sameAs": [
        "https://www.instagram.com/lev.wildspirit/",
        "https://www.facebook.com/profile.php?id=61593353747996"
      ]
    }};
  }}

  function generateProductSchema(prod, url, imageUrl) {{
    const brandName = detectBrand(prod);
    const schema = {{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": prod.nombre,
      "image": [imageUrl],
      "description": prod.descripcion || `${{prod.nombre}} de alto rendimiento en LEV Wild Spirit.`,
      "sku": prod.codigo,
      "mpn": prod.codigo,
      "brand": {{
        "@type": "Brand",
        "name": brandName
      }},
      "offers": {{
        "@type": "Offer",
        "url": url,
        "priceCurrency": "USD",
        "price": prod.precio ? parseFloat(prod.precio).toFixed(2) : "0.00",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {{
          "@type": "Organization",
          "name": "LEV Wild Spirit"
        }}
      }}
    }};
    return schema;
  }}

  // ==========================================================================
  // 11. FILTRADO, BÚSQUEDA Y LÓGICA DE ESTADO
  // ==========================================================================
  function filterByDisciplineOnly(products, discipline) {{
    if (!discipline || discipline === 'todos') return products;
    return products.filter(p => {{
      const d = (p.disciplina || '').toLowerCase();
      if (d === 'todos' || d === '') return true;
      if (discipline === 'gym') return d.includes('gym') || d.includes('training') || d.includes('gimnasio');
      if (discipline === 'ciclismo') return d.includes('ciclismo') || d.includes('ruta') || d.includes('mtb');
      if (discipline === 'escalada') return d.includes('escalada');
      return d.includes(discipline);
    }});
  }}

  function getFilteredProducts() {{
    return state.products.filter(prod => {{
      // Filtro Disciplina
      if (state.activeDiscipline !== 'todos') {{
        const d = (prod.disciplina || '').toLowerCase();
        if (d !== 'todos' && d !== '') {{
          if (state.activeDiscipline === 'gym' && !(d.includes('gym') || d.includes('training') || d.includes('gimnasio'))) return false;
          if (state.activeDiscipline === 'ciclismo' && !(d.includes('ciclismo') || d.includes('ruta') || d.includes('mtb'))) return false;
          if (state.activeDiscipline === 'escalada' && !d.includes('escalada')) return false;
        }}
      }}

      // Filtro Categoría
      if (state.activeCategory !== 'todos') {{
        if (prod.categoria.toLowerCase() !== state.activeCategory.toLowerCase()) {{
          return false;
        }}
      }}

      // Filtro Subcategoría
      if (state.activeSubcategory !== 'todos') {{
        const subfilter = state.activeSubcategory.toLowerCase();
        const pSub = (prod.subcategoria || '').toLowerCase();
        const pName = (prod.nombre || '').toLowerCase();

        if (subfilter === 'delantera' && !(pSub.includes('delantera') || pName.includes('delantera'))) return false;
        if (subfilter === 'trasera' && !(pSub.includes('trasera') || pName.includes('trasera') || pSub.includes('sensor de freno') || pSub.includes('automática'))) return false;
        if (subfilter === 'adulto' && !pSub.includes('adulto')) return false;
        if (subfilter === 'niño' && !(pSub.includes('niño') || pSub.includes('nino') || pName.includes('niño'))) return false;
        
        // Modelos de cascos
        if (state.activeCategory.toLowerCase().includes('casco')) {{
          const family = slugify(getProductFamilyName(prod.nombre));
          if (family && family !== subfilter) return false;
        }}
      }}

      // Búsqueda por texto libre
      if (state.searchQuery.trim() !== '') {{
        const q = state.searchQuery.toLowerCase().trim();
        const inName = (prod.nombre || '').toLowerCase().includes(q);
        const inCode = (prod.codigo || '').toLowerCase().includes(q);
        const inCat = (prod.categoria || '').toLowerCase().includes(q);
        const inSub = (prod.subcategoria || '').toLowerCase().includes(q);
        const inDesc = (prod.descripcion || '').toLowerCase().includes(q);
        const inSpecs = JSON.stringify(prod.especificaciones || {{}}).toLowerCase().includes(q);
        const inBrand = detectBrand(prod).toLowerCase().includes(q);

        return inName || inCode || inCat || inSub || inDesc || inSpecs || inBrand;
      }}

      return true;
    }});
  }}

  function getSiblingVariants(prod) {{
    const family = getProductFamilyKey(prod);
    return state.products.filter(p => getProductFamilyKey(p) === family);
  }}

  function getProductFamilyKey(prod) {{
    const code = (prod.codigo || '').toUpperCase();
    const name = (prod.nombre || '').toLowerCase();

    if (code.startsWith('LEV-CAS-12H15')) return 'CAS-12H15';
    if (code.startsWith('LEV-CAS-12H22N')) return 'CAS-12H22N';
    if (code.startsWith('LEV-CAS-12H09')) return 'CAS-12H09';
    if (code.startsWith('LEV-CAS-11H01')) return 'CAS-11H01';
    if (code.startsWith('LEV-GAF-10H1')) return 'GAF-10H1';
    if (code.startsWith('LEV-GAF-10H2')) return 'GAF-10H2';
    if (code.startsWith('LEV-AUD-LANG-TS19')) return 'AUD-TS19';
    if (code.startsWith('LEV-BOL-ESC')) return 'BOL-ESC';

    return prod.codigo;
  }}

  function getProductFamilyName(name) {{
    if (!name) return '';
    const clean = name.replace(/-\s*(Plomo|Negro|Blanco|Rojo|Verde|Azul|Amarillo|Beige).*$/i, '').trim();
    return clean;
  }}

  function getVariantColorHex(variantStr) {{
    if (!variantStr) return null;
    const v = variantStr.toLowerCase();
    if (v.includes('plomo') || v.includes('gris')) return '#64748B';
    if (v.includes('blanco con azul')) return 'linear-gradient(135deg, #FFFFFF 50%, #0284C7 50%)';
    if (v.includes('verde con blanco')) return 'linear-gradient(135deg, #22C55E 50%, #FFFFFF 50%)';
    if (v.includes('negro con rojo')) return 'linear-gradient(135deg, #090D16 50%, #EF4444 50%)';
    if (v.includes('negro con blanco')) return 'linear-gradient(135deg, #090D16 50%, #FFFFFF 50%)';
    if (v.includes('negro con plomo') || v.includes('negro con gris')) return 'linear-gradient(135deg, #090D16 50%, #64748B 50%)';
    if (v.includes('rojo con negro')) return 'linear-gradient(135deg, #EF4444 50%, #090D16 50%)';
    if (v.includes('negro con azul')) return 'linear-gradient(135deg, #090D16 50%, #0284C7 50%)';
    if (v.includes('negro') || v.includes('black')) return '#090D16';
    if (v.includes('blanco') || v.includes('white')) return '#FFFFFF';
    if (v.includes('rojo') || v.includes('red')) return '#EF4444';
    if (v.includes('azul') || v.includes('blue')) return '#0284C7';
    if (v.includes('amarillo') || v.includes('yellow')) return '#FACC15';
    if (v.includes('verde') || v.includes('green')) return '#22C55E';
    if (v.includes('beige')) return '#E2D9C8';
    return null;
  }}

  function getCategoryEmoji(catName) {{
    const c = (catName || '').toLowerCase();
    if (c.includes('casco')) return '🪖';
    if (c.includes('guante')) return '🧤';
    if (c.includes('iluminac') || c.includes('luz') || c.includes('luces')) return '💡';
    if (c.includes('audifono')) return '🎧';
    if (c.includes('gafa')) return '🕶️';
    if (c.includes('bolsa') || c.includes('magnesio')) return '🎒';
    if (c.includes('gorra')) return '🧢';
    if (c.includes('componente') || c.includes('pedal')) return '⚙️';
    return '⚡';
  }}

  function slugify(text) {{
    if (!text) return '';
    return text.toString().toLowerCase()
      .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }}

  function updateResultsSummary(count) {{
    if (!DOM.resultsCountText) return;
    let label = `${{count}} ${{count === 1 ? 'producto encontrado' : 'productos encontrados'}}`;
    if (state.activeCategory !== 'todos') {{
      label += ` en <strong>${{state.activeCategory}}</strong>`;
    }}
    if (state.activeDiscipline !== 'todos') {{
      label += ` (${{state.activeDiscipline.toUpperCase()}})`;
    }}
    if (state.searchQuery) {{
      label += ` para "${{state.searchQuery}}"`;
    }}
    DOM.resultsCountText.innerHTML = label;
  }}

  // ==========================================================================
  // 12. EVENTOS GLOBALES Y CONTROLES UI
  // ==========================================================================
  function setupEventListeners() {{
    if (DOM.navDesktop) {{
      DOM.navDesktop.querySelectorAll('.nav-btn').forEach(btn => {{
        btn.addEventListener('click', () => {{
          DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeDiscipline = btn.dataset.discipline || 'todos';
          renderCategoryPills();
          renderCatalog();
        }});
      }});
    }}

    if (DOM.mobileMenuToggle && DOM.mobileDrawer) {{
      DOM.mobileMenuToggle.addEventListener('click', () => {{
        const isOpen = DOM.mobileDrawer.classList.toggle('open');
        DOM.mobileMenuToggle.classList.toggle('open');
        DOM.mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      }});
    }}

    if (DOM.mobileDrawer) {{
      DOM.mobileDrawer.querySelectorAll('.drawer-pill[data-discipline]').forEach(btn => {{
        btn.addEventListener('click', () => {{
          DOM.mobileDrawer.querySelectorAll('.drawer-pill[data-discipline]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeDiscipline = btn.dataset.discipline || 'todos';
          
          if (DOM.navDesktop) {{
            DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => {{
              b.classList.toggle('active', b.dataset.discipline === state.activeDiscipline);
            }});
          }}

          DOM.mobileDrawer.classList.remove('open');
          DOM.mobileMenuToggle.classList.remove('open');
          renderCategoryPills();
          renderCatalog();
        }});
      }});
    }}

    if (DOM.searchInput) {{
      DOM.searchInput.addEventListener('input', (e) => {{
        state.searchQuery = e.target.value;
        if (DOM.searchClearBtn) {{
          DOM.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
        }}
        renderCatalog();
      }});
    }}

    if (DOM.searchClearBtn) {{
      DOM.searchClearBtn.addEventListener('click', () => {{
        if (DOM.searchInput) DOM.searchInput.value = '';
        state.searchQuery = '';
        DOM.searchClearBtn.style.display = 'none';
        renderCatalog();
      }});
    }}

    if (DOM.searchToggleBtn) {{
      DOM.searchToggleBtn.addEventListener('click', () => {{
        if (DOM.searchBoxWrapper) {{
          DOM.searchBoxWrapper.classList.toggle('active');
          if (DOM.searchBoxWrapper.classList.contains('active') && DOM.searchInput) {{
            DOM.searchInput.focus();
          }}
        }}
      }});
    }}

    if (DOM.resetFiltersBtn) {{
      DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
    }}

    if (DOM.clearSearchActionBtn) {{
      DOM.clearSearchActionBtn.addEventListener('click', resetAllFilters);
    }}

    if (DOM.modalCloseBtn) {{
      DOM.modalCloseBtn.addEventListener('click', () => closeProductModal(true));
    }}

    if (DOM.productModal) {{
      DOM.productModal.addEventListener('click', (e) => {{
        if (e.target === DOM.productModal || e.target.classList.contains('modal-backdrop')) {{
          closeProductModal(true);
        }}
      }});
    }}

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'Escape') {{
        if (zoomState.isOpen) closeFullscreenZoom();
        else if (DOM.productModal && DOM.productModal.classList.contains('open')) closeProductModal(true);
      }}
    }});

    document.querySelectorAll('[data-action="scroll-catalogo"], .announcement-link').forEach(link => {{
      link.addEventListener('click', (e) => {{
        e.preventDefault();
        scrollToSection('filterBar');
      }});
    }});
  }}

  function resetAllFilters() {{
    state.activeDiscipline = 'todos';
    state.activeCategory = 'todos';
    state.activeSubcategory = 'todos';
    state.searchQuery = '';

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'none';

    if (DOM.navDesktop) {{
      DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => {{
        b.classList.toggle('active', b.dataset.discipline === 'todos');
      }});
    }}

    history.pushState(null, '', '/');
    updateProductMeta(null);

    renderCategoryPills();
    renderCatalog();
    scrollToSection('filterBar');
  }}

  function scrollToSection(elementId) {{
    const el = document.getElementById(elementId);
    if (el) {{
      const headerOffset = 90;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - headerOffset;
      window.scrollTo({{
        top: offsetPosition,
        behavior: 'smooth'
      }});
    }}
  }}

  function setupScrollAnimations() {{
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          entry.target.classList.add('revealed');
        }}
      }});
    }}, {{ threshold: 0.08 }});

    reveals.forEach(r => observer.observe(r));
  }}

  // ==========================================================================
  // 13. TEMA CLARO / OSCURO (BLANCO LIMPIO VS DARK MODE)
  // ==========================================================================
  function initTheme() {{
    const savedTheme = localStorage.getItem('lev_theme') || 'dark';
    applyTheme(savedTheme);

    const toggleTheme = () => {{
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('lev_theme', next);
    }};

    if (DOM.themeToggleBtn) DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    if (DOM.mobileThemeToggleBtn) DOM.mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }}

  function applyTheme(theme) {{
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    const isLight = theme === 'light';
    if (isLight) {{
      document.body.classList.add('theme-light');
    }} else {{
      document.body.classList.remove('theme-light');
    }}

    if (DOM.themeToggleBtn) {{
      const sun = DOM.themeToggleBtn.querySelector('.sun-icon');
      const moon = DOM.themeToggleBtn.querySelector('.moon-icon');
      if (sun && moon) {{
        sun.style.display = isLight ? 'none' : 'block';
        moon.style.display = isLight ? 'block' : 'none';
      }}
    }}

    if (DOM.mobileThemeToggleBtn) {{
      DOM.mobileThemeToggleBtn.textContent = isLight ? '🌙 Modo Oscuro' : '☀️ Fondo Blanco';
    }}
  }}

  // ==========================================================================
  // 14. DATASET SINCRONIZADO DE RESPALDO (OFFLINE / FALLBACK)
  // ==========================================================================
  function loadFallbackData() {{
    const fallback = {json_str};
    state.data = fallback;
    state.products = fallback.productos || [];
    state.categories = fallback.categorias || [];
    state.disciplines = fallback.disciplinas || [];
    state.videos = fallback.videos || [];
    if (fallback.marca && fallback.marca.whatsapp_numero) {{
      CONFIG.defaultWhatsapp = fallback.marca.whatsapp_numero;
    }}
    renderVideoShowcase();
    renderCategoryPills();
    renderNavigationLinks();
    renderCatalog();
  }}

  // Iniciar al cargar el DOM
  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', init);
  }} else {{
    init();
  }}

}})();
"""

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js_code)
print("-> app.js actualizado.")

# 3. Construir index.html base
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

index_html = re.sub(r'<link rel="canonical"[^>]*>', '', index_html)
index_html = index_html.replace('</title>', '</title>\n  <link rel="canonical" href="https://levwild.com/">')

index_html = re.sub(
    r'<a href="[^"]*" class="announcement-link"[^>]*>Ver Catálogo &rarr;</a>',
    r'<a href="/" class="announcement-link" data-action="scroll-catalogo">Ver Catálogo &rarr;</a>',
    index_html
)

index_html = re.sub(
    r'<a href="[^"]*" class="brand-logo"[^>]*>',
    r'<a href="/" class="brand-logo" aria-label="LEV Wild Spirit Inicio">',
    index_html
)

clean_quick_bar = """        <div class="hero-disciplines-bar animate-fade-in" id="heroCategoryQuickBar">
          <a href="/cascos/" class="hero-quick-tag" data-cat="cascos">
            <span class="icon">🪖</span>
            <span class="label">Cascos</span>
          </a>
          <a href="/guantes/" class="hero-quick-tag" data-cat="guantes">
            <span class="icon">🧤</span>
            <span class="label">Guantes</span>
          </a>
          <a href="/luces-delanteras/" class="hero-quick-tag" data-cat="luces-delanteras">
            <span class="icon">🔦</span>
            <span class="label">Luces Delanteras</span>
          </a>
          <a href="/luces-traseras/" class="hero-quick-tag" data-cat="luces-traseras">
            <span class="icon">🚨</span>
            <span class="label">Luces Traseras</span>
          </a>
          <a href="/audifonos/" class="hero-quick-tag" data-cat="audifonos">
            <span class="icon">🎧</span>
            <span class="label">Audífonos</span>
          </a>
          <a href="/gafas/" class="hero-quick-tag" data-cat="gafas">
            <span class="icon">🕶️</span>
            <span class="label">Gafas</span>
          </a>
          <a href="/bolsas/" class="hero-quick-tag" data-cat="bolsas">
            <span class="icon">🎒</span>
            <span class="label">Bolsas & Magnesio</span>
          </a>
          <a href="/gorras/" class="hero-quick-tag" data-cat="gorras">
            <span class="icon">🧢</span>
            <span class="label">Gorras</span>
          </a>
          <a href="/componentes/" class="hero-quick-tag" data-cat="componentes">
            <span class="icon">⚙️</span>
            <span class="label">Componentes</span>
          </a>
        </div>"""

index_html = re.sub(
    r'<div class="hero-disciplines-bar animate-fade-in" id="heroCategoryQuickBar">[\s\S]*?</div>\s*</div>',
    clean_quick_bar + '\n      </div>',
    index_html
)

index_html = re.sub(
    r'<a href="[^"]*" class="btn btn-primary btn-lg"[^>]*>',
    r'<a href="/" class="btn btn-primary btn-lg" data-action="scroll-catalogo">',
    index_html
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)
print("-> index.html actualizado.")

# 4. Generar subpáginas estáticas por categoría
categories_meta = [
    {
        'slug': 'cascos',
        'category_name': 'Cascos',
        'title': 'Cascos de Ciclismo | LEV Wild Spirit',
        'desc': 'Cascos aerodinámicos de alta protección con visor magnético y luz trasera LED integrada en varios colores. Explora el catálogo oficial LEV Wild Spirit.',
        'image': 'images/products/casco-promend-12H15-plomo-01.webp'
    },
    {
        'slug': 'guantes',
        'category_name': 'Guantes',
        'title': 'Guantes de Ciclismo y Deportivos | LEV Wild Spirit',
        'desc': 'Guantes de ciclismo antideslizantes y transpirables para adultos y niños. Conoce todos los modelos, colores y tallas en LEV Wild Spirit.',
        'image': 'images/products/guante-ciclismo-adulto-01.webp'
    },
    {
        'slug': 'luces-delanteras',
        'category_name': 'Iluminación',
        'subcategory': 'delantera',
        'title': 'Luces Delanteras de Alta Potencia | LEV Wild Spirit',
        'desc': 'Luces delanteras LED de 1000 y 1300 lúmenes con batería recargable USB para ciclismo de ruta y montaña.',
        'image': 'images/products/luz-delantera-1300lm-01.webp'
    },
    {
        'slug': 'luces-traseras',
        'category_name': 'Iluminación',
        'subcategory': 'trasera',
        'title': 'Luces Traseras Inteligentes con Sensor de Freno | LEV Wild Spirit',
        'desc': 'Luces traseras inteligentes con sensor de freno automático y tecnología LED COB para máxima seguridad ciclista en LEV Wild Spirit.',
        'image': 'images/products/luz-trasera-sensorfreno-01.webp'
    },
    {
        'slug': 'iluminacion',
        'category_name': 'Iluminación',
        'title': 'Iluminación y Luces LED para Ciclismo | LEV Wild Spirit',
        'desc': 'Luces delanteras y traseras de alta potencia con sensor de freno inteligente para ciclismo nocturno y urbano en LEV Wild Spirit.',
        'image': 'images/products/luz-delantera-1300lm-01.webp'
    },
    {
        'slug': 'audifonos',
        'category_name': 'Audífonos',
        'title': 'Audífonos Deportivos Open-Ear | LEV Wild Spirit',
        'desc': 'Audífonos deportivos Langsdom TS19 y OpenAir Duet. Audio de alta fidelidad sin tapar el oído para entrenar con total seguridad.',
        'image': 'images/products/audifono-ts19-beige-001.webp'
    },
    {
        'slug': 'gafas',
        'category_name': 'Gafas',
        'title': 'Gafas Polarizadas Deportivas ROCKBROS | LEV Wild Spirit',
        'desc': 'Gafas deportivas con protección UV400, micas polarizadas e intercambiables para ciclismo y entrenamiento al aire libre.',
        'image': 'images/products/gafa-rockbros-10h1-negroazul-01.webp'
    },
    {
        'slug': 'bolsas',
        'category_name': 'Bolsas y Magnesio',
        'title': 'Bolsas Técnicas, Mochilas y Magnesio | LEV Wild Spirit',
        'desc': 'Bolsos de magnesio Luckstone para escalada, mochilas de ciclismo, riñoneras y bolsas magnéticas para gimnasio en LEV Wild Spirit.',
        'image': 'images/products/bolsa-magnesio-azul-001.webp'
    },
    {
        'slug': 'gorras',
        'category_name': 'Gorras',
        'title': 'Gorras de Ciclismo Deportivas | LEV Wild Spirit',
        'desc': 'Gorras transpirables bajo casco con protección solar para ciclistas y atletas en LEV Wild Spirit.',
        'image': 'images/products/gorra-ciclismo-01.webp'
    },
    {
        'slug': 'componentes',
        'category_name': 'Componentes',
        'title': 'Componentes y Pedales de Ciclismo | LEV Wild Spirit',
        'desc': 'Pedales mixtos MTB de aluminio sellado y componentes de alta durabilidad para bicicleta en LEV Wild Spirit.',
        'image': 'images/products/pedal-mixto-mtb-01.webp'
    }
]

for cat in categories_meta:
    slug = cat['slug']
    os.makedirs(slug, exist_ok=True)
    page_html = index_html

    page_html = re.sub(r'<title>.*?</title>', f'<title>{cat["title"]}</title>', page_html)
    page_html = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="https://levwild.com/{slug}/">', page_html)
    page_html = re.sub(r'<meta name="description" id="metaDescription" content=".*?">', f'<meta name="description" id="metaDescription" content="{cat["desc"]}">', page_html)
    page_html = re.sub(r'<meta property="og:title" id="ogTitle" content=".*?">', f'<meta property="og:title" id="ogTitle" content="{cat["title"]}">', page_html)
    page_html = re.sub(r'<meta property="og:description" id="ogDescription" content=".*?">', f'<meta property="og:description" id="ogDescription" content="{cat["desc"]}">', page_html)
    page_html = re.sub(r'<meta property="og:image" id="ogImage" content=".*?">', f'<meta property="og:image" id="ogImage" content="https://levwild.com/{cat["image"]}">', page_html)
    page_html = re.sub(r'<meta property="og:url" id="ogUrl" content=".*?">', f'<meta property="og:url" id="ogUrl" content="https://levwild.com/{slug}/">', page_html)
    page_html = re.sub(r'<meta name="twitter:title" id="twitterTitle" content=".*?">', f'<meta name="twitter:title" id="twitterTitle" content="{cat["title"]}">', page_html)
    page_html = re.sub(r'<meta name="twitter:description" id="twitterDescription" content=".*?">', f'<meta name="twitter:description" id="twitterDescription" content="{cat["desc"]}">', page_html)
    page_html = re.sub(r'<meta name="twitter:image" id="twitterImage" content=".*?">', f'<meta name="twitter:image" id="twitterImage" content="https://levwild.com/{cat["image"]}">', page_html)

    subcat_attr = f' data-subcat="{cat["subcategory"]}"' if 'subcategory' in cat else ''
    page_html = re.sub(r'<body([^>]*)>', f'<body\\1 data-initial-cat="{cat["category_name"]}"{subcat_attr}>', page_html)

    page_html = page_html.replace('href="style.css"', 'href="../style.css"')
    page_html = page_html.replace('src="app.js"', 'src="../app.js"')
    page_html = page_html.replace('href="favicon.ico"', 'href="../favicon.ico"')
    page_html = page_html.replace('href="images/', 'href="../images/')
    page_html = page_html.replace('src="images/', 'src="../images/')

    sub_file = os.path.join(slug, 'index.html')
    with open(sub_file, 'w', encoding='utf-8') as f:
        f.write(page_html)
    print(f"-> Subpágina: {sub_file}")

# 5. Generar 404.html
err_html = index_html.replace('href="style.css"', 'href="/style.css"').replace('src="app.js"', 'src="/app.js"')
with open('404.html', 'w', encoding='utf-8') as f:
    f.write(err_html)
print("-> 404.html actualizado.")

# 6. Sincronizar catalogo-meta.csv
rows = []
header = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'google_product_category', 'fb_product_category', 'color']

for p in catalog_data['productos']:
    pid = p['codigo']
    variant = p.get('subcategoria') or ''
    title = f"{p['nombre']}{f' - {variant}' if variant else ''}"
    desc = p.get('descripcion') or f"{p['nombre']} de alto rendimiento LEV Wild Spirit."
    avail = 'in stock'
    cond = 'new'
    price = f"{float(p['precio']):.2f} USD" if p.get('precio') else '0.00 USD'
    
    cat_lower = p['categoria'].lower()
    if 'casco' in cat_lower:
        slug = 'cascos'
    elif 'guante' in cat_lower:
        slug = 'guantes'
    elif 'iluminac' in cat_lower:
        slug = 'luces-delanteras' if 'delantera' in variant.lower() else 'luces-traseras'
    elif 'audifono' in cat_lower:
        slug = 'audifonos'
    elif 'gafa' in cat_lower:
        slug = 'gafas'
    elif 'bolsa' in cat_lower or 'magnesio' in cat_lower:
        slug = 'bolsas'
    elif 'gorra' in cat_lower:
        slug = 'gorras'
    elif 'componente' in cat_lower or 'pedal' in cat_lower:
        slug = 'componentes'
    else:
        slug = 'cascos'
        
    link = f"https://levwild.com/{slug}/"
    img = f"https://levwild.com/images/products/{p['fotos'][0]}" if p.get('fotos') else 'https://levwild.com/images/brand/logo-lev-nav.png'
    
    code = pid.upper()
    name = p['nombre'].lower()
    if '12H' in code or 'promend' in name:
        brand = 'Promend'
    elif '11H' in code or 'bike boy' in name:
        brand = 'Bike Boy'
    elif 'GAF' in code or 'rockbros' in name:
        brand = 'ROCKBROS'
    elif 'GUA-NINO' in code or 'knightlaood' in name:
        brand = 'Knightlaood'
    elif 'TS19' in code or 'langsdom' in name:
        brand = 'Langsdom'
    elif 'BOL-ESC' in code or 'luckstone' in name:
        brand = 'Luckstone'
    else:
        brand = 'LEV Wild Spirit'
        
    rows.append({
        'id': pid,
        'title': title,
        'description': desc,
        'availability': avail,
        'condition': cond,
        'price': price,
        'link': link,
        'image_link': img,
        'brand': brand,
        'google_product_category': p['categoria'],
        'fb_product_category': p['categoria'],
        'color': variant or 'Único'
    })

with open('catalogo-meta.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=header)
    writer.writeheader()
    writer.writerows(rows)
print("-> catalogo-meta.csv sincronizado.")

# 7. Generar Sitemap y Robots
sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://levwild.com/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://levwild.com/cascos/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/guantes/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/luces-delanteras/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/luces-traseras/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/audifonos/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/gafas/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/bolsas/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/gorras/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://levwild.com/componentes/</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
"""

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_xml.strip())
print("-> sitemap.xml actualizado.")

robots_txt = """User-agent: *
Allow: /

Sitemap: https://levwild.com/sitemap.xml
"""

with open('robots.txt', 'w', encoding='utf-8') as f:
    f.write(robots_txt.strip())
print("-> robots.txt actualizado.")

print("\n Sincronización completa con éxito.")
