import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerente-general-dashboard',
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
    this.nombreGerente = user?.nombre ?? 'Gerente General';
  }

  irNuevaSucursal(): void {
    this.router.navigate(['/gerente-general/nueva-sucursal']);
  }

  irGestionPersonal(): void {
    // TODO: Implementar navegación
    console.log('Navegar a Gestión Personal');
  }

  irMovimientosGlobales(): void {
    // TODO: Implementar navegación
    console.log('Navegar a Movimientos Globales');
  }
}

