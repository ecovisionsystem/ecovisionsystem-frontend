const allowedRoles = new Set(["admin", "researcher", "developer", "ecologist"]);

export function hasAllowedGroup(groups: unknown): boolean {
  return Array.isArray(groups) && groups.some(
    (group) => typeof group === "string" && allowedRoles.has(group.toLowerCase()),
  );
}
