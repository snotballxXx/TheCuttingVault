// src/utils/cookies.ts
import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, days: number) => {
    const expires = days ? days : 7; // Default to 7 days if not specified
    Cookies.set(name, value, { expires });
};

export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

export const removeCookie = (name: string) => {
    // Remove the cookie by setting its expiration date to a past date
    Cookies.remove(name);
};
