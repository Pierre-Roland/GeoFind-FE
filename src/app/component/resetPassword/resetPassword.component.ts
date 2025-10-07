import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reset-password',
  standalone: true,    
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.scss']
})

export class ResetPasswordComponent {
    token = '';
    uid = '';
    newPassword = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        const params = new URLSearchParams(window.location.search);
        this.token = params.get('token')!;
        this.uid = params.get('uid')!;
    }

    submit() {
        this.http.post('http://localhost:8080/auth/reset-password', {
            token: this.token,
            uid: this.uid,
            newPassword: this.newPassword
        }).subscribe({
            next: res => alert('Mot de passe réinitialisé !')
        });
    }
}