import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerenteService } from '../../../core/services/gerente.service';

@Component({
  selector: 'app-gestion-personal',
  templateUrl: './gestion-personal.component.html',
  styleUrls: ['./gestion-personal.component.css']
})
export class GestionPersonalComponent {

  formularioBusqueda: FormGroup;
  formularioModificacion: FormGroup;
  buscando = false;
  modificando = false;
  error = '';
  exito = '';
  empleado: any = null;

  constructor(
    private fb: FormBuilder,
    private gerenteService: GerenteService,
    private router: Router
  ) {
    this.formularioBusqueda = this.fb.group({
      idEmpleado: ['', [Validators.required]]
    });

    this.formularioModificacion = this.fb.group({
      rol: ['', [Validators.required]],
      sucursal: ['', [Validators.required]],
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
    this.empleado = null;

    const idEmpleado = this.formularioBusqueda.get('idEmpleado')?.value;

    this.gerenteService.buscarEmpleado(idEmpleado).subscribe({
      next: (empleado) => {
        this.buscando = false;
        this.empleado = empleado;
        // Prellenar formulario de modificación
        this.formularioModificacion.patchValue({
          rol: empleado.rol || '',
          sucursal: empleado.sucursalId?.toString() || '',
          estado: empleado.estado || ''
        });
      },
      error: err => {
        this.buscando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No se encontró el empleado.';
        this.error = `Error${status}${url}: ${detalle}`;
        this.empleado = null;
      }
    });
  }

  modificar(): void {
    if (this.formularioModificacion.invalid || !this.empleado) {
      this.formularioModificacion.markAllAsTouched();
      return;
    }

    this.modificando = true;
    this.error = '';
    this.exito = '';

    const { rol, sucursal, estado } = this.formularioModificacion.value;

    this.gerenteService.modificarEmpleado(this.empleado.id, {
      rol,
      sucursalId: parseInt(sucursal) || 0,
      estado
    }).subscribe({
      next: (empleadoActualizado) => {
        this.modificando = false;
        this.exito = 'Empleado modificado correctamente.';
        this.empleado = empleadoActualizado;
        // Actualizar formulario con nuevos valores
        this.formularioModificacion.patchValue({
          rol: empleadoActualizado.rol || '',
          sucursal: empleadoActualizado.sucursalId?.toString() || '',
          estado: empleadoActualizado.estado || ''
        });
      },
      error: err => {
        this.modificando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No fue posible modificar el empleado.';
        this.error = `Error${status}${url}: ${detalle}`;
      }
    });
  }

  mostrarCampoInvalido(campo: string, formulario: FormGroup): boolean {
    const ctrl = formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}

