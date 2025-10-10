/**
 * xhtml returns small case
 */
export function isTagName(node: Node, tagName: string): boolean {
  return (
    ((node as HTMLElement).tagName || '').toLowerCase() ===
    tagName.toLowerCase()
  )
}

export function parseDomFromPlainHtml(plainHtml: string): Document {
  return new DOMParser().parseFromString(plainHtml, 'text/html')
}
