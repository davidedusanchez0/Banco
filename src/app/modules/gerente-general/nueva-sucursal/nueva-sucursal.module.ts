import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NuevaSucursalComponent } from './nueva-sucursal.component';

const routes: Routes = [
  { path: '', component: NuevaSucursalComponent }
];

@NgModule({
  declarations: [NuevaSucursalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class NuevaSucursalModule { }

