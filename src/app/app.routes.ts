import { Routes } from '@angular/router';
import { MostVisitedComponent } from './component/MostVisited/MostVisited.component';
import { HomeComponent } from './component/Home/Home.component';
import { ResetPasswordComponent } from './component/resetPassword/resetPassword.component';
import { LoginFormComponent } from './component/connection/connection.component';
import { ForgotPasswordComponent } from './component/forgotPassword/forgotPassword.component';
import { SignupComponent } from './component/Inscription/inscription.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent }, 
    { path: 'home/:username', component: HomeComponent}, 
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'mostVisited', component: MostVisitedComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'connection', component: LoginFormComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'inscription', component: SignupComponent }
];
