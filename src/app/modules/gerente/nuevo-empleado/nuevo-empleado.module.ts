import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NuevoEmpleadoComponent } from './nuevo-empleado.component';

const routes: Routes = [
  { path: '', component: NuevoEmpleadoComponent }
];

@NgModule({
  declarations: [NuevoEmpleadoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class NuevoEmpleadoModule { }

