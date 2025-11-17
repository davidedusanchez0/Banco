import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SucursalRegistro {
  nombre: string;
  direccion: string;
  telefono: string;
  estado: string;
  gerenteId: number;
  gerenteNombre: string;
  gerenteApellidos: string;
}

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: string;
  gerenteId: number;
  gerenteNombre?: string;
  gerenteApellidos?: string;
}

@Injectable({ providedIn: 'root' })
export class GerenteGeneralService {

  constructor(private http: HttpClient) {}

  crearSucursal(payload: SucursalRegistro): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${environment.apiUrl}/gerente-general/sucursales`, payload);
  }
}

