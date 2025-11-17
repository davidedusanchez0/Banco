import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CajeroService } from '../../../core/services/cajero.service';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent {

  formulario: FormGroup;
  creando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private cajeroService: CajeroService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      apellidos: ['', [Validators.required, Validators.maxLength(200)]],
      dui: ['', [Validators.required, Validators.maxLength(20)]],
      genero: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      salario: ['', [Validators.required, Validators.min(0)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      estadoCivil: ['', [Validators.required, Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  volver(): void {
    this.router.navigate(['/cajero/dashboard']);
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

    const { nombres, apellidos, dui, genero, direccion, salario, correo, estadoCivil, fechaNacimiento, usuario, password } = this.formulario.value;
    
    this.cajeroService.crearCliente({
      nombre: nombres,
      apellidos,
      dui,
      genero,
      direccion,
      salario: parseFloat(salario) || 0,
      correo,
      estadoCivil,
      fechaNacimiento,
      usuario,
      password
    }).subscribe({
      next: () => {
        this.creando = false;
        this.exito = 'Cliente creado correctamente.';
        this.formulario.reset();
        setTimeout(() => {
          this.volver();
        }, 2000);
      },
      error: err => {
        this.creando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No fue posible crear el cliente.';
        this.error = `Error${status}${url}: ${detalle}`;
      }
    });
  }

  mostrarCampoInvalido(campo: string): boolean {
    const ctrl = this.formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}

