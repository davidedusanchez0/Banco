export interface Movimiento {
  id: number;
  tipoMovimiento: string;
  monto: number;
  fecha: string;
  descripcion?: string;
  numeroCuenta?: string;
  clienteNombre?: string;
}
