# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Build Commands
- `npm run build` - Production build with minification
- `npm run build:dev` - Development build without minification
- `npm run build:full` - Production build with IE9+ support
- `npm run build:unminified` - Production build without minification (for debugging)
- `npm run build:sourcemap` - Production build with source maps
- `npm run build:debug` - Unminified build with source maps

### Development Server
- `npm run dev` - Start webpack dev server on http://127.0.0.1:9000 (modern browsers)
- `npm run dev:full` - Start webpack dev server with IE9+ support

### Testing
- `npm run test` - Run all tests (ESLint + Jasmine)
- `npm run test:eslint` - Run ESLint only
- `npm run test:jasmine` - Run Jasmine tests only

### Deployment
- `npm run deploy` - Build and publish to npm

## Architecture Overview

### Core Library Structure
The library transforms native HTML text inputs into duration pickers without external dependencies. Key architectural points:

1. **Main Entry Point**: `src/html-duration-picker.js` - IIFE that exports the HtmlDurationPicker object
2. **Build System**: Webpack 5 with Babel for transpilation and browser compatibility
3. **Style Injection**: CSS from `src/style.css` is injected into the JS bundle via webpack configuration
4. **Distribution**: Outputs to `dist/` folder:
   - `html-duration-picker.min.js` - Minified production build
   - `html-duration-picker.js` - Unminified build (when using build:unminified)
   - Source maps when using build:sourcemap or build:debug

### Key Implementation Details
- The picker attaches to any input with class `html-duration-picker`
- Uses data attributes for configuration: `data-duration`, `data-duration-max`, `data-duration-min`, `data-hide-seconds`
- Cursor position detection determines which time unit (hours/minutes/seconds) to adjust
- Keyboard arrow keys increment/decrement the selected time unit
- The library adds IE9+ polyfills when needed
- **Empty Value Support**: This fork supports empty values (`--:--`) that return `""` when accessed

### Important Notes for Development
1. **Array Bounds Checking**: When splitting time values by `:`, always check if array elements exist before accessing their properties
   - Empty string `""` splits to `[""]` (only one element)
   - Normal values like `"01:30"` split to `["01", "30"]`
   - Always check `sectioned[1]` and `sectioned[2]` exist before accessing `.length`

2. **Windows Compatibility**: Build scripts are cross-platform compatible (no Unix-specific paths)

3. **Webpack CLI Syntax**: Uses modern webpack 5 syntax (`--env key=value` not `--env.key=value`)

### Testing Approach
- Unit tests use Jasmine framework (spec files in `spec/`)
- Tests run against the development build
- ESLint configured with Google style guide + custom rules in `.eslintrc.json`
- When testing empty value handling, ensure to test rapid clicking and typing scenarios