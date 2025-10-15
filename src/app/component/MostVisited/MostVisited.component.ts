import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface Description {
  lieu: string;
  image: string;
  description: string;
}

@Component({
  selector: 'most-visited',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: 'MostVisited.component.html',
  styleUrls: ['./MostVisited.component.scss']
})

export class MostVisitedComponent implements OnInit {

  private http = inject(HttpClient);

  mostVisited: Description[] = [];

  pagination: number = 10;

  itemsPerPage: number = 10;

  onItemsPerPageChange() {
    this.executeQuery(this.itemsPerPage);
  }

  ngOnInit(): void {
    this.executeQuery(this.pagination);
  }

  executeQuery(pagination: number) {
    this.mostVisited = [];
    this.http.get<Description[]>(`http://localhost:8080/description/lieu/mostVisited/${pagination}`).subscribe({
    next: (data) => {
        data.forEach((res) => {
          this.mostVisited.push({
              lieu: res.lieu,
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
