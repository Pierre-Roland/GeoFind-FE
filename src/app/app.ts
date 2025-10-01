import { Component, signal, inject  } from '@angular/core';
import { MapComponent } from './component/map/map.component';
import { HeaderComponent } from './component/header/header.component';
import { HttpClient } from '@angular/common/http';

interface Coordonne {
  zoom: number;
  center1: number;
  center2: number;
  country: string;
}

@Component({
  selector: 'app-root',
  standalone: true,        
  imports: [MapComponent, HeaderComponent],  
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  value: String = "";

  coords = signal<Coordonne | null>(null);

  private http = inject(HttpClient);

  protected readonly title = signal('geo-find');

  onInputChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
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
}

