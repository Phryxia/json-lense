/**
 * Escape single quote and control characters to render properly to TypeScript
 * @param s
 * @returns safely cleansed type string
 */
export function escapeForTypeScript(s: string) {
  return s
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\b', '\\b')
    .replaceAll('\f', '\\f')
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '\\r')
    .replaceAll('\t', '\\t')
    .replaceAll('\v', '\\v')
}
