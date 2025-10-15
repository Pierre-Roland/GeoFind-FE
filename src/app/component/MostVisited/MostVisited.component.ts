import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface Description {
  country: string;
  image: string;
  description: string;
}

@Component({
  selector: 'most-visited',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'MostVisited.component.html',
  styleUrls: ['./MostVisited.component.scss']
})

export class MostVisitedComponent implements OnInit {

  private http = inject(HttpClient);

  mostVisited: Description[] = [];

  pagination: Number = 10;

  ngOnInit(): void {
    this.http.get<Description[]>(`http://localhost:8080/description/lieu/mostVisited/${this.pagination}`).subscribe({
    next: (data) => {
        data.forEach((res) => {
          this.mostVisited.push({
              country: res.country,
              description: res.description,
              image: res.image
          });
        });
    },
    error: (err) => {
        console.error('Erreur API:', err);
        alert(`Erreur inattendue (${err.status})`);
    }
    });
  }
}
