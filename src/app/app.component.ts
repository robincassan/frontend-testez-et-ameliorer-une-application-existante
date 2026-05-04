import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink
],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'etudiant-frontend';

  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
      return localStorage.getItem('token') !== null;
    }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
