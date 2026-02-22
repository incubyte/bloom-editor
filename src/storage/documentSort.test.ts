import { describe, test, expect } from "vitest";
import { sortByModified } from "./documentSort";

describe("sortByModified", () => {
  test("sorts documents by most recently modified first", () => {
    const docs = [
      { id: "old", title: "Old Post", modifiedAt: "2026-01-01T00:00:00.000Z", tags: [] },
      { id: "newest", title: "Newest Post", modifiedAt: "2026-02-20T00:00:00.000Z", tags: [] },
      { id: "middle", title: "Middle Post", modifiedAt: "2026-02-10T00:00:00.000Z", tags: [] },
    ];

    const sorted = sortByModified(docs);

    expect(sorted[0].id).toBe("newest");
    expect(sorted[1].id).toBe("middle");
    expect(sorted[2].id).toBe("old");
  });
});
