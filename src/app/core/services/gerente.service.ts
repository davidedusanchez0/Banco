import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GerenteService {

  constructor(private http: HttpClient) {}

  crearEmpleado(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/gerente/empleados`, payload);
  }

  getPrestamosPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/gerente/prestamos/pendientes`);
  }

  aprobarPrestamo(prestamoId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/gerente/prestamos/${prestamoId}/aprobar`, {});
  }

  rechazarPrestamo(prestamoId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/gerente/prestamos/${prestamoId}/rechazar`, {});
  }

  desactivarEmpleado(empleadoId: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/gerente/empleados/${empleadoId}/desactivar`, {});
  }

  // Obtener empleado por id
  getEmpleadoById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/gerente/empleado/${id}`);
  }

  // Actualizar empleado (si backend tiene PUT /gerente/empleados/{id})
  actualizarEmpleado(id: number, payload: any) {
    return this.http.put<any>(`${environment.apiUrl}/gerente/empleados/${id}`, payload);
  }
}