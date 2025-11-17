
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
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      apellidos: ['', [Validators.required, Validators.maxLength(200)]],
      genero: ['', [Validators.required, Validators.maxLength(20)]],
      dui: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  volver(): void {
    this.router.navigate(['/dependiente/dashboard']);
  }

  submit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.creando = true;
    this.error = '';
    this.exito = '';

    const { nombres, apellidos, genero, dui } = this.formulario.value;
    this.dependienteService.crearCliente({
      nombre: nombres,
      apellidos,
      genero,
      dui
    }).subscribe({
      next: () => {
        this.creando = false;
        this.exito = 'Usuario creado correctamente.';
        this.formulario.reset();
      },
      error: err => {
        this.creando = false;
        this.error = err?.error?.error || err?.message || 'No fue posible crear el usuario.';
      }
    });
  }

  mostrarCampoInvalido(campo: string): boolean {
    const ctrl = this.formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}


