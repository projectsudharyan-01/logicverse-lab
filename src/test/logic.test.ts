import { describe, expect, it } from "vitest";

import { evaluateGate } from "@/lib/logic";

describe("Boolean gate evaluation", () => {
  it("AND is true only when both inputs are true", () => {
    expect(evaluateGate("AND", true, true)).toBe(true);
    expect(evaluateGate("AND", true, false)).toBe(false);
  });

  it("OR is true when either input is true", () => {
    expect(evaluateGate("OR", false, true)).toBe(true);
    expect(evaluateGate("OR", false, false)).toBe(false);
  });

  it("NOT flips input A regardless of input B", () => {
    expect(evaluateGate("NOT", false, false)).toBe(true);
    expect(evaluateGate("NOT", true, true)).toBe(false);
  });

  it("XOR is true when the two inputs differ", () => {
    expect(evaluateGate("XOR", true, false)).toBe(true);
    expect(evaluateGate("XOR", true, true)).toBe(false);
  });
});