import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cajero-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  nombreCajero = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.nombreCajero = user?.nombre ?? 'Cajero';
  }

  irNuevoCliente(): void {
    this.router.navigate(['/cajero/nuevo-cliente']);
  }

  irAgregarDependientes(): void {
    // TODO: Implementar navegación
    console.log('Navegar a Agregar Dependientes');
  }

  irDepositosYRetiros(): void {
    // TODO: Implementar navegación
    this.router.navigate(['/cajero/deposito-retiro']);
  }

  irPrestamos(): void {
    // TODO: Implementar navegación
    this.router.navigate(['/cajero/prestamos']);
  }
}
