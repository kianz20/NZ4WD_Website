export interface LoginResponse {
  message?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
  error?: string;
}
