import { Routes } from '@angular/router';
import { MostVisitedComponent } from './component/MostVisited/MostVisited.component';
import { HomeComponent } from './component/Home/Home.component';
import { ResetPasswordComponent } from './component/resetPassword/resetPassword.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },  
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'mostVisited', component: MostVisitedComponent },
    { path: 'reset-password', component: ResetPasswordComponent}
];
