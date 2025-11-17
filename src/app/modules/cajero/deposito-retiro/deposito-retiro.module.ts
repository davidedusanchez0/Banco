import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DepositoRetiroComponent } from './deposito-retiro.component';

const routes: Routes = [
  { path: '', component: DepositoRetiroComponent }
];

@NgModule({
  declarations: [DepositoRetiroComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class DepositoRetiroModule { }
