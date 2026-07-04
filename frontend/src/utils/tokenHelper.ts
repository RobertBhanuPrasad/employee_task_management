export const setRememberMeFlag = (rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('rememberMe');
  }
};

const getStorage = () => {
  return localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
};

export const setToken = (token: string, rememberMe?: boolean) => {
  if (rememberMe !== undefined) {
    setRememberMeFlag(rememberMe);
  }
  getStorage().setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const setUser = (user: any) => {
  getStorage().setItem('user', JSON.stringify(user));
};

export const getUser = (): any | null => {
  const item = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!item || item === 'undefined') return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

export const clearAuthStorage = () => {
  removeToken();
  removeUser();
  localStorage.removeItem('rememberMe');
};
