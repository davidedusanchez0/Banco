import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerenteService } from '../../../core/services/gerente.service';

@Component({
  selector: 'app-nuevo-empleado',
  templateUrl: './nuevo-empleado.component.html',
  styleUrls: ['./nuevo-empleado.component.css']
})
export class NuevoEmpleadoComponent {

  formulario: FormGroup;
  creando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private gerenteService: GerenteService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      apellidos: ['', [Validators.required, Validators.maxLength(200)]],
      dui: ['', [Validators.required, Validators.maxLength(20)]],
      genero: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      usuario: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', [Validators.required, Validators.maxLength(50)]],
      sucursal: ['', [Validators.required]],
      estado: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  volver(): void {
    this.router.navigate(['/gerente/dashboard']);
  }

  submit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Por favor complete los campos obligatorios.';
      return;
    }

    this.creando = true;
    this.error = '';
    this.exito = '';

    const { nombres, apellidos, dui, genero, direccion, usuario, password, rol, sucursal, estado } = this.formulario.value;
    
    this.gerenteService.crearEmpleado({
      nombre: nombres,
      apellidos,
      dui,
      genero,
      direccion,
      usuario,
      password,
      rol,
      sucursalId: parseInt(sucursal) || 0,
      estado
    }).subscribe({
      next: () => {
        this.creando = false;
        this.exito = 'Empleado creado correctamente.';
        this.formulario.reset();
        setTimeout(() => {
          this.volver();
        }, 2000);
      },
      error: err => {
        this.creando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No fue posible crear el empleado.';
        this.error = `Error${status}${url}: ${detalle}`;
      }
    });
  }

  mostrarCampoInvalido(campo: string): boolean {
    const ctrl = this.formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}

