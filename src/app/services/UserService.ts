import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usernameSource = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSource.asObservable();

  setUsername(name: string | null) {
    this.usernameSource.next(name);
  }

  private countrySource = new BehaviorSubject<string | null>(null);
  country$ = this.countrySource.asObservable();

  setCountry(country: string | null) {
    this.countrySource.next(country);
  }
}
