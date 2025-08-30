const store = window.localStorage; // swap to sessionStorage if you prefer

const withPrefix = (k: string) => `app:${k}`;
export const storage = {
  get<T = unknown>(key: string): T | null {
    const raw = store.getItem(withPrefix(key));
    return raw ? (JSON.parse(raw) as T) : null;
  },
  set<T = unknown>(key: string, value: T) {
    store.setItem(withPrefix(key), JSON.stringify(value));
  },
  remove(key: string) {
    store.removeItem(withPrefix(key));
  },
  clearAll() {
    Object.keys(store)
      .filter((k) => k.startsWith("app:"))
      .forEach((k) => store.removeItem(k));
  },
};
