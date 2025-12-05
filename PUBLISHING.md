# 📦 Guía de Publicación en npm

Esta guía te ayudará a publicar el paquete `@coderoycc/bottom-sheet-wrappers` en npm con soporte completo de TypeScript.

## ✅ Prerequisitos

Antes de publicar, asegúrate de tener:

1. **Cuenta en npm**: Si no tienes una, créala en [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI autenticado**: Ejecuta `npm login` y proporciona tus credenciales
3. **Repositorio Git**: El código debe estar en GitHub (ya configurado en package.json)
4. **Licencia**: Ya tienes MIT configurada ✓

## 🔍 Verificación Pre-Publicación

### 1. Verificar que el build funciona correctamente

```bash
npm run build
```

Esto debe generar en `dist/`:
- ✅ `bottom-sheet-wrappers.es.js` - Módulo ES
- ✅ `bottom-sheet-wrappers.umd.js` - Módulo UMD
- ✅ `bottom-sheet-wrappers.css` - Estilos
- ✅ `index.d.ts` - Tipos de TypeScript

### 2. Verificar los tipos de TypeScript

Revisa que `dist/index.d.ts` contenga todas las exportaciones:

```bash
Get-Content dist\index.d.ts
```

Debe incluir:
- `BottomSheet` (componente)
- `BottomSheetProps`
- `SheetSize`, `SheetMode`
- `SheetOptions`, `SheetInstance`, `SheetState`
- `GestureState`, `BottomSheetMetadata`

### 3. Verificar qué archivos se publicarán

```bash
npm pack --dry-run
```

Esto mostrará exactamente qué archivos se incluirán en el paquete publicado.

## 📝 Proceso de Publicación

### Paso 1: Actualizar la versión

Usa [Semantic Versioning](https://semver.org/):

```bash
# Para un patch (0.1.0 -> 0.1.1) - correcciones de bugs
npm version patch

# Para un minor (0.1.0 -> 0.2.0) - nuevas características
npm version minor

# Para un major (0.1.0 -> 1.0.0) - cambios que rompen compatibilidad
npm version major
```

Esto automáticamente:
- Actualiza `package.json`
- Crea un commit de git
- Crea un tag de git

### Paso 2: Publicar en npm

```bash
npm publish --access public
```

> **Nota**: El flag `--access public` es necesario para paquetes con scope (@coderoycc)

### Paso 3: Push a GitHub

```bash
git push && git push --tags
```

## 🎯 Primera Publicación

Si es la primera vez que publicas este paquete:

```bash
# 1. Asegúrate de estar autenticado
npm whoami

# 2. Verifica el nombre del paquete (debe estar disponible)
npm view @coderoycc/bottom-sheet-wrappers

# 3. Si el paquete no existe, puedes publicar
npm publish --access public
```

## 🔄 Actualizaciones Posteriores

Para publicar actualizaciones:

```bash
# 1. Haz tus cambios en el código
# 2. Actualiza la versión
npm version patch  # o minor/major según corresponda
# 3. Publica
npm publish
# 4. Push a GitHub
git push && git push --tags
```

## 🧪 Probar el Paquete Localmente

Antes de publicar, puedes probar el paquete localmente:

```bash
# En el directorio del paquete
npm pack

# Esto crea un archivo .tgz que puedes instalar en otro proyecto
# En otro proyecto:
npm install ../bottom-sheet-wrappers/coderoycc-bottom-sheet-wrappers-0.1.0.tgz
```

## 📋 Checklist de Publicación

- [ ] El build se completa sin errores (`npm run build`)
- [ ] Los archivos `.d.ts` se generan correctamente
- [ ] El `README.md` está actualizado con ejemplos de uso
- [ ] La versión en `package.json` es correcta
- [ ] Estás autenticado en npm (`npm whoami`)
- [ ] Has probado el paquete localmente
- [ ] El repositorio Git está actualizado
- [ ] Has ejecutado `npm publish --access public`
- [ ] Has hecho push de los tags a GitHub

## 🔧 Solución de Problemas

### Error: "You must be logged in to publish packages"

```bash
npm login
```

### Error: "You do not have permission to publish"

Verifica que el nombre del paquete no esté tomado o que tengas permisos sobre el scope `@coderoycc`.

### Los tipos no se generan

Verifica que `vite-plugin-dts` esté instalado:

```bash
npm install -D vite-plugin-dts
```

### Error en el build

Limpia el directorio `dist` y vuelve a intentar:

```bash
Remove-Item -Recurse -Force dist
npm run build
```

## 📚 Uso del Paquete Publicado

Una vez publicado, los usuarios podrán instalarlo:

```bash
npm install @coderoycc/bottom-sheet-wrappers
```

Y usarlo con soporte completo de tipos:

```typescript
import { BottomSheet, type BottomSheetProps } from '@coderoycc/bottom-sheet-wrappers'
import '@coderoycc/bottom-sheet-wrappers/dist/bottom-sheet-wrappers.css'
```

## 🎨 Importar Estilos

Los usuarios deben importar los estilos CSS:

```javascript
// En main.js o main.ts
import '@coderoycc/bottom-sheet-wrappers/dist/bottom-sheet-wrappers.css'
```

O en un archivo CSS:

```css
@import '@coderoycc/bottom-sheet-wrappers/dist/bottom-sheet-wrappers.css';
```

## 📊 Estadísticas del Paquete

Después de publicar, puedes ver las estadísticas en:
- npm: https://www.npmjs.com/package/@coderoycc/bottom-sheet-wrappers
- npm trends: https://npmtrends.com/@coderoycc/bottom-sheet-wrappers
- bundlephobia: https://bundlephobia.com/package/@coderoycc/bottom-sheet-wrappers
