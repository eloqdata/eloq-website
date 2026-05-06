/**
 * Blog MDX modules expose `default` (the component) plus `metadata`, `frontMatter`,
 * etc. Docusaurus merges those onto `default` in ComponentCreator using
 * Object.keys(loadedModule). With Rspack/Webpack ESM interop, those exports may
 * not be own/enumerable keys, so `metadata` never gets attached and
 * BlogPostProvider sees `content.metadata === undefined`.
 *
 * This normalizes either shape into a single callable component that carries
 * the blog post fields the theme expects.
 */
export function normalizeBlogPostModule(content) {
  if (!content) {
    return content;
  }
  if (typeof content.default === 'function') {
    const Comp = content.default;
    return Object.assign(Comp, {
      metadata: content.metadata ?? Comp.metadata,
      frontMatter: content.frontMatter ?? Comp.frontMatter,
      assets: content.assets ?? Comp.assets,
      toc: content.toc ?? Comp.toc,
    });
  }
  return content;
}
