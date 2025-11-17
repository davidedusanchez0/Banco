import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GerenteService } from '../../../core/services/gerente.service';

@Component({
  selector: 'app-gestion-personal',
  templateUrl: './gestion-personal.component.html',
  styleUrls: ['./gestion-personal.component.css']
})
export class GestionPersonalComponent {

  formBuscar: FormGroup;
  empleado: any | null = null;
  cargando = false;
  guardando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private gerenteService: GerenteService
  ) {
    this.formBuscar = this.fb.group({
      idEmpleado: ['', [Validators.required]]
    });
  }

  buscarPorId() {
    if (this.formBuscar.invalid) {
      this.formBuscar.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.error = '';
    this.exito = '';
    this.empleado = null;

    const id = Number(this.formBuscar.value.idEmpleado);
    this.gerenteService.getEmpleadoById(id).subscribe({
      next: (resp: any) => {
        this.cargando = false;
        this.empleado = resp;
      },
      error: (err: any) => {
        this.cargando = false;
        this.error = err?.error?.error || err?.message || 'Empleado no encontrado.';
      }
    });
  }

  guardarCambios() {
    if (!this.empleado || !this.empleado.id) return;
    this.guardando = true;
    this.error = '';
    this.exito = '';

    // construir payload con los campos editables
    const payload = {
      nombre: this.empleado.nombre,
      apellidos: this.empleado.apellidos,
      puesto: this.empleado.puesto,
      salario: this.empleado.salario,
      estado: this.empleado.estado,
      usuario: this.empleado.usuario
    };

    this.gerenteService.actualizarEmpleado(this.empleado.id, payload).subscribe({
      next: (resp: any) => {
        this.guardando = false;
        this.empleado = resp;
        this.exito = 'Empleado actualizado correctamente.';
      },
      error: (err: any) => {
        this.guardando = false;
        this.error = err?.error?.error || err?.message || 'Error al guardar.';
      }
    });
  }

  desactivar() {
    if (!this.empleado || !this.empleado.id) return;
    this.guardando = true;
    this.error = '';
    this.exito = '';

    this.gerenteService.desactivarEmpleado(this.empleado.id).subscribe({
      next: (resp: any) => {
        this.guardando = false;
        this.empleado = resp;
        this.exito = 'Empleado desactivado.';
      },
      error: (err: any) => {
        this.guardando = false;
        this.error = err?.error?.error || err?.message || 'Error al desactivar.';
      }
    });
  }
}