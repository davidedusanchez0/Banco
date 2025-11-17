
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'nuevo-empleado', loadChildren: () => import('./nuevo-empleado/nuevo-empleado.module').then(m => m.NuevoEmpleadoModule) },
  { path: 'gestion-personal', loadChildren: () => import('./gestion-personal/gestion-personal.module').then(m => m.GestionPersonalModule) },
  { path: 'prestamos', loadChildren: () => import('./prestamos/prestamos.module').then(m => m.PrestamosModule) }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerenteRoutingModule { }

