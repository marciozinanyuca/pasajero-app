# TransCorp · Portal del trabajador

Aplicación web responsive basada en el proyecto de Stitch **Prototipo - Trabajador (Usuario)**. Está construida con React y Vite, se puede publicar como sitio estático en GitHub Pages y ofrece instalación como PWA.

## Desarrollo local

```bash
npm ci
npm run dev
```

Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` construye el sitio al actualizar las ramas `main` o `master` y publica `dist` en GitHub Pages. En **Settings → Pages**, configura **Build and deployment → Source: GitHub Actions**. El build obtiene automáticamente el subpath del repositorio desde `GITHUB_REPOSITORY`.

## PWA y datos

La aplicación incluye manifiesto, iconos PNG de 192 y 512 px, registro de service worker y caché local de recursos del sitio. Tras cargar la app una vez, el shell y los recursos visitados pueden abrirse sin conexión. El navegador puede ofrecer la instalación de forma automática o desde el menú de instalación.

La navegación, reserva/cancelación de asiento, tema y nombre de perfil funcionan en el navegador y se guardan localmente. Los horarios, paraderos, conductor, placa y código QR son datos demostrativos. El seguimiento GPS, la validación real del pase, sincronización de reservas, autenticación y persistencia entre dispositivos requieren un backend, por lo que no se conectan desde esta publicación estática.
