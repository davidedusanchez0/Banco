import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerenteService } from '../../../core/services/gerente.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {

  formularioBusqueda: FormGroup;
  formularioModificacion: FormGroup;
  buscando = false;
  modificando = false;
  error = '';
  exito = '';
  prestamo: any = null;

  constructor(
    private fb: FormBuilder,
    private gerenteService: GerenteService,
    private router: Router
  ) {
    this.formularioBusqueda = this.fb.group({
      idPrestamo: ['', [Validators.required]]
    });

    this.formularioModificacion = this.fb.group({
      estado: ['', [Validators.required]]
    });
  }

  volver(): void {
    this.router.navigate(['/gerente/dashboard']);
  }

  buscar(): void {
    if (this.formularioBusqueda.invalid) {
      this.formularioBusqueda.markAllAsTouched();
      return;
    }

    this.buscando = true;
    this.error = '';
    this.exito = '';
    this.prestamo = null;

    const idPrestamo = this.formularioBusqueda.get('idPrestamo')?.value;

    this.gerenteService.buscarPrestamo(idPrestamo).subscribe({
      next: (prestamo) => {
        this.buscando = false;
        this.prestamo = prestamo;
        // Prellenar formulario de modificación
        this.formularioModificacion.patchValue({
          estado: prestamo.estado || ''
        });
      },
      error: err => {
        this.buscando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No se encontró el préstamo.';
        this.error = `Error${status}${url}: ${detalle}`;
        this.prestamo = null;
      }
    });
  }

  modificar(): void {
    if (this.formularioModificacion.invalid || !this.prestamo) {
      this.formularioModificacion.markAllAsTouched();
      return;
    }

    this.modificando = true;
    this.error = '';
    this.exito = '';

    const { estado } = this.formularioModificacion.value;

    this.gerenteService.modificarPrestamo(this.prestamo.id, {
      estado
    }).subscribe({
      next: (prestamoActualizado) => {
        this.modificando = false;
        this.exito = 'Préstamo modificado correctamente.';
        this.prestamo = prestamoActualizado;
        // Actualizar formulario con nuevo valor
        this.formularioModificacion.patchValue({
          estado: prestamoActualizado.estado || ''
        });
      },
      error: err => {
        this.modificando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No fue posible modificar el préstamo.';
        this.error = `Error${status}${url}: ${detalle}`;
      }
    });
  }

  mostrarCampoInvalido(campo: string, formulario: FormGroup): boolean {
    const ctrl = formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}

