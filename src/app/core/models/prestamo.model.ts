export interface Prestamo {
  id: number;
  clienteId: number;
  clienteNombre?: string;
  monto: number;
  plazoMeses: number;
  cuotaMensual: number;
  estado: string;
  fechaSolicitud: string;
  fechaAprobacion?: string;
}

export interface PrestamoSolicitud {
  clienteId: number;
  monto: number;
  cajeroId: number;
}

