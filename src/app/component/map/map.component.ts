import { Component, AfterViewInit, Input, OnChanges, SimpleChanges  } from '@angular/core';
import * as L from 'leaflet';

interface Coordonne {
  zoom: number;
  center1: number;
  center2: number;
  country: string;
}

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges  {
  private map!: L.Map;

  @Input() coords: Coordonne | null = null;

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.coords) {
      this.updateMap(this.coords);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coords'] && this.coords && this.map) {
      this.updateMap(this.coords);
    }
  }

  private updateMap(coords: Coordonne): void {
    
    this.map.flyTo([coords.center1, coords.center2], coords.zoom, {
      animate: true,
      duration: 2
    });

    L.marker([coords.center1, coords.center2], {
      icon: L.divIcon({ className: 'empty-icon' }) 
    })
      .addTo(this.map)
      .bindPopup(coords.country)
      .openPopup();
  }
}
