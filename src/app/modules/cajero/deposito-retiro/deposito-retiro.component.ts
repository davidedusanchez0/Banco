import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CajeroService } from '../../../core/services/cajero.service';

@Component({
  selector: 'app-deposito-retiro',
  templateUrl: './deposito-retiro.component.html',
  styleUrls: ['./deposito-retiro.component.css']
})
export class DepositoRetiroComponent {

  formBuscar: FormGroup;
  formTransaccion: FormGroup;

  cuentas: any[] = [];
  cuentaSeleccionada: any = null;

  buscando = false;
  procesando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private cajeroService: CajeroService,
    private router: Router
  ) {
    this.formBuscar = this.fb.group({
      dui: ['', [Validators.required]]
    });

    this.formTransaccion = this.fb.group({
      operacion: ['deposito', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  campoInvalido(form: FormGroup, campo: string): boolean {
    const c = form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  volver() {
    this.router.navigate(['/cajero/dashboard']);
  }

  buscarCliente() {
    if (this.formBuscar.invalid) {
      this.formBuscar.markAllAsTouched();
      return;
    }

    this.buscando = true;
    this.error = '';
    this.exito = '';
    this.cuentas = [];
    this.cuentaSeleccionada = null;

    const dui = this.formBuscar.value.dui;

    this.cajeroService.buscarCuentaPorDui(dui).subscribe({
      next: (data) => {
        this.buscando = false;

        // Si backend devuelve ClienteDTO con 'cuentas'
        if (data?.cuentas && Array.isArray(data.cuentas)) {
          this.cuentas = data.cuentas;
        }
        // Si por alguna razón devuelve directamente un array
        else if (Array.isArray(data)) {
          this.cuentas = data;
        } else {
          this.cuentas = [];
        }

        if (this.cuentas.length === 0) {
          this.error = "No se encontraron cuentas para este DUI.";
        }
      },
      error: (err) => {
        this.buscando = false;
        this.error = err?.error?.error || err?.error || err?.message || 'Error al buscar el cliente.';
      }
    });
  }

  seleccionarCuenta(cuenta: any) {
    this.cuentaSeleccionada = cuenta;
    this.error = '';
    this.exito = '';
  }

  procesar() {
    if (this.formTransaccion.invalid || !this.cuentaSeleccionada) return;

    this.procesando = true;
    this.error = '';
    this.exito = '';

    const dto = {
      numeroCuenta: this.cuentaSeleccionada.numeroCuenta,
      duiCliente: this.formBuscar.value.dui,
      monto: parseFloat(this.formTransaccion.value.monto)
    };

    const operacion = this.formTransaccion.value.operacion;

    const llamada = operacion === 'deposito'
      ? this.cajeroService.abonar(dto)
      : this.cajeroService.retirar(dto);

    llamada.subscribe({
      next: (resp:any) => {
        this.procesando = false;
        this.exito = resp.mensaje;
      },
      error: (err:any) => {
        this.procesando = false;
        this.error = err?.error?.error || "Ocurrió un error.";
      }
    });
  }
}
