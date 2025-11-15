import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario, LoginRequest, LoginResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Nota: El backend no tiene endpoint de login aún, esto es temporal
    // Por ahora simulamos el login
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const user: Usuario = {
            id: response.id,
            nombre: response.nombre,
            rol: response.rol,
            rolId: response.rolId ?? null,
            sucursalId: response.sucursalId ?? null,
            clienteId: response.clienteId ?? null
          };
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  private getUserFromStorage(): Usuario | null {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

