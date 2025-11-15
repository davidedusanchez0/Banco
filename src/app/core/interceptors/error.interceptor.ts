import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 400:
              errorMessage = error.error?.error || 'Solicitud inválida';
              break;
            case 401:
              errorMessage = 'No autorizado';
              break;
            case 404:
              errorMessage = error.error?.error || 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error del servidor';
              break;
            default:
              errorMessage = error.error?.error || `Error: ${error.status}`;
          }
        }
        
        console.error('Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

