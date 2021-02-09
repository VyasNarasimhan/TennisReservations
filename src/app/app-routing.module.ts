import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { RegisterComponent } from './register/register.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'reservations',
  component: ReservationsComponent,
}, {
  path: 'login',
  component: LoginComponent,
}, {
  path: 'register',
  component: RegisterComponent,
}, {
  path: 'changepassword',
  component: ChangepasswordComponent,
}, {
  path: 'forgotpassword',
  component: ForgotpasswordComponent,
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
}, {
  path: 'admin',
  component: AdminComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
