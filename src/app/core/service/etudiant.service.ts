import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/Etudiant';
import { CreateEtudiant } from '../models/CreateEtudiant';
import { UpdateEtudiant } from '../models/UpdateEtudiant';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(private http: HttpClient) { }

  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>('/api/etudiants');
  }

  getEtudiantById(id: number): Observable<Etudiant> {
      return this.http.get<Etudiant>(`/api/etudiants/${id}`);
    }

    createEtudiant(dto: CreateEtudiant): Observable<Etudiant> {
      return this.http.post<Etudiant>('/api/etudiants', dto);
    }

    updateEtudiant(id: number, dto: UpdateEtudiant): Observable<Etudiant> {
      return this.http.put<Etudiant>(`/api/etudiants/${id}`, dto);
    }

    deleteEtudiant(id: number): Observable<void> {
      return this.http.delete<void>(`/api/etudiants/${id}`);
    }
}
