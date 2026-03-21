# Content Security Policy (CSP) Configuration Guide

## Overview

El proyecto Black Polar ha sido refactorizado para ser completamente compatible con **Content Security Policy estricta** sin usar directivas `'unsafe-inline'`.

## CSP Headers Recomendados

Para máxima seguridad, configura estos headers en tu servidor (Express/Nginx):

### Express (app.js)

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: true,
    },
  },
}));
```

### Nginx

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self'; frame-src 'none'; object-src 'none'; upgrade-insecure-requests;" always;
```

## Cambios Realizados

### ✅ Scripts

**ANTES:**
```html
<script>
  // Miles de líneas de código inline
  function handleFormSubmit(e) { ... }
  document.getElementById('mobile-menu-toggle').addEventListener('click', () => { ... });
</script>
```

**DESPUÉS:**
```html
<script src="/public/js/main.js"></script>
```

**Archivos creados:**
- `src/apps/main/public/js/main.js` - Toda la lógica extraída a archivo externo
- `src/apps/portfolios/public/js/index.js` - Ya estaba limpio
- `src/apps/tlm/public/js/index.js` - Ya estaba limpio

### ✅ Event Handlers

**ANTES:**
```html
<button onclick="alert('Admin login')" style="cursor:none">Admin</button>
<button onclick="handleFormSubmit(event)">Send Message</button>
```

**DESPUÉS:**
```html
<button id="admin-btn" class="cursor-none">Admin</button>
<button data-form-submit>Send Message</button>
```

El JavaScript agora usa `addEventListener` en lugar de event handlers inline.

### ✅ Inline Styles

**ANTES:**
```html
<p style="max-width:480px; color:rgba(245,245,240,0.45); font-size:0.65rem;">
  Text here
</p>
<select style="appearance:none; cursor:none; background:#080808;">
  <option>Option</option>
</select>
```

**DESPUÉS:**
```html
<p class="text-description text-muted-dark text-xs">
  Text here
</p>
<select class="contact-input select-custom select-option-dark">
  <option>Option</option>
</select>
```

**Archivo creado:**
- `src/apps/main/public/css/inline-styles.css` - Clases CSS para todos los estilos inline anteriores

## Estructura de Archivos

```
src/apps/main/
├── public/
│   ├── js/
│   │   └── main.js                 ← TODO el código JavaScript
│   ├── css/
│   │   ├── index.css               ← Estilos originales de diseño
│   │   └── inline-styles.css       ← Nuevo: Clases para estilos inline
│   └── assets/
│
├── views/
│   └── index.ejs                   ← HTML refactorizado (sin inline scripts/styles)
│
└── server.js

src/shared/styles/
├── global.css                      ← Tailwind directives
└── output.css                      ← Compilado por Tailwind
```

## Funcionalidad Preservada

✅ **Menu móvil** - Funciona completamente sin inline handlers
✅ **Animaciones** - Todas preservadas (reveal, fade-up, pulse, etc.)
✅ **Contador de estadísticas** - Animación de números preservada
✅ **Header scroll** - Efecto de header al scroll preservado
✅ **Galería de servicios y portafolio** - Renderizado dinámico por JS
✅ **Formulario de contacto** - Validación y submit handler funcional
✅ **Cursor personalizado** - Control completo desde JS (si existe elemento cursor)
✅ **Tailwind CSS** - Completamente integrado y funcional

## Testing CSP Compliance

### 1. Verificar consola del navegador
Al cargar la página, no debe haber errores de CSP. Abre las DevTools (F12) y busca mensajes rojos.

### 2. Verificar headers HTTP
```bash
curl -i http://localhost:3000 | grep -i "content-security-policy"
```

### 3. Prueba manual de funcionalidad

- [ ] Menu móvil abre/cierra correctamente
- [ ] Botón Admin muestra alert
- [ ] Scroll muestra efecto en header
- [ ] Contadores animan números
- [ ] Formulario se envía y cambia estado
- [ ] Smooth scroll en links (#about, #services, etc.)
- [ ] Reveal animations se activan al scroll
- [ ] Portfolio items muestran overlay en hover

## Notas de Seguridad

1. **Sin 'unsafe-inline'** - No hay excepciones para scripts o estilos inline
2. **Sin eval()** - No se ejecuta código dinámico misterioso
3. **Imports externos limitados** - Solo Google Fonts (CSS + fuentes)
4. **Imagenes externas permitidas** - Necesario para hero y portfolio images
5. **CORS seguro** - Los scripts se sirven desde 'self'

## Migración a Producción

Cuando despliegues:

1. **Configura CSP headers** en tu servidor (nginx.prod.conf o Renderprops)
2. **Activa HTTPS** - CSP funciona mejor con protocolo seguro
3. **Verifica compilación de assets** - Asegúrate que `/styles/output.css` se genera
4. **Monitor de CSP violations** - Usa report-uri para reportar violaciones

## Troubleshooting

### "Script error: main.js not found"
- Verifica que el archivo existe en `src/apps/main/public/js/main.js`
- Asegúrate de que Express sirve `/public` correctamente

### "Styles not applied"
- Verifica que `inline-styles.css` está linkeado en el `<head>`
- Checa orden de CSS: Tailwind → index.css → inline-styles.css

### "CSP violation: The page attempted to load content from X"
- Revisa la consola para ver qué URL fue bloqueada
- Valida que la URL esté en la whitelist de CSP directives

## Referencias

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Helmet.js - CSP Middleware](https://helmetjs.github.io/)
- [OWASP: CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

**Autor**: GitHub Copilot
**Fecha**: March 21, 2026
**Versión**: 1.0
