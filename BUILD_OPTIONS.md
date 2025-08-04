# Build Options for HTML Duration Picker

## New Build Commands

### 1. Unminified Build (Recommended for debugging)
```bash
npm run build:unminified
```
- Creates `dist/html-duration-picker.js` (unminified)
- Preserves all code formatting and comments
- Includes CSS embedded in JavaScript
- Easier to debug but larger file size

### 2. Build with Source Maps
```bash
npm run build:sourcemap
```
- Creates `dist/html-duration-picker.min.js` (minified)
- Creates `dist/html-duration-picker.min.js.map` (source map)
- Allows debugging minified code in browser DevTools
- Browser will show original source code when debugging

### 3. Debug Build (Unminified + Source Maps)
```bash
npm run build:debug
```
- Creates `dist/html-duration-picker.js` (unminified)
- Creates `dist/html-duration-picker.js.map` (source map)
- Best for development and debugging
- Preserves comments AND provides source mapping

### 4. Standard Builds (existing)
```bash
npm run build         # Minified production build
npm run build:dev     # Development build
npm run build:full    # Production build with IE9+ support
```

## Usage in Production

For production debugging, you have two options:

1. **Use source maps**: Deploy both `.min.js` and `.min.js.map` files. Modern browsers will automatically use the source map for debugging.

2. **Use unminified temporarily**: Replace the minified file with the unminified version when debugging production issues.

## File Sizes Comparison

- Minified: ~10KB
- Unminified: ~25KB
- Source map: ~30KB

## Browser DevTools Support

When using source maps:
1. Open browser DevTools
2. Go to Sources/Debugger tab
3. Find `html-duration-picker.js` under webpack://
4. Set breakpoints in the original source code
5. Debug with full variable names and comments visible