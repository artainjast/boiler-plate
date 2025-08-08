function camelCase(str: string): string {
  return (
    str
      // Replace any sequence of non-alphanumeric or underscore/dash/space chars
      // with a single space, then split on whitespace.
      .replace(/[\W_]+/g, ' ')
      .split(' ')
      .filter(Boolean) // remove any empty strings
      .map((word, index) => {
        // Lowercase everything first
        const lower = word.toLowerCase();
        // For all words except the first, uppercase the first character
        return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join('')
  );
}

export function mapKeysDeep<T>(obj: T, fn: (key: string) => string = camelCase): unknown {
  if (Array.isArray(obj)) {
    return obj.map((val) => mapKeysDeep(val, fn));
  } else if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    Object.keys(obj as object).forEach((key) => {
      const transformedKey = fn(key);
      const val = (obj as Record<string, unknown>)[key];
      result[transformedKey] =
        val !== null && typeof val === 'object' ? mapKeysDeep(val, fn) : val;
    });
    return result;
  }
  return obj;
}
