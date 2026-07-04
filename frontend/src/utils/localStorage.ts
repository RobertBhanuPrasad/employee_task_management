export const setItem = (key: string, value: any) => {
  if (value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getItem = (key: string) => {
  const item = localStorage.getItem(key);
  if (item === null || item === 'undefined') return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export const removeItem = (key: string) => localStorage.removeItem(key);
export const clear = () => localStorage.clear();
