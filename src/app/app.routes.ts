  import { Routes } from '@angular/router';
  import { RegisterComponent } from './pages/register/register.component';
  import { LoginComponent } from './pages/login/login.component';
  import { EtudiantListComponent } from './pages/etudiant-list/etudiant-list.component';
  import { EtudiantFormComponent } from './pages/etudiant-form/etudiant-form.component';
  import { authGuard } from './core/guard/auth.guard';

  export const routes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'etudiants', component: EtudiantListComponent, canActivate: [authGuard] },
    { path: 'etudiants/nouveau', component: EtudiantFormComponent, canActivate: [authGuard] },
    { path: 'etudiants/:id', component: EtudiantFormComponent, canActivate: [authGuard] },
    { path: 'etudiants/:id/modifier', component: EtudiantFormComponent, canActivate: [authGuard] }
  ];
