import { describe, test, expect } from "vitest";
import { getExportFormats, registerExportFormat } from "./exportFormats";

describe("exportFormats", () => {
  test("default formats include Markdown and HTML", () => {
    const formats = getExportFormats();
    const names = formats.map((f) => f.name);

    expect(names).toContain("Markdown");
    expect(names).toContain("HTML");
  });

  test("registerExportFormat adds a custom format", () => {
    const before = getExportFormats().length;

    registerExportFormat({
      name: "Plain Text",
      extension: "txt",
      convert: (content) => content.text ?? "",
    });

    const after = getExportFormats();
    expect(after).toHaveLength(before + 1);

    const names = after.map((f) => f.name);
    expect(names).toContain("Plain Text");
  });
});
