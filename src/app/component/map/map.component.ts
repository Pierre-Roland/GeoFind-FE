import { Component, AfterViewInit, OnChanges, SimpleChanges,signal, inject  } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { effect } from '@angular/core';
import { UserService } from '../../services/UserService';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Coordonne {
  zoom: number;
  center1: number;
  center2: number;
  country: string;
  times_visited: number;
}

interface description {
  lieu: string;
  image: string;
  description: string;
}

@Component({
  selector: 'map',
  standalone: true, // composant autonome
  imports: [FormsModule],
  templateUrl: 'map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  private currentMarker: L.Marker | null = null;

  private map!: L.Map;

  private image!: string;

  private description!: string;

  private country!: string;

  private username!: string;

  value: String = "";

  isDescriptionVisible = false;

  DescriptionLogo = false;

  coords = signal<Coordonne | null>(null);

  private http = inject(HttpClient);

  protected readonly title = signal('geo-find');

  constructor(public userService: UserService, private route: ActivatedRoute) {
    effect(() => {
      const c = this.coords();
      if (c && this.map) {
        this.updateMap(c);
      }
      this.userService.username$.subscribe(usernameValue => {
        if (!usernameValue) {
          console.error('Utilisateur non connecté');
          return;
        }
        this.username = usernameValue;
      })
      
      this.userService.country$.subscribe(countryValue => {
        if (!countryValue) {
          console.error('pays impossible à récupérer');
          return;
        }
        this.country = countryValue;
      })
    });
  }

  get getDescription() {
    return this.description;
  }

  get getImage() {
    return this.image;
  }

  get getUsername() {
    return this.username;
  }

  closePopup() {
    this.isDescriptionVisible = false;
    this.DescriptionLogo = true;
  }

  openPopup() {
    this.DescriptionLogo = false;
    this.isDescriptionVisible = true;
  }

  onReset() {
    this.DescriptionLogo = false;
    this.isDescriptionVisible = false;
    if (this.map) {
      this.map.setView([51.505, -0.09], 3); 
    }
    this.value = '';
    if (this.currentMarker) {
      this.currentMarker.closePopup();
    }
  }

  onSubmit() {
    const country = this.value; 

    this.getCoordonnees(country);
  }

  getCoordonnees(country: String) {
    this.http.get<Coordonne>(`http://localhost:8080/maps/${country}`).subscribe({
      next: (config) => {
        console.log('Réponse backend:', config);
        this.coords.set(config);
        this.http.get<description>(`http://localhost:8080/description/${country}`).subscribe({
          next: (config) => {
            this.isDescriptionVisible = true;
            this.image = config.image;
            this.description = config.description;
          },
          error: (err) => {
            console.error('Erreur API:', err);
            this.image = '';
            this.description = '';
            alert('Erreur : aucune description correspondante pour ce pays.');
          }
        });
      },
      error: (err) => {
        console.error('Erreur API:', err);
        alert('Erreur : impossible de trouver de correspondance pour ce pays.');
      }
    });
  }
   
  onSubmitFav() {
    const body = {
      username: this.getUsername, 
      country: this.country
    };

    this.http.post<description>('http://localhost:8080/userPage/save', body).subscribe({
      next: (config) => {
        console.log('Enregistré avec succès:', config);
        alert("pays bien ajouté en favoris");
      },
      error: (err) => {
        console.error('Erreur API:', err);

        if (err.status === 409) {
          alert("Ce pays est déjà dans vos favoris !");
        } else if (err.status === 500) {
          alert("Erreur interne du serveur. Réessayez plus tard.");
        } else {
          alert(`Erreur inattendue (${err.status})`);
        }
      }
    });
  };

  onInputChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
  }

  ngAfterViewInit(): void {
    if (this.country != null) {
      this.getCoordonnees(this.country);
    }
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private updateMap(coords: Coordonne): void {
    this.country = coords.country;
    
    this.map.flyTo([coords.center1, coords.center2], coords.zoom, {
      animate: true,
      duration: 2
    });

    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    this.currentMarker = L.marker([coords.center1, coords.center2], {
      icon: L.divIcon({ className: 'empty-icon' })
    })
    .addTo(this.map)
    .bindPopup(coords.country)
    .openPopup();
  }
}
