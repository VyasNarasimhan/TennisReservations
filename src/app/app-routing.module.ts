import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ReservationsComponent } from './reservations/reservations.component';

const routes: Routes = [{
  path: 'reservations',
  component: ReservationsComponent,
  
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
