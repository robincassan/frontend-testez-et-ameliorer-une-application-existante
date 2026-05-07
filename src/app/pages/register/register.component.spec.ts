  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { RegisterComponent } from './register.component';
  import { UserService } from '../../core/service/user.service';
  import { of } from 'rxjs';
  import { provideRouter } from '@angular/router';
  import { provideLocationMocks } from '@angular/common/testing';
  import { MaterialModule } from '../../shared/material.module';

  describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let userService: jest.Mocked<UserService>;

    beforeEach(async () => {
      const mockService = {
        register: jest.fn()
      };

      await TestBed.configureTestingModule({
        imports: [
          RegisterComponent,
          MaterialModule  // nécessaire car le template utilise Material
        ],
        providers: [
          provideRouter([]),
          provideLocationMocks(),
          { provide: UserService, useValue: mockService }
        ]
      }).compileComponents();

      userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      // Test : le composant existe
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      // Test : formulaire initialisé vide
      expect(component.registerForm.get('firstName')?.value).toBe('');
      expect(component.registerForm.get('lastName')?.value).toBe('');
      expect(component.registerForm.get('login')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
    });

    it('should have invalid form when fields are empty', () => {
      // Test : champs vides → formulaire invalide
      expect(component.registerForm.invalid).toBe(true);
    });

    it('should have valid form when all fields are filled', () => {
      // Test : tous les champs remplis → formulaire valide
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        login: 'jdoe',
        password: 'secret'
      });
      expect(component.registerForm.valid).toBe(true);
    });

    it('should call onSubmit and call register service', () => {
      // Test : soumission valide → register() appelé
      jest.spyOn(window, 'alert').mockImplementation(() => {}); // évite l'alerte réelle
      userService.register.mockReturnValue(of({}));

      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        login: 'jdoe',
        password: 'secret'
      });
      component.onSubmit();

      expect(userService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        login: 'jdoe',
        password: 'secret'
      });
    });

    it('should not call register when form is invalid', () => {
      // Test : formulaire invalide → register() pas appelé
      component.onSubmit();
      expect(userService.register).not.toHaveBeenCalled();
    });

    it('should reset form on onReset', () => {
      // Test : reset → formulaire vidé, submitted = false
      component.onReset();
      expect(component.submitted).toBe(false);
      expect(component.registerForm.get('firstName')?.value).toBeNull();
    });
  });