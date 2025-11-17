import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerenteGeneralService } from '../../../core/services/gerente-general.service';

@Component({
  selector: 'app-nueva-sucursal',
  templateUrl: './nueva-sucursal.component.html',
  styleUrls: ['./nueva-sucursal.component.css']
})
export class NuevaSucursalComponent {

  formulario: FormGroup;
  creando = false;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private gerenteGeneralService: GerenteGeneralService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombreSucursal: ['', [Validators.required, Validators.maxLength(200)]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      estado: ['', [Validators.required, Validators.maxLength(20)]],
      idGerente: ['', [Validators.required]],
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      apellidos: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  volver(): void {
    this.router.navigate(['/gerente-general/dashboard']);
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

    const { nombreSucursal, direccion, telefono, estado, idGerente, nombres, apellidos } = this.formulario.value;
    
    this.gerenteGeneralService.crearSucursal({
      nombre: nombreSucursal,
      direccion,
      telefono,
      estado,
      gerenteId: parseInt(idGerente) || 0,
      gerenteNombre: nombres,
      gerenteApellidos: apellidos
    }).subscribe({
      next: () => {
        this.creando = false;
        this.exito = 'Sucursal creada correctamente.';
        this.formulario.reset();
        setTimeout(() => {
          this.volver();
        }, 2000);
      },
      error: err => {
        this.creando = false;
        const status = err?.status ? ` (${err.status})` : '';
        const url = err?.url ? ` en ${err.url}` : '';
        const detalle = err?.error?.error || err?.message || 'No fue posible crear la sucursal.';
        this.error = `Error${status}${url}: ${detalle}`;
      }
    });
  }

  mostrarCampoInvalido(campo: string): boolean {
    const ctrl = this.formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}

