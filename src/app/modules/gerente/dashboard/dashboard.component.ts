import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerente-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  nombreGerente = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.nombreGerente = user?.nombre ?? 'Gerente';
  }

  irNuevoEmpleado(): void {
    // TODO: Implementar navegación
   this.router.navigate(['/gerente/nuevo-empleado']);
  }

  irGestionPersonal(): void {
    // TODO: Implementar navegación
    this.router.navigate(['/gerente/gestion-personal']);
  }

  irPrestamos(): void {
    // TODO: Implementar navegación
    console.log('Navegar a Préstamos');
  }
}

