import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService ';

@Component({
selector: 'app-login-form',
standalone: true,  
imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule], 
templateUrl: './connection.component.html',
styleUrls: ['./connection.component.scss']
})
export class LoginFormComponent {

    form: FormGroup;
    showPassword = false;

    constructor(private auth: AuthService, private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    });
    }

    get username() { return this.form.get('username')!; }
    get password() { return this.form.get('password')!; }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        return;
        }
        const { username, password } = this.form.value;

        const params = new HttpParams()
            .set('username', username)
            .set('password', password);

        this.http.get<boolean>('http://localhost:8080/users/identification', { params })
        .subscribe({
            next: (result: boolean) => {
            if (result) {
                this.auth.login();
                this.router.navigate(['/home', username]);
            } else {
                alert('Identifiants invalides !');
            }
            },
            error: err => {
            console.error('Erreur connexion:', err);
            alert('Erreur lors de la connexion.');
            }
        });
    }

    onForgotPassword() {
        this.router.navigate(['/forgot-password']);
    }

    onSignup() {
        this.router.navigate(['/inscription']);
    }
}
