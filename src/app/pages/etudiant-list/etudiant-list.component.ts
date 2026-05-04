  import { Component, DestroyRef, inject, OnInit } from '@angular/core';
  import { EtudiantService } from '../../core/service/etudiant.service';
  import { Etudiant } from '../../core/models/Etudiant';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  import { RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etudiant-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './etudiant-list.component.html',
  styleUrl: './etudiant-list.component.css'
})
export class EtudiantListComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
    private destroyRef = inject(DestroyRef);
    etudiants: Etudiant[] = [];
    loading: boolean = false;
    errorMessage: string | null = null;

    ngOnInit(): void {
      this.loadEtudiants();
    }

    loadEtudiants(): void {
      this.loading = true;
      this.errorMessage = null;
      this.etudiantService.getAllEtudiants()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.etudiants = data;
            this.loading = false;
          },
          error: (err) => {
            this.errorMessage = 'Erreur lors du chargement des étudiants';
            this.loading = false;
          }
        });
    }

    deleteEtudiant(id: number): void {
      if (confirm('Supprimer cet étudiant ?')) {
        this.etudiantService.deleteEtudiant(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.etudiants = this.etudiants.filter(e => e.id !== id);
            },
            error: (err) => {
              this.errorMessage = 'Erreur lors de la suppression';
            }
          });
      }
    }
}
