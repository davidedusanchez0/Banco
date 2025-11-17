import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login exitoso. Rol recibido:', response.rol);
          this.redirectByRole(response.rol);
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.errorMessage = error?.error?.error || error?.message || 'Error al iniciar sesión';
        }
      });
    }
  }

  private redirectByRole(rol: string): void {
    // Normalizar el rol (trim y case-insensitive)
    const rolNormalizado = rol?.trim() || '';
    console.log('Redirigiendo por rol:', rolNormalizado);
    
    const roleRoutes: { [key: string]: string } = {
      'Cajero': '/cajero/dashboard',
      'Dependiente': '/dependiente/dashboard',
      'Gerente': '/gerente/dashboard',
      'Gerente de Sucursal': '/gerente/dashboard',
      'Gerente General': '/gerente-general/dashboard',
      'Cliente': '/cliente/dashboard'
    };
    
    // Buscar coincidencia exacta primero
    let route = roleRoutes[rolNormalizado];
    
    // Si no hay coincidencia exacta, buscar case-insensitive
    if (!route) {
      const rolLower = rolNormalizado.toLowerCase();
      for (const [key, value] of Object.entries(roleRoutes)) {
        if (key.toLowerCase() === rolLower) {
          route = value;
          break;
        }
      }
    }
    
    // Si aún no hay ruta, buscar por palabras clave
    if (!route) {
      const rolLower = rolNormalizado.toLowerCase();
      if (rolLower.includes('gerente general')) {
        route = '/gerente-general/dashboard';
      } else if (rolLower.includes('gerente')) {
        route = '/gerente/dashboard';
      } else if (rolLower.includes('cajero')) {
        route = '/cajero/dashboard';
      } else if (rolLower.includes('dependiente')) {
        route = '/dependiente/dashboard';
      } else if (rolLower.includes('cliente')) {
        route = '/cliente/dashboard';
      }
    }
    
    // Si aún no hay ruta, mostrar error
    if (!route) {
      console.error('Rol no reconocido:', rol, 'Rol normalizado:', rolNormalizado);
      this.errorMessage = `Rol no reconocido: "${rol}". Contacte al administrador.`;
      return;
    }
    
    console.log('Navegando a:', route);
    this.router.navigate([route]);
  }
}

