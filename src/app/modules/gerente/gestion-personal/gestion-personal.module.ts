import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GestionPersonalComponent } from './gestion-personal.component';

const routes: Routes = [
  { path: '', component: GestionPersonalComponent }
];

@NgModule({
  declarations: [GestionPersonalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class GestionPersonalModule { }