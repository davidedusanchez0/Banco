import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NuevoClienteComponent } from './nuevo-cliente.component';

const routes: Routes = [
  { path: '', component: NuevoClienteComponent }
];

@NgModule({
  declarations: [NuevoClienteComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class NuevoClienteModule { }

