import { Component, OnInit } from '@angular/core';
import { DependienteService } from '../../../core/services/dependiente.service';
import { AuthService } from '../../../core/services/auth.service';
import { DependienteResumen } from '../../../core/models/dependiente-resumen.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dependiente-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  resumen: DependienteResumen | null = null;
  loading = false;
  error = '';

  constructor(
    private dependienteService: DependienteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = 'No se pudo identificar al usuario dependiente.';
      return;
    }

    this.cargarResumen(user.id);
  }

  private cargarResumen(dependienteId: number): void {
    this.loading = true;
    this.error = '';
    this.dependienteService.obtenerResumen(dependienteId).subscribe({
      next: resumen => {
        this.resumen = resumen;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.error || err?.message || 'No fue posible cargar la información.';
        this.loading = false;
      }
    });
  }

  get nombreDependiente(): string {
    if (this.resumen?.nombre) {
      return this.resumen.nombre;
    }
    const user = this.authService.getCurrentUser();
    return user?.nombre ?? 'Dependiente';
  }

  get comisionAcumulada(): number {
    return this.resumen?.comisionAcumulada ?? 0;
  }

  irCrearUsuario(): void {
    this.router.navigate(['/dependiente/crear-usuario']);
  }
}
