  import { Component, DestroyRef, inject, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
  import { EtudiantService } from '../../core/service/etudiant.service';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-etudiant-form',
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './etudiant-form.component.html',
    styleUrl: './etudiant-form.component.css'
  })
  export class EtudiantFormComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private etudiantService = inject(EtudiantService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    etudiantForm: FormGroup = new FormGroup({});
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string | null = null;
    isEditMode: boolean = false;
    etudiantId: number | null = null;

    ngOnInit(): void {
      this.etudiantForm = this.formBuilder.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['']
      });

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditMode = true;
        this.etudiantId = Number(id);
        this.loadEtudiant(this.etudiantId);
      }
    }

    get form() {
      return this.etudiantForm.controls;
    }

    loadEtudiant(id: number): void {
      this.loading = true;
      this.etudiantService.getEtudiantById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.etudiantForm.patchValue(data);
            this.loading = false;
          },
           error: (err) => {
            this.errorMessage = 'Erreur lors du chargement';
            this.loading = false;
          }
        });
    }

    onSubmit(): void {
      this.submitted = true;
      this.errorMessage = null;

      if (this.etudiantForm.invalid) {
        return;
      }

      this.loading = true;
      const dto = this.etudiantForm.value;

      if (this.isEditMode && this.etudiantId) {
        this.etudiantService.updateEtudiant(this.etudiantId, dto)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.router.navigate(['/etudiants']);
            },
            error: (err) => {
              this.errorMessage = 'Erreur lors de la modification';
              this.loading = false;
            }
          });
      } else {
        this.etudiantService.createEtudiant(dto)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.router.navigate(['/etudiants']);
            },
            error: (err) => {
              this.errorMessage = 'Erreur lors de la création';
              this.loading = false;
            }
          });
      }
    }
  }

