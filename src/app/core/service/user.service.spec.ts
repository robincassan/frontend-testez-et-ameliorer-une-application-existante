  import { TestBed } from '@angular/core/testing';
  import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
  import { provideHttpClient } from '@angular/common/http';
  import { UserService } from './user.service';
  import { Register } from '../models/Register';
  import { Login } from '../models/login';

  describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
        ]
      });
      service = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should POST to register', () => {
      // Test : register(user) → requête POST /api/register
      const user: Register = { firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'secret' };

      service.register(user).subscribe();

      const req = httpMock.expectOne('/api/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush({});
    });

    it('should POST to login', () => {
      // Test : login(user) → requête POST /api/login avec responseType text
      const credentials: Login = { login: 'admin', password: 'pass' };
      const fakeToken = 'fake-jwt-token';

      service.login(credentials).subscribe(token => {
        expect(token).toBe(fakeToken);
      });

      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(fakeToken);
    });
  });