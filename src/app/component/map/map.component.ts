import { Component, AfterViewInit, OnChanges, SimpleChanges,signal, inject  } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { effect } from '@angular/core';
import { UserService } from '../../services/UserService';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../env/environnement';
import { CommonModule } from '@angular/common';

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
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: 'map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  private apiUrl = environment.apiUrl;

  private currentMarker: L.Marker | null = null;

  private map!: L.Map;

  private image!: string;

  private description!: string;

  private country!: string;

  countryParam!: string;

  private username!: string;

  countryList: string[] = [];

  filteredCountries: string[] = [];

  value: string = "";

  isDescriptionVisible = false;

  DescriptionLogo = false;

  coords = signal<Coordonne | null>(null);

  private http = inject(HttpClient);

  protected readonly title = signal('geo-find');

  constructor(public userService: UserService) {
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
        this.countryParam = countryValue;
      })
      this.countryList = [];
      this.http.get<description[]>(`${this.apiUrl}/description/lieu/mostVisited/184`).subscribe({   
      next: (data) => {
          data.forEach((res) => {
            this.countryList.push(res.lieu);
          });
      },
      error: (err) => {
          console.error('Erreur API:', err);
          alert(`Erreur inattendue (${err.status})`);
      }
      });
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
    this.filteredCountries = [];
  }

  onSubmit() {
    const country = this.value; 

    this.getCoordonnees(country);
  }

  getCoordonnees(country: String) {
    this.http.get<Coordonne>(`${this.apiUrl}/maps/${country}`).subscribe({
      next: (config) => {
        console.log('Réponse backend:', config);
        this.coords.set(config);
        this.http.get<description>(`${this.apiUrl}/description/${country}`).subscribe({
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

    this.http.post<description>(`${this.apiUrl}/userPage/save`, body).subscribe({   
      next: (config) => {
        console.log('Enregistré avec succès:', config);
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
    this.value = (event.target as HTMLInputElement).value.toLowerCase();

    if (this.value.trim() === '') {
      this.filteredCountries = [];
      return;
    }

    this.filteredCountries = this.countryList.filter(country =>
      country.toLowerCase().startsWith(this.value)
    );

    if (this.filteredCountries.length == 0) {
      this.filteredCountries = this.countryList.filter(country =>
        country.toLowerCase().includes(this.value)
      );
    }
  }

  selectCountry(country: string) {
    this.value = country;
    this.filteredCountries = [];
  }


  ngAfterViewInit(): void {
    if (this.countryParam != null) {
      this.getCoordonnees(this.countryParam);
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
