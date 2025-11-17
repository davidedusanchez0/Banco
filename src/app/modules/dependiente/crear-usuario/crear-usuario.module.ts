import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuarioComponent } from './crear-usuario.component';

const routes: Routes = [
  { path: '', component: CrearUsuarioComponent }
];

@NgModule({
  declarations: [CrearUsuarioComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CrearUsuarioModule { }

