import { Customer } from '@/xata';
import axios from 'axios';

export const login = async (walletAddress: string) => {
    return axios.post<Customer>('/api/auth', { walletAddress });
}