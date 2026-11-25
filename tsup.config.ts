import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { defineConfig } from 'tsup';

function isBaseNode(node: postcss.ChildNode): boolean {
  if (node.type === 'rule') {
    const sel = node.selector.replace(/\s+/g, '');
    if (
      sel === ':root' ||
      sel === ':where(body)' ||
      sel === 'body' ||
      sel.includes('*:before') ||
      sel.includes('*::before')
    ) {
      return true;
    }
    if (
      (sel.includes('[data-theme=dark]') || sel.includes('[data-theme="dark"]')) &&
      node.nodes?.every((child) => child.type !== 'decl' || child.prop.startsWith('--eta-'))
    ) {
      return true;
    }
    return false;
  }

  if (
    node.type === 'atrule' &&
    node.name === 'media' &&
    node.params.includes('prefers-color-scheme')
  ) {
    return true;
  }

  return false;
}

function buildLayeredStylesheet(distDir: string) {
  const indexCssPath = path.join(distDir, 'index.css');
  if (!fs.existsSync(indexCssPath)) return;

  const rawCss = fs.readFileSync(indexCssPath, 'utf8');
  const root = postcss.parse(rawCss);

  const baseLayer = postcss.atRule({ name: 'layer', params: 'base' });
  const componentsLayer = postcss.atRule({ name: 'layer', params: 'components' });

  root.nodes.forEach((node) => {
    const cloned = node.clone();
    if (isBaseNode(node)) {
      baseLayer.append(cloned);
    } else {
      componentsLayer.append(cloned);
    }
  });

  const outRoot = postcss.root();
  outRoot.append(postcss.atRule({ name: 'layer', params: 'theme, base, components, utilities' }));
  if (baseLayer.nodes && baseLayer.nodes.length > 0) {
    outRoot.append(baseLayer);
  }
  if (componentsLayer.nodes && componentsLayer.nodes.length > 0) {
    outRoot.append(componentsLayer);
  }

  fs.writeFileSync(path.join(distDir, 'styles.layer.css'), outRoot.toString(), 'utf8');
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  banner: {
    js: '"use client";',
  },
  loader: {
    '.css': 'local-css',
  },
  esbuildOptions(options) {
    options.minifyWhitespace = true;
    options.minifySyntax = true;
    options.minifyIdentifiers = false;
  },
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  async onSuccess() {
    const distDir = path.resolve('dist');
    buildLayeredStylesheet(distDir);
  },
});
