---
name: deployment-confiable-github-pages-pwa
description: Configura y diagnostica el build y despliegue de sitios Vite/PWA en GitHub Pages, incluyendo subpaths, lockfiles, compatibilidad de navegador y GitHub Actions. Úsala al publicar una app estática o resolver errores de Actions.
---

# Deployment confiable en GitHub Pages

## Antes de cambiar

1. Inspecciona workflows, package.json, package-lock.json, Vite, manifiesto y salida de Actions.
2. Identifica commit, branch y attempt de la ejecución fallida. Los registros antiguos describen el código ejecutado entonces, no necesariamente el estado actual.
3. Reproduce el comando exacto localmente, empezando por npm ci y luego npm run build.
4. Diagnostica el primer error raíz; las sugerencias posteriores pueden ser genéricas.

## Dependencias y build

- Versiona package-lock.json y usa npm ci en Actions.
- No mezcles npm ci con npm install --no-save dentro del workflow. Corrige dependencias declaradas y regenera el lockfile.
- Mantén un build determinista. Para Vite, vite build crea la salida estática; ejecuta typecheck como paso independiente si se requiere.
- Si TypeScript no encuentra tipos, comprueba package.json, lockfile del commit del runner y configuración que pueda omitir dependencias de desarrollo.
- Evita latest en dependencias críticas del build; fija versiones y conserva el lockfile actualizado.
- Ejecuta npm ci y build después de cambios en dependencias o lockfile.

## Configuración de Pages

- Para un repositorio de proyecto, usa base /<nombre-repositorio>/; para un dominio raíz, usa /.
- Obtén el nombre real del repositorio desde GITHUB_REPOSITORY durante el build; no fijes accidentalmente el nombre de otro repositorio.
- Revisa rutas de assets, manifest, start_url, scope, iconos y registro del service worker bajo el subpath.
- Configura GitHub Pages con GitHub Actions como fuente.
- El workflow necesita permisos pages: write e id-token: write, subir dist como artifact y desplegarlo con actions/deploy-pages.
- Alinea el trigger con la rama principal real; no asumas que siempre se llama main.

## PWA y compatibilidad

- Confirma que manifest y service worker se generen en dist y funcionen en la URL publicada, no solo en localhost.
- Incluye iconos PNG 192x192 y 512x512 y verifica sus URLs bajo el subpath.
- Configura target JavaScript según el navegador mínimo. Un target moderno puede fallar en WebView antiguo aunque funcione en desktop.
- No garantices compatibilidad de sistemas antiguos sin conocer navegador, WebView, APIs requeridas y pruebas en dispositivo.
- Una PWA instalada conserva cache. Al diagnosticar actualizaciones, comprueba service worker, scope y cache antes de atribuirlo al código nuevo.

## Diagnóstico de Actions

- Inspecciona el intento más reciente y confirma su commit SHA y branch.
- Lee el comando de build impreso en los logs para saber qué script ejecutó el runner.
- Separa fallos de instalación, tipos, Vite, generación PWA, upload artifact y deploy.
- Un log de un intento anterior no cambia después de corregir el código; hace falta un nuevo commit o reejecutar el workflow en el commit corregido.
- Tras corregir, valida npm ci y build. Indica los pasos de commit/push si el usuario debe publicar el cambio; no afirmes que hubo despliegue si solo se compiló localmente.

## Workflow de referencia

Usa actions/checkout, actions/setup-node con una versión Node LTS soportada y cache npm, npm ci, build con base explícita, actions/upload-pages-artifact y actions/deploy-pages. Mantén permisos mínimos y fija las dependencias mediante lockfile.
