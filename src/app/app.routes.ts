import { Routes } from '@angular/router';
import { MostVisitedComponent } from './component/MostVisited/MostVisited.component';
import { HomeComponent } from './component/Home/Home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },  
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'mostVisited', component: MostVisitedComponent }
];
