import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cuenta } from '../../../core/models/cuenta.model';
import { Movimiento } from '../../../core/models/movimiento.model';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent implements OnInit {

  cuentas: Cuenta[] = [];
  clienteId: number | null = null;
  cuentaSeleccionada: Cuenta | null = null;
  movimientos: Movimiento[] = [];
  depositos: Movimiento[] = [];
  retiros: Movimiento[] = [];
  transferencias: Movimiento[] = [];
  movimientosLoading = false;
  movimientosError = '';
  seccionActiva: 'depositos' | 'retiros' | 'transferencias' | null = 'retiros';
  loading = false;
  errorMessage = '';
  mostrarModalCrear = false;
  tipoCuentaSeleccionada: 'Cuenta Corriente' | 'Cuenta de Ahorro' = 'Cuenta Corriente';
  creandoCuenta = false;
  crearCuentaError = '';

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.clienteId = user?.clienteId ?? null;

    if (!this.clienteId) {
      this.errorMessage = 'No se pudo identificar al cliente.';
      return;
    }

    this.cargarCuentas();
  }

  verDetalle(cuenta: Cuenta): void {
    this.cuentaSeleccionada = cuenta;
    this.seccionActiva = 'retiros';
    this.movimientosLoading = true;
    this.movimientosError = '';
    this.resetMovimientos();

    if (!this.clienteId) {
      this.movimientosError = 'No se pudo identificar al cliente.';
      this.movimientosLoading = false;
      return;
    }

    this.clienteService.obtenerMovimientosCuenta(this.clienteId, cuenta.id).subscribe({
      next: movimientos => {
        this.movimientos = movimientos;
        this.clasificarMovimientos(movimientos);
        this.movimientosLoading = false;
      },
      error: err => {
        this.movimientosError = err?.message || 'No fue posible cargar los movimientos.';
        this.movimientosLoading = false;
      }
    });
  }

  cerrarDetalle(): void {
    this.cuentaSeleccionada = null;
    this.resetMovimientos();
    this.movimientosError = '';
    this.seccionActiva = 'retiros';
    this.movimientosLoading = false;
  }

  toggleSeccion(seccion: 'depositos' | 'retiros' | 'transferencias'): void {
    this.seccionActiva = this.seccionActiva === seccion ? null : seccion;
  }

  obtenerIconoSeccion(seccion: 'depositos' | 'retiros' | 'transferencias'): string {
    return this.seccionActiva === seccion ? '▼' : '▲';
  }

  obtenerMontoConSigno(movimiento: Movimiento): number {
    const monto = Number(movimiento.monto);
    const tipo = (movimiento.tipoMovimiento || '').toUpperCase();
    if (tipo === 'RETIRO' || tipo.includes('SALIDA')) {
      return -monto;
    }
    return monto;
  }

  get puedeCrearCuenta(): boolean {
    return this.cuentas.length < 3;
  }

  abrirModalCrearCuenta(): void {
    if (!this.puedeCrearCuenta) {
      return;
    }
    this.tipoCuentaSeleccionada = 'Cuenta Corriente';
    this.crearCuentaError = '';
    this.creandoCuenta = false;
    this.mostrarModalCrear = true;
  }

  cerrarModalCrearCuenta(): void {
    this.mostrarModalCrear = false;
    this.crearCuentaError = '';
    this.creandoCuenta = false;
  }

  seleccionarTipoCuenta(tipo: 'Cuenta Corriente' | 'Cuenta de Ahorro'): void {
    this.tipoCuentaSeleccionada = tipo;
  }

  confirmarCreacionCuenta(): void {
    if (!this.clienteId) {
      this.crearCuentaError = 'No se pudo identificar al cliente.';
      return;
    }
    if (!this.puedeCrearCuenta) {
      this.crearCuentaError = 'Cada cliente puede tener como máximo 3 cuentas.';
      return;
    }

    this.creandoCuenta = true;
    this.crearCuentaError = '';

    this.clienteService.crearCuenta(this.clienteId, { tipoCuenta: this.tipoCuentaSeleccionada })
      .subscribe({
        next: cuenta => {
          this.creandoCuenta = false;
          this.cuentas = [...this.cuentas, cuenta].sort((a, b) => a.id - b.id);
          this.cerrarModalCrearCuenta();
        },
        error: err => {
          this.creandoCuenta = false;
          const mensaje = err?.error?.error || err?.message;
          this.crearCuentaError = mensaje || 'No fue posible crear la cuenta.';
        }
      });
  }

  private resetMovimientos(): void {
    this.movimientos = [];
    this.depositos = [];
    this.retiros = [];
    this.transferencias = [];
  }

  private cargarCuentas(): void {
    if (!this.clienteId) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.clienteService.obtenerCuentas(this.clienteId).subscribe({
      next: cuentas => {
        this.cuentas = cuentas;
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err?.error?.error || err?.message || 'No fue posible cargar las cuentas.';
        this.loading = false;
      }
    });
  }

  private clasificarMovimientos(movimientos: Movimiento[]): void {
    this.depositos = [];
    this.retiros = [];
    this.transferencias = [];

    movimientos.forEach(movimiento => {
      const tipo = (movimiento.tipoMovimiento || '').toUpperCase();
      if (tipo === 'DEPOSITO') {
        this.depositos.push(movimiento);
      } else if (tipo === 'RETIRO') {
        this.retiros.push(movimiento);
      } else if (tipo.includes('TRANSFER')) {
        this.transferencias.push(movimiento);
      } else {
        this.transferencias.push(movimiento);
      }
    });
  }
}
