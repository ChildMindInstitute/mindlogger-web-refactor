interface LocalStorageServiceOutput {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clearStorage: () => void;
}

const createLocalStorageService = (): LocalStorageServiceOutput => {
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  const clearStorage = () => {
    localStorage.clear();
  };

  const getItem = (key: string) => {
    return localStorage.getItem(key);
  };

  return {
    getItem,
    setItem,
    removeItem,
    clearStorage,
  };
};

export const localStorageService = createLocalStorageService();
