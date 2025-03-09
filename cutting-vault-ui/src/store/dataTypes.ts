export enum DialogResult {
    'ok',
    'cancel',
}

export type User = {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    changePassword: boolean;
};

export type Customer = {
    id: number;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    email: string | null;
    barcode: string | null;
    street: string | null;
    town: string | null;
    suburb: string | null;
    comment: string | null;
    loyaltyCount: number;
    lastLoyaltyCountUpdate: Date | null;
    lastUpdate: Date;
};

export type PagedSet<T> = {
    page: Array<T>;
    totalCount: number;
    pageNumber: number;
    itemsPerPage: number;
};

export interface UserLoginRequest {
    password: string;
    userName: string;
}

export interface RefreshResponse {
    token: string;
}

export interface UserLoginResponse {
    user: User;
    token: string;
}

export interface ChangePasswordRequest {
    userName: string;
    newPassword: string;
    oldPassword: string;
}
