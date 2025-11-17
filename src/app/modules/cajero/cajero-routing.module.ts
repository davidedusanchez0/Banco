import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'nuevo-cliente', loadChildren: () => import('./nuevo-cliente/nuevo-cliente.module').then(m => m.NuevoClienteModule) },
{ path: 'deposito-retiro', loadChildren: () => import('./deposito-retiro/deposito-retiro.module').then(m => m.DepositoRetiroModule) },
{ path: 'prestamos', loadChildren: () => import('./prestamos/prestamos.module').then(m => m.PrestamosModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajeroRoutingModule { }

