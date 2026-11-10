import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;;

export interface Employee {
  _id?: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface PaginatedResponse {
  data: Employee[];
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
}

export const getEmployees = async (page = 1, limit = 10, search = '') => {
  const response = await axios.get<PaginatedResponse>(
    `${API_BASE_URL}/employees?page=${page}&limit=${limit}&search=${search}`
  );
  return response.data;
};

export const addEmployee = async (employee: Omit<Employee, '_id' | 'created_at'>) => {
  const response = await axios.post<Employee>(`${API_BASE_URL}/employees`, employee);
  return response.data;
};

export const updateEmployee = async (id: string, employee: Partial<Employee>) => {
  const response = await axios.put<Employee>(`${API_BASE_URL}/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/employees/${id}`);
  return response.data;
};