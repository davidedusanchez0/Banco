import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteRegistro } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class CajeroService {

  constructor(private http: HttpClient) {}

  crearCliente(payload: ClienteRegistro): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.apiUrl}/cajero/clientes`, payload);
  }
}

