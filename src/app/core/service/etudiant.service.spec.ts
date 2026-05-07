  import { TestBed } from '@angular/core/testing';
  import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
  import { provideHttpClient } from '@angular/common/http';
  import { EtudiantService } from './etudiant.service';
  import { Etudiant } from '../models/Etudiant';
  import { CreateEtudiant } from '../models/CreateEtudiant';
  import { UpdateEtudiant } from '../models/UpdateEtudiant';

  describe('EtudiantService', () => {
    let service: EtudiantService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
        ]
      });
      service = TestBed.inject(EtudiantService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should GET all etudiants', () => {
      // Test : getAllEtudiants → requête GET /api/etudiants
      const mockEtudiants: Etudiant[] = [
        { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', createdAt: '2024-01-01' },
        { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie@test.com', createdAt: '2024-01-02' }
      ];

      service.getAllEtudiants().subscribe(etudiants => {
        expect(etudiants).toEqual(mockEtudiants);
      });

      const req = httpMock.expectOne('/api/etudiants');
      expect(req.request.method).toBe('GET');
      req.flush(mockEtudiants);
    });

    it('should GET etudiant by id', () => {
      // Test : getEtudiantById(1) → requête GET /api/etudiants/1
      const mockEtudiant: Etudiant = { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', createdAt: '2024-01-01' };

      service.getEtudiantById(1).subscribe(etudiant => {
        expect(etudiant).toEqual(mockEtudiant);
      });

      const req = httpMock.expectOne('/api/etudiants/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockEtudiant);
    });

    it('should POST to create etudiant', () => {
      // Test : createEtudiant(dto) → requête POST /api/etudiants
      const dto: CreateEtudiant = { nom: 'Martin', prenom: 'Sophie', email: 'sophie@test.com' };
      const created: Etudiant = { id: 3, ...dto, createdAt: '2024-01-03' };

      service.createEtudiant(dto).subscribe(etudiant => {
        expect(etudiant).toEqual(created);
      });

      const req = httpMock.expectOne('/api/etudiants');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(created);
    });

    it('should PUT to update etudiant', () => {
      // Test : updateEtudiant(1, dto) → requête PUT /api/etudiants/1
      const dto: UpdateEtudiant = { nom: 'Dupont', prenom: 'Jean-Pierre' };

      service.updateEtudiant(1, dto).subscribe();

      const req = httpMock.expectOne('/api/etudiants/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({});
    });

    it('should DELETE etudiant', () => {
      // Test : deleteEtudiant(1) → requête DELETE /api/etudiants/1
      service.deleteEtudiant(1).subscribe();

      const req = httpMock.expectOne('/api/etudiants/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle error on getAllEtudiants', () => {
      // Test : getAllEtudiants en cas d'erreur → erreur propagée
      service.getAllEtudiants().subscribe({
        error: (err) => expect(err.status).toBe(500)
      });

      const req = httpMock.expectOne('/api/etudiants');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
