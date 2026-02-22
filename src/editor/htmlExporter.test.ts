import { describe, test, expect } from "vitest";
import { cleanHtml } from "./htmlExporter";

describe("cleanHtml", () => {
  test("strips data attributes from Tiptap HTML", () => {
    const input = '<p data-pm-slice="1 1 []">Hello</p>';
    expect(cleanHtml(input)).toBe("<p>Hello</p>");
  });

  test("preserves semantic tags like strong, em, h1, ul, ol, li, pre, code, a, blockquote", () => {
    const input =
      "<h1>Title</h1><p><strong>Bold</strong> and <em>italic</em></p>" +
      "<ul><li>Item</li></ul><ol><li>One</li></ol>" +
      "<pre><code>code</code></pre>" +
      '<a href="https://example.com">Link</a>' +
      "<blockquote><p>Quote</p></blockquote>";

    const result = cleanHtml(input);

    expect(result).toContain("<h1>");
    expect(result).toContain("<strong>");
    expect(result).toContain("<em>");
    expect(result).toContain("<ul>");
    expect(result).toContain("<ol>");
    expect(result).toContain("<li>");
    expect(result).toContain("<pre>");
    expect(result).toContain("<code>");
    expect(result).toContain("<a ");
    expect(result).toContain("<blockquote>");
  });

  test("removes Tiptap wrapper classes", () => {
    const input =
      '<ul class="tiptap-bullet-list"><li class="tiptap-list-item"><p>Item</p></li></ul>';
    const result = cleanHtml(input);
    expect(result).not.toContain("class=");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>");
  });

  test("preserves href attributes on links", () => {
    const input =
      '<a href="https://example.com" class="tiptap-link" data-type="external">Link</a>';
    const result = cleanHtml(input);
    expect(result).toContain('href="https://example.com"');
    expect(result).not.toContain("class=");
    expect(result).not.toContain("data-");
  });
});
