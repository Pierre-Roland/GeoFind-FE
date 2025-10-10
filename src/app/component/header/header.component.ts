import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/UserService';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'header-geo',
  imports: [AsyncPipe, RouterModule],
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  constructor(public userService: UserService, public router: Router) {}

  logout() {
    this.userService.setUsername(null);
    this.router.navigate(['/home']);
  }
}
