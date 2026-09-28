/**
 * LEV WILD SPIRIT - Meta Ads Product Page Application
 * Handles dynamic product rendering, gallery, recommendations & Meta Pixel tracking.
 */

(function() {
  'use strict';

  // Dataset de respaldo embebido (garantiza funcionamiento sin CORS en pruebas locales)
  const BACKUP_PRODUCTS_DATA = [
  {
    "id": "LEV-CAS-12H15-001",
    "item_group_id": "LEV-CAS-12H15",
    "title": "Casco Promend 12H15 – Plomo Mate",
    "description": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético; Luz trasera: LED integrada",
    "description_text": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      },
      {
        "label": "Luz trasera",
        "value": "LED integrada"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "45.00 USD",
    "price_num": 45.0,
    "price_formatted": "$45.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H15-001",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H15-plomo-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H15-plomo-02.jpg,https://levwild.com/images/meta/casco-promend-12H15-plomo-03.jpg,https://levwild.com/images/meta/casco-promend-12H15-plomo-04.jpg,https://levwild.com/images/meta/casco-promend-12H15-plomo-05.jpg,https://levwild.com/images/meta/casco-promend-12H15-plomo-06.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-06.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-01.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-plomo-06.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Plomo Mate",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Premium",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H15-002",
    "item_group_id": "LEV-CAS-12H15",
    "title": "Casco Promend 12H15 – Negro con Blanco",
    "description": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético; Luz trasera: LED integrada",
    "description_text": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      },
      {
        "label": "Luz trasera",
        "value": "LED integrada"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "45.00 USD",
    "price_num": 45.0,
    "price_formatted": "$45.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H15-002",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H15-negrob-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H15-negrob-02.jpg,https://levwild.com/images/meta/casco-promend-12H15-negrob-03.jpg,https://levwild.com/images/meta/casco-promend-12H15-negrob-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-01.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negrob-04.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Negro con Blanco",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Premium",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H15-003",
    "item_group_id": "LEV-CAS-12H15",
    "title": "Casco Promend 12H15 – Negro con Rojo",
    "description": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético; Luz trasera: LED integrada",
    "description_text": "Casco aerodinámico de alta protección, con visor magnético y luz trasera LED integrada.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      },
      {
        "label": "Luz trasera",
        "value": "LED integrada"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "45.00 USD",
    "price_num": 45.0,
    "price_formatted": "$45.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H15-003",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H15-negror-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H15-negror-03.jpg,https://levwild.com/images/meta/casco-promend-12H15-negror-04.jpg,https://levwild.com/images/meta/casco-promend-12H15-negror-05.jpg,https://levwild.com/images/meta/casco-promend-12H15-negror-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H15-negror-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H15-negror-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H15-negror-01.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Negro con Rojo",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Premium",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H22N-001",
    "item_group_id": "LEV-CAS-12H22N",
    "title": "Casco Promend 12H22N – Negro",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "37.00 USD",
    "price_num": 37.0,
    "price_formatted": "$37.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H22N-001",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H22N-negro-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H22N-negro-03.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negro-04.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negro-05.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negro-06.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negro-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-06.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-06.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negro-01.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Negro",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Premium",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H22N-002",
    "item_group_id": "LEV-CAS-12H22N",
    "title": "Casco Promend 12H22N – Blanco",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "37.00 USD",
    "price_num": 37.0,
    "price_formatted": "$37.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H22N-002",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H22N-blanco-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H22N-blanco-03.jpg,https://levwild.com/images/meta/casco-promend-12H22N-blanco-04.jpg,https://levwild.com/images/meta/casco-promend-12H22N-blanco-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-blanco-01.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Blanco",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Premium",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H22N-003",
    "item_group_id": "LEV-CAS-12H22N",
    "title": "Casco Promend 12H22N – Rojo con Negro",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "37.00 USD",
    "price_num": 37.0,
    "price_formatted": "$37.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H22N-003",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-03.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-04.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-05.jpg,https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-05.jpg",
      "https://levwild.com/images/meta/casco-promend-12H22N-negrorojo-01.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Rojo con Negro",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Premium",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H09-001",
    "item_group_id": "LEV-CAS-12H09",
    "title": "Casco Promend 12H09 – Blanco",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "29.00 USD",
    "price_num": 29.0,
    "price_formatted": "$29.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H09-001",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H09-blanco-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H09-blanco-02.jpg,https://levwild.com/images/meta/casco-promend-12H09-blanco-03.jpg,https://levwild.com/images/meta/casco-promend-12H09-blanco-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-01.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-blanco-04.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Blanco",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Medio",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H09-002",
    "item_group_id": "LEV-CAS-12H09",
    "title": "Casco Promend 12H09 – Negro con Plomo",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "29.00 USD",
    "price_num": 29.0,
    "price_formatted": "$29.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H09-002",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-03.jpg,https://levwild.com/images/meta/casco-promend-12H09-negroplomo-04.jpg,https://levwild.com/images/meta/casco-promend-12H09-negroplomo-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negroplomo-01.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Negro con Plomo",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Medio",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-12H09-003",
    "item_group_id": "LEV-CAS-12H09",
    "title": "Casco Promend 12H09 – Negro con Rojo",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético, ideal para ruta.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "29.00 USD",
    "price_num": 29.0,
    "price_formatted": "$29.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-12H09-003",
    "image_link": "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-03.jpg,https://levwild.com/images/meta/casco-promend-12H09-negrorojo-04.jpg,https://levwild.com/images/meta/casco-promend-12H09-negrorojo-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-02.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-03.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-04.jpg",
      "https://levwild.com/images/meta/casco-promend-12H09-negrorojo-01.jpg"
    ],
    "brand": "Promend",
    "product_type": "Ciclismo > Cascos",
    "color": "Negro con Rojo",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Medio",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-CAS-11H01-001",
    "item_group_id": "LEV-CAS-11H01",
    "title": "Casco Bike Boy 11H01 – Negro con Blanco",
    "description": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético. | Estructura: EPS alta densidad; Ajuste: Dial trasero ajustable; Ventilación: Canales integrados; Peso: Liviano; Visor: Magnético",
    "description_text": "Casco aerodinámico de alta protección, con ventilación optimizada y visor magnético.",
    "specs": [
      {
        "label": "Estructura",
        "value": "EPS alta densidad"
      },
      {
        "label": "Ajuste",
        "value": "Dial trasero ajustable"
      },
      {
        "label": "Ventilación",
        "value": "Canales integrados"
      },
      {
        "label": "Peso",
        "value": "Liviano"
      },
      {
        "label": "Visor",
        "value": "Magnético"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "25.00 USD",
    "price_num": 25.0,
    "price_formatted": "$25.00",
    "currency": "USD",
    "link": "https://levwild.com/cascos/?p=LEV-CAS-11H01-001",
    "image_link": "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-02.jpg,https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-03.jpg,https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-02.jpg",
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-03.jpg",
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-01.jpg",
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-02.jpg",
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-03.jpg",
      "https://levwild.com/images/meta/casco-bikeboy-11H01-negrob-04.jpg"
    ],
    "brand": "Bike Boy",
    "product_type": "Ciclismo > Cascos",
    "color": "Negro con Blanco",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Cascos",
    "custom_label_2": "Medio",
    "categoria": "Cascos"
  },
  {
    "id": "LEV-GAF-10H1-001",
    "item_group_id": "LEV-GAF-10H1",
    "title": "Gafa ROCKBROS 10H1 – Negro con Azul",
    "description": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida. | Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Incluye: Estuche, bolsa de tela y paño de limpieza",
    "description_text": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida.",
    "specs": [
      {
        "label": "Protección UV",
        "value": "100%"
      },
      {
        "label": "Lente",
        "value": "Polarizado"
      },
      {
        "label": "Armazón",
        "value": "Ajustable a la medida"
      },
      {
        "label": "Incluye",
        "value": "Estuche, bolsa de tela y paño de limpieza"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "29.00 USD",
    "price_num": 29.0,
    "price_formatted": "$29.00",
    "currency": "USD",
    "link": "https://levwild.com/gafas/?p=LEV-GAF-10H1-001",
    "image_link": "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-02.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-03.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-04.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-05.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-06.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-04.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-05.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-06.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-01.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-04.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-05.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-negroazul-06.jpg"
    ],
    "brand": "ROCKBROS",
    "product_type": "Ciclismo > Gafas",
    "color": "Negro con Azul",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Gafas",
    "custom_label_2": "Medio",
    "categoria": "Gafas"
  },
  {
    "id": "LEV-GAF-10H1-002",
    "item_group_id": "LEV-GAF-10H1",
    "title": "Gafa ROCKBROS 10H1 – Blanco con Azul",
    "description": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida. | Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Incluye: Estuche, bolsa de tela y paño de limpieza",
    "description_text": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida.",
    "specs": [
      {
        "label": "Protección UV",
        "value": "100%"
      },
      {
        "label": "Lente",
        "value": "Polarizado"
      },
      {
        "label": "Armazón",
        "value": "Ajustable a la medida"
      },
      {
        "label": "Incluye",
        "value": "Estuche, bolsa de tela y paño de limpieza"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "29.00 USD",
    "price_num": 29.0,
    "price_formatted": "$29.00",
    "currency": "USD",
    "link": "https://levwild.com/gafas/?p=LEV-GAF-10H1-002",
    "image_link": "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-02.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-03.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-01.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-blancoazul-04.jpg"
    ],
    "brand": "ROCKBROS",
    "product_type": "Ciclismo > Gafas",
    "color": "Blanco con Azul",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Gafas",
    "custom_label_2": "Medio",
    "categoria": "Gafas"
  },
  {
    "id": "LEV-GAF-10H1-003",
    "item_group_id": "LEV-GAF-10H1",
    "title": "Gafa ROCKBROS 10H1 – Verde con Blanco",
    "description": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida. | Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Incluye: Estuche, bolsa de tela y paño de limpieza",
    "description_text": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida.",
    "specs": [
      {
        "label": "Protección UV",
        "value": "100%"
      },
      {
        "label": "Lente",
        "value": "Polarizado"
      },
      {
        "label": "Armazón",
        "value": "Ajustable a la medida"
      },
      {
        "label": "Incluye",
        "value": "Estuche, bolsa de tela y paño de limpieza"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "29.00 USD",
    "price_num": 29.0,
    "price_formatted": "$29.00",
    "currency": "USD",
    "link": "https://levwild.com/gafas/?p=LEV-GAF-10H1-003",
    "image_link": "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-02.jpg",
    "additional_image_link": "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-03.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-04.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-05.jpg,https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-01.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-04.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-05.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-01.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-04.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-05.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h1-verdeblanco-01.jpg"
    ],
    "brand": "ROCKBROS",
    "product_type": "Ciclismo > Gafas",
    "color": "Verde con Blanco",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Gafas",
    "custom_label_2": "Medio",
    "categoria": "Gafas"
  },
  {
    "id": "LEV-GAF-10H2-001",
    "item_group_id": "LEV-GAF-10H2",
    "title": "Gafa ROCKBROS 10H2 – Negro con Rojo",
    "description": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida, incluye 4 visores intercambiables adicionales. | Protección UV: 100%; Lente: Polarizado; Armazón: Ajustable a la medida; Visores adicionales incluidos: 4; Incluye: Estuche, bolsa de tela y paño de limpieza",
    "description_text": "Gafa deportiva ROCKBROS con protección UV 100% y lente polarizado, armazón ajustable a la medida, incluye 4 visores intercambiables adicionales.",
    "specs": [
      {
        "label": "Protección UV",
        "value": "100%"
      },
      {
        "label": "Lente",
        "value": "Polarizado"
      },
      {
        "label": "Armazón",
        "value": "Ajustable a la medida"
      },
      {
        "label": "Visores adicionales incluidos",
        "value": "4"
      },
      {
        "label": "Incluye",
        "value": "Estuche, bolsa de tela y paño de limpieza"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "35.00 USD",
    "price_num": 35.0,
    "price_formatted": "$35.00",
    "currency": "USD",
    "link": "https://levwild.com/gafas/?p=LEV-GAF-10H2-001",
    "image_link": "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-02.jpg,https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-03.jpg,https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-04.jpg,https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-05.jpg,https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-06.jpg,https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-07.jpg,https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-08.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-04.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-05.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-06.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-07.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-08.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-01.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-02.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-03.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-04.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-05.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-06.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-07.jpg",
      "https://levwild.com/images/meta/gafa-rockbros-10h2-negrorojo-08.jpg"
    ],
    "brand": "ROCKBROS",
    "product_type": "Ciclismo > Gafas",
    "color": "Negro con Rojo",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Gafas",
    "custom_label_2": "Premium",
    "categoria": "Gafas"
  },
  {
    "id": "LEV-AUD-H12-001",
    "item_group_id": "LEV-AUD-H12",
    "title": "Audífonos deportivos H12 – Negros",
    "description": "Audífonos deportivos inalámbricos, ultraligeros y resistentes al agua, ideales para entrenar. | Conexión: Bluetooth inalámbrico; Alcance: 10 metros; Tiempo de carga: 2 horas",
    "description_text": "Audífonos deportivos inalámbricos, ultraligeros y resistentes al agua, ideales para entrenar.",
    "specs": [
      {
        "label": "Conexión",
        "value": "Bluetooth inalámbrico"
      },
      {
        "label": "Alcance",
        "value": "10 metros"
      },
      {
        "label": "Tiempo de carga",
        "value": "2 horas"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "30.00 USD",
    "price_num": 30.0,
    "price_formatted": "$30.00",
    "currency": "USD",
    "link": "https://levwild.com/audifonos/?p=LEV-AUD-H12-001",
    "image_link": "https://levwild.com/images/meta/audifono-h12-negro-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/audifono-h12-negro-02.jpg,https://levwild.com/images/meta/audifono-h12-negro-03.jpg,https://levwild.com/images/meta/audifono-h12-negro-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/audifono-h12-negro-02.jpg",
      "https://levwild.com/images/meta/audifono-h12-negro-03.jpg",
      "https://levwild.com/images/meta/audifono-h12-negro-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/audifono-h12-negro-01.jpg",
      "https://levwild.com/images/meta/audifono-h12-negro-02.jpg",
      "https://levwild.com/images/meta/audifono-h12-negro-03.jpg",
      "https://levwild.com/images/meta/audifono-h12-negro-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Gym & Training > Audífonos",
    "color": "Negros",
    "custom_label_0": "Gym & Training",
    "custom_label_1": "Audífonos",
    "custom_label_2": "Premium",
    "categoria": "Audífonos"
  },
  {
    "id": "LEV-AUD-OPENAIR-001",
    "item_group_id": "LEV-AUD-OPENAIR",
    "title": "Audífonos deportivos OpenAir Duet – Negros",
    "description": "Audífonos deportivos inalámbricos, ultraligeros y resistentes al agua, con batería de larga duración. | Conexión: Bluetooth inalámbrico; Autonomía: 5 horas; Resistencia al agua: IPX5; Peso: Ultraligero",
    "description_text": "Audífonos deportivos inalámbricos, ultraligeros y resistentes al agua, con batería de larga duración.",
    "specs": [
      {
        "label": "Conexión",
        "value": "Bluetooth inalámbrico"
      },
      {
        "label": "Autonomía",
        "value": "5 horas"
      },
      {
        "label": "Resistencia al agua",
        "value": "IPX5"
      },
      {
        "label": "Peso",
        "value": "Ultraligero"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "33.00 USD",
    "price_num": 33.0,
    "price_formatted": "$33.00",
    "currency": "USD",
    "link": "https://levwild.com/audifonos/?p=LEV-AUD-OPENAIR-001",
    "image_link": "https://levwild.com/images/meta/audifono-openair-duet-negro-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/audifono-openair-duet-negro-02.jpg,https://levwild.com/images/meta/audifono-openair-duet-negro-03.jpg,https://levwild.com/images/meta/audifono-openair-duet-negro-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/audifono-openair-duet-negro-02.jpg",
      "https://levwild.com/images/meta/audifono-openair-duet-negro-03.jpg",
      "https://levwild.com/images/meta/audifono-openair-duet-negro-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/audifono-openair-duet-negro-01.jpg",
      "https://levwild.com/images/meta/audifono-openair-duet-negro-02.jpg",
      "https://levwild.com/images/meta/audifono-openair-duet-negro-03.jpg",
      "https://levwild.com/images/meta/audifono-openair-duet-negro-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Gym & Training > Audífonos",
    "color": "Negros",
    "custom_label_0": "Gym & Training",
    "custom_label_1": "Audífonos",
    "custom_label_2": "Premium",
    "categoria": "Audífonos"
  },
  {
    "id": "LEV-LUZ-FRENO-001",
    "item_group_id": "LEV-LUZ-FRENO-001",
    "title": "Luz Trasera con Sensor de Freno – Aluminio",
    "description": "Luz trasera profesional de alta potencia con sensor de freno, que brilla más fuerte automáticamente al frenar para máxima seguridad en tus rutas. | Material: 100% aluminio; Sensor de freno: Automático (brilla más fuerte al frenar); Modos de luz: 6; Operación: Manual o automática; Carga: USB; Resistencia: Impermeable (lluvia extrema)",
    "description_text": "Luz trasera profesional de alta potencia con sensor de freno, que brilla más fuerte automáticamente al frenar para máxima seguridad en tus rutas.",
    "specs": [
      {
        "label": "Material",
        "value": "100% aluminio"
      },
      {
        "label": "Sensor de freno",
        "value": "Automático (brilla más fuerte al frenar)"
      },
      {
        "label": "Modos de luz",
        "value": "6"
      },
      {
        "label": "Operación",
        "value": "Manual o automática"
      },
      {
        "label": "Carga",
        "value": "USB"
      },
      {
        "label": "Resistencia",
        "value": "Impermeable (lluvia extrema)"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "21.00 USD",
    "price_num": 21.0,
    "price_formatted": "$21.00",
    "currency": "USD",
    "link": "https://levwild.com/luces-traseras/?p=LEV-LUZ-FRENO-001",
    "image_link": "https://levwild.com/images/meta/luz-trasera-sensorfreno-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/luz-trasera-sensorfreno-02.jpg,https://levwild.com/images/meta/luz-trasera-sensorfreno-03.jpg,https://levwild.com/images/meta/luz-trasera-sensorfreno-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-02.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-03.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-01.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-02.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-03.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Iluminación",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Iluminación",
    "custom_label_2": "Medio",
    "categoria": "Iluminación"
  },
  {
    "id": "LEV-LUZ-FRENO-002",
    "item_group_id": "LEV-LUZ-FRENO-002",
    "title": "Luz Trasera con Sensor de Freno – Ligera",
    "description": "Luz trasera ligera con sensor de freno automático. Aumenta su brillo al frenar, brindando máxima seguridad en tus rutas a un precio accesible. | Material: Plástico de alta resistencia (ligero); Sensor inteligente: Detección automática de frenado (aumenta el brillo); Modos de iluminación: 6 (fijos y parpadeantes); Operación: Dual (Manual e Inteligente/Automática); Carga: Batería recargable vía USB; Resistencia: Resistente al agua y salpicaduras",
    "description_text": "Luz trasera ligera con sensor de freno automático. Aumenta su brillo al frenar, brindando máxima seguridad en tus rutas a un precio accesible.",
    "specs": [
      {
        "label": "Material",
        "value": "Plástico de alta resistencia (ligero)"
      },
      {
        "label": "Sensor inteligente",
        "value": "Detección automática de frenado (aumenta el brillo)"
      },
      {
        "label": "Modos de iluminación",
        "value": "6 (fijos y parpadeantes)"
      },
      {
        "label": "Operación",
        "value": "Dual (Manual e Inteligente/Automática)"
      },
      {
        "label": "Carga",
        "value": "Batería recargable vía USB"
      },
      {
        "label": "Resistencia",
        "value": "Resistente al agua y salpicaduras"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "15.00 USD",
    "price_num": 15.0,
    "price_formatted": "$15.00",
    "currency": "USD",
    "link": "https://levwild.com/luces-traseras/?p=LEV-LUZ-FRENO-002",
    "image_link": "https://levwild.com/images/meta/luz-trasera-sensorfreno002-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/luz-trasera-sensorfreno002-02.jpg,https://levwild.com/images/meta/luz-trasera-sensorfreno002-03.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/luz-trasera-sensorfreno002-02.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno002-03.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/luz-trasera-sensorfreno002-01.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno002-02.jpg",
      "https://levwild.com/images/meta/luz-trasera-sensorfreno002-03.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Iluminación",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Iluminación",
    "custom_label_2": "Económico",
    "categoria": "Iluminación"
  },
  {
    "id": "LEV-LUZ-1300-001",
    "item_group_id": "LEV-LUZ-1300",
    "title": "Luz Delantera 1300 Lúmenes",
    "description": "Luz delantera de brillo extremo para visibilidad total en rutas de montaña o ciudad, incluso en la oscuridad más absoluta. | Lúmenes: 1300; Carga: USB recargable; Soporte: Estable, no se mueve con baches; Resistencia: Al agua; Modos: Varios (intensidad ajustable)",
    "description_text": "Luz delantera de brillo extremo para visibilidad total en rutas de montaña o ciudad, incluso en la oscuridad más absoluta.",
    "specs": [
      {
        "label": "Lúmenes",
        "value": "1300"
      },
      {
        "label": "Carga",
        "value": "USB recargable"
      },
      {
        "label": "Soporte",
        "value": "Estable, no se mueve con baches"
      },
      {
        "label": "Resistencia",
        "value": "Al agua"
      },
      {
        "label": "Modos",
        "value": "Varios (intensidad ajustable)"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "33.00 USD",
    "price_num": 33.0,
    "price_formatted": "$33.00",
    "currency": "USD",
    "link": "https://levwild.com/luces-delanteras/?p=LEV-LUZ-1300-001",
    "image_link": "https://levwild.com/images/meta/luz-delantera-1300lm-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/luz-delantera-1300lm-02.jpg,https://levwild.com/images/meta/luz-delantera-1300lm-03.jpg,https://levwild.com/images/meta/luz-delantera-1300lm-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/luz-delantera-1300lm-02.jpg",
      "https://levwild.com/images/meta/luz-delantera-1300lm-03.jpg",
      "https://levwild.com/images/meta/luz-delantera-1300lm-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/luz-delantera-1300lm-01.jpg",
      "https://levwild.com/images/meta/luz-delantera-1300lm-02.jpg",
      "https://levwild.com/images/meta/luz-delantera-1300lm-03.jpg",
      "https://levwild.com/images/meta/luz-delantera-1300lm-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Iluminación",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Iluminación",
    "custom_label_2": "Premium",
    "categoria": "Iluminación"
  },
  {
    "id": "LEV-LUZ-1000-001",
    "item_group_id": "LEV-LUZ-1000",
    "title": "Luz Delantera 1000 Lúmenes",
    "description": "Luz delantera de brillo extremo para visibilidad total en rutas de montaña o ciudad, incluso en la oscuridad más absoluta. | Lúmenes: 1000; Carga: USB recargable; Soporte: Estable, no se mueve con baches; Resistencia: Al agua; Modos: Varios (intensidad ajustable)",
    "description_text": "Luz delantera de brillo extremo para visibilidad total en rutas de montaña o ciudad, incluso en la oscuridad más absoluta.",
    "specs": [
      {
        "label": "Lúmenes",
        "value": "1000"
      },
      {
        "label": "Carga",
        "value": "USB recargable"
      },
      {
        "label": "Soporte",
        "value": "Estable, no se mueve con baches"
      },
      {
        "label": "Resistencia",
        "value": "Al agua"
      },
      {
        "label": "Modos",
        "value": "Varios (intensidad ajustable)"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "28.00 USD",
    "price_num": 28.0,
    "price_formatted": "$28.00",
    "currency": "USD",
    "link": "https://levwild.com/luces-delanteras/?p=LEV-LUZ-1000-001",
    "image_link": "https://levwild.com/images/meta/luz-delantera-1000lm-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/luz-delantera-1000lm-02.jpg,https://levwild.com/images/meta/luz-delantera-1000lm-03.jpg,https://levwild.com/images/meta/luz-delantera-1000lm-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/luz-delantera-1000lm-02.jpg",
      "https://levwild.com/images/meta/luz-delantera-1000lm-03.jpg",
      "https://levwild.com/images/meta/luz-delantera-1000lm-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/luz-delantera-1000lm-01.jpg",
      "https://levwild.com/images/meta/luz-delantera-1000lm-02.jpg",
      "https://levwild.com/images/meta/luz-delantera-1000lm-03.jpg",
      "https://levwild.com/images/meta/luz-delantera-1000lm-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Iluminación",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Iluminación",
    "custom_label_2": "Medio",
    "categoria": "Iluminación"
  },
  {
    "id": "LEV-LUZ-COB-001",
    "item_group_id": "LEV-LUZ-COB",
    "title": "Luz Trasera LED COB Recargable",
    "description": "Luz trasera tipo COB de alto brillo, súper ligera y resistente, que se carga como un celular sin necesidad de pilas. | Tecnología: LED COB; Batería: Litio 500 mAh; Carga: USB (cable incluido); Soporte: Liga ajustable 12-32 mm; Instalación: Sin herramientas; Modos: Varios; Incluye: Luz LED RPL-2266, cable de carga USB, soporte de fijación",
    "description_text": "Luz trasera tipo COB de alto brillo, súper ligera y resistente, que se carga como un celular sin necesidad de pilas.",
    "specs": [
      {
        "label": "Tecnología",
        "value": "LED COB"
      },
      {
        "label": "Batería",
        "value": "Litio 500 mAh"
      },
      {
        "label": "Carga",
        "value": "USB (cable incluido)"
      },
      {
        "label": "Soporte",
        "value": "Liga ajustable 12-32 mm"
      },
      {
        "label": "Instalación",
        "value": "Sin herramientas"
      },
      {
        "label": "Modos",
        "value": "Varios"
      },
      {
        "label": "Incluye",
        "value": "Luz LED RPL-2266, cable de carga USB, soporte de fijación"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "11.00 USD",
    "price_num": 11.0,
    "price_formatted": "$11.00",
    "currency": "USD",
    "link": "https://levwild.com/luces-traseras/?p=LEV-LUZ-COB-001",
    "image_link": "https://levwild.com/images/meta/luz-trasera-cob-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/luz-trasera-cob-02.jpg,https://levwild.com/images/meta/luz-trasera-cob-03.jpg,https://levwild.com/images/meta/luz-trasera-cob-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/luz-trasera-cob-02.jpg",
      "https://levwild.com/images/meta/luz-trasera-cob-03.jpg",
      "https://levwild.com/images/meta/luz-trasera-cob-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/luz-trasera-cob-01.jpg",
      "https://levwild.com/images/meta/luz-trasera-cob-02.jpg",
      "https://levwild.com/images/meta/luz-trasera-cob-03.jpg",
      "https://levwild.com/images/meta/luz-trasera-cob-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Iluminación",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Iluminación",
    "custom_label_2": "Económico",
    "categoria": "Iluminación"
  },
  {
    "id": "LEV-LUZ-DUAL-001",
    "item_group_id": "LEV-LUZ-DUAL",
    "title": "Luz Dual Blanca/Roja",
    "description": "Luz dual de alta potencia para bicicleta o casco, con luz blanca al frente y roja atrás para ser visto desde cualquier ángulo. | Colores: Blanca (frontal) y roja (trasera); Uso: Manubrio o casco; Modos: 4 (fija fuerte/suave, intermitente rápido/lento); Batería: Litio recargable vía USB; Resistencia: IPX8 (lluvia); Instalación: Sin herramientas; Incluye: Luz dual, cable USB y soporte ajustable",
    "description_text": "Luz dual de alta potencia para bicicleta o casco, con luz blanca al frente y roja atrás para ser visto desde cualquier ángulo.",
    "specs": [
      {
        "label": "Colores",
        "value": "Blanca (frontal) y roja (trasera)"
      },
      {
        "label": "Uso",
        "value": "Manubrio o casco"
      },
      {
        "label": "Modos",
        "value": "4 (fija fuerte/suave, intermitente rápido/lento)"
      },
      {
        "label": "Batería",
        "value": "Litio recargable vía USB"
      },
      {
        "label": "Resistencia",
        "value": "IPX8 (lluvia)"
      },
      {
        "label": "Instalación",
        "value": "Sin herramientas"
      },
      {
        "label": "Incluye",
        "value": "Luz dual, cable USB y soporte ajustable"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "16.00 USD",
    "price_num": 16.0,
    "price_formatted": "$16.00",
    "currency": "USD",
    "link": "https://levwild.com/luces-delanteras/?p=LEV-LUZ-DUAL-001",
    "image_link": "https://levwild.com/images/meta/luz-dual-blancoroja-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/luz-dual-blancoroja-02.jpg,https://levwild.com/images/meta/luz-dual-blancoroja-03.jpg,https://levwild.com/images/meta/luz-dual-blancoroja-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/luz-dual-blancoroja-02.jpg",
      "https://levwild.com/images/meta/luz-dual-blancoroja-03.jpg",
      "https://levwild.com/images/meta/luz-dual-blancoroja-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/luz-dual-blancoroja-01.jpg",
      "https://levwild.com/images/meta/luz-dual-blancoroja-02.jpg",
      "https://levwild.com/images/meta/luz-dual-blancoroja-03.jpg",
      "https://levwild.com/images/meta/luz-dual-blancoroja-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Iluminación",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Iluminación",
    "custom_label_2": "Económico",
    "categoria": "Iluminación"
  },
  {
    "id": "LEV-GUA-001",
    "item_group_id": "LEV-GUA",
    "title": "Guantes de Ciclismo",
    "description": "Guantes de ciclismo half-finger que equilibran protección, estilo y ventilación, ideales para MTB, ruta o uso urbano. | Diseño: Half-finger (medio dedo); Palma: Antideslizante con acolchado geométrico; Material: Tejido elástico transpirable; Cierre: Velcro reforzado en la muñeca; Retiro: Pestañas para quitarlos fácilmente; Tallas disponibles: S / M / L / XL",
    "description_text": "Guantes de ciclismo half-finger que equilibran protección, estilo y ventilación, ideales para MTB, ruta o uso urbano.",
    "specs": [
      {
        "label": "Diseño",
        "value": "Half-finger (medio dedo)"
      },
      {
        "label": "Palma",
        "value": "Antideslizante con acolchado geométrico"
      },
      {
        "label": "Material",
        "value": "Tejido elástico transpirable"
      },
      {
        "label": "Cierre",
        "value": "Velcro reforzado en la muñeca"
      },
      {
        "label": "Retiro",
        "value": "Pestañas para quitarlos fácilmente"
      },
      {
        "label": "Tallas disponibles",
        "value": "S / M / L / XL"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "14.00 USD",
    "price_num": 14.0,
    "price_formatted": "$14.00",
    "currency": "USD",
    "link": "https://levwild.com/guantes/?p=LEV-GUA-001",
    "image_link": "https://levwild.com/images/meta/guante-ciclismo-adulto-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/guante-ciclismo-adulto-02.jpg,https://levwild.com/images/meta/guante-ciclismo-adulto-03.jpg,https://levwild.com/images/meta/guante-ciclismo-adulto-04.jpg,https://levwild.com/images/meta/guante-ciclismo-adulto-05.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/guante-ciclismo-adulto-02.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-03.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-04.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-05.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/guante-ciclismo-adulto-01.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-02.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-03.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-04.jpg",
      "https://levwild.com/images/meta/guante-ciclismo-adulto-05.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Guantes",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Guantes",
    "custom_label_2": "Económico",
    "categoria": "Guantes"
  },
  {
    "id": "LEV-GUA-NINO-001",
    "item_group_id": "LEV-GUA-NINO",
    "title": "Guantes de Ciclismo para Niños Knightlaood",
    "description": "Guantes de ciclismo infantiles que brindan seguridad y confort para que los niños exploren al aire libre con confianza. | Marca: Knightlaood; Palma: Antideslizante; Seguridad: Elementos reflectores; Material: Malla transpirable (Mesh); Diseño: Medio dedo; Tallas: S / M / L",
    "description_text": "Guantes de ciclismo infantiles que brindan seguridad y confort para que los niños exploren al aire libre con confianza.",
    "specs": [
      {
        "label": "Marca",
        "value": "Knightlaood"
      },
      {
        "label": "Palma",
        "value": "Antideslizante"
      },
      {
        "label": "Seguridad",
        "value": "Elementos reflectores"
      },
      {
        "label": "Material",
        "value": "Malla transpirable (Mesh)"
      },
      {
        "label": "Diseño",
        "value": "Medio dedo"
      },
      {
        "label": "Tallas",
        "value": "S / M / L"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "12.00 USD",
    "price_num": 12.0,
    "price_formatted": "$12.00",
    "currency": "USD",
    "link": "https://levwild.com/guantes/?p=LEV-GUA-NINO-001",
    "image_link": "https://levwild.com/images/meta/guante-nino-knightlaood-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/guante-nino-knightlaood-02.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/guante-nino-knightlaood-02.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/guante-nino-knightlaood-01.jpg",
      "https://levwild.com/images/meta/guante-nino-knightlaood-02.jpg"
    ],
    "brand": "Knightlaood",
    "product_type": "Ciclismo > Guantes",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Guantes",
    "custom_label_2": "Económico",
    "categoria": "Guantes"
  },
  {
    "id": "LEV-PED-MTB-001",
    "item_group_id": "LEV-PED-MTB",
    "title": "Pedal Mixto MTB",
    "description": "Pedal mixto muy versátil, utilizable con zapatos de ciclismo o zapatos deportivos comunes; ideal para quienes inician con clips, ciclistas urbanos y rutas de montaña técnicas. | Tipo: Doble cara (bloqueo automático SPD de un lado, plataforma plana del otro); Peso: 298 g el par; Eje: Acero molibdeno; Cuerpo: Aleación de aluminio; Incluye: Calas (clips) y pernos",
    "description_text": "Pedal mixto muy versátil, utilizable con zapatos de ciclismo o zapatos deportivos comunes; ideal para quienes inician con clips, ciclistas urbanos y rutas de montaña técnicas.",
    "specs": [
      {
        "label": "Tipo",
        "value": "Doble cara (bloqueo automático SPD de un lado, plataforma plana del otro)"
      },
      {
        "label": "Peso",
        "value": "298 g el par"
      },
      {
        "label": "Eje",
        "value": "Acero molibdeno"
      },
      {
        "label": "Cuerpo",
        "value": "Aleación de aluminio"
      },
      {
        "label": "Incluye",
        "value": "Calas (clips) y pernos"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "37.00 USD",
    "price_num": 37.0,
    "price_formatted": "$37.00",
    "currency": "USD",
    "link": "https://levwild.com/componentes/?p=LEV-PED-MTB-001",
    "image_link": "https://levwild.com/images/meta/pedal-mixto-mtb-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/pedal-mixto-mtb-02.jpg,https://levwild.com/images/meta/pedal-mixto-mtb-03.jpg,https://levwild.com/images/meta/pedal-mixto-mtb-04.jpg,https://levwild.com/images/meta/pedal-mixto-mtb-05.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/pedal-mixto-mtb-02.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-03.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-04.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-05.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/pedal-mixto-mtb-01.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-02.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-03.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-04.jpg",
      "https://levwild.com/images/meta/pedal-mixto-mtb-05.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Componentes",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Componentes",
    "custom_label_2": "Premium",
    "categoria": "Componentes"
  },
  {
    "id": "LEV-BOL-MOCHDEL-001",
    "item_group_id": "LEV-BOL-MOCHDEL",
    "title": "Mochila Delantera para Bicicleta",
    "description": "Mochila que se instala en el cuadro delantero de la bicicleta para llevar tus cosas al alcance de la mano durante la ruta. | Sujeción: 3 puntos de anclaje (estabilidad total); Capacidad: Herramientas, celular, snacks y repuestos; Material: Alta resistencia con correas reforzadas; Acceso: Rápido, sin bajarte de la bici; Diseño: Aerodinámico",
    "description_text": "Mochila que se instala en el cuadro delantero de la bicicleta para llevar tus cosas al alcance de la mano durante la ruta.",
    "specs": [
      {
        "label": "Sujeción",
        "value": "3 puntos de anclaje (estabilidad total)"
      },
      {
        "label": "Capacidad",
        "value": "Herramientas, celular, snacks y repuestos"
      },
      {
        "label": "Material",
        "value": "Alta resistencia con correas reforzadas"
      },
      {
        "label": "Acceso",
        "value": "Rápido, sin bajarte de la bici"
      },
      {
        "label": "Diseño",
        "value": "Aerodinámico"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "25.00 USD",
    "price_num": 25.0,
    "price_formatted": "$25.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-MOCHDEL-001",
    "image_link": "https://levwild.com/images/meta/mochila-delantera-bici-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/mochila-delantera-bici-02.jpg,https://levwild.com/images/meta/mochila-delantera-bici-03.jpg,https://levwild.com/images/meta/mochila-delantera-bici-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/mochila-delantera-bici-02.jpg",
      "https://levwild.com/images/meta/mochila-delantera-bici-03.jpg",
      "https://levwild.com/images/meta/mochila-delantera-bici-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/mochila-delantera-bici-01.jpg",
      "https://levwild.com/images/meta/mochila-delantera-bici-02.jpg",
      "https://levwild.com/images/meta/mochila-delantera-bici-03.jpg",
      "https://levwild.com/images/meta/mochila-delantera-bici-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Ciclismo > Bolsas",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  },
  {
    "id": "LEV-BOL-RINESC-001",
    "item_group_id": "LEV-BOL-RINESC",
    "title": "Bolso/Riñonera para Escalada",
    "description": "Riñonera técnica de alta capacidad para optimizar tu equipo de escalada. | Capacidad: Zapatos de escalada, arnés compacto, magnesio y snacks; Ventilación: Orificios laterales; Acceso: Bolsillo frontal con malla técnica y cierres reforzados; Material: Alta durabilidad, resistente al roce con la roca; Uso: En la cintura o cruzada",
    "description_text": "Riñonera técnica de alta capacidad para optimizar tu equipo de escalada.",
    "specs": [
      {
        "label": "Capacidad",
        "value": "Zapatos de escalada, arnés compacto, magnesio y snacks"
      },
      {
        "label": "Ventilación",
        "value": "Orificios laterales"
      },
      {
        "label": "Acceso",
        "value": "Bolsillo frontal con malla técnica y cierres reforzados"
      },
      {
        "label": "Material",
        "value": "Alta durabilidad, resistente al roce con la roca"
      },
      {
        "label": "Uso",
        "value": "En la cintura o cruzada"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "25.00 USD",
    "price_num": 25.0,
    "price_formatted": "$25.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-RINESC-001",
    "image_link": "https://levwild.com/images/meta/rinonera-escalada-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/rinonera-escalada-02.jpg,https://levwild.com/images/meta/rinonera-escalada-03.jpg,https://levwild.com/images/meta/rinonera-escalada-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/rinonera-escalada-02.jpg",
      "https://levwild.com/images/meta/rinonera-escalada-03.jpg",
      "https://levwild.com/images/meta/rinonera-escalada-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/rinonera-escalada-01.jpg",
      "https://levwild.com/images/meta/rinonera-escalada-02.jpg",
      "https://levwild.com/images/meta/rinonera-escalada-03.jpg",
      "https://levwild.com/images/meta/rinonera-escalada-04.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Escalada > Bolsas",
    "color": "",
    "custom_label_0": "Escalada",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  },
  {
    "id": "LEV-BOL-GYM",
    "item_group_id": "LEV-BOL-GYM",
    "title": "Bolsa Gym Magnética",
    "description": "Bolsa magnética que se adhiere a cualquier máquina o rack del gimnasio, para mantener tus pertenencias limpias y a la mano durante el entrenamiento. | Sujeción: Imán potente para superficies metálicas; Capacidad: Celular, llaves, audífonos y más; Bolsillo: Malla para ver notificaciones rápidamente",
    "description_text": "Bolsa magnética que se adhiere a cualquier máquina o rack del gimnasio, para mantener tus pertenencias limpias y a la mano durante el entrenamiento.",
    "specs": [
      {
        "label": "Sujeción",
        "value": "Imán potente para superficies metálicas"
      },
      {
        "label": "Capacidad",
        "value": "Celular, llaves, audífonos y más"
      },
      {
        "label": "Bolsillo",
        "value": "Malla para ver notificaciones rápidamente"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "20.00 USD",
    "price_num": 20.0,
    "price_formatted": "$20.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-GYM",
    "image_link": "https://levwild.com/images/meta/bolsa-gym-magnetica-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/bolsa-gym-magnetica-02.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/bolsa-gym-magnetica-02.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/bolsa-gym-magnetica-01.jpg",
      "https://levwild.com/images/meta/bolsa-gym-magnetica-02.jpg"
    ],
    "brand": "LEV Wild Spirit",
    "product_type": "Gym & Training > Bolsas",
    "color": "",
    "custom_label_0": "Gym & Training",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  },
  {
    "id": "LEV-GOR-001",
    "item_group_id": "LEV-GOR",
    "title": "Gorra de Ciclismo RockBross",
    "description": "Gorra deportiva ligera y transpirable, diseñada para un ajuste perfecto bajo el casco o para uso durante las cicleadas, con protección solar y estilo. | Material: Transpirable; Ajuste: Bajo el casco o uso diario; Diseños: Varios modelos disponibles",
    "description_text": "Gorra deportiva ligera y transpirable, diseñada para un ajuste perfecto bajo el casco o para uso durante las cicleadas, con protección solar y estilo.",
    "specs": [
      {
        "label": "Material",
        "value": "Transpirable"
      },
      {
        "label": "Ajuste",
        "value": "Bajo el casco o uso diario"
      },
      {
        "label": "Diseños",
        "value": "Varios modelos disponibles"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "18.00 USD",
    "price_num": 18.0,
    "price_formatted": "$18.00",
    "currency": "USD",
    "link": "https://levwild.com/gorras/?p=LEV-GOR-001",
    "image_link": "https://levwild.com/images/meta/gorra-ciclismo-01.jpg",
    "additional_image_link": "https://levwild.com/images/meta/gorra-ciclismo-02.jpg,https://levwild.com/images/meta/gorra-ciclismo-03.jpg,https://levwild.com/images/meta/gorra-ciclismo-04.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/gorra-ciclismo-02.jpg",
      "https://levwild.com/images/meta/gorra-ciclismo-03.jpg",
      "https://levwild.com/images/meta/gorra-ciclismo-04.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/gorra-ciclismo-01.jpg",
      "https://levwild.com/images/meta/gorra-ciclismo-02.jpg",
      "https://levwild.com/images/meta/gorra-ciclismo-03.jpg",
      "https://levwild.com/images/meta/gorra-ciclismo-04.jpg"
    ],
    "brand": "ROCKBROS",
    "product_type": "Ciclismo > Gorras",
    "color": "",
    "custom_label_0": "Ciclismo",
    "custom_label_1": "Gorras",
    "custom_label_2": "Medio",
    "categoria": "Gorras"
  },
  {
    "id": "LEV-AUD-LANG-TS19-001",
    "item_group_id": "LEV-AUD-LANG-TS19",
    "title": "Audífonos Langsdom TS19 – Beige",
    "description": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche. | Tipo: Abierto ergonómico (no entra al oído); Micrófono: Integrado y nítido para llamadas; Conexión: Bluetooth (hasta 10 metros); Batería total: Hasta 40 horas con estuche; Tiempo de carga: 1.5 a 2 horas aprox.; Puerto de carga: USB-C; Resistencia: Sudor y lluvia ligera",
    "description_text": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche.",
    "specs": [
      {
        "label": "Tipo",
        "value": "Abierto ergonómico (no entra al oído)"
      },
      {
        "label": "Micrófono",
        "value": "Integrado y nítido para llamadas"
      },
      {
        "label": "Conexión",
        "value": "Bluetooth (hasta 10 metros)"
      },
      {
        "label": "Batería total",
        "value": "Hasta 40 horas con estuche"
      },
      {
        "label": "Tiempo de carga",
        "value": "1.5 a 2 horas aprox."
      },
      {
        "label": "Puerto de carga",
        "value": "USB-C"
      },
      {
        "label": "Resistencia",
        "value": "Sudor y lluvia ligera"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "36.00 USD",
    "price_num": 36.0,
    "price_formatted": "$36.00",
    "currency": "USD",
    "link": "https://levwild.com/audifonos/?p=LEV-AUD-LANG-TS19-001",
    "image_link": "https://levwild.com/images/meta/audifono-ts19-beige-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/audifono-ts19-beige-002.jpg,https://levwild.com/images/meta/audifono-ts19-beige-003.jpg,https://levwild.com/images/meta/audifono-ts19-beige-004.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/audifono-ts19-beige-002.jpg",
      "https://levwild.com/images/meta/audifono-ts19-beige-003.jpg",
      "https://levwild.com/images/meta/audifono-ts19-beige-004.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/audifono-ts19-beige-001.jpg",
      "https://levwild.com/images/meta/audifono-ts19-beige-002.jpg",
      "https://levwild.com/images/meta/audifono-ts19-beige-003.jpg",
      "https://levwild.com/images/meta/audifono-ts19-beige-004.jpg"
    ],
    "brand": "Langsdom",
    "product_type": "Gym & Training > Audífonos",
    "color": "Beige",
    "custom_label_0": "Gym & Training",
    "custom_label_1": "Audífonos",
    "custom_label_2": "Premium",
    "categoria": "Audífonos"
  },
  {
    "id": "LEV-AUD-LANG-TS19-002",
    "item_group_id": "LEV-AUD-LANG-TS19",
    "title": "Audífonos Langsdom TS19 – Gris con Verde",
    "description": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche. | Tipo: Abierto ergonómico (no entra al oído); Micrófono: Integrado y nítido para llamadas; Conexión: Bluetooth (hasta 10 metros); Batería total: Hasta 40 horas con estuche; Tiempo de carga: 1.5 a 2 horas aprox.; Puerto de carga: USB-C; Resistencia: Sudor y lluvia ligera",
    "description_text": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche.",
    "specs": [
      {
        "label": "Tipo",
        "value": "Abierto ergonómico (no entra al oído)"
      },
      {
        "label": "Micrófono",
        "value": "Integrado y nítido para llamadas"
      },
      {
        "label": "Conexión",
        "value": "Bluetooth (hasta 10 metros)"
      },
      {
        "label": "Batería total",
        "value": "Hasta 40 horas con estuche"
      },
      {
        "label": "Tiempo de carga",
        "value": "1.5 a 2 horas aprox."
      },
      {
        "label": "Puerto de carga",
        "value": "USB-C"
      },
      {
        "label": "Resistencia",
        "value": "Sudor y lluvia ligera"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "36.00 USD",
    "price_num": 36.0,
    "price_formatted": "$36.00",
    "currency": "USD",
    "link": "https://levwild.com/audifonos/?p=LEV-AUD-LANG-TS19-002",
    "image_link": "https://levwild.com/images/meta/audifono-ts19-gris-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/audifono-ts19-gris-002.jpg,https://levwild.com/images/meta/audifono-ts19-gris-003.jpg,https://levwild.com/images/meta/audifono-ts19-gris-004.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/audifono-ts19-gris-002.jpg",
      "https://levwild.com/images/meta/audifono-ts19-gris-003.jpg",
      "https://levwild.com/images/meta/audifono-ts19-gris-004.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/audifono-ts19-gris-001.jpg",
      "https://levwild.com/images/meta/audifono-ts19-gris-002.jpg",
      "https://levwild.com/images/meta/audifono-ts19-gris-003.jpg",
      "https://levwild.com/images/meta/audifono-ts19-gris-004.jpg"
    ],
    "brand": "Langsdom",
    "product_type": "Gym & Training > Audífonos",
    "color": "Gris con Verde",
    "custom_label_0": "Gym & Training",
    "custom_label_1": "Audífonos",
    "custom_label_2": "Premium",
    "categoria": "Audífonos"
  },
  {
    "id": "LEV-AUD-LANG-TS19-003",
    "item_group_id": "LEV-AUD-LANG-TS19",
    "title": "Audífonos Langsdom TS19 – Negros",
    "description": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche. | Tipo: Abierto ergonómico (no entra al oído); Micrófono: Integrado y nítido para llamadas; Conexión: Bluetooth (hasta 10 metros); Batería total: Hasta 40 horas con estuche; Tiempo de carga: 1.5 a 2 horas aprox.; Puerto de carga: USB-C; Resistencia: Sudor y lluvia ligera",
    "description_text": "Audífonos deportivos abiertos (open-ear) que van sobre la oreja sin tapar el oído, ideales para entrenar y escuchar tu entorno con total seguridad. Incluyen micrófono de voz clara para llamadas fluidas, ajuste ergonómico ligero y hasta 40 horas de batería total con su estuche.",
    "specs": [
      {
        "label": "Tipo",
        "value": "Abierto ergonómico (no entra al oído)"
      },
      {
        "label": "Micrófono",
        "value": "Integrado y nítido para llamadas"
      },
      {
        "label": "Conexión",
        "value": "Bluetooth (hasta 10 metros)"
      },
      {
        "label": "Batería total",
        "value": "Hasta 40 horas con estuche"
      },
      {
        "label": "Tiempo de carga",
        "value": "1.5 a 2 horas aprox."
      },
      {
        "label": "Puerto de carga",
        "value": "USB-C"
      },
      {
        "label": "Resistencia",
        "value": "Sudor y lluvia ligera"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "36.00 USD",
    "price_num": 36.0,
    "price_formatted": "$36.00",
    "currency": "USD",
    "link": "https://levwild.com/audifonos/?p=LEV-AUD-LANG-TS19-003",
    "image_link": "https://levwild.com/images/meta/audifono-ts19-negro-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/audifono-ts19-negro-002.jpg,https://levwild.com/images/meta/audifono-ts19-negro-003.jpg,https://levwild.com/images/meta/audifono-ts19-negro-004.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/audifono-ts19-negro-002.jpg",
      "https://levwild.com/images/meta/audifono-ts19-negro-003.jpg",
      "https://levwild.com/images/meta/audifono-ts19-negro-004.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/audifono-ts19-negro-001.jpg",
      "https://levwild.com/images/meta/audifono-ts19-negro-002.jpg",
      "https://levwild.com/images/meta/audifono-ts19-negro-003.jpg",
      "https://levwild.com/images/meta/audifono-ts19-negro-004.jpg"
    ],
    "brand": "Langsdom",
    "product_type": "Gym & Training > Audífonos",
    "color": "Negros",
    "custom_label_0": "Gym & Training",
    "custom_label_1": "Audífonos",
    "custom_label_2": "Premium",
    "categoria": "Audífonos"
  },
  {
    "id": "LEV-BOL-ESC-001-AZUL",
    "item_group_id": "LEV-BOL-ESC-001",
    "title": "Bolsa de Magnesio Luckstone Azul",
    "description": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones | Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
    "description_text": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
    "specs": [
      {
        "label": "Sistema de cierre",
        "value": "Cordón ajustable con seguro antiderrame"
      },
      {
        "label": "Bolsillos",
        "value": "1 frontal y 1 lateral con cierre (entra el celular)"
      },
      {
        "label": "Ajuste",
        "value": "Correa a la cintura con broche regulable"
      },
      {
        "label": "Agarraderas extras",
        "value": "Elásticos laterales para cepillo de escalada o mosquetón"
      },
      {
        "label": "Material",
        "value": "Tela impermeable y resistente al raspón"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "20.00 USD",
    "price_num": 20.0,
    "price_formatted": "$20.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-ESC-001-AZUL",
    "image_link": "https://levwild.com/images/meta/bolsa-magnesio-azul-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/bolsa-magnesio-azul-002.jpg,https://levwild.com/images/meta/bolsa-magnesio-azul-003.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/bolsa-magnesio-azul-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-azul-003.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/bolsa-magnesio-azul-001.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-azul-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-azul-003.jpg"
    ],
    "brand": "Luckstone",
    "product_type": "Escalada > Bolsas",
    "color": "",
    "custom_label_0": "Escalada",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  },
  {
    "id": "LEV-BOL-ESC-001-AMARILLA",
    "item_group_id": "LEV-BOL-ESC-001",
    "title": "Bolsa de Magnesio Luckstone Amarilla",
    "description": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones | Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
    "description_text": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
    "specs": [
      {
        "label": "Sistema de cierre",
        "value": "Cordón ajustable con seguro antiderrame"
      },
      {
        "label": "Bolsillos",
        "value": "1 frontal y 1 lateral con cierre (entra el celular)"
      },
      {
        "label": "Ajuste",
        "value": "Correa a la cintura con broche regulable"
      },
      {
        "label": "Agarraderas extras",
        "value": "Elásticos laterales para cepillo de escalada o mosquetón"
      },
      {
        "label": "Material",
        "value": "Tela impermeable y resistente al raspón"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "20.00 USD",
    "price_num": 20.0,
    "price_formatted": "$20.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-ESC-001-AMARILLA",
    "image_link": "https://levwild.com/images/meta/bolsa-magnesio-amarillo-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/bolsa-magnesio-amarillo-002.jpg,https://levwild.com/images/meta/bolsa-magnesio-amarillo-003.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/bolsa-magnesio-amarillo-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-amarillo-003.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/bolsa-magnesio-amarillo-001.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-amarillo-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-amarillo-003.jpg"
    ],
    "brand": "Luckstone",
    "product_type": "Escalada > Bolsas",
    "color": "",
    "custom_label_0": "Escalada",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  },
  {
    "id": "LEV-BOL-ESC-001-VERDE",
    "item_group_id": "LEV-BOL-ESC-001",
    "title": "Bolsa de Magnesio Luckstone Verde",
    "description": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones | Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
    "description_text": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
    "specs": [
      {
        "label": "Sistema de cierre",
        "value": "Cordón ajustable con seguro antiderrame"
      },
      {
        "label": "Bolsillos",
        "value": "1 frontal y 1 lateral con cierre (entra el celular)"
      },
      {
        "label": "Ajuste",
        "value": "Correa a la cintura con broche regulable"
      },
      {
        "label": "Agarraderas extras",
        "value": "Elásticos laterales para cepillo de escalada o mosquetón"
      },
      {
        "label": "Material",
        "value": "Tela impermeable y resistente al raspón"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "20.00 USD",
    "price_num": 20.0,
    "price_formatted": "$20.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-ESC-001-VERDE",
    "image_link": "https://levwild.com/images/meta/bolsa-magnesio-verde-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/bolsa-magnesio-verde-002.jpg,https://levwild.com/images/meta/bolsa-magnesio-verde-003.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/bolsa-magnesio-verde-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-verde-003.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/bolsa-magnesio-verde-001.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-verde-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-verde-003.jpg"
    ],
    "brand": "Luckstone",
    "product_type": "Escalada > Bolsas",
    "color": "",
    "custom_label_0": "Escalada",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  },
  {
    "id": "LEV-BOL-ESC-001-NEGRA",
    "item_group_id": "LEV-BOL-ESC-001",
    "title": "Bolsa de Magnesio Luckstone Negra",
    "description": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones | Sistema de cierre: Cordón ajustable con seguro antiderrame; Bolsillos: 1 frontal y 1 lateral con cierre (entra el celular); Ajuste: Correa a la cintura con broche regulable; Agarraderas extras: Elásticos laterales para cepillo de escalada o mosquetón; Material: Tela impermeable y resistente al raspón",
    "description_text": "Bolsa de magnesio práctica y resistente para escalada y gimnasio. Viene con cordón ajustable con seguro para que no se riegue el magnesio, dos bolsillos con cierre (frontal y lateral) ideales para guardar el celular o las llaves, correa para la cintura y agarraderas elásticas para sujetar cepillos o enganchar mosquetones",
    "specs": [
      {
        "label": "Sistema de cierre",
        "value": "Cordón ajustable con seguro antiderrame"
      },
      {
        "label": "Bolsillos",
        "value": "1 frontal y 1 lateral con cierre (entra el celular)"
      },
      {
        "label": "Ajuste",
        "value": "Correa a la cintura con broche regulable"
      },
      {
        "label": "Agarraderas extras",
        "value": "Elásticos laterales para cepillo de escalada o mosquetón"
      },
      {
        "label": "Material",
        "value": "Tela impermeable y resistente al raspón"
      }
    ],
    "availability": "in stock",
    "condition": "new",
    "price": "20.00 USD",
    "price_num": 20.0,
    "price_formatted": "$20.00",
    "currency": "USD",
    "link": "https://levwild.com/bolsas/?p=LEV-BOL-ESC-001-NEGRA",
    "image_link": "https://levwild.com/images/meta/bolsa-magnesio-negro-001.jpg",
    "additional_image_link": "https://levwild.com/images/meta/bolsa-magnesio-negro-002.jpg,https://levwild.com/images/meta/bolsa-magnesio-negro-003.jpg",
    "additional_images": [
      "https://levwild.com/images/meta/bolsa-magnesio-negro-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-negro-003.jpg"
    ],
    "images": [
      "https://levwild.com/images/meta/bolsa-magnesio-negro-001.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-negro-002.jpg",
      "https://levwild.com/images/meta/bolsa-magnesio-negro-003.jpg"
    ],
    "brand": "Luckstone",
    "product_type": "Escalada > Bolsas",
    "color": "",
    "custom_label_0": "Escalada",
    "custom_label_1": "Bolsas",
    "custom_label_2": "Medio",
    "categoria": "Bolsas"
  }
];

  const WHATSAPP_PHONE = '593985346800';
  const CATALOG_URL = 'https://levwild.com/';

  // Helper para resolver URLs de imágenes locales vs online
  function formatImageUrl(url) {
    if (!url) return '';
    if (window.location.protocol === 'file:') {
      return url.replace('https://levwild.com/images/', '../images/');
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return url.replace('https://levwild.com/images/', '/images/');
    }
    return url;
  }

  // Helper para construir el enlace de WhatsApp
  function getWhatsAppUrl(product) {
    const message = `¡Hola LEV Wild Spirit! 👋 Vi este producto en un anuncio y me interesa: ${product.title} (Código: ${product.id}). ¿Me ayudan con el precio especial?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }

  // Evento Pixel de WhatsApp Contact
  function trackWhatsAppContact(product) {
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', {
          content_ids: [product.id],
          content_type: 'product',
          value: Number(product.price_num || 0),
          currency: 'USD'
        });
      }
    } catch (e) {
      console.warn('Meta Pixel Contact tracking error:', e);
    }
  }

  // Evento Pixel de Carga de Producto ViewContent
  function trackProductView(product) {
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'PageView');
        fbq('track', 'ViewContent', {
          content_ids: [product.id],
          content_type: 'product',
          content_name: product.title,
          content_category: product.custom_label_1 || product.categoria,
          value: Number(product.price_num || 0),
          currency: 'USD'
        });
      }
    } catch (e) {
      console.warn('Meta Pixel ViewContent tracking error:', e);
    }
  }

  // Obtener parámetro ID de la URL
  function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || urlParams.get('p');
    return id ? id.trim() : null;
  }

  // Cargar lista de productos (Fetch con fallback)
  async function loadProducts() {
    try {
      const response = await fetch('./productos-meta.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.info('Usando dataset embebido de productos:', err);
    }
    return BACKUP_PRODUCTS_DATA;
  }

  // Renderizar estado de error / no encontrado
  function renderNotFound(productId, allProducts) {
    const container = document.getElementById('product-content');
    if (!container) return;

    // Seleccionar 4 productos destacados para recomendar
    const featured = allProducts.slice(0, 4);

    container.innerHTML = `
      <div class="not-found-container">
        <div class="not-found-icon">🔍</div>
        <h1 class="not-found-title">Producto No Encontrado</h1>
        <p class="not-found-desc">
          El código <strong>${productId ? escapeHtml(productId) : 'solicitado'}</strong> no corresponde a ningún producto activo en este momento. Te invitamos a explorar nuestro catálogo completo de equipamiento deportivo.
        </p>
        <a href="${CATALOG_URL}" class="btn-catalog-cta">
          ⚡ Explorar Catálogo Completo
        </a>
      </div>

      <section class="related-products-section">
        <div class="related-header">
          <h2 class="related-title">Productos Destacados</h2>
          <a href="${CATALOG_URL}" class="header-cta-link">Ver Todo &rarr;</a>
        </div>
        <div class="related-grid">
          ${featured.map(renderRelatedCard).join('')}
        </div>
      </section>
    `;

    document.title = 'Producto No Encontrado | LEV Wild Spirit';
  }

  // Helper para escapar HTML seguro
  function escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // Renderizar tarjeta de producto relacionado
  function renderRelatedCard(item) {
    const mainImg = formatImageUrl(item.image_link || (item.images && item.images[0]) || '');
    const productUrl = `./?id=${encodeURIComponent(item.id)}`;
    return `
      <a href="${productUrl}" class="related-card">
        <div class="related-img-wrapper">
          <img src="${mainImg}" alt="${escapeHtml(item.title)}" loading="lazy">
        </div>
        <div class="related-card-content">
          <div>
            <span class="related-card-tag">${escapeHtml(item.brand || item.categoria)}</span>
            <h3 class="related-card-title">${escapeHtml(item.title)}</h3>
          </div>
          <div class="related-card-price">${escapeHtml(item.price_formatted || item.price)}</div>
        </div>
      </a>
    `;
  }

  // Renderizar producto principal
  function renderProduct(product, allProducts) {
    const container = document.getElementById('product-content');
    if (!container) return;

    // Actualizar Metas y Título del documento
    document.title = `${product.title} | LEV Wild Spirit`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', product.description_text || product.title);

    // Preparar lista de imágenes
    const images = (product.images && product.images.length > 0) ? product.images : [product.image_link];
    let currentImageIndex = 0;

    // Buscar 4 productos relacionados de la misma categoría
    const sameCategory = allProducts.filter(p => 
      p.id !== product.id && 
      ((p.custom_label_1 && p.custom_label_1.toLowerCase() === (product.custom_label_1 || '').toLowerCase()) ||
       (p.categoria && p.categoria.toLowerCase() === (product.categoria || '').toLowerCase()))
    );

    // Si hay menos de 4, completar con otros
    let related = [...sameCategory];
    if (related.length < 4) {
      const others = allProducts.filter(p => p.id !== product.id && !related.some(r => r.id === p.id));
      related = related.concat(others);
    }
    related = related.slice(0, 4);

    const waUrl = getWhatsAppUrl(product);

    // Renderizar HTML Principal
    container.innerHTML = `
      <!-- Breadcrumb -->
      <nav class="breadcrumb-section" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          <li><a href="${CATALOG_URL}">Inicio</a></li>
          <li class="breadcrumb-sep">/</li>
          <li><a href="${CATALOG_URL}">${escapeHtml(product.categoria || 'Catálogo')}</a></li>
          <li class="breadcrumb-sep">/</li>
          <li class="breadcrumb-current" aria-current="page">${escapeHtml(product.title)}</li>
        </ol>
      </nav>

      <!-- Main Layout -->
      <div class="product-hero-section">
        <div class="product-layout">
          
          <!-- Columna Izquierda: Galería de Fotos -->
          <div class="gallery-container">
            <div class="gallery-main-wrapper" id="main-image-wrapper">
              <div class="gallery-badge-top">
                <span class="product-pill-badge stock">⚡ En Stock</span>
                <span class="product-pill-badge category">${escapeHtml(product.categoria || 'Equipamiento')}</span>
              </div>
              
              <img id="gallery-main-img" class="gallery-main-img" src="${formatImageUrl(images[0])}" alt="${escapeHtml(product.title)}">
              
              ${images.length > 1 ? `
                <button class="gallery-nav-btn prev" id="gallery-btn-prev" aria-label="Foto anterior">&#8249;</button>
                <button class="gallery-nav-btn next" id="gallery-btn-next" aria-label="Foto siguiente">&#8250;</button>
              ` : ''}

              <div class="gallery-zoom-hint">
                <span>🔍 Clic para ampliar</span>
              </div>
            </div>

            <!-- Miniaturas -->
            ${images.length > 1 ? `
              <div class="gallery-thumbs-row" id="gallery-thumbs-row">
                ${images.map((img, idx) => `
                  <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <img src="${formatImageUrl(img)}" alt="Vista ${idx + 1}">
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Columna Derecha: Información y CTA de Compra -->
          <div class="product-info-col">
            
            <div class="product-header-tags">
              <span class="tag-brand">${escapeHtml(product.brand || 'LEV Wild Spirit')}</span>
              <span class="tag-sku">CÓDIGO: ${escapeHtml(product.id)}</span>
            </div>

            <h1 class="product-main-title">${escapeHtml(product.title)}</h1>

            <!-- Caja de Precio -->
            <div class="product-price-box">
              <div class="price-main-display">
                <span class="price-amount">${escapeHtml(product.price_formatted || product.price)}</span>
                <span class="price-currency">${escapeHtml(product.currency || 'USD')}</span>
              </div>
            </div>

            <!-- Botón Grande Pedir por WhatsApp -->
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-cta" id="btn-whatsapp-main">
              <svg class="whatsapp-icon-svg" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Pedir por WhatsApp</span>
            </a>
            <span class="btn-whatsapp-subtext">Respuesta inmediata &bull; Asesoría personalizada</span>

            <!-- Beneficios de Confianza -->
            <div class="trust-badges-grid">
              <div class="trust-item">
                <span class="trust-icon">🚚</span>
                <span class="trust-title">Envíos a todo el Ecuador</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">💳</span>
                <span class="trust-title">Pago por transferencia</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">🛡️</span>
                <span class="trust-title">Producto original</span>
              </div>
            </div>

            <!-- Ficha Técnica y Descripción -->
            <div class="product-details-card">
              <h2 class="details-heading">Descripción del Producto</h2>
              <p class="product-desc-text">
                ${escapeHtml(product.description_text || product.description)}
              </p>

              ${product.specs && product.specs.length > 0 ? `
                <h2 class="details-heading" style="margin-top: 10px;">Especificaciones Técnicas</h2>
                <div class="specs-list-grid">
                  ${product.specs.map(spec => `
                    <div class="spec-item-box">
                      <span class="spec-item-label">${escapeHtml(spec.label || 'Característica')}</span>
                      <span class="spec-item-value">${escapeHtml(spec.value)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

          </div>
        </div>
      </div>

      <!-- Productos Relacionados -->
      ${related.length > 0 ? `
        <section class="related-products-section">
          <div class="related-header">
            <h2 class="related-title">También te puede interesar</h2>
            <a href="${CATALOG_URL}" class="header-cta-link">Ver Catálogo Completo &rarr;</a>
          </div>
          <div class="related-grid">
            ${related.map(renderRelatedCard).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Banner Ver Catálogo Completo -->
      <section class="catalog-banner-section">
        <div class="catalog-banner-card">
          <h2 class="catalog-banner-title">Explora la Colección Completa LEV Wild Spirit</h2>
          <p class="catalog-banner-desc">
            Descubre cascos aerodinámicos, gafas polarizadas, luces LED ultrabrillantes, guantes técnicos y bolsos deportivos de alto rendimiento.
          </p>
          <a href="${CATALOG_URL}" class="btn-catalog-cta">
            ⚡ Ver Catálogo Completo
          </a>
        </div>
      </section>

      <!-- Barra Sticky Móvil -->
      <div class="mobile-sticky-bar">
        <div class="sticky-product-meta">
          <span class="sticky-product-title">${escapeHtml(product.title)}</span>
          <span class="sticky-product-price">${escapeHtml(product.price_formatted || product.price)}</span>
        </div>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="sticky-whatsapp-btn" id="btn-whatsapp-sticky">
          <svg class="whatsapp-icon-svg" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>Pedir WhatsApp</span>
        </a>
      </div>

      <!-- Lightbox Modal -->
      <div class="lightbox-modal" id="lightbox-modal">
        <button class="lightbox-close-btn" id="lightbox-close-btn">&times;</button>
        <div class="lightbox-content">
          <img id="lightbox-img" class="lightbox-img" src="${formatImageUrl(images[0])}" alt="${escapeHtml(product.title)}">
        </div>
      </div>
    `;

    // Configurar Interactividad de Galería
    const mainImgEl = document.getElementById('gallery-main-img');
    const thumbEls = document.querySelectorAll('.gallery-thumb-item');
    const prevBtn = document.getElementById('gallery-btn-prev');
    const nextBtn = document.getElementById('gallery-btn-next');
    const mainWrapper = document.getElementById('main-image-wrapper');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    function updateGalleryImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentImageIndex = index;

      const newSrc = formatImageUrl(images[currentImageIndex]);
      if (mainImgEl) mainImgEl.src = newSrc;
      if (lightboxImg) lightboxImg.src = newSrc;

      thumbEls.forEach((thumb, idx) => {
        if (idx === currentImageIndex) {
          thumb.classList.add('active');
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          thumb.classList.remove('active');
        }
      });
    }

    thumbEls.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.getAttribute('data-index'), 10);
        updateGalleryImage(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGalleryImage(currentImageIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGalleryImage(currentImageIndex + 1);
      });
    }

    // Lightbox open / close
    if (mainWrapper && lightboxModal && lightboxClose) {
      mainWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-nav-btn')) return;
        lightboxModal.classList.add('active');
      });

      lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });

      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          lightboxModal.classList.remove('active');
        }
      });
    }

    // Swipe táctil en móvil para la galería
    if (mainWrapper && images.length > 1) {
      let touchStartX = 0;
      let touchEndX = 0;
      mainWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      mainWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40) {
          updateGalleryImage(currentImageIndex + 1);
        } else if (touchEndX > touchStartX + 40) {
          updateGalleryImage(currentImageIndex - 1);
        }
      }, { passive: true });
    }

    // WhatsApp Tracking Clicks
    const btnMain = document.getElementById('btn-whatsapp-main');
    const btnSticky = document.getElementById('btn-whatsapp-sticky');

    if (btnMain) {
      btnMain.addEventListener('click', () => {
        trackWhatsAppContact(product);
      });
    }

    if (btnSticky) {
      btnSticky.addEventListener('click', () => {
        trackWhatsAppContact(product);
      });
    }

    // Disparar evento de ViewContent en Meta Pixel
    trackProductView(product);
  }

  // Inicialización de la aplicación
  async function init() {
    const productId = getProductIdFromUrl();
    const products = await loadProducts();

    if (!productId) {
      if (products.length > 0) {
        renderProduct(products[0], products);
      } else {
        renderNotFound(null, products);
      }
      return;
    }

    // Buscar producto exacto (insensible a mayúsculas/espacios)
    const cleanId = productId.trim().toLowerCase();
    const product = products.find(p => p.id && p.id.trim().toLowerCase() === cleanId);

    if (product) {
      renderProduct(product, products);
    } else {
      renderNotFound(productId, products);
    }
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
