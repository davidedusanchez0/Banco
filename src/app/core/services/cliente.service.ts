import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cuenta } from '../models/cuenta.model';
import { Movimiento } from '../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  constructor(private http: HttpClient) {}

  obtenerCuentas(clienteId: number): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${environment.apiUrl}/clientes/${clienteId}/cuentas`);
  }

  obtenerMovimientosCuenta(clienteId: number, cuentaId: number): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      `${environment.apiUrl}/clientes/${clienteId}/cuentas/${cuentaId}/movimientos`
    );
  }

  crearCuenta(clienteId: number, payload: { tipoCuenta: string }): Observable<Cuenta> {
    return this.http.post<Cuenta>(
      `${environment.apiUrl}/clientes/${clienteId}/cuentas`,
      payload
    );
  }
}
