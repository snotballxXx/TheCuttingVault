import { removeCookie } from './cookies';

export const isPasswordValid = (
    newPassword: string,
    oldPassword: string,
): boolean => {
    if (newPassword === oldPassword) return false;

    if (newPassword.length < 8) return false;

    return true;
};

export const removeUser = () => {
    saveValueToLocalStorage('user');
    saveValueToLocalStorage('authToken');
    removeCookie('refreshToken');
};

export const saveValueToLocalStorage = (
    key: string,
    value: string | null = null,
) => {
    if (value) {
        localStorage.setItem(key, value);
    } else {
        localStorage.removeItem(key);
    }
};

export const readValueFromLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const saveObjectToLocalStorage = (
    key: string,
    value: any | null = null,
) => {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.removeItem(key);
    }
};

export const readObjectFromLocalStorage = (key: string): any => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};
