export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  rolId?: number | null;
  sucursalId?: number | null;
  clienteId?: number | null;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  rol: string;
  rolId?: number | null;
  sucursalId?: number | null;
  clienteId?: number | null;
}

