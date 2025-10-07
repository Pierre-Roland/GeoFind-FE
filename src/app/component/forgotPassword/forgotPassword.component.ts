import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
selector: 'app-forgot-password-form',
standalone: true,
imports: [CommonModule, ReactiveFormsModule],
templateUrl: './forgotPassword.component.html',
styleUrls: ['./forgotPassword.component.scss']
})

export class ForgotPasswordComponent {

@Output() sendEmail = new EventEmitter<string>();
form: FormGroup;

constructor(private fb: FormBuilder, private http: HttpClient) {
this.form = this.fb.group({
email: ['', [Validators.required, Validators.email]]
});
}

get email() {
    return this.form.get('email')!;
}

onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const emailValue = encodeURIComponent(this.email.value);
  const url = `http://localhost:8080/auth/forgot-password?email=${emailValue}`;

  this.http.post(url, null, { responseType: 'text' })
    .subscribe({
      next: () => {
        alert('Lien de réinitialisation envoyé !');
      },
      error: err => {
        console.error(err);
        alert("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.");
      }
    });
}
}
