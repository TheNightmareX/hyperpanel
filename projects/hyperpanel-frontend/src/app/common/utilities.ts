export function defineAccessor<T, K extends keyof T>(
  obj: T,
  key: K,
  config: { get: () => T[K]; set: (v: T[K]) => void },
): void {
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: config.get,
    set: config.set,
  });
}
