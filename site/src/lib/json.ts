/**
 * Serialize data for embedding inside an HTML <script> element (JSON data
 * blocks and JSON-LD). Escapes characters that could close the element or
 * start markup, so text from metadata can never break out into HTML.
 */
const LINE_SEP = new RegExp('\\u2028', 'g');
const PARA_SEP = new RegExp('\\u2029', 'g');

export function scriptJson(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(LINE_SEP, '\\u2028')
    .replace(PARA_SEP, '\\u2029');
}
