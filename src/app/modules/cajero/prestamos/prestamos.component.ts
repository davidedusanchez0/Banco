import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CajeroService } from '../../../core/services/cajero.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {

  formBuscar: FormGroup;
  formSolicitud: FormGroup;

  cliente: any = null;
  cuentas: any[] = [];
  cuentaSeleccionada: any = null;

  // Valores que vienen del backend o se muestran en UI
  prestamoMaximo: number | null = null;
  interes: number | null = null;
  prestamoResult: any = null; // guarda la respuesta del POST (PrestamoDTO)

  buscando = false;
  procesando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private cajeroService: CajeroService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router
  ) {
    this.formBuscar = this.fb.group({
      dui: ['', [Validators.required]]
    });

    this.formSolicitud = this.fb.group({
      numeroCuenta: [{ value: '', disabled: true }],
      estado: [{ value: 'ESPERA', disabled: true }],
      monto: ['', [Validators.required, Validators.min(1)]]
    });
  }

  campoInvalido(form: FormGroup, campo: string): boolean {
    const c = form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  buscar() {
    if (this.formBuscar.invalid) {
      this.formBuscar.markAllAsTouched();
      return;
    }

    this.buscando = true;
    this.error = '';
    this.exito = '';
    this.cliente = null;
    this.cuentas = [];
    this.cuentaSeleccionada = null;

    const dui = this.formBuscar.value.dui;

    // Usar endpoint path: GET /cajero/cliente/{dui}
    this.clienteService.obtenerClientePorDuiPorPath(dui).subscribe({
      next: (clienteData: any) => {
        this.cliente = clienteData;

        // pedir criterio por salario
        const salario = Number(this.cliente?.salario ?? 0);
        if (salario > 0) {
          this.clienteService.obtenerCriterioPorSalario(salario).pipe(take(1)).subscribe({
            next: (criterio: any) => {
              // adaptar según DTO devuelto por backend
              this.prestamoMaximo = criterio?.montoMaximo ? Number(criterio.montoMaximo) : null;
              this.interes = criterio?.porcentajeInteres ? Number(criterio.porcentajeInteres) : null;
            },
            error: () => {
              // fallback si no existe endpoint o devuelve 404
              this.prestamoMaximo = salario * 10;
              this.interes = 5; // valor por defecto
            }
          });
        } else {
          this.prestamoMaximo = null;
          this.interes = null;
        }

        // luego obtener cuentas por DUI (mantener tu lógica)
        this.cajeroService.buscarCuentaPorDui(dui).subscribe({
          next: (cuentasData: any) => {
            this.buscando = false;
            this.cuentas = Array.isArray(cuentasData) ? cuentasData : [];
            if (this.cuentas.length > 0) {
              this.seleccionarCuenta(this.cuentas[0]);
            }
          },
          error: () => {
            this.buscando = false;
            this.cuentas = [];
          }
        });
      },
      error: (err: any) => {
        // reintentar sin caracteres no numéricos si 404
        if (err?.status === 404 && typeof dui === 'string' && /\D/.test(dui)) {
          const cleaned = dui.replace(/\D/g, '');
          this.clienteService.obtenerClientePorDuiPorPath(cleaned).subscribe({
            next: (clienteData2: any) => {
              this.formBuscar.patchValue({ dui: cleaned });
              this.cliente = clienteData2;
              this.cajeroService.buscarCuentaPorDui(cleaned).subscribe({
                next: (cuentasData2: any) => {
                  this.buscando = false;
                  this.cuentas = Array.isArray(cuentasData2) ? cuentasData2 : [];
                  if (this.cuentas.length > 0) {
                    this.seleccionarCuenta(this.cuentas[0]);
                  }
                },
                error: () => {
                  this.buscando = false;
                  this.cuentas = [];
                }
              });
            },
            error: (err2: any) => {
              this.buscando = false;
              this.error = err2?.error?.error || err2?.message || 'Cliente no encontrado.';
            }
          });
          return;
        }

        this.buscando = false;
        this.error = err?.error?.error || err?.message || 'Error al buscar el cliente.';
      }
    });
  }

  seleccionarCuenta(cuenta: any) {
    this.cuentaSeleccionada = cuenta;
    this.formSolicitud.patchValue({ numeroCuenta: cuenta.numeroCuenta });
    this.error = '';
    this.exito = '';
  }

  volver() {
    this.router.navigate(['/cajero/dashboard']);
  }

  crearSolicitud() {
    if (this.formSolicitud.invalid || !this.cliente || !this.cuentaSeleccionada) {
      this.formSolicitud.markAllAsTouched();
      this.error = 'Complete los datos y seleccione una cuenta.';
      return;
    }

    this.procesando = true;
    this.error = '';
    this.exito = '';
    this.prestamoResult = null;
    this.prestamoMaximo = null;
    this.interes = null;

    const monto = parseFloat(this.formSolicitud.get('monto')!.value);
    const cajeroId = this.authService.getCurrentUser()?.id;
    if (!cajeroId) {
      this.procesando = false;
      this.error = 'No se encontró el ID del cajero en sesión.';
      return;
    }

    const payload = {
      clienteId: this.cliente.id,
      cajeroId: cajeroId,
      monto: monto
    };

    this.cajeroService.solicitarPrestamo(payload).subscribe({
      next: (resp: any) => {
        this.procesando = false;
        this.prestamoResult = resp;
        // si el backend incluye criterio, usamos sus valores
        if (resp?.criterio?.montoMaximo) {
          this.prestamoMaximo = Number(resp.criterio.montoMaximo);
        }
        if (resp?.criterio?.porcentajeInteres) {
          this.interes = Number(resp.criterio.porcentajeInteres);
        }
        this.exito = 'Solicitud de préstamo creada (en espera).';
      },
      error: (err: any) => {
        this.procesando = false;
        this.error = err?.error?.error || err?.message || 'Error al crear la solicitud.';
      }
    });
  }

}
