# 🚀 Guía de Deployment a GitHub Pages

## 📋 Configuración Completa

Se ha configurado el proyecto para desplegar automáticamente la demo en GitHub Pages usando GitHub Actions.

## 📁 Archivos Creados/Modificados

### 1. `.github/workflows/deploy.yml`
Workflow de GitHub Actions que:
- Se ejecuta automáticamente en cada push a `main`
- Usa Node.js 22
- Construye la demo del proyecto
- Despliega a GitHub Pages

### 2. `vite.config.js`
Actualizado para soportar dos modos de build:
- **Library build** (default): `npm run build` - Genera el paquete npm
- **Demo build**: `npm run build:demo` - Genera la demo para GitHub Pages

### 3. `package.json`
Agregado script: `"build:demo": "DEMO_BUILD=true vite build"`

### 4. `.gitignore`
Agregado `dist-demo` para excluir el directorio de build de la demo

## 🔧 Configuración en GitHub

### Paso 1: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**

### Paso 2: Actualizar el Base Path

En `vite.config.js`, línea 23, actualiza el base path con el nombre de tu repositorio:

```javascript
base: isDemoBuild ? '/bottom-sheet-wrappers/' : '/',
//                   ^^^^^^^^^^^^^^^^^^^^^^
//                   Reemplaza con el nombre de tu repo
```

**Ejemplo:** Si tu repo es `https://github.com/coderoycc/my-bottom-sheet`, usa:
```javascript
base: isDemoBuild ? '/my-bottom-sheet/' : '/',
```

## 🚀 Deployment

### Automático (Recomendado)

El deployment se ejecuta automáticamente cuando:
1. Haces push a la rama `main`
2. GitHub Actions ejecuta el workflow
3. La demo se despliega en GitHub Pages

```bash
git add .
git commit -m "feat: add GitHub Pages deployment"
git push origin main
```

### Manual

También puedes ejecutar el workflow manualmente:
1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow "Deploy to GitHub Pages"
3. Click en **Run workflow**

## 🧪 Probar Localmente

Antes de hacer push, puedes probar el build de la demo localmente:

```bash
# Build de la demo
npm run build:demo

# Preview de la demo
npx vite preview --outDir dist-demo
```

Esto iniciará un servidor local en `http://localhost:4173` con la demo.

## 📊 Estructura de Directorios

```
bottom-sheet-wrappers/
├── .github/
│   └── workflows/
│       └── deploy.yml          # ✅ GitHub Actions workflow
├── dist/                       # Build de la librería (npm)
├── dist-demo/                  # Build de la demo (GitHub Pages)
├── src/
│   ├── components/
│   │   └── BottomSheet.vue
│   ├── index.ts               # Entry point de la librería
│   └── main.ts                # Entry point de la demo
├── index.html                 # HTML de la demo
├── vite.config.js             # ✅ Configuración dual
└── package.json               # ✅ Script build:demo
```

## 🌐 URL de la Demo

Una vez desplegado, tu demo estará disponible en:

```
https://<tu-usuario>.github.io/<nombre-repo>/
```

**Ejemplo:**
```
https://coderoycc.github.io/bottom-sheet-wrappers/
```

## 🔍 Verificar el Deployment

1. Ve a la pestaña **Actions** en GitHub
2. Verifica que el workflow se ejecutó correctamente (✅ verde)
3. Click en el workflow para ver los detalles
4. En el job "deploy", encontrarás la URL de tu sitio

## 🛠️ Scripts Disponibles

```bash
# Desarrollo local
npm run dev

# Build de la librería (para npm)
npm run build

# Build de la demo (para GitHub Pages)
npm run build:demo

# Preview local
npm run preview
```

## ⚙️ Configuración del Workflow

El workflow en `.github/workflows/deploy.yml`:

```yaml
- Node.js: 22
- Trigger: Push a main o manual
- Build: npm run build:demo
- Output: dist-demo/
- Deploy: GitHub Pages
```

## 🔄 Actualizar la Demo

Para actualizar la demo después del deployment inicial:

1. Haz cambios en tu código
2. Commit y push a `main`
3. GitHub Actions automáticamente rebuildeará y redesplegarà

```bash
git add .
git commit -m "update: improve demo"
git push origin main
```

## 🐛 Troubleshooting

### La demo no se ve correctamente

**Problema:** Los assets no cargan (404)

**Solución:** Verifica que el `base` path en `vite.config.js` coincida con el nombre de tu repositorio.

### El workflow falla

**Problema:** Error en GitHub Actions

**Soluciones:**
1. Verifica que GitHub Pages esté habilitado en Settings
2. Asegúrate de que la fuente sea "GitHub Actions"
3. Revisa los logs del workflow en la pestaña Actions

### Cambios no se reflejan

**Problema:** Los cambios no aparecen en la demo

**Soluciones:**
1. Limpia el caché del navegador (Ctrl+Shift+R)
2. Espera unos minutos (GitHub Pages puede tardar)
3. Verifica que el workflow se ejecutó correctamente

## 📝 Notas Importantes

1. **Dos builds separados:**
   - `npm run build` → Librería para npm (dist/)
   - `npm run build:demo` → Demo para GitHub Pages (dist-demo/)

2. **Base path:**
   - Desarrollo local: `/`
   - GitHub Pages: `/nombre-repo/`

3. **Branches:**
   - El workflow se ejecuta en push a `main`
   - Puedes cambiar esto en `deploy.yml` si usas otra rama

## ✅ Checklist de Deployment

- [ ] Actualizar `base` path en `vite.config.js` con el nombre de tu repo
- [ ] Habilitar GitHub Pages en Settings → Pages
- [ ] Seleccionar "GitHub Actions" como source
- [ ] Push a la rama `main`
- [ ] Verificar que el workflow se ejecutó correctamente
- [ ] Visitar la URL de GitHub Pages para ver la demo

¡Tu demo estará disponible públicamente en GitHub Pages! 🎉
