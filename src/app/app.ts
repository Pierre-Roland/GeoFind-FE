import { Component, signal, inject  } from '@angular/core';
import { MapComponent } from './component/map/map.component';
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
  imports: [MapComponent],  
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  value: String = "";

  private http = inject(HttpClient);

  protected readonly title = signal('geo-find');

  onInputChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    console.log(this.value);
  }

  onSubmit() {
    console.log("entré");
    const country = this.value; 

    this.http.get<Coordonne>(`/maps/${country}`).subscribe({
      next: (config) => {
        console.log('Réponse backend:', config);
      },
      error: (err) => {
        console.error('Erreur API:', err);
      }
    });
  }
}

