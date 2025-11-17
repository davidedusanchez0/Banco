export interface Transaccion {
  numeroCuenta: string;
  monto: number;
  dui?: string;
}

export interface CajeroTransaccion {
  numeroCuenta: string;
  monto: number;
  dui: string;
  cajeroId: number;
}

export interface DependienteTransaccion {
  numeroCuenta: string;
  monto: number;
  dependienteId: number;
}

