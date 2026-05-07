  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { AppComponent } from './app.component';
  import { provideRouter } from '@angular/router';

  describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [provideRouter([])]  // fournit un routeur vide pour éviter les erreurs
      }).compileComponents();

      localStorage.clear();
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the app', () => {
      // Test : le composant est créé
      expect(component).toBeTruthy();
    });

    it(`should have the 'etudiant-frontend' title`, () => {
      // Test : le titre est défini
      expect(component.title).toEqual('etudiant-frontend');
    });

    it('should return false isLoggedIn when no token', () => {
      // Test : pas de token → isLoggedIn = false
      expect(component.isLoggedIn).toBe(false);
    });

    it('should return true isLoggedIn when token exists', () => {
      // Test : token présent → isLoggedIn = true
      localStorage.setItem('token', 'xxx');
      expect(component.isLoggedIn).toBe(true);
    });

    it('should show nav links when not logged in', () => {
      // Test : non connecté → on voit Inscription et Connexion, pas Déconnexion
      const navHtml = fixture.nativeElement.querySelector('.nav-links').textContent;
      expect(navHtml).toContain('Inscription');
      expect(navHtml).toContain('Connexion');
      expect(navHtml).not.toContain('Déconnexion');
    });

    it('should show Etudiants and Déconnexion when logged in', () => {
      // Test : connecté → on voit Etudiants et Déconnexion
      localStorage.setItem('token', 'xxx');
      fixture.detectChanges();  // re-rend le template après modif du localStorage
      const navHtml = fixture.nativeElement.querySelector('.nav-links').textContent;
      expect(navHtml).toContain('Etudiants');
      expect(navHtml).toContain('Déconnexion');
    });

    it('should clear token and navigate on logout', () => {
      // Test : logout() → token supprimé, navigation vers /login
      localStorage.setItem('token', 'xxx');
      component.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });