import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [{
  path: 'reservations',
  component: ReservationsComponent,
}, {
  path: 'login',
  component: LoginComponent,
}, {
  path: 'register',
  component: RegisterComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
