import { removeCookie } from "./cookies";

export const isPasswordValid = (
    newPassword: string,
    oldPassword: string,
): boolean => {
    if (newPassword === oldPassword) return false;

    if (newPassword.length < 8) return false;

    return true;
};


export const removeUser = () => {
    removeCookie('user');
    removeCookie('authToken');
    removeCookie('refreshToken');  
}