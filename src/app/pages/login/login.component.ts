import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/service/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Login } from '../../core/models/login';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  token: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.token = null;
    this.loading = true;

    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    const loginUser: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response)=> {
          this.token = response;
          this.loading = false;
          localStorage.setItem('token', response);
          alert('Login réussi ! Token : ' + response);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur d\'authentification : identifiants invalides';
          this.loading = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
    this.token = null;
    this.errorMessage = null;
  }
}
