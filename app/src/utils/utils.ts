export function toCamelCase(selector: string): string {
  return selector.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
