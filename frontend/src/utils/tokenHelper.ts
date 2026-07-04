import { setItem, getItem, removeItem } from './localStorage';

export const setToken = (token: string) => setItem('token', token);
export const getToken = (): string | null => getItem('token');
export const removeToken = () => removeItem('token');
