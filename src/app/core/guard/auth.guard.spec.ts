  import { TestBed } from '@angular/core/testing';
  import { CanActivateFn } from '@angular/router';

  import { authGuard } from './auth.guard';

  describe('authGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters));

    beforeEach(() => {
      TestBed.configureTestingModule({});
      localStorage.clear();
    });

    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('should return true when token exists', () => {
      // Test : token présent → accès autorisé (true)
      localStorage.setItem('token', 'fake-jwt-token');
      // On passe des objets vides pour route et state (non utilisés par le guard)
      const routeMock: any = {};
      const stateMock: any = {};
      const result = executeGuard(routeMock, stateMock);
      expect(result).toBe(true);
    });

    it('should redirect to /login when token is missing', () => {
      // Test : pas de token → redirection vers /login
      const routeMock: any = {};
      const stateMock: any = {};
      const result = executeGuard(routeMock, stateMock);
      expect(result.toString()).toBe('/login');
    });
  });