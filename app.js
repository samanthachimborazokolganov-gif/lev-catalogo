/**
 * LEV WILD SPIRIT - MOTOR DE CATÁLOGO DINÁMICO v3.0
 * - URLs 100% LIMPIAS SIN HASHTAGS (#) PARA SEO (ej: https://levwild.com/cascos/, https://levwild.com/guantes/)
 * - Subpáginas estáticas dedicadas por categoría con Metatags Open Graph y Twitter Cards
 * - Sincronización en tiempo real de variantes de diseño y color en tarjeta y modal
 * - Mensajes de WhatsApp predeterminados exactos con Nombre, Variante y Precio USD
 * - Showcase cinemático de videos demostrativos en ruta
 * - Zoom interactivo HD con lupa y Lightbox fullscreen
 */

(function () {
  'use strict';

  function getBasePrefix() {
    if (typeof window !== 'undefined') {
      if (window.location.protocol === 'file:') {
        const scriptEl = document.querySelector('script[src*="app.js"]');
        return scriptEl ? scriptEl.getAttribute('src').replace('app.js', '') : './';
      }
      return '/';
    }
    return './';
  }

  // Configuración global
  const CONFIG = {
    dataPath: getBasePrefix() + 'data/productos.json',
    imagesPath: getBasePrefix() + 'images/products/',
    defaultWhatsapp: '593985346800',
    siteUrl: 'https://levwild.com'
  };

  // Estado de la aplicación
  const state = {
    data: null,
    products: [],
    categories: [],
    disciplines: [],
    videos: [],
    activeDiscipline: 'todos',
    activeCategory: 'todos',
    activeSubcategory: 'todos',
    searchQuery: '',
    carousels: {},
    currentModalProduct: null
  };

  // Estado del Zoom Fullscreen / Lightbox
  const zoomState = {
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
  };

  // Elementos DOM
  const DOM = {};

  function populateDOM() {
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
  }

  // ==========================================================================
  // 1. INICIALIZACIÓN Y CARGA DE DATOS
  // ==========================================================================
  async function init() {
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
  }

  async function loadCatalogData() {
    try {
      const response = await fetch(CONFIG.dataPath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      state.data = json;
      state.products = json.productos || [];
      state.categories = json.categorias || [];
      state.disciplines = json.disciplinas || [];
      state.videos = json.videos || [];
      
      if (json.marca && json.marca.whatsapp_numero) {
        CONFIG.defaultWhatsapp = json.marca.whatsapp_numero;
      }
    } catch (err) {
      console.warn('Cargando dataset sincronizado de respaldo:', err);
      loadFallbackData();
    } finally {
      if (DOM.catalogLoading) {
        DOM.catalogLoading.style.display = 'none';
      }
    }
  }

  // ==========================================================================
  // 2. GENERACIÓN DE MENSAJES Y ENLACES WHATSAPP PRECISOS
  // ==========================================================================
  function formatPriceText(price) {
    if (price === null || price === undefined || price === '') return '';
    const num = parseFloat(price);
    if (isNaN(num)) return '';
    return `$${num.toFixed(2)} USD`;
  }

  function getProductWhatsAppUrl(prod, customGreeting = 'Quiero pedir información y comprar') {
    const nombre = (prod.nombre || 'Producto LEV').trim();
    const variante = prod.subcategoria ? ` en color/modelo *${prod.subcategoria}*` : '';
    const priceStr = formatPriceText(prod.precio);
    const precio = priceStr ? ` por el valor de *${priceStr}*` : '';
    
    const msg = `¡Hola LEV Wild Spirit! 👋 ${customGreeting}: *${nombre}*${variante}${precio}. ¿Tienen stock disponible y cuál es el procedimiento de entrega?`;
    return `https://wa.me/${CONFIG.defaultWhatsapp}?text=${encodeURIComponent(msg)}`;
  }

  function getModalWhatsAppUrl(prod) {
    return getProductWhatsAppUrl(prod, 'Deseo realizar el pedido de');
  }

  // ==========================================================================
  // 3. SHOWCASE DE VIDEOS HORIZONTALES CINEMÁTICO
  // ==========================================================================
  function renderVideoShowcase() {
    if (!DOM.videoShowcaseContainer || !state.videos || state.videos.length === 0) return;

    let html = '';
    state.videos.forEach(vid => {
      const vidWaMsg = `¡Hola LEV Wild Spirit! 👋 Vi el video de *${vid.producto_nombre || vid.titulo}* en su catálogo web y quiero consultar disponibilidad y precio.`;
      const vidWaUrl = `https://wa.me/${CONFIG.defaultWhatsapp}?text=${encodeURIComponent(vidWaMsg)}`;

      html += `
        <div class="video-card-cinematic" id="${vid.id}">
          <div class="video-player-box-cinematic">
            <video class="video-element-cinematic" controls playsinline preload="metadata">
              <source src="${CONFIG.imagesPath}${vid.archivo}" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>
          </div>
          <div class="video-info-cinematic">
            <div class="video-badge-row">
              <span class="video-tag-pill">${vid.badge || '⚡ DEMOSTRACIÓN EN RUTA'}</span>
              <span class="video-category-pill">🚴 ${vid.disciplina || vid.categoria}</span>
            </div>
            <h3 class="video-title-cinematic">${vid.titulo}</h3>
            <p class="video-desc-cinematic">${vid.subtitulo || 'Comprobación de rendimiento, resistencia y visibilidad en ruta real.'}</p>
            
            <div class="video-actions-cinematic">
              <button class="btn-video-product" data-ref="${vid.producto_ref}">
                <span>Ver Ficha del Producto</span> &rarr;
              </button>
              <a href="${vidWaUrl}" target="_blank" rel="noopener noreferrer" class="btn-video-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.12 .94 11.503.94c-5.44 0-9.866 4.372-9.87 9.802 0 1.83.504 3.619 1.46 5.181l-.959 3.501 3.616-.948l.307.182zm11.391-7.795c-.328-.162-1.94-.949-2.24-.1.057-.301-.15-.406-.328-.488-.3-.136-.527-.243-.728-.544-.2-.301-.2-.581-.1-.861.1-.281.428-.681.628-.881.2-.201.272-.281.399-.481.129-.2.057-.381-.043-.581-.1-.2-.828-1.971-1.128-2.693-.3-.721-.586-.622-.8-.632l-.685-.01c-.243 0-.643.09-.971.451-.328.361-1.257 1.213-1.257 2.946 0 1.733 1.271 3.407 1.443 3.637.171.23 2.5 3.778 6.057 5.283.846.357 1.506.57 2.02.729.85.267 1.624.23 2.235.14.68-.101 2.086-.842 2.371-1.663.286-.822.286-1.523.2-1.663-.085-.141-.314-.221-.643-.382z"/>
                </svg>
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      `;
    });

    DOM.videoShowcaseContainer.innerHTML = html;

    DOM.videoShowcaseContainer.querySelectorAll('.btn-video-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ref = btn.dataset.ref;
        const targetProd = state.products.find(p => p.codigo === ref || slugify(p.codigo) === slugify(ref));
        if (targetProd) {
          openProductModal(targetProd, 'video', true);
        }
      });
    });
  }

  // ==========================================================================
  // 4. RENDERIZADO DE PASTILLAS Y NAVEGACIÓN (URLs LIMPIAS SIN HASHTAGS)
  // ==========================================================================
  function getCategoryPath(catName, subcat = 'todos') {
    const cName = (catName || '').toLowerCase();
    if (cName === 'todos' || !cName) return '/';
    if (cName.includes('casco')) return '/cascos/';
    if (cName.includes('guante')) return '/guantes/';
    if (cName.includes('iluminac') || cName.includes('luz') || cName.includes('luces')) {
      if (subcat === 'delantera') return '/luces-delanteras/';
      if (subcat === 'trasera') return '/luces-traseras/';
      return '/luces-delanteras/';
    }
    if (cName.includes('audifono')) return '/audifonos/';
    if (cName.includes('gafa')) return '/gafas/';
    if (cName.includes('bolsa')) return '/bolsas/';
    if (cName.includes('gorra')) return '/gorras/';
    if (cName.includes('componente') || cName.includes('pedal')) return '/componentes/';

    const catObj = state.categories.find(c => c.nombre.toLowerCase() === cName);
    const slug = catObj ? (catObj.slug || slugify(catObj.nombre)) : slugify(catName);
    return `/${slug}/`;
  }

  function renderCategoryPills() {
    if (!DOM.categoryPillsContainer) return;

    const filteredByDiscipline = filterByDisciplineOnly(state.products, state.activeDiscipline);
    const totalCount = filteredByDiscipline.length;

    let html = `
      <a href="/" class="cat-pill ${state.activeCategory === 'todos' ? 'active' : ''}" data-cat="todos">
        <span>⚡ Todos</span>
        <span class="count">${totalCount}</span>
      </a>
    `;

    state.categories.forEach(cat => {
      const catCount = filteredByDiscipline.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
      if (catCount > 0 || state.activeDiscipline === 'todos') {
        const isCatActive = state.activeCategory.toLowerCase() === cat.nombre.toLowerCase();
        const path = getCategoryPath(cat.nombre, 'todos');
        html += `
          <a href="${path}" class="cat-pill ${isCatActive ? 'active' : ''}" data-cat="${cat.nombre}" data-slug="${cat.slug || slugify(cat.nombre)}">
            <span>${cat.icono || '🏷️'} ${cat.nombre}</span>
            <span class="count">${catCount}</span>
          </a>
        `;
      }
    });

    DOM.categoryPillsContainer.innerHTML = html;

    DOM.categoryPillsContainer.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = pill.dataset.cat;
        activateCategory(cat, 'todos', true);
      });
    });
  }

  function renderNavigationLinks() {
    if (DOM.footerCategoriesList) {
      let footerCatsHtml = '';
      state.categories.forEach(cat => {
        const path = getCategoryPath(cat.nombre, 'todos');
        footerCatsHtml += `
          <li>
            <a href="${path}" data-cat-link="${cat.nombre}">
              ${cat.icono || '🏷️'} ${cat.nombre}
            </a>
          </li>
        `;
      });
      DOM.footerCategoriesList.innerHTML = footerCatsHtml;

      DOM.footerCategoriesList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const cat = link.dataset.catLink;
          if (cat) {
            activateCategory(cat, 'todos', true);
          }
        });
      });
    }

    if (DOM.mobileCategoriesList) {
      let mobileCatsHtml = '';
      state.categories.forEach(cat => {
        const path = getCategoryPath(cat.nombre, 'todos');
        mobileCatsHtml += `
          <li>
            <a href="${path}" class="drawer-cat-link" data-cat="${cat.nombre}">
              <span>${cat.icono || '🏷️'} ${cat.nombre}</span>
              <span class="arrow">&rarr;</span>
            </a>
          </li>
        `;
      });
      DOM.mobileCategoriesList.innerHTML = mobileCatsHtml;

      DOM.mobileCategoriesList.querySelectorAll('.drawer-cat-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const cat = link.dataset.cat;
          DOM.mobileDrawer.classList.remove('open');
          DOM.mobileMenuToggle.classList.remove('open');
          activateCategory(cat, 'todos', true);
        });
      });
    }

    // Quick tags en Hero
    document.querySelectorAll('#heroCategoryQuickBar a, .hero-quick-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const catAttr = tag.dataset.cat || '';
        const href = tag.getAttribute('href') || '';
        const cleanPath = catAttr || href.replace(/^\//, '').replace(/\/$/, '').replace('#', '');
        handleCategoryRoute(cleanPath);
      });
    });
  }

  // ==========================================================================
  // 5. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
  // ==========================================================================
  function renderCatalog() {
    if (!DOM.catalogContainer) {
      DOM.catalogContainer = document.getElementById('catalogContainer');
      if (!DOM.catalogContainer) return;
    }

    const filteredProducts = getFilteredProducts();
    updateResultsSummary(filteredProducts.length);

    if (filteredProducts.length === 0) {
      DOM.catalogContainer.innerHTML = '';
      if (DOM.noResultsState) DOM.noResultsState.style.display = 'block';
      return;
    }

    if (DOM.noResultsState) DOM.noResultsState.style.display = 'none';

    // Agrupar productos por Categoría
    const groupedByCategory = {};
    filteredProducts.forEach(prod => {
      if (!groupedByCategory[prod.categoria]) {
        groupedByCategory[prod.categoria] = [];
      }
      groupedByCategory[prod.categoria].push(prod);
    });

    let catalogHtml = '';

    Object.keys(groupedByCategory).forEach(catName => {
      const catProducts = groupedByCategory[catName];
      const catMeta = state.categories.find(c => c.nombre.toLowerCase() === catName.toLowerCase()) || {
        icono: getCategoryEmoji(catName),
        nombre: catName,
        slug: slugify(catName)
      };
      const catSlug = catMeta.slug || slugify(catName);

      const subfilters = getCategorySubfilters(catName, catProducts);
      let subfiltersHtml = '';
      if (subfilters.length > 1) {
        subfiltersHtml = `
          <div class="category-subfilters" data-cat="${catName}">
            ${subfilters.map(sf => `
              <button class="subfilter-chip ${state.activeSubcategory.toLowerCase() === sf.id.toLowerCase() ? 'active' : ''}" 
                      data-subfilter="${sf.id}" 
                      data-cat="${catName}">
                ${sf.label}
              </button>
            `).join('')}
          </div>
        `;
      }

      catalogHtml += `
        <section class="category-section scroll-reveal revealed visible" id="cat-${catSlug}">
          <div class="category-header-wrapper">
            <div class="category-header">
              <div class="category-title-group">
                <div class="category-icon-badge">${catMeta.icono}</div>
                <h2 class="category-title">${catName}</h2>
              </div>
              <span class="category-count">${catProducts.length} ${catProducts.length === 1 ? 'producto' : 'productos'}</span>
            </div>

            ${subfiltersHtml}
          </div>

          <div class="products-grid">
            ${catProducts.map(prod => renderProductCard(prod)).join('')}
          </div>
        </section>
      `;
    });

    DOM.catalogContainer.innerHTML = catalogHtml;
    attachProductCardEvents();
    attachCategoryActionEvents();
    setupScrollAnimations();
  }

  function getCategorySubfilters(catName, products) {
    const list = [{ id: 'todos', label: '⚡ Todos los Modelos' }];
    const catLower = catName.toLowerCase();

    if (catLower.includes('iluminac')) {
      list.push({ id: 'delantera', label: '🔦 Delanteras (1000/1300 lm)' });
      list.push({ id: 'trasera', label: '🚨 Traseras con Sensor de Freno' });
      return list;
    }

    if (catLower.includes('casco')) {
      const distinctModels = [];
      products.forEach(p => {
        const baseName = getProductFamilyName(p.nombre);
        if (baseName && !distinctModels.includes(baseName)) {
          distinctModels.push(baseName);
        }
      });
      if (distinctModels.length > 1) {
        distinctModels.forEach(m => {
          list.push({ id: slugify(m), label: m });
        });
      }
      return list;
    }

    if (catLower.includes('guante')) {
      list.push({ id: 'adulto', label: '🧑 Adultos' });
      list.push({ id: 'niño', label: '🧒 Niños' });
      return list;
    }

    return list;
  }

  function renderProductCard(prod) {
    const photos = prod.fotos && prod.fotos.length > 0 ? prod.fotos : [];
    const hasMultipleMedia = photos.length > 1 || !!prod.video;
    const hasVideo = !!prod.video;
    const cardId = `card-${slugify(prod.codigo)}`;

    // Carrusel de imágenes
    let slidesHtml = '';
    photos.forEach((photo, idx) => {
      slidesHtml += `
        <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <img src="${CONFIG.imagesPath}${photo}" 
               alt="${prod.nombre} - ${prod.subcategoria || ''}" 
               loading="lazy"
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'photo-placeholder\'><span class=\'placeholder-icon\'>${getCategoryEmoji(prod.categoria)}</span></div>';">
        </div>
      `;
    });

    if (hasVideo) {
      slidesHtml += `
        <div class="carousel-slide slide-video" data-index="${photos.length}">
          <video class="card-carousel-video" muted loop playsinline preload="none">
            <source src="${CONFIG.imagesPath}${prod.video}" type="video/mp4">
          </video>
          <div class="video-play-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      `;
    }

    if (photos.length === 0 && !hasVideo) {
      slidesHtml = `
        <div class="carousel-slide active">
          <div class="photo-placeholder">
            <span class="placeholder-icon">${getCategoryEmoji(prod.categoria)}</span>
          </div>
        </div>
      `;
    }

    // Puntos indicadores
    let dotsHtml = '';
    const totalSlides = photos.length + (hasVideo ? 1 : 0);
    if (totalSlides > 1) {
      for (let i = 0; i < totalSlides; i++) {
        dotsHtml += `<span class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`;
      }
    }

    // Selector interactivo de variantes
    const siblings = getSiblingVariants(prod);
    let variantsRowHtml = '';
    if (siblings.length > 1) {
      variantsRowHtml = `
        <div class="card-variants-row" title="Seleccionar color o variante">
          <span class="variants-row-label">Color / Modelo:</span>
          <div class="variants-pills-list">
            ${siblings.map(sib => {
              const isActive = sib.codigo === prod.codigo;
              const colorDot = getVariantColorHex(sib.subcategoria || sib.nombre);
              return `
                <button class="variant-pill-btn ${isActive ? 'active' : ''}" 
                        data-code="${sib.codigo}" 
                        title="${sib.subcategoria || sib.nombre}">
                  ${colorDot ? `<span class="variant-color-dot" style="background: ${colorDot};"></span>` : ''}
                  <span class="variant-name">${sib.subcategoria || sib.nombre}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Especificaciones
    let specsHtml = '';
    if (prod.especificaciones && Object.keys(prod.especificaciones).length > 0) {
      const specKeys = Object.keys(prod.especificaciones).slice(0, 3);
      specsHtml = `
        <div class="card-specs-grid">
          ${specKeys.map(k => `
            <div class="spec-pill">
              <span class="spec-name">${k}:</span>
              <span class="spec-val">${prod.especificaciones[k]}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    const priceFormatted = formatPriceText(prod.precio);
    const priceDisplay = priceFormatted 
      ? `<span class="price-value">${priceFormatted}</span>` 
      : `<span class="price-pending">[Consultar PVP]</span>`;

    const waUrl = getProductWhatsAppUrl(prod);

    return `
      <article class="product-card" data-code="${prod.codigo}" data-category="${prod.categoria}" data-discipline="${prod.disciplina || 'todos'}">
        <div class="product-carousel" data-card-id="${cardId}">
          ${hasVideo ? `
            <div class="carousel-badges">
              <span class="badge-video">🎬 Video</span>
            </div>
          ` : ''}

          <div class="carousel-track">
            ${slidesHtml}
          </div>

          ${hasMultipleMedia ? `
            <button class="carousel-btn prev" aria-label="Foto anterior" data-action="prev">&lsaquo;</button>
            <button class="carousel-btn next" aria-label="Foto siguiente" data-action="next">&rsaquo;</button>
            <div class="carousel-dots">
              ${dotsHtml}
            </div>
          ` : ''}

          <button class="card-zoom-btn" title="Ver detalle completo y zoom" data-action="zoom" aria-label="Ampliar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title">${prod.nombre}</h3>
          </div>

          ${variantsRowHtml}

          ${hasVideo ? `
            <button class="btn-card-video" data-action="open-video">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Ver Video en Ruta</span>
            </button>
          ` : ''}

          <p class="card-description">${prod.descripcion || 'Equipamiento deportivo de alto rendimiento LEV Wild Spirit.'}</p>

          ${specsHtml}

          <div class="card-footer">
            <div class="price-row">
              <span class="price-label">PRECIO AL PÚBLICO</span>
              ${priceDisplay}
            </div>

            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.12 .94 11.503.94c-5.44 0-9.866 4.372-9.87 9.802 0 1.83.504 3.619 1.46 5.181l-.959 3.501 3.616-.948l.307.182zm11.391-7.795c-.328-.162-1.94-.949-2.24-.1.057-.301-.15-.406-.328-.488-.3-.136-.527-.243-.728-.544-.2-.301-.2-.581-.1-.861.1-.281.428-.681.628-.881.2-.201.272-.281.399-.481.129-.2.057-.381-.043-.581-.1-.2-.828-1.971-1.128-2.693-.3-.721-.586-.622-.8-.632l-.685-.01c-.243 0-.643.09-.971.451-.328.361-1.257 1.213-1.257 2.946 0 1.733 1.271 3.407 1.443 3.637.171.23 2.5 3.778 6.057 5.283.846.357 1.506.57 2.02.729.85.267 1.624.23 2.235.14.68-.101 2.086-.842 2.371-1.663.286-.822.286-1.523.2-1.663-.085-.141-.314-.221-.643-.382z"/>
              </svg>
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // ==========================================================================
  // 6. EVENTOS DE TARJETA, VARIANTES Y ACCIONES
  // ==========================================================================
  function attachCategoryActionEvents() {
    document.querySelectorAll('.subfilter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = chip.dataset.cat;
        const subfilter = chip.dataset.subfilter;
        state.activeCategory = cat;
        state.activeSubcategory = subfilter;
        renderCatalog();
      });
    });
  }

  function attachProductCardEvents() {
    document.querySelectorAll('.product-carousel').forEach(carouselEl => {
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

      if (!state.carousels[cardId]) {
        state.carousels[cardId] = {
          currentIndex: 0,
          totalSlides: slides.length
        };
      }

      const updateSlide = (newIndex) => {
        const total = slides.length;
        if (total === 0) return;
        const normalizedIndex = (newIndex + total) % total;
        state.carousels[cardId].currentIndex = normalizedIndex;
        if (track) {
          track.style.transform = `translateX(-${normalizedIndex * 100}%)`;
        }
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === normalizedIndex);
        });

        slides.forEach((s, idx) => {
          const vid = s.querySelector('video');
          if (vid && idx !== normalizedIndex) {
            vid.pause();
          }
        });
      };

      if (prevBtn) {
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          updateSlide(state.carousels[cardId].currentIndex - 1);
        };
      }

      if (nextBtn) {
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          updateSlide(state.carousels[cardId].currentIndex + 1);
        };
      }

      dots.forEach(dot => {
        dot.onclick = (e) => {
          e.stopPropagation();
          const idx = parseInt(dot.dataset.index, 10);
          updateSlide(idx);
        };
      });

      if (zoomBtn && prod) {
        zoomBtn.onclick = (e) => {
          e.stopPropagation();
          openProductModal(prod, 'image', true);
        };
      }

      carouselEl.onclick = (e) => {
        if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot') || e.target.closest('.card-zoom-btn')) return;
        if (prod) openProductModal(prod, 'image', true);
      };
    });

    // Cambiar variante en la tarjeta
    document.querySelectorAll('.variant-pill-btn').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = pill.dataset.code;
        const cardEl = pill.closest('.product-card');
        const targetProd = state.products.find(p => p.codigo === code);
        if (targetProd && cardEl) {
          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = renderProductCard(targetProd);
          const newCard = tempContainer.firstElementChild;
          cardEl.replaceWith(newCard);
          attachProductCardEvents();
        }
      });
    });

    document.querySelectorAll('.btn-card-video, .badge-video').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardEl = btn.closest('.product-card');
        const prodCode = cardEl ? cardEl.dataset.code : null;
        const prod = state.products.find(p => p.codigo === prodCode);
        if (prod) {
          openProductModal(prod, 'video', true);
        }
      });
    });
  }

  // ==========================================================================
  // 7. MODAL DE DETALLE COMPLETO Y SELECTOR DE VARIANTES
  // ==========================================================================
  function openProductModal(prod, initialMedia = 'image', pushHistory = true) {
    if (!DOM.productModal || !DOM.modalBody || !prod) {
      DOM.productModal = document.getElementById('productModal');
      DOM.modalBody = document.getElementById('modalBody');
      if (!DOM.productModal || !DOM.modalBody || !prod) return;
    }

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
    if (prod.especificaciones && Object.keys(prod.especificaciones).length > 0) {
      specsTableHtml = `
        <div class="modal-specs-title">ESPECIFICACIONES TÉCNICAS</div>
        <div class="modal-specs-table">
          ${Object.entries(prod.especificaciones).map(([k, v]) => `
            <div class="spec-row">
              <span class="spec-key">${k}</span>
              <span class="spec-val">${v}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    let modalVariantsHtml = '';
    if (hasVariants) {
      modalVariantsHtml = `
        <div class="modal-variants-box">
          <div class="modal-variants-label">
            <span>🎨 Selecciona el color / diseño:</span>
            <span style="font-size: 0.78rem; color: var(--accent-volt); font-weight: 700;">${prod.subcategoria || 'Original'}</span>
          </div>
          <div class="modal-variants-grid">
            ${siblings.map(sib => {
              const isActive = sib.codigo === prod.codigo;
              const thumb = sib.fotos && sib.fotos.length > 0 ? sib.fotos[0] : '';
              return `
                <button class="modal-variant-btn ${isActive ? 'active' : ''}" data-code="${sib.codigo}">
                  ${thumb ? `<img src="${CONFIG.imagesPath}${thumb}" class="modal-variant-thumb" alt="${sib.subcategoria || ''}">` : ''}
                  <span>${sib.subcategoria || sib.nombre}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    let mainMediaHtml = '';
    if (startWithVideo) {
      mainMediaHtml = `
        <video class="modal-main-video" controls autoplay playsinline id="modalMainVideo">
          <source src="${CONFIG.imagesPath}${prod.video}" type="video/mp4">
          Tu navegador no soporta reproducción de video.
        </video>
      `;
    } else if (photos.length > 0) {
      mainMediaHtml = `
        <img src="${CONFIG.imagesPath}${photos[0]}" 
             id="modalMainImg" 
             alt="${prod.nombre}"
             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'photo-placeholder\'><span class=\'placeholder-icon\'>${getCategoryEmoji(prod.categoria)}</span></div>';">
        <div class="modal-zoom-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <span>Pasa el cursor para zoom &bull; Clic para ver gigante</span>
        </div>
      `;
    } else {
      mainMediaHtml = `
        <div class="photo-placeholder">
          <span class="placeholder-icon">${getCategoryEmoji(prod.categoria)}</span>
        </div>
      `;
    }

    let thumbnailsHtml = '';
    if (photos.length > 1 || hasVideo) {
      thumbnailsHtml += photos.map((photo, i) => `
        <div class="modal-thumb ${!startWithVideo && i === 0 ? 'active' : ''}" data-type="image" data-src="${CONFIG.imagesPath}${photo}" data-index="${i}">
          <img src="${CONFIG.imagesPath}${photo}" alt="${prod.nombre} - miniatura ${i + 1}">
        </div>
      `).join('');

      if (hasVideo) {
        thumbnailsHtml += `
          <div class="modal-thumb modal-thumb-video ${startWithVideo ? 'active' : ''}" data-type="video" data-video-src="${CONFIG.imagesPath}${prod.video}">
            <div class="thumb-video-icon">▶</div>
            <span>VIDEO</span>
          </div>
        `;
      }
    }

    const priceFormatted = formatPriceText(prod.precio);
    const modalHtml = `
      <div class="modal-layout">
        <div class="modal-gallery">
          <div class="modal-main-img-box ${startWithVideo ? 'has-video' : ''}" id="modalMainMediaBox">
            ${mainMediaHtml}
          </div>
          ${thumbnailsHtml ? `<div class="modal-thumbnails">${thumbnailsHtml}</div>` : ''}
        </div>

        <div class="modal-details">
          <div class="modal-header-tag">${prod.categoria.toUpperCase()}</div>
          <h2 class="modal-title">${prod.nombre}</h2>
          <div style="display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;">
            <span class="badge-brand">${detectBrand(prod)}</span>
            ${hasVideo ? `<span class="badge-video">🎬 Video en Acción</span>` : ''}
          </div>

          <p class="modal-description">${prod.descripcion || 'Equipamiento deportivo de élite LEV Wild Spirit diseñado para superar los límites del rendimiento.'}</p>

          ${modalVariantsHtml}

          ${specsTableHtml}

          <div class="modal-purchase-footer">
            <div class="modal-price-box">
              <span class="price-label">PRECIO AL PÚBLICO</span>
              ${priceFormatted 
                ? `<span class="price-value">${priceFormatted}</span>` 
                : `<span class="price-pending">[Consultar PVP]</span>`
              }
            </div>

            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-full btn-lg">
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
    if (pushHistory) {
      const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
      const targetUrl = `${currentPath}?p=${productSlug}`;
      history.pushState({ productCode: prod.codigo, slug: productSlug }, '', targetUrl);
    }

    updateProductMeta(prod);

    DOM.modalBody.querySelectorAll('.modal-variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const newVariant = state.products.find(p => p.codigo === code);
        if (newVariant) {
          openProductModal(newVariant, 'image', true);
        }
      });
    });

    const mediaBox = document.getElementById('modalMainMediaBox');

    const attachHoverZoom = () => {
      const img = mediaBox.querySelector('img');
      if (!img) return;

      mediaBox.classList.remove('has-video');

      mediaBox.onmousemove = (e) => {
        const rect = mediaBox.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = 'scale(2.2)';
      };

      mediaBox.onmouseleave = () => {
        img.style.transformOrigin = 'center center';
        img.style.transform = 'scale(1)';
      };

      mediaBox.onclick = () => {
        if (photos.length > 0) {
          openFullscreenZoom(photos, currentPhotoIdx, prod.nombre);
        }
      };
    };

    if (!startWithVideo && photos.length > 0) {
      attachHoverZoom();
    }

    DOM.modalBody.querySelectorAll('.modal-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        DOM.modalBody.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        const type = thumb.dataset.type;
        if (type === 'video') {
          const videoSrc = thumb.dataset.videoSrc;
          mediaBox.className = 'modal-main-img-box has-video';
          mediaBox.onmousemove = null;
          mediaBox.onmouseleave = null;
          mediaBox.onclick = null;
          mediaBox.innerHTML = `
            <video class="modal-main-video" controls autoplay playsinline id="modalMainVideo">
              <source src="${videoSrc}" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>
          `;
        } else {
          const src = thumb.dataset.src;
          currentPhotoIdx = parseInt(thumb.dataset.index, 10) || 0;
          mediaBox.className = 'modal-main-img-box';
          mediaBox.innerHTML = `
            <img src="${src}" id="modalMainImg" alt="${prod.nombre}">
            <div class="modal-zoom-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Pasa el cursor para zoom &bull; Clic para ver gigante</span>
            </div>
          `;
          attachHoverZoom();
        }
      });
    });
  }

  function closeProductModal(updateHistory = true) {
    if (!DOM.productModal) return;
    DOM.productModal.classList.remove('open');
    DOM.productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.currentModalProduct = null;

    const modalVid = DOM.productModal.querySelector('video');
    if (modalVid) modalVid.pause();

    if (updateHistory) {
      let targetPath = '/';
      if (state.activeCategory !== 'todos') {
        targetPath = getCategoryPath(state.activeCategory, state.activeSubcategory);
      }
      history.pushState(null, '', targetPath);
      updateProductMeta(null);
    }
  }

  // ==========================================================================
  // 8. ZOOM FULLSCREEN / LIGHTBOX HD
  // ==========================================================================
  function setupZoomModalEvents() {
    if (!DOM.imageFullscreenModal) return;

    if (DOM.zoomCloseBtn) DOM.zoomCloseBtn.addEventListener('click', closeFullscreenZoom);
    if (DOM.zoomInBtn) DOM.zoomInBtn.addEventListener('click', zoomIn);
    if (DOM.zoomOutBtn) DOM.zoomOutBtn.addEventListener('click', zoomOut);
    if (DOM.zoomResetBtn) DOM.zoomResetBtn.addEventListener('click', zoomReset);

    if (DOM.zoomNavPrev) {
      DOM.zoomNavPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        setZoomPhoto(zoomState.currentIndex - 1);
      });
    }

    if (DOM.zoomNavNext) {
      DOM.zoomNavNext.addEventListener('click', (e) => {
        e.stopPropagation();
        setZoomPhoto(zoomState.currentIndex + 1);
      });
    }

    if (DOM.zoomViewport) {
      DOM.zoomViewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      }, { passive: false });

      DOM.zoomViewport.addEventListener('mousedown', (e) => {
        if (zoomState.scale <= 1.05) return;
        zoomState.isDragging = true;
        zoomState.startX = e.clientX - zoomState.panX;
        zoomState.startY = e.clientY - zoomState.panY;
        zoomState.hasMoved = false;
        DOM.zoomViewport.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!zoomState.isDragging) return;
        zoomState.panX = e.clientX - zoomState.startX;
        zoomState.panY = e.clientY - zoomState.startY;
        zoomState.hasMoved = true;
        applyZoomTransform();
      });

      window.addEventListener('mouseup', () => {
        if (zoomState.isDragging) {
          zoomState.isDragging = false;
          if (DOM.zoomViewport) DOM.zoomViewport.style.cursor = zoomState.scale > 1.05 ? 'grab' : 'default';
        }
      });
    }
  }

  function openFullscreenZoom(photos, initialIndex = 0, title = 'Detalle de Producto') {
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
  }

  function setZoomPhoto(index) {
    const total = zoomState.photos.length;
    if (total === 0) return;
    const normalized = (index + total) % total;
    zoomState.currentIndex = normalized;
    zoomState.scale = 1.0;
    zoomState.panX = 0;
    zoomState.panY = 0;

    const photo = zoomState.photos[normalized];
    if (DOM.zoomFullscreenImg) {
      DOM.zoomFullscreenImg.src = `${CONFIG.imagesPath}${photo}`;
    }

    if (DOM.zoomPhotoCounter) {
      DOM.zoomPhotoCounter.textContent = `Foto ${normalized + 1} de ${total}`;
    }

    applyZoomTransform();
    renderZoomThumbnails();
  }

  function renderZoomThumbnails() {
    if (!DOM.zoomThumbnails) return;
    if (zoomState.photos.length <= 1) {
      DOM.zoomThumbnails.innerHTML = '';
      return;
    }

    let html = '';
    zoomState.photos.forEach((p, idx) => {
      const isActive = idx === zoomState.currentIndex;
      html += `
        <div class="zoom-thumb ${isActive ? 'active' : ''}" data-index="${idx}">
          <img src="${CONFIG.imagesPath}${p}" alt="Miniatura ${idx + 1}">
        </div>
      `;
    });

    DOM.zoomThumbnails.innerHTML = html;

    DOM.zoomThumbnails.querySelectorAll('.zoom-thumb').forEach(t => {
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(t.dataset.index, 10);
        setZoomPhoto(idx);
      });
    });
  }

  function zoomIn() {
    zoomState.scale = Math.min(zoomState.maxScale, zoomState.scale + 0.4);
    applyZoomTransform();
  }

  function zoomOut() {
    zoomState.scale = Math.max(zoomState.minScale, zoomState.scale - 0.4);
    if (zoomState.scale <= 1.05) {
      zoomState.panX = 0;
      zoomState.panY = 0;
    }
    applyZoomTransform();
  }

  function zoomReset() {
    zoomState.scale = 1.0;
    zoomState.panX = 0;
    zoomState.panY = 0;
    applyZoomTransform();
  }

  function applyZoomTransform() {
    if (!DOM.zoomFullscreenImg) return;
    DOM.zoomFullscreenImg.style.transform = `translate(${zoomState.panX}px, ${zoomState.panY}px) scale(${zoomState.scale})`;
  }

  function closeFullscreenZoom() {
    if (!DOM.imageFullscreenModal) return;
    zoomState.isOpen = false;
    DOM.imageFullscreenModal.classList.remove('open');
    DOM.imageFullscreenModal.setAttribute('aria-hidden', 'true');
  }

  // ==========================================================================
  // 9. ROUTING 100% LIMPIO SIN HASHTAGS (SEO FRIENDLY)
  // ==========================================================================
  function setupHistoryRouting() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.productCode) {
        const prod = state.products.find(p => p.codigo === e.state.productCode);
        if (prod) openProductModal(prod, 'image', false);
      } else if (e.state && e.state.category) {
        activateCategory(e.state.category, e.state.subcategory || 'todos', false);
        closeProductModal(false);
      } else {
        checkDeepLink();
      }
    });
  }

  function checkDeepLink() {
    const initialCat = document.body.dataset.initialCat;
    const initialSubcat = document.body.dataset.subcat || 'todos';
    if (initialCat) {
      activateCategory(initialCat, initialSubcat, false);
      return;
    }

    const path = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const prodParam = searchParams.get('producto') || searchParams.get('p');
    const catParam = searchParams.get('categoria') || searchParams.get('cat');
    const subcatParam = searchParams.get('subcategoria') || searchParams.get('subcat');

    const hash = window.location.hash.toLowerCase();
    if (hash && hash.length > 1) {
      const cleanHash = hash.replace('#cat-', '').replace('#producto-', '').replace('#', '');
      if (hash.startsWith('#producto-')) {
        const matched = state.products.find(p => slugify(p.codigo) === cleanHash || p.codigo.toLowerCase() === cleanHash);
        if (matched) {
          history.replaceState(null, '', `?p=${slugify(matched.codigo)}`);
          openProductModal(matched, 'image', false);
          return;
        }
      } else {
        handleCategoryRoute(cleanHash, true);
        return;
      }
    }

    if (prodParam && state.products.length > 0) {
      const matchedProd = state.products.find(p => 
        slugify(p.codigo) === slugify(prodParam) ||
        p.codigo.toLowerCase() === prodParam.toLowerCase() ||
        slugify(p.nombre) === slugify(prodParam)
      );

      if (matchedProd) {
        setTimeout(() => {
          openProductModal(matchedProd, 'image', false);
        }, 150);
        return;
      }
    }

    if (path.includes('/cascos')) {
      activateCategory('Cascos', 'todos', false);
      return;
    }
    if (path.includes('/guantes')) {
      activateCategory('Guantes', 'todos', false);
      return;
    }
    if (path.includes('/luces-delanteras')) {
      activateCategory('Iluminación', 'delantera', false);
      return;
    }
    if (path.includes('/luces-traseras')) {
      activateCategory('Iluminación', 'trasera', false);
      return;
    }
    if (path.includes('/iluminacion') || path.includes('/luces')) {
      activateCategory('Iluminación', 'todos', false);
      return;
    }
    if (path.includes('/audifonos')) {
      activateCategory('Audífonos', 'todos', false);
      return;
    }
    if (path.includes('/gafas')) {
      activateCategory('Gafas', 'todos', false);
      return;
    }
    if (path.includes('/bolsas')) {
      activateCategory('Bolsas y Magnesio', 'todos', false);
      return;
    }
    if (path.includes('/gorras')) {
      activateCategory('Gorras', 'todos', false);
      return;
    }
    if (path.includes('/componentes')) {
      activateCategory('Componentes', 'todos', false);
      return;
    }

    if (catParam) {
      activateCategory(catParam, subcatParam || 'todos', false);
    }
  }

  function handleCategoryRoute(routeStr, replaceHistory = false) {
    const h = (routeStr || '').toLowerCase();

    if (h.includes('casco')) {
      activateCategory('Cascos', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('guante')) {
      activateCategory('Guantes', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('luces-delanteras') || h.includes('luz-delantera') || h.includes('delantera')) {
      activateCategory('Iluminación', 'delantera', true, replaceHistory);
      return;
    }
    if (h.includes('luces-traseras') || h.includes('luz-trasera') || h.includes('trasera')) {
      activateCategory('Iluminación', 'trasera', true, replaceHistory);
      return;
    }
    if (h.includes('iluminac') || h.includes('luz') || h.includes('luces')) {
      activateCategory('Iluminación', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('audifono')) {
      activateCategory('Audífonos', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('gafa')) {
      activateCategory('Gafas', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('bolsa') || h.includes('magnesio')) {
      activateCategory('Bolsas y Magnesio', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('gorra')) {
      activateCategory('Gorras', 'todos', true, replaceHistory);
      return;
    }
    if (h.includes('componente') || h.includes('pedal')) {
      activateCategory('Componentes', 'todos', true, replaceHistory);
      return;
    }

    const matchedCategory = state.categories.find(c => 
      slugify(c.nombre) === h || 
      (c.slug && c.slug === h) ||
      c.id.toLowerCase() === h
    );

    if (matchedCategory) {
      activateCategory(matchedCategory.nombre, 'todos', true, replaceHistory);
    }
  }

  function activateCategory(categoryName, subcategory = 'todos', pushState = true, replaceState = false) {
    state.activeCategory = categoryName;
    state.activeSubcategory = subcategory || 'todos';
    state.activeDiscipline = 'todos';
    state.searchQuery = '';

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'none';

    renderCategoryPills();
    renderCatalog();

    if (pushState || replaceState) {
      const targetPath = getCategoryPath(categoryName, subcategory);
      if (replaceState) {
        history.replaceState({ category: categoryName, subcategory: subcategory }, '', targetPath);
      } else {
        history.pushState({ category: categoryName, subcategory: subcategory }, '', targetPath);
      }
    }

    updateCategoryMeta(categoryName, subcategory);
    scrollToSection('filterBar');
  }

  // ==========================================================================
  // 10. METATAGS OPEN GRAPH & DATOS ESTRUCTURADOS (SCHEMA.ORG)
  // ==========================================================================
  function detectBrand(prod) {
    const code = (prod.codigo || '').toUpperCase();
    const name = (prod.nombre || '').toLowerCase();
    const specs = JSON.stringify(prod.especificaciones || {}).toLowerCase();
    const raw = (prod.especificaciones_raw || '').toLowerCase();

    if (code.includes('LEV-CAS-12H') || name.includes('promend') || code.includes('LEV-PED') || specs.includes('promend') || raw.includes('promend')) {
      return 'Promend';
    }
    if (code.includes('LEV-CAS-11H') || name.includes('bike boy') || name.includes('bikeboy')) {
      return 'Bike Boy';
    }
    if (code.includes('LEV-GAF') || name.includes('rockbros') || name.includes('rockbross')) {
      return 'ROCKBROS';
    }
    if (code.includes('LEV-GUA-NINO') || name.includes('knightlaood')) {
      return 'Knightlaood';
    }
    if (code.includes('TS19') || name.includes('langsdom')) {
      return 'Langsdom';
    }
    if (code.includes('LEV-BOL-ESC') || name.includes('luckstone')) {
      return 'Luckstone';
    }
    return 'LEV Wild Spirit';
  }

  function updateCategoryMeta(catName, subcatName) {
    let title = `${catName} | Catálogo Oficial LEV Wild Spirit`;
    let desc = `Descubre todos los modelos, diseños y colores de ${catName} en LEV Wild Spirit. Equipamiento deportivo de alto rendimiento.`;
    const cleanPath = getCategoryPath(catName, subcatName);
    const pageUrl = `https://levwild.com${cleanPath}`;
    
    if (catName.toLowerCase().includes('iluminac') && subcatName === 'delantera') {
      title = 'Luces Delanteras de Alta Potencia | LEV Wild Spirit';
      desc = 'Luces delanteras LED de 1000 y 1300 lúmenes con batería recargable USB para ciclismo de ruta y montaña.';
    } else if (catName.toLowerCase().includes('iluminac') && subcatName === 'trasera') {
      title = 'Luces Traseras Inteligentes con Sensor de Freno | LEV Wild Spirit';
      desc = 'Luces traseras inteligentes con sensor de freno automático y tecnología LED COB para máxima seguridad ciclista.';
    }

    document.title = title;
    setMeta('metaDescription', desc, 'name', 'description');
    setMeta('ogTitle', title, 'property', 'og:title');
    setMeta('ogDescription', desc, 'property', 'og:description');
    setMeta('ogUrl', pageUrl, 'property', 'og:url');
    setMeta('twitterTitle', title, 'name', 'twitter:title');
    setMeta('twitterDescription', desc, 'name', 'twitter:description');
  }

  function updateProductMeta(prod) {
    if (!prod) {
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

      if (DOM.structuredData) {
        DOM.structuredData.textContent = JSON.stringify(generateOrganizationSchema());
      }
      return;
    }

    const prodTitle = `${prod.nombre} | LEV Wild Spirit`;
    const prodDesc = `${prod.descripcion || 'Equipamiento de alto rendimiento LEV Wild Spirit.'} ${prod.subcategoria ? `Variante: ${prod.subcategoria}.` : ''} Precio al público: ${formatPriceText(prod.precio)}. Pedidos inmediatos por WhatsApp.`;
    const prodImg = (prod.fotos && prod.fotos.length > 0) ? `https://levwild.com/images/products/${prod.fotos[0]}` : 'https://levwild.com/images/brand/logo-lev-nav.png';
    const prodUrl = `https://levwild.com/?p=${slugify(prod.codigo)}`;

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

    if (DOM.structuredData) {
      DOM.structuredData.textContent = JSON.stringify(generateProductSchema(prod, prodUrl, prodImg));
    }
  }

  function setMeta(elementKey, value, attrType, attrName) {
    let el = DOM[elementKey] || document.querySelector(`meta[${attrType}="${attrName}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrType, attrName);
      document.head.appendChild(el);
      DOM[elementKey] = el;
    }
    el.setAttribute('content', value);
  }

  function generateOrganizationSchema() {
    return {
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
    };
  }

  function generateProductSchema(prod, url, imageUrl) {
    const brandName = detectBrand(prod);
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": prod.nombre,
      "image": [imageUrl],
      "description": prod.descripcion || `${prod.nombre} de alto rendimiento en LEV Wild Spirit.`,
      "sku": prod.codigo,
      "mpn": prod.codigo,
      "brand": {
        "@type": "Brand",
        "name": brandName
      },
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "USD",
        "price": prod.precio ? parseFloat(prod.precio).toFixed(2) : "0.00",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "LEV Wild Spirit"
        }
      }
    };
    return schema;
  }

  // ==========================================================================
  // 11. FILTRADO, BÚSQUEDA Y LÓGICA DE ESTADO
  // ==========================================================================
  function filterByDisciplineOnly(products, discipline) {
    if (!discipline || discipline === 'todos') return products;
    return products.filter(p => {
      const d = (p.disciplina || '').toLowerCase();
      if (d === 'todos' || d === '') return true;
      if (discipline === 'gym') return d.includes('gym') || d.includes('training') || d.includes('gimnasio');
      if (discipline === 'ciclismo') return d.includes('ciclismo') || d.includes('ruta') || d.includes('mtb');
      if (discipline === 'escalada') return d.includes('escalada');
      return d.includes(discipline);
    });
  }

  function getFilteredProducts() {
    return state.products.filter(prod => {
      // Filtro Disciplina
      if (state.activeDiscipline !== 'todos') {
        const d = (prod.disciplina || '').toLowerCase();
        if (d !== 'todos' && d !== '') {
          if (state.activeDiscipline === 'gym' && !(d.includes('gym') || d.includes('training') || d.includes('gimnasio'))) return false;
          if (state.activeDiscipline === 'ciclismo' && !(d.includes('ciclismo') || d.includes('ruta') || d.includes('mtb'))) return false;
          if (state.activeDiscipline === 'escalada' && !d.includes('escalada')) return false;
        }
      }

      // Filtro Categoría
      if (state.activeCategory !== 'todos') {
        if (prod.categoria.toLowerCase() !== state.activeCategory.toLowerCase()) {
          return false;
        }
      }

      // Filtro Subcategoría
      if (state.activeSubcategory !== 'todos') {
        const subfilter = state.activeSubcategory.toLowerCase();
        const pSub = (prod.subcategoria || '').toLowerCase();
        const pName = (prod.nombre || '').toLowerCase();

        if (subfilter === 'delantera' && !(pSub.includes('delantera') || pName.includes('delantera'))) return false;
        if (subfilter === 'trasera' && !(pSub.includes('trasera') || pName.includes('trasera') || pSub.includes('sensor de freno') || pSub.includes('automática'))) return false;
        if (subfilter === 'adulto' && !pSub.includes('adulto')) return false;
        if (subfilter === 'niño' && !(pSub.includes('niño') || pSub.includes('nino') || pName.includes('niño'))) return false;
        
        // Modelos de cascos
        if (state.activeCategory.toLowerCase().includes('casco')) {
          const family = slugify(getProductFamilyName(prod.nombre));
          if (family && family !== subfilter) return false;
        }
      }

      // Búsqueda por texto libre
      if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase().trim();
        const inName = (prod.nombre || '').toLowerCase().includes(q);
        const inCode = (prod.codigo || '').toLowerCase().includes(q);
        const inCat = (prod.categoria || '').toLowerCase().includes(q);
        const inSub = (prod.subcategoria || '').toLowerCase().includes(q);
        const inDesc = (prod.descripcion || '').toLowerCase().includes(q);
        const inSpecs = JSON.stringify(prod.especificaciones || {}).toLowerCase().includes(q);
        const inBrand = detectBrand(prod).toLowerCase().includes(q);

        return inName || inCode || inCat || inSub || inDesc || inSpecs || inBrand;
      }

      return true;
    });
  }

  function getSiblingVariants(prod) {
    const family = getProductFamilyKey(prod);
    return state.products.filter(p => getProductFamilyKey(p) === family);
  }

  function getProductFamilyKey(prod) {
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
  }

  function getProductFamilyName(name) {
    if (!name) return '';
    const clean = name.replace(/-\s*(Plomo|Negro|Blanco|Rojo|Verde|Azul|Amarillo|Beige).*$/i, '').trim();
    return clean;
  }

  function getVariantColorHex(variantStr) {
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
  }

  function getCategoryEmoji(catName) {
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
  }

  function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function updateResultsSummary(count) {
    if (!DOM.resultsCountText) return;
    let label = `${count} ${count === 1 ? 'producto encontrado' : 'productos encontrados'}`;
    if (state.activeCategory !== 'todos') {
      label += ` en <strong>${state.activeCategory}</strong>`;
    }
    if (state.activeDiscipline !== 'todos') {
      label += ` (${state.activeDiscipline.toUpperCase()})`;
    }
    if (state.searchQuery) {
      label += ` para "${state.searchQuery}"`;
    }
    DOM.resultsCountText.innerHTML = label;
  }

  // ==========================================================================
  // 12. EVENTOS GLOBALES Y CONTROLES UI
  // ==========================================================================
  function setupEventListeners() {
    if (DOM.navDesktop) {
      DOM.navDesktop.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeDiscipline = btn.dataset.discipline || 'todos';
          renderCategoryPills();
          renderCatalog();
        });
      });
    }

    if (DOM.mobileMenuToggle && DOM.mobileDrawer) {
      DOM.mobileMenuToggle.addEventListener('click', () => {
        const isOpen = DOM.mobileDrawer.classList.toggle('open');
        DOM.mobileMenuToggle.classList.toggle('open');
        DOM.mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    if (DOM.mobileDrawer) {
      DOM.mobileDrawer.querySelectorAll('.drawer-pill[data-discipline]').forEach(btn => {
        btn.addEventListener('click', () => {
          DOM.mobileDrawer.querySelectorAll('.drawer-pill[data-discipline]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeDiscipline = btn.dataset.discipline || 'todos';
          
          if (DOM.navDesktop) {
            DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.discipline === state.activeDiscipline);
            });
          }

          DOM.mobileDrawer.classList.remove('open');
          DOM.mobileMenuToggle.classList.remove('open');
          renderCategoryPills();
          renderCatalog();
        });
      });
    }

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (DOM.searchClearBtn) {
          DOM.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
        }
        renderCatalog();
      });
    }

    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener('click', () => {
        if (DOM.searchInput) DOM.searchInput.value = '';
        state.searchQuery = '';
        DOM.searchClearBtn.style.display = 'none';
        renderCatalog();
      });
    }

    if (DOM.searchToggleBtn) {
      DOM.searchToggleBtn.addEventListener('click', () => {
        if (DOM.searchBoxWrapper) {
          DOM.searchBoxWrapper.classList.toggle('active');
          if (DOM.searchBoxWrapper.classList.contains('active') && DOM.searchInput) {
            DOM.searchInput.focus();
          }
        }
      });
    }

    if (DOM.resetFiltersBtn) {
      DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
    }

    if (DOM.clearSearchActionBtn) {
      DOM.clearSearchActionBtn.addEventListener('click', resetAllFilters);
    }

    if (DOM.modalCloseBtn) {
      DOM.modalCloseBtn.addEventListener('click', () => closeProductModal(true));
    }

    if (DOM.productModal) {
      DOM.productModal.addEventListener('click', (e) => {
        if (e.target === DOM.productModal || e.target.classList.contains('modal-backdrop')) {
          closeProductModal(true);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (zoomState.isOpen) closeFullscreenZoom();
        else if (DOM.productModal && DOM.productModal.classList.contains('open')) closeProductModal(true);
      }
    });

    document.querySelectorAll('[data-action="scroll-catalogo"], .announcement-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection('filterBar');
      });
    });
  }

  function resetAllFilters() {
    state.activeDiscipline = 'todos';
    state.activeCategory = 'todos';
    state.activeSubcategory = 'todos';
    state.searchQuery = '';

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'none';

    if (DOM.navDesktop) {
      DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.discipline === 'todos');
      });
    }

    history.pushState(null, '', '/');
    updateProductMeta(null);

    renderCategoryPills();
    renderCatalog();
    scrollToSection('filterBar');
  }

  function scrollToSection(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      const headerOffset = 90;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  function setupScrollAnimations() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach(r => observer.observe(r));
  }

  // ==========================================================================
  // 13. TEMA CLARO / OSCURO (BLANCO LIMPIO VS DARK MODE)
  // ==========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem('lev_theme') || 'dark';
    applyTheme(savedTheme);

    const toggleTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('lev_theme', next);
    };

    if (DOM.themeToggleBtn) DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    if (DOM.mobileThemeToggleBtn) DOM.mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    const isLight = theme === 'light';
    if (isLight) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }

    if (DOM.themeToggleBtn) {
      const sun = DOM.themeToggleBtn.querySelector('.sun-icon');
      const moon = DOM.themeToggleBtn.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isLight ? 'none' : 'block';
        moon.style.display = isLight ? 'block' : 'none';
      }
    }

    if (DOM.mobileThemeToggleBtn) {
      DOM.mobileThemeToggleBtn.textContent = isLight ? '🌙 Modo Oscuro' : '☀️ Fondo Blanco';
    }
  }

  // ==========================================================================
  // 14. DATASET SINCRONIZADO DE RESPALDO (OFFLINE / FALLBACK)
  // ==========================================================================
  function loadFallbackData() {
    const fallback = {
  "marca": {
    "nombre": "LEV Wild Spirit",
    "eslogan": "Potencia tu Rendimiento",
    "descripcion": "Equipamiento de alto rendimiento para ciclismo, gimnasio y escalada.",
    "whatsapp_numero": "593985346800",
    "whatsapp_mensaje_template": "¡Hola! Estoy interesado en {nombre} (Ref: {codigo})",
    "redes": {
      "instagram": "https://www.instagram.com/lev.wildspirit/",
      "instagram_usuario": "@lev.wildspirit",
      "facebook": "https://www.facebook.com/profile.php?id=61593353747996",
      "facebook_usuario": "LEV Wild Spirit"
    }
  },
  "disciplinas": [
    {
      "id": "todos",
      "nombre": "Todo el Catálogo",
      "icono": "⚡"
    },
    {
      "id": "ciclismo",
      "nombre": "Ciclismo",
      "icono": "🚴"
    },
    {
      "id": "gym",
      "nombre": "Gym & Training",
      "icono": "💪"
    },
    {
      "id": "escalada",
      "nombre": "Escalada",
      "icono": "🧗"
    }
  ],
  "categorias": [
    {
      "id": "Cascos",
      "nombre": "Cascos",
      "icono": "🪖",
      "disciplina": "ciclismo",
      "slug": "cascos"
    },
    {
      "id": "Guantes",
      "nombre": "Guantes",
      "icono": "🧤",
      "disciplina": "ciclismo",
      "slug": "guantes"
    },
    {
      "id": "Iluminación",
      "nombre": "Iluminación",
      "icono": "💡",
      "disciplina": "ciclismo",
      "slug": "iluminacion"
    },
    {
      "id": "Audífonos",
      "nombre": "Audífonos",
      "icono": "🎧",
      "disciplina": "gym",
      "slug": "audifonos"
    },
    {
      "id": "Gafas",
      "nombre": "Gafas",
      "icono": "🕶️",
      "disciplina": "ciclismo",
      "slug": "gafas"
    },
    {
      "id": "Bolsas",
      "nombre": "Bolsas y Magnesio",
      "icono": "🎒",
      "disciplina": "todos",
      "slug": "bolsas"
    },
    {
      "id": "Gorras",
      "nombre": "Gorras",
      "icono": "🧢",
      "disciplina": "ciclismo",
      "slug": "gorras"
    },
    {
      "id": "Componentes",
      "nombre": "Componentes",
      "icono": "⚙️",
      "disciplina": "ciclismo",
      "slug": "componentes"
    }
  ],
  "productos": [
    {
      "codigo": "LEV-CAS-12H15-001",
      "categoria": "Cascos",
      "subcategoria": "Plomo Mate",
      "nombre": "Casco Promend 12H15",
      "precio": 45.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético; Luz trasera: LED integrada",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético",
        "Luz trasera": "LED integrada"
      },
      "fotos": [
        "casco-promend-12H15-plomo-01.webp",
        "casco-promend-12H15-plomo-02.webp",
        "casco-promend-12H15-plomo-03.webp",
        "casco-promend-12H15-plomo-04.webp",
        "casco-promend-12H15-plomo-05.webp",
        "casco-promend-12H15-plomo-06.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H15-002",
      "categoria": "Cascos",
      "subcategoria": "Negro con Blanco",
      "nombre": "Casco Promend 12H15",
      "precio": 45.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético; Luz trasera: LED integrada",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético",
        "Luz trasera": "LED integrada"
      },
      "fotos": [
        "casco-promend-12H15-negrob-01.webp",
        "casco-promend-12H15-negrob-02.webp",
        "casco-promend-12H15-negrob-03.webp",
        "casco-promend-12H15-negrob-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H15-003",
      "categoria": "Cascos",
      "subcategoria": "Negro con Rojo",
      "nombre": "Casco Promend 12H15",
      "precio": 45.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético; Luz trasera: LED integrada",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético",
        "Luz trasera": "LED integrada"
      },
      "fotos": [
        "casco-promend-12H15-negror-01.webp",
        "casco-promend-12H15-negror-02.webp",
        "casco-promend-12H15-negror-03.webp",
        "casco-promend-12H15-negror-04.webp",
        "casco-promend-12H15-negror-05.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H22N-001",
      "categoria": "Cascos",
      "subcategoria": "Negro",
      "nombre": "Casco Promend 12H22N",
      "precio": 37.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-promend-12H22N-negro-01.webp",
        "casco-promend-12H22N-negro-02.webp",
        "casco-promend-12H22N-negro-03.webp",
        "casco-promend-12H22N-negro-04.webp",
        "casco-promend-12H22N-negro-05.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H22N-002",
      "categoria": "Cascos",
      "subcategoria": "Blanco",
      "nombre": "Casco Promend 12H22N",
      "precio": 37.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-promend-12H22N-blanco-01.webp",
        "casco-promend-12H22N-blanco-02.webp",
        "casco-promend-12H22N-blanco-03.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H22N-003",
      "categoria": "Cascos",
      "subcategoria": "Rojo con Negro",
      "nombre": "Casco Promend 12H22N",
      "precio": 37.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-promend-12H22N-negrorojo-01.webp",
        "casco-promend-12H22N-negrorojo-02.webp",
        "casco-promend-12H22N-negrorojo-03.webp",
        "casco-promend-12H22N-negrorojo-04.webp",
        "casco-promend-12H22N-negrorojo-05.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H09-001",
      "categoria": "Cascos",
      "subcategoria": "Blanco",
      "nombre": "Casco Promend 12H09",
      "precio": 29.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-promend-12H09-blanco-01.webp",
        "casco-promend-12H09-blanco-02.webp",
        "casco-promend-12H09-blanco-03.webp",
        "casco-promend-12H09-blanco-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H09-002",
      "categoria": "Cascos",
      "subcategoria": "Negro con Plomo",
      "nombre": "Casco Promend 12H09",
      "precio": 29.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-promend-12H09-negroplomo-01.webp",
        "casco-promend-12H09-negroplomo-02.webp",
        "casco-promend-12H09-negroplomo-03.webp",
        "casco-promend-12H09-negroplomo-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-12H09-003",
      "categoria": "Cascos",
      "subcategoria": "Negro con Rojo",
      "nombre": "Casco Promend 12H09",
      "precio": 29.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-promend-12H09-negrorojo-01.webp",
        "casco-promend-12H09-negrorojo-02.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-CAS-11H01-001",
      "categoria": "Cascos",
      "subcategoria": "Negro con Blanco",
      "nombre": "Casco Bike Boy 11H01",
      "precio": 25.0,
      "precio_distribuidor": "",
      "descripcion": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético.",
      "especificaciones_raw": "Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
      "especificaciones": {
        "Estructura": "EPS alta densidad",
        "Ajuste": "Dial trasero ajustable",
        "Ventilación": "Canales integrados",
        "Peso": "Liviano",
        "Visor": "Magnético"
      },
      "fotos": [
        "casco-bikeboy-11H01-negrob-01.webp",
        "casco-bikeboy-11H01-negrob-02.webp",
        "casco-bikeboy-11H01-negrob-03.webp",
        "casco-bikeboy-11H01-negrob-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-GAF-10H1-001",
      "categoria": "Gafas",
      "subcategoria": "Negro con Azul",
      "nombre": "Gafa ROCKBROS 10H1",
      "precio": 29.0,
      "precio_distribuidor": "",
      "descripcion": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida.",
      "especificaciones_raw": "Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Incluye: Estuche, bolsa de tela y paño de limpieza",
      "especificaciones": {
        "Protección UV": "100%",
        "Lente": "Polarizado",
        "Armazón": "Ajustable a la medida",
        "Incluye": "Estuche, bolsa de tela y paño de limpieza"
      },
      "fotos": [
        "gafa-rockbros-10h1-negroazul-01.webp",
        "gafa-rockbros-10h1-negroazul-02.webp",
        "gafa-rockbros-10h1-negroazul-03.webp",
        "gafa-rockbros-10h1-negroazul-04.webp",
        "gafa-rockbros-10h1-negroazul-05.webp",
        "gafa-rockbros-10h1-negroazul-06.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-GAF-10H1-002",
      "categoria": "Gafas",
      "subcategoria": "Blanco con Azul",
      "nombre": "Gafa ROCKBROS 10H1",
      "precio": 29.0,
      "precio_distribuidor": "",
      "descripcion": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida.",
      "especificaciones_raw": "Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Incluye: Estuche, bolsa de tela y paño de limpieza",
      "especificaciones": {
        "Protección UV": "100%",
        "Lente": "Polarizado",
        "Armazón": "Ajustable a la medida",
        "Incluye": "Estuche, bolsa de tela y paño de limpieza"
      },
      "fotos": [
        "gafa-rockbros-10h1-blancoazul-01.webp",
        "gafa-rockbros-10h1-blancoazul-02.webp",
        "gafa-rockbros-10h1-blancoazul-03.webp",
        "gafa-rockbros-10h1-blancoazul-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-GAF-10H1-003",
      "categoria": "Gafas",
      "subcategoria": "Verde con Blanco",
      "nombre": "Gafa ROCKBROS 10H1",
      "precio": 29.0,
      "precio_distribuidor": "",
      "descripcion": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida.",
      "especificaciones_raw": "Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Incluye: Estuche, bolsa de tela y paño de limpieza",
      "especificaciones": {
        "Protección UV": "100%",
        "Lente": "Polarizado",
        "Armazón": "Ajustable a la medida",
        "Incluye": "Estuche, bolsa de tela y paño de limpieza"
      },
      "fotos": [
        "gafa-rockbros-10h1-verdeblanco-01.webp",
        "gafa-rockbros-10h1-verdeblanco-02.webp",
        "gafa-rockbros-10h1-verdeblanco-03.webp",
        "gafa-rockbros-10h1-verdeblanco-04.webp",
        "gafa-rockbros-10h1-verdeblanco-05.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-GAF-10H2-001",
      "categoria": "Gafas",
      "subcategoria": "Negro con Rojo",
      "nombre": "Gafa ROCKBROS 10H2",
      "precio": 35.0,
      "precio_distribuidor": "",
      "descripcion": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida, incluye 4 visores intercambiables adicionales.",
      "especificaciones_raw": "Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Visores adicionales incluidos: 4; Incluye: Estuche, bolsa de tela y paño de limpieza",
      "especificaciones": {
        "Protección UV": "100%",
        "Lente": "Polarizado",
        "Armazón": "Ajustable a la medida",
        "Visores adicionales incluidos": "4",
        "Incluye": "Estuche, bolsa de tela y paño de limpieza"
      },
      "fotos": [
        "gafa-rockbros-10h2-negrorojo-01.webp",
        "gafa-rockbros-10h2-negrorojo-02.webp",
        "gafa-rockbros-10h2-negrorojo-03.webp",
        "gafa-rockbros-10h2-negrorojo-04.webp",
        "gafa-rockbros-10h2-negrorojo-05.webp",
        "gafa-rockbros-10h2-negrorojo-06.webp",
        "gafa-rockbros-10h2-negrorojo-07.webp",
        "gafa-rockbros-10h2-negrorojo-08.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-AUD-H12-001",
      "categoria": "Audífonos",
      "subcategoria": "Negros",
      "nombre": "Audífonos deportivos H12",
      "precio": 30.0,
      "precio_distribuidor": "",
      "descripcion": "Audífonos deportivos inalámbricos, ultraligeros y resistentes al agua, ideales para entrenar.",
      "especificaciones_raw": "Conexión: Bluetooth inalámbrico; Alcance: 10 metros; Tiempo de carga: 2 horas.",
      "especificaciones": {
        "Conexión": "Bluetooth inalámbrico",
        "Alcance": "10 metros",
        "Tiempo de carga": "2 horas."
      },
      "fotos": [
        "audifono-h12-negro-01.webp",
        "audifono-h12-negro-02.webp",
        "audifono-h12-negro-03.webp"
      ],
      "disciplinas": [
        "Gym",
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-AUD-OPENAIR-001",
      "categoria": "Audífonos",
      "subcategoria": "Negros",
      "nombre": "Audífonos deportivos OpenAir Duet",
      "precio": 33.0,
      "precio_distribuidor": "",
      "descripcion": "Audífonos deportivos inalámbricos, ultraligeros y resistentes al agua, con batería de larga duración.",
      "especificaciones_raw": "Conexión: Bluetooth inalámbrico; Autonomía: 5 horas; Resistencia al agua: IPX5; Peso: Ultraligero",
      "especificaciones": {
        "Conexión": "Bluetooth inalámbrico",
        "Autonomía": "5 horas",
        "Resistencia al agua": "IPX5",
        "Peso": "Ultraligero"
      },
      "fotos": [
        "audifono-openair-duet-negro-01.webp",
        "audifono-openair-duet-negro-02.webp",
        "audifono-openair-duet-negro-03.webp",
        "audifono-openair-duet-negro-04.webp"
      ],
      "disciplinas": [
        "Gym",
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-LUZ-FRENO-001",
      "categoria": "Iluminación",
      "subcategoria": "Aluminio Pro (Automática)",
      "nombre": "Luz Trasera Aluminio con Sensor de Freno",
      "precio": 21.0,
      "precio_distribuidor": "17",
      "descripcion": "Luz trasera profesional de alta potencia con sensor de freno, que brilla más fuerte automáticamente al frenar para máxima seguridad en tus rutas.",
      "especificaciones_raw": "Material: 100% aluminio; Sensor de freno: Automático (brilla más fuerte al frenar); Modos de luz: 6; Operación: Manual o automática; Carga: USB; Resistencia: Impermeable (lluvia extrema)",
      "especificaciones": {
        "Material": "100% aluminio",
        "Sensor de freno": "Automático (brilla más fuerte al frenar)",
        "Modos de luz": "6",
        "Operación": "Manual o automática",
        "Carga": "USB",
        "Resistencia": "Impermeable (lluvia extrema)"
      },
      "fotos": [
        "luz-trasera-sensorfreno-01.webp",
        "luz-trasera-sensorfreno-02.webp",
        "luz-trasera-sensorfreno-03.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-LUZ-FRENO-002",
      "categoria": "Iluminación",
      "subcategoria": "Polímero Ligero (Automática)",
      "nombre": "Luz Trasera Ligera con Sensor de Freno",
      "precio": 15.0,
      "precio_distribuidor": "13",
      "descripcion": "Luz trasera ligera con sensor de freno automático. Aumenta su brillo al frenar, brindando máxima seguridad en tus rutas a un precio accesible.",
      "especificaciones_raw": "Material: Plástico de alta resistencia (ligero); Sensor inteligente: Detección automática de frenado (aumenta el brillo); Modos de iluminación: 6 (fijos y parpadeantes); Operación: Dual (Manual e Inteligente/Automática); Carga: Batería recargable vía USB; Resistencia: Resistente al agua y salpicaduras.",
      "especificaciones": {
        "Material": "Plástico de alta resistencia (ligero)",
        "Sensor inteligente": "Detección automática de frenado (aumenta el brillo)",
        "Modos de iluminación": "6 (fijos y parpadeantes)",
        "Operación": "Dual (Manual e Inteligente/Automática)",
        "Carga": "Batería recargable vía USB",
        "Resistencia": "Resistente al agua y salpicaduras."
      },
      "fotos": [
        "luz-trasera-sensorfreno002-01.webp",
        "luz-trasera-sensorfreno002-02.webp",
        "luz-trasera-sensorfreno002-03.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-LUZ-1300-001",
      "categoria": "Iluminación",
      "subcategoria": "Delantera",
      "nombre": "Luz Delantera 1300 Lúmenes",
      "precio": 33.0,
      "precio_distribuidor": "21",
      "descripcion": "Luz delantera de brillo extremo para visibilidad total en rutas de montaña o ciudad, incluso en la oscuridad más absoluta.",
      "especificaciones_raw": "Lúmenes: 1300; Carga: USB recargable; Soporte: Estable, no se mueve con baches; Resistencia: Al agua; Modos: Varios (intensidad ajustable)",
      "especificaciones": {
        "Lúmenes": "1300",
        "Carga": "USB recargable",
        "Soporte": "Estable, no se mueve con baches",
        "Resistencia": "Al agua",
        "Modos": "Varios (intensidad ajustable)"
      },
      "fotos": [
        "luz-delantera-1300lm-01.webp",
        "luz-delantera-1300lm-02.webp",
        "luz-delantera-1300lm-03.webp",
        "luz-delantera-1300lm-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-LUZ-1000-001",
      "categoria": "Iluminación",
      "subcategoria": "Delantera",
      "nombre": "Luz Delantera 1000 Lúmenes",
      "precio": 28.0,
      "precio_distribuidor": "16",
      "descripcion": "Luz delantera de brillo extremo para visibilidad total en rutas de montaña o ciudad, incluso en la oscuridad más absoluta.",
      "especificaciones_raw": "Lúmenes: 1000; Carga: USB recargable; Soporte: Estable, no se mueve con baches; Resistencia: Al agua; Modos: Varios (intensidad ajustable)",
      "especificaciones": {
        "Lúmenes": "1000",
        "Carga": "USB recargable",
        "Soporte": "Estable, no se mueve con baches",
        "Resistencia": "Al agua",
        "Modos": "Varios (intensidad ajustable)"
      },
      "fotos": [
        "luz-delantera-1000lm-01.webp",
        "luz-delantera-1000lm-02.webp",
        "luz-delantera-1000lm-03.webp",
        "luz-delantera-1000lm-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ],
      "video": "Luz delantera 1000L.mp4"
    },
    {
      "codigo": "LEV-LUZ-COB-001",
      "categoria": "Iluminación",
      "subcategoria": "Trasera",
      "nombre": "Luz Trasera LED COB Recargable",
      "precio": 11.0,
      "precio_distribuidor": "9",
      "descripcion": "Luz trasera tipo COB de alto brillo, súper ligera y resistente, que se carga como un celular sin necesidad de pilas.",
      "especificaciones_raw": "Tecnología: LED COB; Batería: Litio 500 mAh; Carga: USB (cable incluido); Soporte: Liga ajustable 12-32 mm; Instalación: Sin herramientas; Modos: Varios; Incluye: Luz LED RPL-2266, cable de carga USB, soporte de fijación",
      "especificaciones": {
        "Tecnología": "LED COB",
        "Batería": "Litio 500 mAh",
        "Carga": "USB (cable incluido)",
        "Soporte": "Liga ajustable 12-32 mm",
        "Instalación": "Sin herramientas",
        "Modos": "Varios",
        "Incluye": "Luz LED RPL-2266, cable de carga USB, soporte de fijación"
      },
      "fotos": [
        "luz-trasera-cob-01.webp",
        "luz-trasera-cob-02.webp",
        "luz-trasera-cob-03.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-LUZ-DUAL-001",
      "categoria": "Iluminación",
      "subcategoria": "Dual (Delantera/Trasera)",
      "nombre": "Luz Dual Blanca/Roja",
      "precio": 16.0,
      "precio_distribuidor": "13",
      "descripcion": "Luz dual de alta potencia para bicicleta o casco, con luz blanca al frente y roja atrás para ser visto desde cualquier ángulo.",
      "especificaciones_raw": "Colores: Blanca (frontal) y roja (trasera); Uso: Manubrio o casco; Modos: 4 (fija fuerte/suave, intermitente rápido/lento); Batería: Litio recargable vía USB; Resistencia: IPX8 (lluvia); Instalación: Sin herramientas; Incluye: Luz dual, cable USB y soporte ajustable",
      "especificaciones": {
        "Colores": "Blanca (frontal) y roja (trasera)",
        "Uso": "Manubrio o casco",
        "Modos": "4 (fija fuerte/suave, intermitente rápido/lento)",
        "Batería": "Litio recargable vía USB",
        "Resistencia": "IPX8 (lluvia)",
        "Instalación": "Sin herramientas",
        "Incluye": "Luz dual, cable USB y soporte ajustable"
      },
      "fotos": [
        "luz-dual-blancoroja-01.webp",
        "luz-dual-blancoroja-02.webp",
        "luz-dual-blancoroja-03.webp",
        "luz-dual-blancoroja-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-GUA-001",
      "categoria": "Guantes",
      "subcategoria": "Adulto",
      "nombre": "Guantes de Ciclismo",
      "precio": 14.0,
      "precio_distribuidor": "12",
      "descripcion": "Guantes de ciclismo half-finger que equilibran protección, estilo y ventilación, ideales para MTB, ruta o uso urbano.",
      "especificaciones_raw": "Diseño: Half-finger (medio dedo); Palma: Antideslizante con acolchado geométrico; Material: Tejido elástico transpirable; Cierre: Velcro reforzado en la muñeca; Retiro: Pestañas para quitarlos fácilmente; Tallas disponibles: S / M / L / XL",
      "especificaciones": {
        "Diseño": "Half-finger (medio dedo)",
        "Palma": "Antideslizante con acolchado geométrico",
        "Material": "Tejido elástico transpirable",
        "Cierre": "Velcro reforzado en la muñeca",
        "Retiro": "Pestañas para quitarlos fácilmente",
        "Tallas disponibles": "S / M / L / XL"
      },
      "fotos": [
        "guante-ciclismo-adulto-01.webp",
        "guante-ciclismo-adulto-02.webp",
        "guante-ciclismo-adulto-03.webp",
        "guante-ciclismo-adulto-04.webp",
        "guante-ciclismo-adulto-05.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-GUA-NINO-001",
      "categoria": "Guantes",
      "subcategoria": "Niños",
      "nombre": "Guantes de Ciclismo para Niños Knightlaood",
      "precio": 12.0,
      "precio_distribuidor": "",
      "descripcion": "Guantes de ciclismo infantiles que brindan seguridad y confort para que los niños exploren al aire libre con confianza.",
      "especificaciones_raw": "Marca: Knightlaood; Palma: Antideslizante; Seguridad: Elementos reflectores; Material: Malla transpirable (Mesh); Diseño: Medio dedo; Tallas: S / M / L",
      "especificaciones": {
        "Marca": "Knightlaood",
        "Palma": "Antideslizante",
        "Seguridad": "Elementos reflectores",
        "Material": "Malla transpirable (Mesh)",
        "Diseño": "Medio dedo",
        "Tallas": "S / M / L"
      },
      "fotos": [
        "guante-nino-knightlaood-01.webp",
        "guante-nino-knightlaood-02.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-PED-MTB-001",
      "categoria": "Componentes",
      "subcategoria": "Ciclismo",
      "nombre": "Pedal Mixto MTB",
      "precio": 37.0,
      "precio_distribuidor": "30",
      "descripcion": "Pedal mixto muy versátil, utilizable con zapatos de ciclismo o zapatos deportivos comunes; ideal para quienes inician con clips, ciclistas urbanos y rutas de montaña técnicas.",
      "especificaciones_raw": "Tipo: Doble cara (bloqueo automático SPD de un lado, plataforma plana del otro); Peso: 298 g el par; Eje: Acero molibdeno; Cuerpo: Aleación de aluminio; Incluye: Calas (clips) y pernos",
      "especificaciones": {
        "Tipo": "Doble cara (bloqueo automático SPD de un lado, plataforma plana del otro)",
        "Peso": "298 g el par",
        "Eje": "Acero molibdeno",
        "Cuerpo": "Aleación de aluminio",
        "Incluye": "Calas (clips) y pernos"
      },
      "fotos": [
        "pedal-mixto-mtb-01.webp",
        "pedal-mixto-mtb-02.webp",
        "pedal-mixto-mtb-03.webp",
        "pedal-mixto-mtb-04.webp",
        "pedal-mixto-mtb-05.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-BOL-MOCHDEL-001",
      "categoria": "Bolsas",
      "subcategoria": "Ciclismo",
      "nombre": "Mochila Delantera para Bicicleta",
      "precio": 25.0,
      "precio_distribuidor": "20",
      "descripcion": "Mochila que se instala en el cuadro delantero de la bicicleta para llevar tus cosas al alcance de la mano durante la ruta.",
      "especificaciones_raw": "Sujeción: 3 puntos de anclaje (estabilidad total); Capacidad: Herramientas, celular, snacks y repuestos; Material: Alta resistencia con correas reforzadas; Acceso: Rápido, sin bajarte de la bici; Diseño: Aerodinámico",
      "especificaciones": {
        "Sujeción": "3 puntos de anclaje (estabilidad total)",
        "Capacidad": "Herramientas, celular, snacks y repuestos",
        "Material": "Alta resistencia con correas reforzadas",
        "Acceso": "Rápido, sin bajarte de la bici",
        "Diseño": "Aerodinámico"
      },
      "fotos": [
        "mochila-delantera-bici-01.webp",
        "mochila-delantera-bici-02.webp",
        "mochila-delantera-bici-03.webp",
        "mochila-delantera-bici-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-BOL-RINESC-001",
      "categoria": "Bolsas",
      "subcategoria": "Escalada",
      "nombre": "Bolso/Riñonera para Escalada",
      "precio": 25.0,
      "precio_distribuidor": "21",
      "descripcion": "Riñonera técnica de alta capacidad para optimizar tu equipo de escalada.",
      "especificaciones_raw": "Capacidad: Zapatos de escalada, arnés compacto, magnesio y snacks; Ventilación: Orificios laterales; Acceso: Bolsillo frontal con malla técnica y cierres reforzados; Material: Alta durabilidad, resistente al roce con la roca; Uso: En la cintura o cruzada",
      "especificaciones": {
        "Capacidad": "Zapatos de escalada, arnés compacto, magnesio y snacks",
        "Ventilación": "Orificios laterales",
        "Acceso": "Bolsillo frontal con malla técnica y cierres reforzados",
        "Material": "Alta durabilidad, resistente al roce con la roca",
        "Uso": "En la cintura o cruzada"
      },
      "fotos": [
        "rinonera-escalada-01.webp",
        "rinonera-escalada-02.webp",
        "rinonera-escalada-03.webp",
        "rinonera-escalada-04.webp"
      ],
      "disciplinas": [
        "Escalada",
        "Gym"
      ]
    },
    {
      "codigo": "LEV-BOL-GYM-001",
      "categoria": "Bolsas",
      "subcategoria": "Gimnasio",
      "nombre": "Bolsa Gym Magnética",
      "precio": 20.0,
      "precio_distribuidor": "18",
      "descripcion": "Bolsa magnética que se adhiere a cualquier máquina o rack del gimnasio, para mantener tus pertenencias limpias y a la mano durante el entrenamiento.",
      "especificaciones_raw": "Sujeción: Imán potente para superficies metálicas; Capacidad: Celular, llaves, audífonos y más; Bolsillo: Malla para ver notificaciones rápidamente",
      "especificaciones": {
        "Sujeción": "Imán potente para superficies metálicas",
        "Capacidad": "Celular, llaves, audífonos y más",
        "Bolsillo": "Malla para ver notificaciones rápidamente"
      },
      "fotos": [
        "bolsa-gym-magnetica-01.webp",
        "bolsa-gym-magnetica-02.webp"
      ],
      "disciplinas": [
        "Gym"
      ]
    },
    {
      "codigo": "LEV-GOR-001",
      "categoria": "Gorras",
      "subcategoria": "Ciclismo",
      "nombre": "Gorra de Ciclismo RockBross",
      "precio": 18.0,
      "precio_distribuidor": "",
      "descripcion": "Gorra deportiva ligera y transpirable, diseñada para un ajuste perfecto bajo el casco o para uso durante las cicleadas, con protección solar y estilo.",
      "especificaciones_raw": "Material: Transpirable; Ajuste: Bajo el casco o uso diario; Diseños: Varios modelos disponibles",
      "especificaciones": {
        "Material": "Transpirable",
        "Ajuste": "Bajo el casco o uso diario",
        "Diseños": "Varios modelos disponibles"
      },
      "fotos": [
        "gorra-ciclismo-01.webp",
        "gorra-ciclismo-02.webp",
        "gorra-ciclismo-03.webp",
        "gorra-ciclismo-04.webp"
      ],
      "disciplinas": [
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-AUD-LANG-TS19-001",
      "categoria": "Audífonos",
      "subcategoria": "Beige",
      "nombre": "Audífonos Open-Ear Langsdom TS19",
      "precio": 36.0,
      "precio_distribuidor": "",
      "descripcion": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche.",
      "especificaciones_raw": "Tipo: Abierto ergonómico (no entra al oído); Micrófono: Integrado y nítido para llamadas; Conexión: Bluetooth (hasta 10 metros); Batería total: Hasta 40 horas con estuche; Tiempo de carga: 1.5 a 2 horas aprox.; Puerto de carga: USB-C; Resistencia: Sudor y lluvia ligera",
      "especificaciones": {
        "Tipo": "Abierto ergonómico (no entra al oído)",
        "Micrófono": "Integrado y nítido para llamadas",
        "Conexión": "Bluetooth (hasta 10 metros)",
        "Batería total": "Hasta 40 horas con estuche",
        "Tiempo de carga": "1.5 a 2 horas aprox.",
        "Puerto de carga": "USB-C",
        "Resistencia": "Sudor y lluvia ligera"
      },
      "fotos": [
        "audifono-ts19-beige-001.webp",
        "audifono-ts19-beige-002.webp"
      ],
      "disciplinas": [
        "Gym",
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-AUD-LANG-TS19-003",
      "categoria": "Audífonos",
      "subcategoria": "Negros",
      "nombre": "Audífonos Open-Ear Langsdom TS19",
      "precio": 36.0,
      "precio_distribuidor": "",
      "descripcion": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche.",
      "especificaciones_raw": "Tipo: Abierto ergonómico (no entra al oído); Micrófono: Integrado y nítido para llamadas; Conexión: Bluetooth (hasta 10 metros); Batería total: Hasta 40 horas con estuche; Tiempo de carga: 1.5 a 2 horas aprox.; Puerto de carga: USB-C; Resistencia: Sudor y lluvia ligera",
      "especificaciones": {
        "Tipo": "Abierto ergonómico (no entra al oído)",
        "Micrófono": "Integrado y nítido para llamadas",
        "Conexión": "Bluetooth (hasta 10 metros)",
        "Batería total": "Hasta 40 horas con estuche",
        "Tiempo de carga": "1.5 a 2 horas aprox.",
        "Puerto de carga": "USB-C",
        "Resistencia": "Sudor y lluvia ligera"
      },
      "fotos": [
        "audifono-ts19-negro-001.webp",
        "audifono-ts19-negro-002.webp",
        "audifono-ts19-negro-003.webp",
        "audifono-ts19-negro-004.webp"
      ],
      "disciplinas": [
        "Gym",
        "Ciclismo"
      ]
    },
    {
      "codigo": "LEV-BOL-ESC-001",
      "categoria": "Bolsas",
      "subcategoria": "Azul",
      "nombre": "Bolso de Magnesio Luckstone",
      "precio": 20.0,
      "precio_distribuidor": "",
      "descripcion": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
      "especificaciones_raw": "Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
      "especificaciones": {
        "Sistema de cierre": "Cordón ajustable con seguro antiderrame",
        "Bolsillos": "1 frontal y 1 lateral con cierre (entra el celular)",
        "Ajuste": "Correa a la cintura con broche regulable",
        "Agarraderas extras": "Elásticos laterales para cepillo de escalada o mosquetón",
        "Material": "Tela impermeable y resistente al raspón"
      },
      "fotos": [
        "bolsa-magnesio-azul-001.webp",
        "bolsa-magnesio-azul-002.webp"
      ],
      "disciplinas": [
        "Escalada",
        "Gym"
      ]
    },
    {
      "codigo": "LEV-BOL-ESC-002",
      "categoria": "Bolsas",
      "subcategoria": "Amarillo",
      "nombre": "Bolso de Magnesio Luckstone",
      "precio": 20.0,
      "precio_distribuidor": "",
      "descripcion": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
      "especificaciones_raw": "Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
      "especificaciones": {
        "Sistema de cierre": "Cordón ajustable con seguro antiderrame",
        "Bolsillos": "1 frontal y 1 lateral con cierre (entra el celular)",
        "Ajuste": "Correa a la cintura con broche regulable",
        "Agarraderas extras": "Elásticos laterales para cepillo de escalada o mosquetón",
        "Material": "Tela impermeable y resistente al raspón"
      },
      "fotos": [
        "bolsa-magnesio-amarillo-001.webp",
        "bolsa-magnesio-amarillo-002.webp"
      ],
      "disciplinas": [
        "Escalada",
        "Gym"
      ]
    },
    {
      "codigo": "LEV-BOL-ESC-003",
      "categoria": "Bolsas",
      "subcategoria": "Verde",
      "nombre": "Bolso de Magnesio Luckstone",
      "precio": 20.0,
      "precio_distribuidor": "",
      "descripcion": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
      "especificaciones_raw": "Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
      "especificaciones": {
        "Sistema de cierre": "Cordón ajustable con seguro antiderrame",
        "Bolsillos": "1 frontal y 1 lateral con cierre (entra el celular)",
        "Ajuste": "Correa a la cintura con broche regulable",
        "Agarraderas extras": "Elásticos laterales para cepillo de escalada o mosquetón",
        "Material": "Tela impermeable y resistente al raspón"
      },
      "fotos": [
        "bolsa-magnesio-verde-001.webp",
        "bolsa-magnesio-verde-002.webp"
      ],
      "disciplinas": [
        "Escalada",
        "Gym"
      ]
    },
    {
      "codigo": "LEV-BOL-ESC-004",
      "categoria": "Bolsas",
      "subcategoria": "Negro",
      "nombre": "Bolso de Magnesio Luckstone",
      "precio": 20.0,
      "precio_distribuidor": "",
      "descripcion": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
      "especificaciones_raw": "Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
      "especificaciones": {
        "Sistema de cierre": "Cordón ajustable con seguro antiderrame",
        "Bolsillos": "1 frontal y 1 lateral con cierre (entra el celular)",
        "Ajuste": "Correa a la cintura con broche regulable",
        "Agarraderas extras": "Elásticos laterales para cepillo de escalada o mosquetón",
        "Material": "Tela impermeable y resistente al raspón"
      },
      "fotos": [
        "bolsa-magnesio-negro-001.webp",
        "bolsa-magnesio-negro-002.webp"
      ],
      "disciplinas": [
        "Escalada",
        "Gym"
      ]
    }
  ],
  "videos": [
    {
      "id": "vid-luz-1000",
      "titulo": "Luz Delantera 1000 Lúmenes en Acción",
      "subtitulo": "Demostración de potencia y visibilidad en ruta nocturna",
      "archivo": "Luz delantera 1000L.mp4",
      "producto_ref": "LEV-LUZ-1000-001",
      "producto_nombre": "Luz Delantera 1000 Lúmenes",
      "categoria": "Iluminación",
      "disciplina": "Ciclismo",
      "badge": "⚡ DEMOSTRACIÓN EN RUTA"
    }
  ]
};
    state.data = fallback;
    state.products = fallback.productos || [];
    state.categories = fallback.categorias || [];
    state.disciplines = fallback.disciplinas || [];
    state.videos = fallback.videos || [];
    if (fallback.marca && fallback.marca.whatsapp_numero) {
      CONFIG.defaultWhatsapp = fallback.marca.whatsapp_numero;
    }
    renderVideoShowcase();
    renderCategoryPills();
    renderNavigationLinks();
    renderCatalog();
  }

  // Iniciar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
