import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }
}
