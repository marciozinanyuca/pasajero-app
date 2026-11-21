---
name: pwa-responsiva-desde-prototipo
description: Convierte prototipos de Stitch u otras referencias visuales en una aplicación React responsive, instalable y mantenible como PWA. Úsala para desarrollar prototipos móviles para web o ampliar aplicaciones similares.
---

# PWA responsiva desde un prototipo

## Objetivo

Implementar el diseño de referencia como una aplicación web adaptable a escritorio, tablet y móvil, lista para instalar como PWA y sin depender de backend cuando el hosting será estático.

## Flujo de trabajo

1. Inspecciona el repositorio, AGENTS.md, package.json, configuración de build y archivos de despliegue antes de editar.
2. Revisa pantallas y estados del prototipo. Anota navegación, acciones, datos de ejemplo, paleta, tipografía, espaciado y comportamiento móvil.
3. Conserva el móvil como referencia funcional: empieza por pantallas estrechas y amplía a layouts de escritorio con breakpoints explícitos.
4. Implementa las vistas como componentes y estados coherentes. Mantén controles accesibles, áreas táctiles amplias y navegación equivalente en escritorio y móvil.
5. Si el hosting es estático, distingue las acciones demostrativas de las que requieren backend; no simules persistencia o servicios reales.
6. Configura manifiesto, registro del service worker e iconos locales. Cachea los archivos construidos y no almacenes respuestas privadas o sensibles.
7. Verifica que rutas y assets funcionen bajo el subpath del repositorio de GitHub Pages.
8. Ejecuta build de producción cuando esté autorizado y comunica los comandos de instalación, desarrollo y despliegue.

## Decisiones técnicas

- Respeta el framework y gestor de paquetes existentes. En proyectos nuevos, Vite con React y TypeScript es una base ligera.
- Separa transpilación y chequeo de tipos: vite build genera artefactos; tsc --noEmit o un script typecheck verifica tipos. No hagas depender Pages de un chequeo de tipos si no es necesario para generar el sitio.
- Ajusta el target de JavaScript al navegador mínimo requerido y revisa APIs/polyfills para dispositivos antiguos.
- Incluye iconos PNG de 192x192 y 512x512 en el manifiesto para compatibilidad de instalación; SVG puede ser adicional.
- Implementa el modo oscuro con variables CSS aplicadas a texto, superficies, bordes, estados y navegación. Persiste la preferencia localmente si corresponde.
- No incluyas secretos, tokens ni datos personales en el frontend estático.

## Responsive y accesibilidad

- En móvil, usa columna única, navegación adaptada al pulgar y controles amplios; no reduzcas simplemente el dashboard de escritorio.
- En escritorio, aprovecha el espacio con navegación lateral, columnas y jerarquía visual clara.
- Revisa foco, nombres accesibles, contraste, escalado de texto y prefers-reduced-motion.
- Evita colores de texto fijos que pierdan contraste al activar el tema oscuro.

## Entrega

Resume pantallas implementadas, comportamiento real y demostrativo, resultado de build y configuración pendiente. No afirmes que se probó en un dispositivo si no fue verificado allí.
