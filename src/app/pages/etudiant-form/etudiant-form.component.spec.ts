  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { EtudiantFormComponent } from './etudiant-form.component';
  import { EtudiantService } from '../../core/service/etudiant.service';
  import { of, throwError } from 'rxjs';
  import { provideRouter } from '@angular/router';
  import { provideLocationMocks } from '@angular/common/testing';
  import { ActivatedRoute } from '@angular/router';

  describe('EtudiantFormComponent', () => {
    // ========== MODE CRÉATION ==========
    describe('create mode', () => {
      let component: EtudiantFormComponent;
      let fixture: ComponentFixture<EtudiantFormComponent>;
      let etudiantService: jest.Mocked<EtudiantService>;

      beforeEach(async () => {
        const mockService = {
          getEtudiantById: jest.fn(),
          createEtudiant: jest.fn(),
          updateEtudiant: jest.fn()
        };

        await TestBed.configureTestingModule({
          imports: [EtudiantFormComponent],
          providers: [
            provideRouter([]),
            provideLocationMocks(),
            // ActivatedRoute qui retourne null pour 'id' → mode création
            { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
            { provide: EtudiantService, useValue: mockService }
          ]
        }).compileComponents();

        etudiantService = TestBed.inject(EtudiantService) as jest.Mocked<EtudiantService>;
        fixture = TestBed.createComponent(EtudiantFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should initialize form with empty values in create mode', () => {
        expect(component.isEditMode).toBe(false);
        expect(component.etudiantForm.get('nom')?.value).toBe('');
      });

      it('should mark form as invalid when required fields are empty', () => {
        component.onSubmit();
        expect(component.etudiantForm.invalid).toBe(true);
        expect(component.submitted).toBe(true);
      });

      it('should call createEtudiant on submit in create mode', () => {
        etudiantService.createEtudiant.mockReturnValue(of({} as any));
        component.etudiantForm.setValue({ nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', telephone: '' });
        component.onSubmit();
        expect(etudiantService.createEtudiant).toHaveBeenCalled();
      });

      it('should show error on create failure', () => {
        etudiantService.createEtudiant.mockReturnValue(throwError(() => new Error('Erreur')));
        component.etudiantForm.setValue({ nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', telephone: '' });
        component.onSubmit();
        expect(component.errorMessage).toBe('Erreur lors de la création');
        expect(component.loading).toBe(false);
      });
    });

    // ========== MODE ÉDITION ==========
    describe('edit mode', () => {
      let component: EtudiantFormComponent;
      let fixture: ComponentFixture<EtudiantFormComponent>;
      let etudiantService: jest.Mocked<EtudiantService>;

      const mockEtudiant = { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', telephone: '', createdAt: '2024-01-01' };

      beforeEach(async () => {
        const mockService = {
          getEtudiantById: jest.fn(),
          createEtudiant: jest.fn(),
          updateEtudiant: jest.fn()
        };

        await TestBed.configureTestingModule({
          imports: [EtudiantFormComponent],
          providers: [
            provideRouter([]),
            provideLocationMocks(),
            // ActivatedRoute qui retourne '1' pour 'id' → mode édition
            { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => key === 'id' ? '1' : null } } } },
            { provide: EtudiantService, useValue: mockService }
          ]
        }).compileComponents();

        etudiantService = TestBed.inject(EtudiantService) as jest.Mocked<EtudiantService>;
      });

      it('should load etudiant on init in edit mode', () => {
        etudiantService.getEtudiantById.mockReturnValue(of(mockEtudiant));
        fixture = TestBed.createComponent(EtudiantFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.isEditMode).toBe(true);
        expect(component.etudiantId).toBe(1);
        expect(component.etudiantForm.get('nom')?.value).toBe('Dupont');
      });

      it('should call updateEtudiant on submit in edit mode', () => {
        etudiantService.getEtudiantById.mockReturnValue(of(mockEtudiant));
        fixture = TestBed.createComponent(EtudiantFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        etudiantService.updateEtudiant.mockReturnValue(of({} as any));
        component.onSubmit();
        expect(etudiantService.updateEtudiant).toHaveBeenCalledWith(1, expect.any(Object));
      });

      it('should show error on update failure', () => {
        etudiantService.getEtudiantById.mockReturnValue(of(mockEtudiant));
        fixture = TestBed.createComponent(EtudiantFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        etudiantService.updateEtudiant.mockReturnValue(throwError(() => new Error('Erreur')));
        component.onSubmit();
        expect(component.errorMessage).toBe('Erreur lors de la modification');
        expect(component.loading).toBe(false);
      });
    });
  });