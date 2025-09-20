import { Component, signal } from '@angular/core';
import { MapComponent } from './component/map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,        
  imports: [MapComponent],  
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('geo-find');
}

