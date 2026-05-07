  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { LoginComponent } from './login.component';
  import { UserService } from '../../core/service/user.service';
  import { of, throwError } from 'rxjs';
  import { provideRouter } from '@angular/router';
  import { provideLocationMocks } from '@angular/common/testing';

  describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let userService: jest.Mocked<UserService>;

    const fakeToken = 'fake-jwt-token';

    beforeEach(async () => {
      const mockService = {
        login: jest.fn()
      };

      await TestBed.configureTestingModule({
        imports: [LoginComponent],
        providers: [
          provideRouter([]),
          provideLocationMocks(),
          { provide: UserService, useValue: mockService }
        ]
      }).compileComponents();

      userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
      localStorage.clear();
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      // Test : le composant existe
      expect(component).toBeTruthy();
    });

    it('should have invalid form when fields are empty', () => {
      // Test : champs vides → formulaire invalide
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should have valid form when all fields are filled', () => {
      // Test : champs remplis → formulaire valide
      component.loginForm.setValue({ login: 'admin', password: 'pass' });
      expect(component.loginForm.valid).toBe(true);
    });

    it('should not call login when form is invalid', () => {
      // Test : soumission avec formulaire invalide → login() pas appelé
      component.onSubmit();
      expect(userService.login).not.toHaveBeenCalled();
    });

    it('should call login and navigate on success', () => {
      // Test : login réussi → token stocké + navigation
      userService.login.mockReturnValue(of(fakeToken));

      component.loginForm.setValue({ login: 'admin', password: 'pass' });
      component.onSubmit();

      expect(userService.login).toHaveBeenCalledWith({ login: 'admin', password: 'pass' });
      expect(localStorage.getItem('token')).toBe(fakeToken);
    });

    it('should show error message on login failure', () => {
      // Test : échec login → message d'erreur
      userService.login.mockReturnValue(throwError(() => ({ error: { message: 'Identifiants invalides' } })));

      component.loginForm.setValue({ login: 'admin', password: 'wrong' });
      component.onSubmit();

      expect(component.errorMessage).toBeTruthy();
      expect(component.loading).toBe(false);
    });

    it('should reset form onReset', () => {
      // Test : reset → formulaire vidé, soumission remise à false
      component.onReset();
      expect(component.submitted).toBe(false);
      expect(component.loginForm.get('login')?.value).toBeNull();
    });
  });