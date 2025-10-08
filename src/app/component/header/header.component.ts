import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/UserService';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'header-geo',
  imports: [AsyncPipe, RouterModule],
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  constructor(public userService: UserService) {}
}
