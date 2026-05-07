  import { TestBed } from '@angular/core/testing';
  import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
  import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
  import { HttpClient } from '@angular/common/http';

  import { authInterceptor } from './auth.interceptor';

  describe('authInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
      TestBed.runInInjectionContext(() => authInterceptor(req, next));

    let httpMock: HttpTestingController;
    let httpClient: HttpClient;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([authInterceptor])),
          // on enregistre l'interceptor pour qu'il s'applique aux requêtes
          provideHttpClientTesting(),
        ]
      });
      httpMock = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
      localStorage.clear();
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      // Test : l'interceptor existe
      expect(interceptor).toBeTruthy();
    });

    it('should add Authorization header when token exists', () => {
      // Test : token présent → toutes les requêtes ont le header Authorization: Bearer xxx
      localStorage.setItem('token', 'mon-token');

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe('Bearer mon-token');
      req.flush({});
    });

    it('should not add Authorization header when no token', () => {
      // Test : pas de token → pas de header Authorization
      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });