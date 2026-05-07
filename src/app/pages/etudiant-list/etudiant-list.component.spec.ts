  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { EtudiantListComponent } from './etudiant-list.component';
  import { EtudiantService } from '../../core/service/etudiant.service';
  import { of, throwError } from 'rxjs';
  import { Etudiant } from '../../core/models/Etudiant';
  import { provideRouter } from '@angular/router';

  describe('EtudiantListComponent', () => {
    let component: EtudiantListComponent;
    let fixture: ComponentFixture<EtudiantListComponent>;
    let etudiantService: jest.Mocked<EtudiantService>;
    // jest.Mocked<Service> crée un type avec toutes les méthodes mockables

    const mockEtudiants: Etudiant[] = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', createdAt: '2024-01-01' },
      { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie@test.com', createdAt: '2024-01-02' }
    ];

    beforeEach(async () => {
      // On crée un mock manuel avec des fonctions jest.fn()
      const mockService = {
        getAllEtudiants: jest.fn(),
        deleteEtudiant: jest.fn()
      };

      await TestBed.configureTestingModule({
        imports: [EtudiantListComponent],
        providers: [
          provideRouter([]), // nécessaire pour le RouterLink dans le template
          { provide: EtudiantService, useValue: mockService }
        ]
      }).compileComponents();

      etudiantService = TestBed.inject(EtudiantService) as jest.Mocked<EtudiantService>;
      fixture = TestBed.createComponent(EtudiantListComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load etudiants on init', () => {
      // Test : au démarrage, getAllEtudiants remplit la liste
      etudiantService.getAllEtudiants.mockReturnValue(of(mockEtudiants));
      // mockReturnValue : quand la méthode est appelée, elle retourne cet Observable

      fixture.detectChanges(); // déclenche ngOnInit

      expect(component.etudiants.length).toBe(2);
      expect(component.etudiants[0].nom).toBe('Dupont');
      expect(component.loading).toBe(false);
    });

    it('should show error message on load failure', () => {
      // Test : erreur serveur → message d'erreur
      etudiantService.getAllEtudiants.mockReturnValue(throwError(() => new Error('HTTP error')));

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Erreur lors du chargement des étudiants');
      expect(component.loading).toBe(false);
    });

    it('should delete etudiant and remove from list', () => {
      // Test : suppression confirmée → l'étudiant disparaît de la liste
      etudiantService.getAllEtudiants.mockReturnValue(of(mockEtudiants));
      fixture.detectChanges();
      expect(component.etudiants.length).toBe(2);

      jest.spyOn(window, 'confirm').mockReturnValue(true);
      // jest.spyOn espionne window.confirm et force le retour à true
      etudiantService.deleteEtudiant.mockReturnValue(of(void 0));

      component.deleteEtudiant(1);

      expect(component.etudiants.length).toBe(1);
      expect(component.etudiants[0].id).toBe(2);
    });

    it('should not delete if confirm is cancelled', () => {
      // Test : suppression annulée → rien ne change
      etudiantService.getAllEtudiants.mockReturnValue(of(mockEtudiants));
      fixture.detectChanges();

      jest.spyOn(window, 'confirm').mockReturnValue(false);

      component.deleteEtudiant(1);

      expect(component.etudiants.length).toBe(2);
      expect(etudiantService.deleteEtudiant).not.toHaveBeenCalled();
    });

      it('should show error message on delete failure', () => {
      // Test : échec suppression → message d'erreur
      etudiantService.getAllEtudiants.mockReturnValue(of(mockEtudiants));
      fixture.detectChanges();

      jest.spyOn(window, 'confirm').mockReturnValue(true);
      etudiantService.deleteEtudiant.mockReturnValue(throwError(() => new Error('Erreur')));

      component.deleteEtudiant(1);

      expect(component.errorMessage).toBe('Erreur lors de la suppression');
    });
  });