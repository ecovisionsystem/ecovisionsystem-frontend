import { describe, expect, it } from "vitest";
import { hasAllowedGroup } from "./auth-roles";

describe("Cognito group authorization", () => {
  it("accepts the backend's lowercase roles and existing title-case groups", () => {
    for (const role of ["admin", "researcher", "developer", "ecologist"]) {
      expect(hasAllowedGroup(["unrelated", role])).toBe(true);
      expect(hasAllowedGroup([role.toUpperCase()])).toBe(true);
    }
  });

  it("rejects missing, malformed and unknown groups", () => {
    for (const groups of [undefined, null, "admin", [], [42, null, {}], ["guest"], [" admin"]]) {
      expect(hasAllowedGroup(groups)).toBe(false);
    }
  });
});
