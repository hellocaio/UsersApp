export interface User {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  gender: string;
  role: string;
}

export interface UsersResponse {
  total: number;
  page: number;
  count: number;
  numPages: number;
  entries: User[];
}
