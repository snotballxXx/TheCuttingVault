// src/services/api.ts
import axios from 'axios';
import { navigateTo } from './NavigationService';

import {
    ChangePasswordRequest,
    Customer,
    PageData,
    PagedSet,
    RefreshResponse,
    UserLoginRequest,
    UserLoginResponse,
} from '../store/dataTypes';
import { removeUser } from '../utils/utils';

// Create an Axios instance with default configuration
const apiClient = axios.create({
    baseURL: window.location.origin.includes('localhost')
        ? 'http://localhost:5187'
        : window.location.origin,
    timeout: 10000, // Request timeout in milliseconds
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            try {
                // Call a function to refresh the token
                console.log(`Token refresh:${JSON.stringify(error.response)}`);
                if (error.config.url !== '/api/v1/Auth/refresh-token') {
                    const newToken = await apiClient.post<RefreshResponse>(
                        '/api/v1/Auth/refresh-token',
                    );
                    error.config.headers['Authorization'] =
                        `Bearer ${newToken.data.token}`;
                    // Retry the original request with the new token
                    setAuthToken(newToken.data.token);
                    return axios(error.config);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                setAuthToken(null);
                removeUser();
                navigateTo('/login');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

// Function to set the Authorization header with the token
export const setAuthToken = (token: string | null) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export const login = async (userLogin: UserLoginRequest) => {
    const response = await apiClient.post<UserLoginResponse>(
        `/api/v1/Auth/login`,
        userLogin,
    );
    return response.data;
};

export const changePassword = async (changePwd: ChangePasswordRequest) => {
    await apiClient.put(`/api/v1/Auth/changePwd`, changePwd);
};

export const getCustomerPage = async (pageData: PageData) => {
    let queryString = `pageNumber=${pageData.pageNumber}&itemsPerPage=${pageData.itemsPerPage}&orderBy=${pageData.sortColumn}&ascending=${pageData.directionAsc}`;

    if (pageData.filters) {
        let filters = '';
        pageData.filters.forEach((e) => {
            if (e.value) filters += `${e.field}~${e.operator}~${e.value}@`;
            else filters += `${e.field}~${e.operator}~@`;
        });
        if (filters.length > 0) {
            queryString +=
                '&filters=' + filters.substring(0, filters.length - 1);
        }
    }

    const response = await apiClient.get<PagedSet<Customer>>(
        `/api/v1/customer?${queryString}`,
    );
    return response.data;
};

export const getCustomer = async (id: number) => {
    const response = await apiClient.get<Customer>(`/api/v1/customer/${id}`);
    return response.data;
};

export const createCustomer = async (customer: Customer) => {
    const response = await apiClient.post<Customer>(
        `/api/v1/customer`,
        customer,
    );
    return response.data;
};

export const updateCustomer = async (customer: Customer) => {
    const response = await apiClient.put<Customer>(
        `/api/v1/customer`,
        customer,
    );
    return response.data;
};

export const updateCustomerLoyalty = async (
    id: number,
    loyaltyCount: number,
) => {
    const response = await apiClient.put<Customer>(
        `/api/v1/customer/loyalty/${id}?value=${loyaltyCount}`,
    );
    return response.data;
};

export const updateCustomerComment = async (customer: Customer) => {
    const response = await apiClient.put<Customer>(
        `/api/v1/customer/comment`,
        customer,
    );
    return response.data;
};

export const deleteCustomer = async (ids: number[]) => {
    const response = await apiClient.delete(
        `/api/v1/customer/?ids=${ids.join('-')}`,
    );
    return response.data;
};

/*export const getUsers = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};*/

export default apiClient;
