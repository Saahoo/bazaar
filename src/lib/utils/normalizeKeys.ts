function toCamel(s: string): string {
  return s.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function normalizeKeysToCamel<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeKeysToCamel(item)) as unknown as T;
  }

  if (isPlainObject(input)) {
    const obj = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const nk = toCamel(k);
      out[nk] = normalizeKeysToCamel(v as unknown);
    }
    return out as T;
  }

  return input;
}

export default normalizeKeysToCamel;
