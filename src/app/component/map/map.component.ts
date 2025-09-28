import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private center1!: number;
  private center2!: number;
  private zoom!: number;

  @Input() coords!: Coordonne; 

  constructor() {
    this.center1 = 51.505;
    this.center2 = -0.09;
    this.zoom = 3;
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [this.center1, this.center2],
      zoom: this.zoom
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }
}
