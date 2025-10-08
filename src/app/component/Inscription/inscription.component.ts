import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})

export class SignupComponent {
  @Output() register = new EventEmitter<{ username: string; email: string; password: string }>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() { return this.form.get('username')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.http.post('http://localhost:8080/users/save', { 
        username: this.username.value,
        password: this.password.value,
        email: this.email.value 
    })
    .subscribe({
    next: () => {
        alert('inscription effectué !');
        this.router.navigate(['/home', this.username.value]);
    },
    error: err => {
        console.error(err);
        alert("erreur d'inscription");
    }
    });
  }
}
