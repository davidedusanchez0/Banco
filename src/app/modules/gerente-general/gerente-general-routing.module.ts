import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'nueva-sucursal', loadChildren: () => import('./nueva-sucursal/nueva-sucursal.module').then(m => m.NuevaSucursalModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerenteGeneralRoutingModule { }

