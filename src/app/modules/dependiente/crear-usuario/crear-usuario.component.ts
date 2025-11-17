import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DependienteService } from '../../../core/services/dependiente.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {

  formulario: FormGroup;
  creando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private dependienteService: DependienteService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombreComercio: ['', [Validators.required, Validators.maxLength(200)]],
      usuario: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  volver(): void {
    this.router.navigate(['/dependiente/dashboard']);
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

    const { nombreComercio, usuario, password } = this.formulario.value;
    this.dependienteService.crearUsuario({
      nombreComercio,
      usuario,
      password
    }).subscribe({
      next: () => {
        this.creando = false;
        this.exito = 'Dependiente creado correctamente.';
        this.formulario.reset();
      },
      error: err => {
        this.creando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No fue posible crear el usuario.';
        this.error = `Error${status}${url}: ${detalle}`;
      }
    });
  }

  mostrarCampoInvalido(campo: string): boolean {
    const ctrl = this.formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}

