import { UsersResponse } from '../types/User';

const API_KEY = '930279b0';
const BASE_URL = 'https://my.api.mockaroo.com/users.json';

export async function fetchUsers(page: number = 1): Promise<UsersResponse> {
  const response = await fetch(`${BASE_URL}?page=${page}&key=${API_KEY}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  
  return response.json();
}
