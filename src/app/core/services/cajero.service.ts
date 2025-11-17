import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteRegistro } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class CajeroService {

  constructor(private http: HttpClient) {}

  crearCliente(payload: ClienteRegistro): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.apiUrl}/cajero/clientes`, payload);
  }

  buscarCuentaPorDui(dui: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/cajero/cuentas/${encodeURIComponent(dui)}`);
  }

  // Nuevo: buscar cliente por DUI (query param) - usa /cajero/clientes/buscar?dui=...
  buscarClientePorDui(dui: string): Observable<any> {
    const url = `${environment.apiUrl}/cajero/clientes/buscar?dui=${encodeURIComponent(dui)}`;
    return this.http.get<any>(url);
  }

  // Alias para compatibilidad con componentes que usan getClientePorDui
  getClientePorDui(dui: string): Observable<any> {
    return this.buscarClientePorDui(dui);
  }



abonar(data: { numeroCuenta: string; duiCliente: string; monto: number }): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/cajero/abonar`, data);
}

retirar(data: { numeroCuenta: string; duiCliente: string; monto: number }): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/cajero/retirar`, data);
}


  // Solicitar un préstamo (POST /cajero/solicitar-prestamo)
  solicitarPrestamo(payload: { clienteId: number; cajeroId: number; monto: number }) : Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cajero/solicitar-prestamo`, payload);
  }


}



