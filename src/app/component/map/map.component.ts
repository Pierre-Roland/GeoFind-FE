import { Component, AfterViewInit, OnChanges, SimpleChanges,signal, inject  } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { effect } from '@angular/core';

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

export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  value: String = "";

  coords = signal<Coordonne | null>(null);

  private http = inject(HttpClient);

  protected readonly title = signal('geo-find');

  constructor() {
    effect(() => {
      const c = this.coords();
      if (c && this.map) {
        this.updateMap(c);
      }
    });
  }

  onSubmit() {
    const country = this.value; 

    this.http.get<Coordonne>(`http://localhost:8080/maps/${country}`).subscribe({
      next: (config) => {
        console.log('Réponse backend:', config);
        this.coords.set(config);
      },
      error: (err) => {
        console.error('Erreur API:', err);
      }
    });
  }

  onInputChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
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
