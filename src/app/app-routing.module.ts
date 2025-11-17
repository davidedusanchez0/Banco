import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'registro',
    loadChildren: () => import('./modules/cajero/nuevo-cliente/nuevo-cliente.module').then(m => m.NuevoClienteModule)
  },
  {
    path: 'cajero',
    loadChildren: () => import('./modules/cajero/cajero.module').then(m => m.CajeroModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dependiente',
    loadChildren: () => import('./modules/dependiente/dependiente.module').then(m => m.DependienteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gerente',
    loadChildren: () => import('./modules/gerente/gerente.module').then(m => m.GerenteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gerente-general',
    loadChildren: () => import('./modules/gerente-general/gerente-general.module').then(m => m.GerenteGeneralModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'cliente',
    loadChildren: () => import('./modules/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }