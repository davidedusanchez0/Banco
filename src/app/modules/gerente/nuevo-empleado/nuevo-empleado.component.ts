import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerenteService } from '../../../core/services/gerente.service';
import { AuthService } from '../../../core/services/auth.service';

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

  // opciones para los combos (puedes reemplazar por datos cargados desde backend)
  puestos = [
    { label: 'Cajero', value: 'CAJERO', rolId: 1 },
    { label: 'Gerente de sucursal', value: 'GERENTE_SUCURSAL', rolId: 3 }
  ];
  estados = [
  { label: "Activo", value: true },
  { label: "Inactivo", value: false }
];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gerenteService: GerenteService,
    private authService: AuthService
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      puesto: [this.puestos[0].value, [Validators.required]],
      rolId: [this.puestos[0].rolId, [Validators.required]],
      estado: [this.estados[0].value, [Validators.required]],
      salario: [0, [Validators.required, Validators.min(0)]],
      usuario: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // cuando cambia el puesto actualiza rolId automáticamente
    this.formulario.get('puesto')!.valueChanges.subscribe(val => {
      const p = this.puestos.find(x => x.value === val);
      if (p) {
        this.formulario.patchValue({ rolId: p.rolId }, { emitEvent: false });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/gerente/dashboard']);
  }

  submit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.creando = true;
    this.error = '';
    this.exito = '';

    const f = this.formulario.value;
    // construimos payload segun AccionPersonalRegistroDTO esperado por el backend
    const gerenteId = this.authService.getCurrentUser()?.id ?? 1; // fallback a 1 si no hay sesión
    const payload = {
      nombre: f.nombre,
      puesto: f.puesto,
      salario: f.salario,
      rolId: f.rolId,
      gerenteSolicitanteId: gerenteId,
      
      usuario: f.usuario,
      password: f.password,
      estado: f.estado
    };

    // usamos el endpoint de solicitar-contratacion para persistir la solicitud/registro en la DB
    this.gerenteService.crearEmpleado(payload).subscribe({
      next: (resp: any) => {
        this.creando = false;
        this.exito = 'Solicitud de contratación enviada correctamente.';
        this.formulario.reset({
          puesto: this.puestos[0].value,
          rolId: this.puestos[0].rolId,
          estado: this.estados[0].value,
          salario: 0
        });
        setTimeout(() => this.volver(), 1000);
      },
      error: (err: any) => {
        this.creando = false;
        this.error = err?.error?.error || err?.message || 'Error al guardar.';
      }
    });
  }

  mostrarCampoInvalido(campo: string): boolean {
    const ctrl = this.formulario.get(campo);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}