import { Component } from '@angular/core';
import { HeaderComponent } from './component/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,    
  imports: [HeaderComponent, RouterModule],    
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App {

}

