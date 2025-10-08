import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, CommonModule],
  templateUrl: 'Home.component.html',
  styleUrls: ['./Home.component.scss']
})

export class HomeComponent {
  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    let username = this.route.snapshot.paramMap.get('username');
    if (username != null) {
      this.userService.setUsername(username);
    }
  }
}
