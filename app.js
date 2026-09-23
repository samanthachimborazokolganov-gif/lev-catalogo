/**
 * LEV WILD SPIRIT - MOTOR DE CATÁLOGO DINÁMICO v2.1
 * - Deep Linking independiente por categoría (#cascos, #guantes, #luces-delanteras, #luces-traseras, #audifonos, #gafas, #bolsas, #gorras, #componentes)
 * - Selector interactivo de variantes de diseño y color en tarjeta y modal con sincronización en tiempo real
 * - Mensajes de WhatsApp predeterminados exactos con Nombre, Referencia, Color/Variante y Precio
 * - Botón de copiar enlace directo y compartir por WhatsApp con notificación Toast
 * - Showcase cinemático de videos demostrativos en ruta
 * - Zoom interactivo estilo Amazon con lupa de hover y Lightbox HD fullscreen
 */

(function () {
  'use strict';

  // Configuración global
  const CONFIG = {
    dataPath: 'data/productos.json',
    imagesPath: 'images/products/',
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
    
    // Verificar si hay deep link en la URL (categoría o producto)
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
    const codigo = (prod.codigo || '').trim();
    const variante = prod.subcategoria ? ` en color/modelo *${prod.subcategoria}*` : '';
    const priceStr = formatPriceText(prod.precio);
    const precio = priceStr ? ` por el valor de *${priceStr}*` : '';
    
    const msg = `¡Hola LEV Wild Spirit! 👋 ${customGreeting}: *${nombre}* (Ref: *${codigo}*)${variante}${precio}. ¿Tienen stock disponible y cuál es el procedimiento de entrega?`;
    return `https://wa.me/${CONFIG.defaultWhatsapp}?text=${encodeURIComponent(msg)}`;
  }

  function getModalWhatsAppUrl(prod) {
    return getProductWhatsAppUrl(prod, 'Deseo realizar el pedido de');
  }

  function getCategoryWhatsAppShareUrl(catSlug, catName) {
    const directUrl = `${CONFIG.siteUrl}/#${catSlug}`;
    const text = `¡Hola! 👋 Te comparto nuestro catálogo oficial de *${catName}* en *LEV Wild Spirit* para que veas todos los modelos, diseños y colores disponibles:\n\n👉 ${directUrl}`;
    return `https://wa.me/${CONFIG.defaultWhatsapp}?text=${encodeURIComponent(text)}`;
  }

  // ==========================================================================
  // 3. SHOWCASE DE VIDEOS HORIZONTALES CINEMÁTICO
  // ==========================================================================
  function renderVideoShowcase() {
    if (!DOM.videoShowcaseContainer || !state.videos || state.videos.length === 0) return;

    let html = '';
    state.videos.forEach(vid => {
      const vidWaMsg = `¡Hola LEV Wild Spirit! 👋 Vi el video de *${vid.producto_nombre || vid.titulo}* (Ref: *${vid.producto_ref}*) en su catálogo web y quiero consultar disponibilidad y precio.`;
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
              <a href="#producto-${slugify(vid.producto_ref)}" class="btn-video-product" data-ref="${vid.producto_ref}">
                <span>Ver Ficha del Producto</span> &rarr;
              </a>
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
  // 4. RENDERIZADO DE PASTILLAS Y NAVEGACIÓN
  // ==========================================================================
  function renderCategoryPills() {
    if (!DOM.categoryPillsContainer) return;

    const filteredByDiscipline = filterByDisciplineOnly(state.products, state.activeDiscipline);
    const totalCount = filteredByDiscipline.length;

    let html = `
      <button class="cat-pill ${state.activeCategory === 'todos' ? 'active' : ''}" data-cat="todos">
        <span>⚡ Todos</span>
        <span class="count">${totalCount}</span>
      </button>
    `;

    state.categories.forEach(cat => {
      const catCount = filteredByDiscipline.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
      if (catCount > 0 || state.activeDiscipline === 'todos') {
        const isCatActive = state.activeCategory.toLowerCase() === cat.nombre.toLowerCase();
        html += `
          <button class="cat-pill ${isCatActive ? 'active' : ''}" data-cat="${cat.nombre}" data-slug="${cat.slug || slugify(cat.nombre)}">
            <span>${cat.icono || '🏷️'} ${cat.nombre}</span>
            <span class="count">${catCount}</span>
          </button>
        `;
      }
    });

    DOM.categoryPillsContainer.innerHTML = html;

    DOM.categoryPillsContainer.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.dataset.cat;
        state.activeCategory = cat;
        state.activeSubcategory = 'todos';
        
        if (cat === 'todos') {
          history.pushState(null, '', window.location.pathname);
          updateProductMeta(null);
        } else {
          const catObj = state.categories.find(c => c.nombre.toLowerCase() === cat.toLowerCase());
          const slug = catObj ? (catObj.slug || slugify(catObj.nombre)) : slugify(cat);
          history.pushState({ category: cat }, '', `#${slug}`);
          updateCategoryMeta(cat, 'todos');
        }

        renderCategoryPills();
        renderCatalog();
        scrollToSection('filterBar');
      });
    });
  }

  function renderNavigationLinks() {
    if (DOM.footerCategoriesList) {
      let footerCatsHtml = '';
      state.categories.forEach(cat => {
        const slug = cat.slug || slugify(cat.nombre);
        footerCatsHtml += `
          <li>
            <a href="#${slug}" data-cat-link="${cat.nombre}">
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
            activateCategory(cat, 'todos');
          }
        });
      });
    }

    if (DOM.mobileCategoriesList) {
      let mobileCatsHtml = '';
      state.categories.forEach(cat => {
        const slug = cat.slug || slugify(cat.nombre);
        mobileCatsHtml += `
          <li>
            <a href="#${slug}" class="drawer-cat-link" data-cat="${cat.nombre}">
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
          activateCategory(cat, 'todos');
        });
      });
    }

    // Quick tags en Hero
    document.querySelectorAll('#heroCategoryQuickBar a, .hero-quick-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const href = tag.getAttribute('href') || '';
        const target = href.replace('#', '');
        handleCategoryHash(target);
      });
    });
  }

  // ==========================================================================
  // 5. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS Y ACCIONES DE CATEGORÍA
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
    const cLower = catName.toLowerCase();

    if (cLower.includes('iluminac')) {
      return [
        { id: 'todos', label: '⚡ Toda la Iluminación' },
        { id: 'delantera', label: '🔦 Luces Delanteras' },
        { id: 'trasera', label: '🚨 Luces Traseras' },
        { id: 'dual', label: '🔄 Luz Dual (Blanca/Roja)' }
      ];
    }

    if (cLower.includes('casco')) {
      return [
        { id: 'todos', label: '⚡ Todos los Cascos' },
        { id: '12h15', label: 'Promend 12H15 (con luz LED)' },
        { id: '12h22n', label: 'Promend 12H22N' },
        { id: '12h09', label: 'Promend 12H09' },
        { id: '11h01', label: 'Bike Boy 11H01' }
      ];
    }

    if (cLower.includes('bolsa')) {
      return [
        { id: 'todos', label: '⚡ Todas las Bolsas' },
        { id: 'magnesio', label: '🧗 Magnesio (Escalada)' },
        { id: 'gym', label: '💪 Gym Magnética' },
        { id: 'ciclismo', label: '🚴 Mochila Bici' }
      ];
    }

    if (cLower.includes('audífon') || cLower.includes('audifon')) {
      return [
        { id: 'todos', label: '⚡ Todos los Audífonos' },
        { id: 'ts19', label: 'Langsdom TS19 (Open-Ear)' },
        { id: 'openair', label: 'OpenAir Duet' },
        { id: 'h12', label: 'Deportivos H12' }
      ];
    }

    if (cLower.includes('guante')) {
      return [
        { id: 'todos', label: '⚡ Todos los Guantes' },
        { id: 'adulto', label: 'Adultos' },
        { id: 'nino', label: 'Niños (Knightlaood)' }
      ];
    }

    if (cLower.includes('gafa')) {
      return [
        { id: 'todos', label: '⚡ Todas las Gafas' },
        { id: '10h1', label: 'ROCKBROS 10H1' },
        { id: '10h2', label: 'ROCKBROS 10H2 (4 visores)' }
      ];
    }

    return list;
  }

  function getSiblingVariants(prod) {
    const baseName = prod.nombre.trim().toLowerCase();
    return state.products.filter(p => p.nombre.trim().toLowerCase() === baseName && p.categoria === prod.categoria);
  }

  function renderProductCard(prod) {
    const cardId = `prod-${slugify(prod.codigo)}`;
    const photos = prod.fotos && prod.fotos.length > 0 ? prod.fotos : [];
    const hasVideo = !!prod.video;
    const totalMediaCount = photos.length + (hasVideo ? 1 : 0);
    const hasMultipleMedia = totalMediaCount > 1;
    
    // Variantes de color del mismo modelo
    const siblings = getSiblingVariants(prod);
    const hasVariants = siblings.length > 1;

    // Enlace de WhatsApp exacto
    const waUrl = getProductWhatsAppUrl(prod);

    const priceFormatted = formatPriceText(prod.precio);
    const priceDisplay = priceFormatted 
      ? `<span class="price-value">${priceFormatted}</span>`
      : `<span class="price-pending">[Consultar PVP]</span>`;

    let specsHtml = '';
    if (prod.especificaciones && Object.keys(prod.especificaciones).length > 0) {{
      const specEntries = Object.entries(prod.especificaciones).slice(0, 3);
      specsHtml = `
        <div class="card-specs">
          ${specEntries.map(([k, v]) => `
            <div class="spec-row">
              <span class="spec-key">${k}:</span>
              <span class="spec-val">${v}</span>
            </div>
          `).join('')}
        </div>
      `;
    }}

    let variantsRowHtml = '';
    if (hasVariants) {
      variantsRowHtml = `
        <div class="card-variants-row">
          <span class="card-variants-title">🎨 Colores:</span>
          ${siblings.map(sib => `
            <button class="card-variant-pill ${sib.codigo === prod.codigo ? 'active' : ''}" 
                    data-code="${sib.codigo}" 
                    title="Ver variante en ${sib.subcategoria || sib.nombre}">
              <span>${sib.subcategoria || 'Color'}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    let slidesHtml = '';
    if (photos.length > 0) {
      slidesHtml += photos.map((photo, idx) => `
        <div class="carousel-slide" data-index="${idx}">
          <img src="${CONFIG.imagesPath}${photo}" 
               alt="${prod.nombre} - ${prod.subcategoria || ''}" 
               class="carousel-img"
               loading="lazy"
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'photo-placeholder\'><span class=\'placeholder-icon\'>${getCategoryEmoji(prod.categoria)}</span><span class=\'placeholder-code\'>${prod.codigo}</span><span class=\'placeholder-label\'>${prod.nombre}</span></div>';">
        </div>
      `).join('');
    } else {
      slidesHtml += `
        <div class="carousel-slide" data-index="0">
          <div class="photo-placeholder">
            <span class="placeholder-icon">${getCategoryEmoji(prod.categoria)}</span>
            <span class="placeholder-code">${prod.codigo}</span>
            <span class="placeholder-label">${prod.nombre}</span>
          </div>
        </div>
      `;
    }

    if (hasVideo) {
      slidesHtml += `
        <div class="carousel-slide video-slide" data-index="${photos.length}">
          <video class="carousel-video-player" playsinline preload="metadata" controls poster="${photos.length > 0 ? CONFIG.imagesPath + photos[0] : ''}">
            <source src="${CONFIG.imagesPath}${prod.video}" type="video/mp4">
          </video>
          <div class="video-slide-badge">▶ Video Demostración</div>
        </div>
      `;
    }

    let dotsHtml = '';
    if (hasMultipleMedia) {
      for (let i = 0; i < totalMediaCount; i++) {
        const isVideoDot = hasVideo && i === totalMediaCount - 1;
        dotsHtml += `<span class="carousel-dot ${i === 0 ? 'active' : ''} ${isVideoDot ? 'video-dot' : ''}" data-index="${i}" title="${isVideoDot ? 'Video' : `Foto ${i+1}`}"></span>`;
      }
    }

    return `
      <article class="product-card" id="${cardId}" data-code="${prod.codigo}">
        <div class="card-badges">
          <span class="badge-code">${prod.codigo}</span>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${hasVideo ? `<button class="badge-video" data-action="open-video" title="Ver video de demostración">▶ VIDEO</button>` : ''}
            ${prod.subcategoria ? `<span class="badge-variant">${prod.subcategoria}</span>` : ''}
          </div>
        </div>

        <div class="product-carousel" data-card-id="${cardId}">
          <div class="carousel-track" style="transform: translateX(0%);">
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
  // 6. EVENTOS DE TARJETA, VARIANTES Y ACCIONES DE CATEGORÍA
  // ==========================================================================
  function attachCategoryActionEvents() {
    document.querySelectorAll('.btn-copy-cat-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.dataset.slug;
        const name = btn.dataset.name;
        copyCategoryLink(slug, name);
      });
    });

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

  function copyCategoryLink(slug, name) {
    const fullUrl = `${CONFIG.siteUrl}/#${slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast(`✅ ¡Enlace de ${name} copiado! Listo para pegar en WhatsApp.`);
      }).catch(() => {
        fallbackCopyText(fullUrl, name);
      });
    } else {
      fallbackCopyText(fullUrl, name);
    }
  }

  function fallbackCopyText(text, name) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`✅ ¡Enlace de ${name} copiado! Listo para pegar en WhatsApp.`);
    } catch (err) {
      showToast(`Enlace: ${text}`);
    }
    document.body.removeChild(ta);
  }

  function showToast(message) {
    let toast = DOM.toastNotification || document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
      DOM.toastNotification = toast;
    }

    toast.innerHTML = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
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

      dots.forEach((dot, idx) => {
        dot.onclick = (e) => {
          e.stopPropagation();
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
        if (!e.target.closest('.carousel-btn') && !e.target.closest('.carousel-dot') && !e.target.closest('video') && prod) {
          openProductModal(prod, 'image', true);
        }
      };

      let touchStartX = 0;
      let touchEndX = 0;
      carouselEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      carouselEl.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) updateSlide(state.carousels[cardId].currentIndex + 1);
          else updateSlide(state.carousels[cardId].currentIndex - 1);
        }
      }, { passive: true });
    });

    // Cambio interactivo de variante en la tarjeta
    document.querySelectorAll('.card-variant-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = pill.dataset.code;
        const cardEl = pill.closest('.product-card');
        const targetProd = state.products.find(p => p.codigo === code);
        if (targetProd && cardEl) {
          // Re-renderizar la tarjeta directamente con la variante seleccionada
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
             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'photo-placeholder\'><span class=\'placeholder-icon\'>${getCategoryEmoji(prod.categoria)}</span><span class=\'placeholder-code\'>${prod.codigo}</span></div>';">
        <div class="modal-zoom-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <span>Pasa el cursor para zoom &bull; Clic para ver gigante</span>
        </div>
      `;
    } else {
      mainMediaHtml = `
        <div class="photo-placeholder">
          <span class="placeholder-icon">${getCategoryEmoji(prod.categoria)}</span>
          <span class="placeholder-code">${prod.codigo}</span>
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
          <div class="modal-header-tag">${prod.categoria.toUpperCase()} ${prod.subcategoria ? `&bull; ${prod.subcategoria}` : ''}</div>
          <h2 class="modal-title">${prod.nombre}</h2>
          <div style="display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;">
            <span class="badge-code">REF: ${prod.codigo}</span>
            ${hasVideo ? `<span class="badge-video">🎬 Video en Acción</span>` : ''}
          </div>
          
          <p class="modal-desc">${prod.descripcion || 'Equipamiento de alto rendimiento LEV Wild Spirit.'}</p>

          ${modalVariantsHtml}

          ${hasVideo ? `
            <div class="modal-video-callout">
              <span style="font-size: 1.2rem;">🎬</span>
              <span><strong>Demostración en video:</strong> Comprobación de visibilidad y resistencia en ruta real.</span>
            </div>
          ` : ''}

          ${specsTableHtml}

          <div class="modal-price-area">
            <div class="price-row">
              <span class="price-label">PRECIO DE VENTA AL PÚBLICO</span>
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
      const targetHash = `#producto-${productSlug}`;
      if (window.location.hash !== targetHash) {
        history.pushState({ productCode: prod.codigo, slug: productSlug }, '', targetHash);
      }
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
        
        if (thumb.dataset.type === 'video') {
          mediaBox.classList.add('has-video');
          mediaBox.onmousemove = null;
          mediaBox.onmouseleave = null;
          mediaBox.onclick = null;
          mediaBox.innerHTML = `
            <video class="modal-main-video" controls autoplay playsinline id="modalMainVideo">
              <source src="${thumb.dataset.videoSrc}" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>
          `;
        } else {
          currentPhotoIdx = parseInt(thumb.dataset.index, 10) || 0;
          mediaBox.innerHTML = `
            <img src="${thumb.dataset.src}" 
                 id="modalMainImg" 
                 alt="${prod.nombre}"
                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'photo-placeholder\'><span class=\'placeholder-icon\'>${getCategoryEmoji(prod.categoria)}</span><span class=\'placeholder-code\'>${prod.codigo}</span></div>';">
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

    if (updateHistory && window.location.hash.startsWith('#producto-')) {
      if (state.activeCategory !== 'todos') {
        const catObj = state.categories.find(c => c.nombre.toLowerCase() === state.activeCategory.toLowerCase());
        const slug = catObj ? (catObj.slug || slugify(catObj.nombre)) : slugify(state.activeCategory);
        history.pushState(null, '', `#${slug}`);
      } else {
        history.pushState(null, '', window.location.pathname);
      }
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
  // 9. ROUTING Y DEEP LINKING
  // ==========================================================================
  function setupHistoryRouting() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.productCode) {
        const prod = state.products.find(p => p.codigo === e.state.productCode);
        if (prod) openProductModal(prod, 'image', false);
      } else if (e.state && e.state.category) {
        activateCategory(e.state.category, 'todos', false);
        closeProductModal(false);
      } else {
        checkDeepLink();
      }
    });
  }

  function checkDeepLink() {
    const hash = window.location.hash.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const prodParam = searchParams.get('producto') || searchParams.get('p');
    const catParam = searchParams.get('categoria') || searchParams.get('cat');
    const subcatParam = searchParams.get('subcategoria') || searchParams.get('subcat');

    // 1. Revisar si es enlace a producto
    let targetCodeOrSlug = null;
    if (hash.startsWith('#producto-')) {
      targetCodeOrSlug = hash.replace('#producto-', '');
    } else if (prodParam) {
      targetCodeOrSlug = prodParam;
    }

    if (targetCodeOrSlug && state.products.length > 0) {
      const matchedProd = state.products.find(p => 
        slugify(p.codigo) === slugify(targetCodeOrSlug) ||
        p.codigo.toLowerCase() === targetCodeOrSlug.toLowerCase() ||
        slugify(p.nombre) === slugify(targetCodeOrSlug)
      );

      if (matchedProd) {
        setTimeout(() => {
          openProductModal(matchedProd, 'image', false);
        }, 150);
        return;
      }
    }

    // 2. Revisar si es enlace a categoría o subcategoría independiente
    if (hash && hash !== '#catalogo' && hash !== '#hero') {
      const cleanHash = hash.replace('#cat-', '').replace('#', '');
      handleCategoryHash(cleanHash);
      return;
    }

    if (catParam) {
      activateCategory(catParam, subcatParam || 'todos', false);
    }
  }

  function handleCategoryHash(cleanHash) {
    const h = cleanHash.toLowerCase();

    if (h.includes('casco')) {
      activateCategory('Cascos', 'todos');
      return;
    }

    if (h.includes('guante')) {
      activateCategory('Guantes', 'todos');
      return;
    }

    if (h.includes('luces-delanteras') || h.includes('luz-delantera') || h.includes('delantera')) {
      activateCategory('Iluminación', 'delantera');
      return;
    }

    if (h.includes('luces-traseras') || h.includes('luz-trasera') || h.includes('trasera')) {
      activateCategory('Iluminación', 'trasera');
      return;
    }

    if (h.includes('iluminac') || h.includes('luz') || h.includes('luces')) {
      activateCategory('Iluminación', 'todos');
      return;
    }

    if (h.includes('audifon') || h.includes('audífon') || h.includes('ts19') || h.includes('langsdom')) {
      activateCategory('Audífonos', 'todos');
      return;
    }

    if (h.includes('gafa') || h.includes('lentes') || h.includes('rockbros')) {
      activateCategory('Gafas', 'todos');
      return;
    }

    if (h.includes('bolsa') || h.includes('magnesio') || h.includes('mochila') || h.includes('rinonera') || h.includes('escalada')) {
      activateCategory('Bolsas', 'todos');
      return;
    }

    if (h.includes('gorra')) {
      activateCategory('Gorras', 'todos');
      return;
    }

    if (h.includes('componente') || h.includes('pedal') || h.includes('accesorios')) {
      activateCategory('Componentes', 'todos');
      return;
    }

    const matchedCategory = state.categories.find(c => 
      slugify(c.nombre) === h || 
      (c.slug && c.slug.toLowerCase() === h) ||
      c.id.toLowerCase() === h
    );

    if (matchedCategory) {
      activateCategory(matchedCategory.nombre, 'todos');
    }
  }

  function activateCategory(categoryName, subcategory = 'todos', pushState = true) {
    state.activeCategory = categoryName;
    state.activeSubcategory = subcategory || 'todos';
    state.activeDiscipline = 'todos';
    state.searchQuery = '';

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'none';

    renderCategoryPills();
    renderCatalog();

    if (pushState) {
      const catObj = state.categories.find(c => c.nombre.toLowerCase() === categoryName.toLowerCase());
      let slug = catObj ? (catObj.slug || slugify(catObj.nombre)) : slugify(categoryName);
      if (categoryName.toLowerCase().includes('iluminac') && subcategory === 'delantera') slug = 'luces-delanteras';
      if (categoryName.toLowerCase().includes('iluminac') && subcategory === 'trasera') slug = 'luces-traseras';
      
      history.pushState({ category: categoryName, subcategory: subcategory }, '', `#${slug}`);
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
    setMeta('twitterTitle', title, 'name', 'twitter:title');
    setMeta('twitterDescription', desc, 'name', 'twitter:description');
  }

  function updateProductMeta(prod) {
    if (!prod) {
      const defaultTitle = 'LEV Wild Spirit | Catálogo Oficial de Equipamiento Deportivo';
      const defaultDesc = 'Catálogo oficial de LEV Wild Spirit. Equipamiento de alto rendimiento para ciclismo, gimnasio y escalada: cascos, gafas polarizadas, audífonos deportivos, iluminación LED, guantes, pedales y bolsas técnicas.';
      const defaultImg = new URL('images/brand/logo-lev-nav.png', window.location.href).href;
      const defaultUrl = window.location.origin + window.location.pathname;

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

      removeMeta('property', 'og:price:amount');
      removeMeta('property', 'og:price:currency');
      removeMeta('property', 'product:retailer_item_id');
      removeMeta('property', 'product:brand');
      removeMeta('property', 'product:availability');
      removeMeta('property', 'product:condition');
      return;
    }

    const title = `${prod.nombre}${prod.subcategoria ? ` (${prod.subcategoria})` : ''} | LEV Wild Spirit`;
    const desc = prod.descripcion || `Adquiere ${prod.nombre} en LEV Wild Spirit. Equipamiento deportivo de alta durabilidad y tecnología.`;
    const firstImg = (prod.fotos && prod.fotos.length > 0) ? prod.fotos[0] : 'images/brand/logo-lev-nav.png';
    const imgUrl = new URL(CONFIG.imagesPath + firstImg, window.location.href).href;
    const prodUrl = `${window.location.origin}${window.location.pathname}#producto-${slugify(prod.codigo)}`;

    document.title = title;
    setMeta('metaDescription', desc, 'name', 'description');
    setMeta('ogTitle', title, 'property', 'og:title');
    setMeta('ogDescription', desc, 'property', 'og:description');
    setMeta('ogImage', imgUrl, 'property', 'og:image');
    setMeta('ogUrl', prodUrl, 'property', 'og:url');
    setMeta('ogType', 'product', 'property', 'og:type');
    setMeta('twitterTitle', title, 'name', 'twitter:title');
    setMeta('twitterDescription', desc, 'name', 'twitter:description');
    setMeta('twitterImage', imgUrl, 'name', 'twitter:image');

    const brand = detectBrand(prod);

    if (prod.precio) {
      setMeta('ogPrice', parseFloat(prod.precio).toFixed(2), 'property', 'og:price:amount');
      setMeta('ogCurrency', 'USD', 'property', 'og:price:currency');
    }
    setMeta('productItemId', prod.codigo, 'property', 'product:retailer_item_id');
    setMeta('productBrand', brand, 'property', 'product:brand');
    setMeta('productAvail', 'in stock', 'property', 'product:availability');
    setMeta('productCondition', 'new', 'property', 'product:condition');

    if (DOM.structuredData) {
      const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": prod.nombre,
        "image": (prod.fotos || []).map(f => new URL(CONFIG.imagesPath + f, window.location.href).href),
        "description": prod.descripcion || `${prod.nombre} equipamiento deportivo`,
        "sku": prod.codigo,
        "mpn": prod.codigo,
        "brand": {
          "@type": "Brand",
          "name": brand
        },
        "category": prod.categoria,
        "offers": {
          "@type": "Offer",
          "url": prodUrl,
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
      DOM.structuredData.textContent = JSON.stringify(schemaData, null, 2);
    }
  }

  function setMeta(elementId, content, attrName, attrValue) {
    let el = document.getElementById(elementId);
    if (!el) {
      el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    }
    if (el) {
      el.setAttribute('content', content);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute(attrName, attrValue);
      newMeta.setAttribute('content', content);
      if (elementId) newMeta.id = elementId;
      document.head.appendChild(newMeta);
    }
  }

  function removeMeta(attrName, attrValue) {
    const el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (el) {
      el.remove();
    }
  }

  // ==========================================================================
  // 11. FILTRADO Y RESUMEN
  // ==========================================================================
  function filterByDisciplineOnly(products, discipline) {
    if (discipline === 'todos') return products;
    const target = discipline.toLowerCase();

    return products.filter(p => {
      if (p.disciplinas && Array.isArray(p.disciplinas)) {
        const hasDisc = p.disciplinas.some(d => d.toLowerCase() === target);
        if (hasDisc) return true;
      }

      const cat = (p.categoria || '').toLowerCase();
      const sub = (p.subcategoria || '').toLowerCase();

      if (target === 'ciclismo') {
        return cat === 'cascos' || cat === 'gafas' || cat === 'iluminación' || cat === 'guantes' || cat === 'gorras' || cat === 'componentes';
      }
      if (target === 'gym') {
        return cat === 'audífonos' || sub.includes('gimnasio') || sub.includes('gym');
      }
      if (target === 'escalada') {
        return sub.includes('escalada') || (p.nombre && p.nombre.toLowerCase().includes('magnesio'));
      }
      return true;
    });
  }

  function getFilteredProducts() {
    let result = filterByDisciplineOnly(state.products, state.activeDiscipline);

    if (state.activeCategory !== 'todos') {
      result = result.filter(p => p.categoria.toLowerCase() === state.activeCategory.toLowerCase());
    }

    if (state.activeSubcategory !== 'todos') {
      const sf = state.activeSubcategory.toLowerCase();
      result = result.filter(p => {
        const sub = (p.subcategoria || '').toLowerCase();
        const name = (p.nombre || '').toLowerCase();
        const code = (p.codigo || '').toLowerCase();

        if (sf === 'delantera') return sub.includes('delantera') || name.includes('delantera') || sub.includes('dual');
        if (sf === 'trasera') return sub.includes('trasera') || name.includes('trasera') || sub.includes('sensor') || sub.includes('dual') || sub.includes('aluminio') || sub.includes('polímero');
        if (sf === 'dual') return sub.includes('dual');
        if (sf === '12h15') return code.includes('12h15') || name.includes('12h15');
        if (sf === '12h22n') return code.includes('12h22n') || name.includes('12h22n');
        if (sf === '12h09') return code.includes('12h09') || name.includes('12h09');
        if (sf === '11h01') return code.includes('11h01') || name.includes('11h01');
        if (sf === 'ts19') return code.includes('ts19') || name.includes('ts19');
        if (sf === 'openair') return code.includes('openair') || name.includes('openair');
        if (sf === 'h12') return code.includes('h12') || name.includes('h12');
        if (sf === 'magnesio') return name.includes('magnesio') || sub.includes('escalada') || sub.includes('azul') || sub.includes('amarillo') || sub.includes('verde') || sub.includes('negro');
        if (sf === 'gym') return sub.includes('gimnasio') || name.includes('gym');
        if (sf === 'ciclismo') return sub.includes('ciclismo') || name.includes('bicicleta');
        if (sf === 'adulto') return sub.includes('adulto');
        if (sf === 'nino') return sub.includes('niño') || sub.includes('nino') || code.includes('nino');
        if (sf === '10h1') return code.includes('10h1');
        if (sf === '10h2') return code.includes('10h2');
        return sub.includes(sf) || name.includes(sf);
      });
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        return (
          p.nombre.toLowerCase().includes(q) ||
          p.codigo.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          (p.subcategoria && p.subcategoria.toLowerCase().includes(q)) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
          (p.especificaciones_raw && p.especificaciones_raw.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }

  function updateResultsSummary(count) {
    if (!DOM.resultsCountText) return;

    let text = `Mostrando ${count} ${count === 1 ? 'producto' : 'productos'}`;
    let isFiltered = false;

    if (state.activeDiscipline !== 'todos') {
      text += ` en ${state.activeDiscipline.toUpperCase()}`;
      isFiltered = true;
    }
    if (state.activeCategory !== 'todos') {
      text += ` &bull; Categoría: ${state.activeCategory}`;
      isFiltered = true;
    }
    if (state.activeSubcategory !== 'todos') {
      text += ` &bull; Filtro: ${state.activeSubcategory.toUpperCase()}`;
      isFiltered = true;
    }
    if (state.searchQuery.trim() !== '') {
      text += ` &bull; Búsqueda: "${state.searchQuery}"`;
      isFiltered = true;
    }

    DOM.resultsCountText.innerHTML = text;

    if (DOM.resetFiltersBtn) {
      DOM.resetFiltersBtn.style.display = isFiltered ? 'inline-block' : 'none';
    }
  }

  // ==========================================================================
  // 12. GESTIÓN DE TEMA (MODO OSCURO Y CLARO)
  // ==========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem('lev_theme') || 'dark';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
    localStorage.setItem('lev_theme', theme);

    if (DOM.themeToggleBtn) {
      const sun = DOM.themeToggleBtn.querySelector('.sun-icon');
      const moon = DOM.themeToggleBtn.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = theme === 'light' ? 'none' : 'block';
        moon.style.display = theme === 'light' ? 'block' : 'none';
      }
    }

    if (DOM.mobileThemeToggleBtn) {
      DOM.mobileThemeToggleBtn.textContent = theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Fondo Blanco';
    }
  }

  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  }

  // ==========================================================================
  // 13. LISTENERS GLOBALES Y UTILIDADES
  // ==========================================================================
  function setupEventListeners() {
    if (DOM.themeToggleBtn) DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    if (DOM.mobileThemeToggleBtn) {
      DOM.mobileThemeToggleBtn.addEventListener('click', () => {
        toggleTheme();
        if (DOM.mobileDrawer) DOM.mobileDrawer.classList.remove('open');
        if (DOM.mobileMenuToggle) DOM.mobileMenuToggle.classList.remove('open');
      });
    }

    window.addEventListener('scroll', () => {
      if (DOM.header) {
        if (window.scrollY > 40) {
          DOM.header.classList.add('scrolled');
        } else {
          DOM.header.classList.remove('scrolled');
        }
      }
    }, { passive: true });

    if (DOM.navDesktop) {
      DOM.navDesktop.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeDiscipline = btn.dataset.discipline;
          state.activeCategory = 'todos';
          state.activeSubcategory = 'todos';
          renderCategoryPills();
          renderCatalog();
        });
      });
    }

    document.querySelectorAll('.drawer-pill:not(#mobileThemeToggleBtn)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.drawer-pill:not(#mobileThemeToggleBtn)').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeDiscipline = btn.dataset.discipline;
        state.activeCategory = 'todos';
        state.activeSubcategory = 'todos';
        if (DOM.mobileDrawer) DOM.mobileDrawer.classList.remove('open');
        if (DOM.mobileMenuToggle) DOM.mobileMenuToggle.classList.remove('open');
        
        if (DOM.navDesktop) {
          DOM.navDesktop.querySelectorAll('.nav-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.discipline === state.activeDiscipline);
          });
        }

        renderCategoryPills();
        renderCatalog();
      });
    });

    if (DOM.mobileMenuToggle && DOM.mobileDrawer) {
      DOM.mobileMenuToggle.addEventListener('click', () => {
        const isOpen = DOM.mobileDrawer.classList.toggle('open');
        DOM.mobileMenuToggle.classList.toggle('open', isOpen);
        DOM.mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
        DOM.searchInput.value = '';
        state.searchQuery = '';
        DOM.searchClearBtn.style.display = 'none';
        renderCatalog();
      });
    }

    if (DOM.searchToggleBtn) {
      DOM.searchToggleBtn.addEventListener('click', () => {
        if (DOM.searchInput) {
          DOM.searchInput.focus();
          DOM.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
    if (DOM.clearSearchActionBtn) DOM.clearSearchActionBtn.addEventListener('click', resetAllFilters);

    if (DOM.modalCloseBtn) {
      DOM.modalCloseBtn.addEventListener('click', () => closeProductModal(true));
    }
    if (DOM.productModal) {
      DOM.productModal.addEventListener('click', (e) => {
        if (e.target === DOM.productModal) closeProductModal(true);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (zoomState.isOpen) {
          closeFullscreenZoom();
        } else if (DOM.productModal && DOM.productModal.classList.contains('open')) {
          closeProductModal(true);
        }
      } else if (zoomState.isOpen) {
        if (e.key === 'ArrowLeft') {
          setZoomPhoto(zoomState.currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          setZoomPhoto(zoomState.currentIndex + 1);
        } else if (e.key === '+' || e.key === '=') {
          zoomIn();
        } else if (e.key === '-' || e.key === '_') {
          zoomOut();
        }
      }
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
    document.querySelectorAll('.drawer-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.discipline === 'todos');
    });

    history.pushState(null, '', window.location.pathname);
    updateProductMeta(null);

    renderCategoryPills();
    renderCatalog();
  }

  function setupScrollAnimations() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(el => {
      el.classList.add('visible');
      el.classList.add('revealed');
    });
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function slugify(text) {
    return (text || '')
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');
  }

  function getCategoryEmoji(cat) {
    const map = {
      'cascos': '🪖',
      'gafas': '🕶️',
      'audífonos': '🎧',
      'audifonos': '🎧',
      'iluminación': '💡',
      'iluminacion': '💡',
      'guantes': '🧤',
      'componentes': '⚙️',
      'bolsas': '🎒',
      'gorras': '🧢'
    };
    return map[cat.toLowerCase()] || '⚡';
  }

  // ==========================================================================
  // 14. DATASET DE RESPALDO SINCRONIZADO CON DATA/PRODUCTOS.JSON
  // ==========================================================================
  function loadFallbackData() {
    const fallbackCatalog = {
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
      "precio": 33.0,
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
      "precio": 30.0,
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

    state.data = fallbackCatalog;
    state.products = fallbackCatalog.productos || [];
    state.categories = fallbackCatalog.categorias || [];
    state.disciplines = fallbackCatalog.disciplinas || [];
    state.videos = fallbackCatalog.videos || [];
    if (fallbackCatalog.marca && fallbackCatalog.marca.whatsapp_numero) {
      CONFIG.defaultWhatsapp = fallbackCatalog.marca.whatsapp_numero;
    }
  }

  // Iniciar aplicación
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
