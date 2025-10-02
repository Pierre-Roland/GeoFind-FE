import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, CommonModule],
  templateUrl: 'Home.component.html',
  styleUrls: ['./Home.component.scss']
})

export class HomeComponent {
  
}
