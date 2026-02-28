import { describe, test, expect } from "vitest";
import { serializeDocument, deserializeDocument } from "./bloomFile";

describe("bloomFile", () => {
  test("serializes a document to bloom JSON format", () => {
    const doc = {
      content: { type: "doc", content: [] },
      title: "My Post",
      subtitle: "",
      createdAt: "2026-02-21T00:00:00.000Z",
      modifiedAt: "2026-02-21T01:00:00.000Z",
      tags: ["draft"],
      status: "draft" as const,
    };

    const json = serializeDocument(doc);
    const parsed = JSON.parse(json);

    expect(parsed.content).toEqual({ type: "doc", content: [] });
    expect(parsed.title).toBe("My Post");
    expect(parsed.createdAt).toBe("2026-02-21T00:00:00.000Z");
    expect(parsed.modifiedAt).toBe("2026-02-21T01:00:00.000Z");
    expect(parsed.tags).toEqual(["draft"]);
    expect(parsed.status).toBe("draft");
  });

  test("deserializes bloom JSON back to a document object", () => {
    const json = JSON.stringify({
      content: { type: "doc", content: [] },
      title: "My Post",
      createdAt: "2026-02-21T00:00:00.000Z",
      modifiedAt: "2026-02-21T01:00:00.000Z",
      tags: ["draft"],
      status: "draft",
    });

    const doc = deserializeDocument(json);

    expect(doc.content).toEqual({ type: "doc", content: [] });
    expect(doc.title).toBe("My Post");
    expect(doc.createdAt).toBe("2026-02-21T00:00:00.000Z");
    expect(doc.modifiedAt).toBe("2026-02-21T01:00:00.000Z");
    expect(doc.tags).toEqual(["draft"]);
    expect(doc.status).toBe("draft");
  });

  test("throws descriptive error when bloom JSON is malformed", () => {
    expect(() => deserializeDocument("not valid json{")).toThrow(/Failed to parse bloom file/);
  });

  test("fills default values for missing fields", () => {
    const json = JSON.stringify({ content: { type: "doc", content: [] } });

    const doc = deserializeDocument(json);

    expect(doc.title).toBe("Untitled");
    expect(doc.tags).toEqual([]);
    expect(doc.status).toBe("draft");
    expect(doc.createdAt).toBeTruthy();
    expect(doc.modifiedAt).toBeTruthy();
  });

  test("preserves unknown fields during round-trip", () => {
    const json = JSON.stringify({
      content: { type: "doc", content: [] },
      title: "My Post",
      createdAt: "2026-02-21T00:00:00.000Z",
      modifiedAt: "2026-02-21T01:00:00.000Z",
      tags: [],
      status: "draft",
      futureFeature: true,
    });

    const doc = deserializeDocument(json);
    const reserialized = serializeDocument(doc);
    const parsed = JSON.parse(reserialized);

    expect(parsed.futureFeature).toBe(true);
  });
});
