import { describe, it, expect } from "vitest";
import { generateSlug } from "./utils";

describe("generateSlug", () => {
  it("lowercases the input", () => {
    expect(generateSlug("London City Runners")).toBe("london-city-runners");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("bondi beach runners")).toBe("bondi-beach-runners");
  });

  it("strips non-alphanumeric characters except hyphens", () => {
    expect(generateSlug("Bondi Beach Runners!")).toBe("bondi-beach-runners");
  });

  it("collapses multiple hyphens into one", () => {
    expect(generateSlug("run--club")).toBe("run-club");
  });

  it("trims leading and trailing hyphens", () => {
    expect(generateSlug("-cool runners-")).toBe("cool-runners");
  });

  it("handles special characters in names", () => {
    expect(generateSlug("O'Brien's Run Club")).toBe("obriens-run-club");
  });

  it("handles numbers", () => {
    expect(generateSlug("Run Club 5K")).toBe("run-club-5k");
  });
});
