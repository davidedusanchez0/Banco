export interface Cliente {
  id: number;
  dui: string;
  nombre: string;
  apellidos?: string;
  genero?: string;
  salario: number;
  direccion: string;
  correo: string;
  estadoCivil: string;
  fechaNacimiento: string;
}

export interface ClienteRegistro {
  nombre: string;
  apellidos?: string;
  genero?: string;
  dui: string;
  salario?: number;
  direccion?: string;
  password?: string;
  correo?: string;
  estadoCivil?: string;
  fechaNacimiento?: string;
}

