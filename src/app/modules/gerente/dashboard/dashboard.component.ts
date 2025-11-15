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
    console.log('Navegar a Nuevo Empleado');
  }

  irGestionPersonal(): void {
    // TODO: Implementar navegación
    console.log('Navegar a Gestión Personal');
  }

  irPrestamos(): void {
    // TODO: Implementar navegación
    console.log('Navegar a Préstamos');
  }
}

