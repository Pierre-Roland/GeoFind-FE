import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface Description {
  country: string;
  image: string;
  description: string;
}

@Component({
  selector: 'user-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'userPage.component.html',
  styleUrls: ['./userPage.component.scss']
})

export class UserPageComponent implements OnInit {

    private username!: string;

    private http = inject(HttpClient);

    favorites: Description[] = [];

    constructor(public userService: UserService, public router: Router) {}

    get getUsername() {
        return this.username;
    }

    ngOnInit(): void {
        this.displayFavorite();
    }

    displayFavorite() {
        this.userService.username$.subscribe(usernameValue => {
            if (!usernameValue) {
            console.error('Utilisateur non connecté');
            return;
            }

            this.username = usernameValue;
            console.log('Username récupéré:', this.username);

            this.http.get<string[]>(`http://localhost:8080/userPage/${this.username}`).subscribe({
            next: (data) => {
                data.forEach((country) => {
                    this.http.get<Description>(`http://localhost:8080/description/${country}`).subscribe({
                        next: (config) => {
                            this.favorites.push({
                                country: country,
                                description: config.description,
                                image: config.image
                            });
                        },
                        error: (err) => {
                            console.error('Erreur API:', err);
                            alert('Erreur : aucune description correspondante pour ce pays.');
                        }
                    });
                });
            },
            error: (err) => {
                console.error('Erreur API:', err);
                alert(`Erreur inattendue (${err.status})`);
            }
            });
        });
    }

    deleteCountry(country: String) {
        const body = {
            username: this.getUsername, 
            country: country
        };

        this.http.delete<String>('http://localhost:8080/userPage/delete', { 
            body,
            responseType: 'text' as 'json'})
            .subscribe({
            next: (config) => {
                console.log('Enregistré avec succès:', config);
                this.favorites = [];
                this.displayFavorite();
            },
            error: (err) => {
                console.error('Erreur API:', err);
                alert(`Erreur inattendue (${err.status})`);
            }
        });
    }
}
