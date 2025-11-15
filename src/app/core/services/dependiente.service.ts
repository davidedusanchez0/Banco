import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DependienteResumen } from '../models/dependiente-resumen.model';
import { Cliente, ClienteRegistro } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class DependienteService {

  constructor(private http: HttpClient) {}

  obtenerResumen(dependienteId: number): Observable<DependienteResumen> {
    return this.http.get<DependienteResumen>(`${environment.apiUrl}/dependiente/${dependienteId}/resumen`);
  }

  crearCliente(payload: ClienteRegistro): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.apiUrl}/dependiente/clientes`, payload);
  }
}

