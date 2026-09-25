import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const templates = readdirSync(new URL('templates/', root), { recursive: true }).filter(name => name.endsWith('.hbs'));

test('every Craftworks section uses the Core title/subtitle header structure', () => {
  for (const file of templates) {
    const source = readFileSync(new URL(`templates/${file.replaceAll('\\', '/')}`, root), 'utf8');
    for (const match of source.matchAll(/<([\w-]+)\b[^>]*class="[^"]*\bml-section-heading\b[^"]*"[^>]*>/g)) {
      assert.equal(match[1], 'div', `${file}: a heading class belongs on its container`);
      assert.match(source.slice(match.index + match[0].length), /^\s*<div>\s*<h2>[\s\S]*?<\/h2>\s*<p\b[^>]*>[\s\S]*?<\/p>\s*<\/div>/, `${file}: title and description must precede the divider`);
    }
    for (const match of source.matchAll(/class="([^"]*\bml-surface\b[^"]*)"([^>]*)>/g)) {
      assert.match(match[1], /\bml-stack\b/, `${file}: surfaces use Core spacing`);
      assert.match(match[2], /data-gap="3"/, `${file}: surfaces use the standard gap`);
    }
  }
});

test('every standalone Craftworks page uses the shared hero and documentation action', () => {
  for (const file of templates.filter(name => !name.includes('partials'))) {
    const source = readFileSync(new URL(`templates/${file}`, root), 'utf8');
    assert.match(source, /<header class="ml-hero">[\s\S]*?ml-hero__icon[\s\S]*?ml-hero__body[\s\S]*?<h1>/, file);
    assert.match(source, /data-action="open-(?:module-)?documentation"/, file);
    assert.doesNotMatch(source, /<h[23] class="ml-section-heading/, file);
  }
});

test('Craftworks consumes Core theme and typography tokens', () => {
  for (const file of readdirSync(new URL('styles/features/', root)).filter(name => name.endsWith('.css'))) {
    const source = readFileSync(new URL(`styles/features/${file}`, root), 'utf8');
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|rgba?\(\s*\d/i, `${file}: theme colors belong in Core`);
    assert.doesNotMatch(source, /font-size:\s*[\d.]+(?:px|rem|em)\b/, `${file}: use the shared type scale`);
    assert.doesNotMatch(source, /var\(--color-/, `${file}: use Core semantic tokens`);
  }
});
