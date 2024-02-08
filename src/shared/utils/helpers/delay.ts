export const delay = (ms: number, cb?: () => void) => new Promise(resolve => setTimeout(() => resolve(cb && cb()), ms));
