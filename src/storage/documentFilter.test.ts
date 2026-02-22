import { describe, test, expect } from "vitest";
import { filterByTag, searchByTitle, collectTags } from "./documentFilter";

describe("filterByTag", () => {
  const docs = [
    { id: "1", title: "React Hooks", modifiedAt: "2026-02-21T00:00:00.000Z", tags: ["tech", "react"] },
    { id: "2", title: "My Vacation", modifiedAt: "2026-02-20T00:00:00.000Z", tags: ["personal"] },
    { id: "3", title: "Vue Guide", modifiedAt: "2026-02-19T00:00:00.000Z", tags: ["tech", "vue"] },
  ];

  test("filters documents by tag", () => {
    const result = filterByTag(docs, "tech");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("3");
  });

  test("returns all documents when no tag filter is applied", () => {
    expect(filterByTag(docs, null)).toHaveLength(3);
    expect(filterByTag(docs, undefined)).toHaveLength(3);
  });
});

describe("searchByTitle", () => {
  const docs = [
    { id: "1", title: "React Hooks Guide", modifiedAt: "2026-02-21T00:00:00.000Z", tags: ["tech"] },
    { id: "2", title: "Vue Composition API", modifiedAt: "2026-02-20T00:00:00.000Z", tags: ["tech"] },
    { id: "3", title: "React State Management", modifiedAt: "2026-02-19T00:00:00.000Z", tags: ["tech"] },
  ];

  test("filters documents by title search query", () => {
    const result = searchByTitle(docs, "react");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("3");
  });

  test("returns all documents when search query is empty", () => {
    expect(searchByTitle(docs, "")).toHaveLength(3);
    expect(searchByTitle(docs, "  ")).toHaveLength(3);
  });

  test("handles special characters in search query safely", () => {
    const docsWithSpecial = [
      { id: "1", title: "React (hooks)", modifiedAt: "2026-02-21T00:00:00.000Z", tags: [] },
      { id: "2", title: "Vue Guide", modifiedAt: "2026-02-20T00:00:00.000Z", tags: [] },
    ];

    expect(() => searchByTitle(docsWithSpecial, "react (hooks)")).not.toThrow();
    expect(searchByTitle(docsWithSpecial, "react (hooks)")).toHaveLength(1);
  });
});

describe("combined filter and search", () => {
  test("applies both tag filter and title search together", () => {
    const docs = [
      { id: "1", title: "React Hooks", modifiedAt: "2026-02-21T00:00:00.000Z", tags: ["tech"] },
      { id: "2", title: "React Recipes", modifiedAt: "2026-02-20T00:00:00.000Z", tags: ["personal"] },
      { id: "3", title: "Vue Guide", modifiedAt: "2026-02-19T00:00:00.000Z", tags: ["tech"] },
    ];

    const filtered = searchByTitle(filterByTag(docs, "tech"), "react");

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });
});

describe("collectTags", () => {
  test("collects unique tags from all documents", () => {
    const docs = [
      { id: "1", title: "A", modifiedAt: "2026-02-21T00:00:00.000Z", tags: ["tech", "react"] },
      { id: "2", title: "B", modifiedAt: "2026-02-20T00:00:00.000Z", tags: ["tech", "personal"] },
      { id: "3", title: "C", modifiedAt: "2026-02-19T00:00:00.000Z", tags: ["react"] },
    ];

    const tags = collectTags(docs);

    expect(tags).toEqual(["personal", "react", "tech"]);
  });
});
