export function cleanHtml(rawHtml: string): string {
  return rawHtml
    .replace(/\s*data-[\w-]+="[^"]*"/g, "")
    .replace(/\s*class="[^"]*"/g, "");
}
