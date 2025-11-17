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

  // Obtener cliente por DUI (simple, usa query param)
  obtenerClientePorDui(dui: string): Observable<any> {
    const url = `${environment.apiUrl}/cajero/clientes/buscar?dui=${encodeURIComponent(dui)}`;
    return this.http.get<any>(url);
  }

  // Obtener cliente por DUI usando path param: GET /cajero/cliente/{dui}
  obtenerClientePorDuiPorPath(dui: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/cajero/cliente/${encodeURIComponent(dui)}`);
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

  // Obtener criterio de prestamo por salario (nuevo)
  obtenerCriterioPorSalario(salario: number): Observable<any> {
    const url = `${environment.apiUrl}/cajero/criterio?salario=${encodeURIComponent(String(salario))}`;
    return this.http.get<any>(url);
  }
}
