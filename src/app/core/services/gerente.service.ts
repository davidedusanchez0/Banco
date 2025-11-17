import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EmpleadoRegistro {
  nombre: string;
  apellidos?: string;
  dui: string;
  genero?: string;
  direccion?: string;
  usuario: string;
  password: string;
  rol: string;
  sucursalId: number;
  estado: string;
}

export interface Empleado {
  id: number;
  codigo?: string;
  nombre: string;
  apellidos?: string;
  dui: string;
  genero?: string;
  direccion?: string;
  usuario: string;
  rol: string;
  sucursalId: number;
  sucursalNombre?: string;
  estado: string;
}

export interface EmpleadoModificacion {
  rol: string;
  sucursalId: number;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class GerenteService {

  constructor(private http: HttpClient) {}

  crearEmpleado(payload: EmpleadoRegistro): Observable<Empleado> {
    return this.http.post<Empleado>(`${environment.apiUrl}/gerente/empleados`, payload);
  }

  buscarEmpleado(idEmpleado: string | number): Observable<Empleado> {
    return this.http.get<Empleado>(`${environment.apiUrl}/gerente/empleados/${idEmpleado}`);
  }

  modificarEmpleado(idEmpleado: number, payload: EmpleadoModificacion): Observable<Empleado> {
    return this.http.put<Empleado>(`${environment.apiUrl}/gerente/empleados/${idEmpleado}`, payload);
  }

  buscarPrestamo(idPrestamo: string | number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/gerente/prestamos/${idPrestamo}`);
  }

  modificarPrestamo(idPrestamo: number, payload: { estado: string }): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/gerente/prestamos/${idPrestamo}`, payload);
  }
}

