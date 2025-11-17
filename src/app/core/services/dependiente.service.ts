import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DependienteResumen } from '../models/dependiente-resumen.model';
import { Cliente, ClienteRegistro } from '../models/cliente.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DependienteService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerResumen(dependienteId: number): Observable<DependienteResumen> {
    return this.http.get<DependienteResumen>(`${environment.apiUrl}/dependiente/${dependienteId}/resumen`);
  }

  crearCliente(payload: ClienteRegistro): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.apiUrl}/dependiente/clientes`, payload);
  }

  crearUsuario(payload: { nombreComercio: string; usuario: string; password: string; }): Observable<any> {
    const user = this.authService.getCurrentUser();
    const cajeroId = user?.id;

    const apiBase = environment.apiUrl;
    const baseSinApi = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;

    // El backend espera el campo 'nombre' (no 'nombreComercio')
    const body = {
      nombre: payload.nombreComercio,
      usuario: payload.usuario,
      password: payload.password
    };

    const candidates: string[] = [
      // Variantes bajo /cajero primero (lo más probable según tu backend)
      `${apiBase}/cajero/dependientes`,
      `${baseSinApi}/cajero/dependientes`,
      // Luego /dependientes directo
      `${apiBase}/dependientes`,
      `${baseSinApi}/dependientes`,
      // Variante con cajeroId explícito
      ...(cajeroId ? [
        `${apiBase}/cajeros/${cajeroId}/dependientes`,
        `${baseSinApi}/cajeros/${cajeroId}/dependientes`
      ] : [])
    ];
    return this.postTrySequential<any>(candidates, body);
  }

  private postTrySequential<T>(urls: string[], body: any, index = 0): Observable<T> {
    if (index >= urls.length) {
      return throwError(() => ({ message: 'No se encontró un endpoint válido para crear dependiente.' }));
    }
    const url = urls[index];
    // Log informativo para depuración en consola del navegador
    // Muestra la URL exacta que se intentará en este paso
    // eslint-disable-next-line no-console
    console.log('[DependienteService] Intentando POST:', url);
    return defer(() => this.http.post<T>(url, body)).pipe(
      catchError(err => {
        if (err?.status === 404) {
          return this.postTrySequential<T>(urls, body, index + 1);
        }
        return throwError(() => err);
      })
    );
  }
}

